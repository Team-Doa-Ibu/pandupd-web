import { json, type ActionFunctionArgs } from "@remix-run/node";
import path from "path";
import os from "os";
import fsp from "fs/promises";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";

function sanitizeSpiralSvg(svg: string): string {
  let out = svg;
  // Remove image elements (dots) but keep background rect
  out = out.replace(/<image\b[^>]*\/>/gi, "");
  out = out.replace(/<image\b[^>]*>[\s\S]*?<\/image>/gi, "");

  // Keep the white background rect - don't remove it
  // out = out.replace(/<rect\b[^>]*?fill\s*=\s*"(?:#fff(?:fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"[^>]*\/>/gi, "");
  // out = out.replace(/<rect\b[^>]*?fill\s*=\s*"(?:#fff(?:fff)?|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"[^>]*>[\s\S]*?<\/rect>/gi, "");

  return out;
}

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

async function saveSvgAsPng(svgString: string, outPath: string) {
  const cleaned = sanitizeSpiralSvg(svgString);
  const svgBuffer = Buffer.from(cleaned, "utf8");

  // Create PNG with white background
  await sharp(svgBuffer)
    .png()
    .flatten({ background: "#ffffff" }) // Ensure white background
    .toFile(outPath);
}

async function convertToWavPcm16k441(
  inputPath: string,
  outPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("pcm_s16le")
      .audioFrequency(44100)
      .format("wav")
      .on("error", (err) => reject(err))
      .on("end", () => resolve())
      .save(outPath);
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const form = await request.formData();
    const spiralSvg = form.get("spiralSvg");
    const audioFile = form.get("audio");

    const publicDir = path.join(process.cwd(), "public");
    const spiralDir = path.join(publicDir, "file_spiral");
    const audioDir = path.join(publicDir, "file_audio");
    await Promise.all([ensureDir(spiralDir), ensureDir(audioDir)]);

    const timestamp = Date.now();
    const saved: { spiralPath?: string; audioPath?: string } = {};

    // Save SVG -> PNG (with white background)
    if (typeof spiralSvg === "string" && spiralSvg.trim().length > 0) {
      const pngName = `spiral_${timestamp}.png`;
      const pngPath = path.join(spiralDir, pngName);
      console.log("[deteksi-submit] saving spiral to:", pngPath);
      await saveSvgAsPng(spiralSvg, pngPath);
      saved.spiralPath = pngPath;
    } else {
      console.log("[deteksi-submit] spiralSvg not provided");
    }

    // Save/convert audio -> WAV 44.1kHz 16-bit
    if (audioFile && typeof (audioFile as any).arrayBuffer === "function") {
      const file = audioFile as unknown as File;
      const arrayBuffer = await file.arrayBuffer();
      const inputTmp = path.join(os.tmpdir(), `audio_in_${timestamp}`);
      const outputName = `audio_${timestamp}.wav`;
      const outputPath = path.join(audioDir, outputName);
      await fsp.writeFile(inputTmp, Buffer.from(arrayBuffer));
      console.log("[deteksi-submit] converting audio to wav:", outputPath);
      try {
        await convertToWavPcm16k441(inputTmp, outputPath);
        saved.audioPath = outputPath;
      } catch (err) {
        console.error(
          "[deteksi-submit] ffmpeg convert failed, fallback copy:",
          err,
        );
        const fallback = path.join(audioDir, `audio_${timestamp}_orig.wav`);
        await fsp.copyFile(inputTmp, fallback);
        saved.audioPath = fallback;
      } finally {
        fsp.unlink(inputTmp).catch(() => undefined);
      }
    } else {
      console.log("[deteksi-submit] audio not provided");
    }

    // Forward to external API (multipart/form-data)
    // const apiUrl = "https://jay-fit-safely.ngrok-free.app/api/diagnosis";
    const apiUrl = process.env.VITE_API_MODEL_URL || "";
    console.log("[deteksi-submit] apiUrl:", apiUrl);
    if (!apiUrl) {
      console.error("[deteksi-submit] API_MODEL_URL not configured");
      await Promise.all([
        saved.spiralPath
          ? fsp.unlink(saved.spiralPath).catch(() => undefined)
          : Promise.resolve(),
        saved.audioPath
          ? fsp.unlink(saved.audioPath).catch(() => undefined)
          : Promise.resolve(),
      ]);
      return json(
        {
          success: false,
          error: "API_MODEL_URL not configured",
          error_type: "config",
        },
        { status: 500 },
      );
    }

    const fdata = new FormData();
    if (saved.spiralPath) {
      const pngBuf = await fsp.readFile(saved.spiralPath);
      console.log(
        "[deteksi-submit] adding hw_file:",
        saved.spiralPath,
        "bytes:",
        pngBuf.length,
      );
      fdata.append(
        "hw_file",
        new Blob([pngBuf], { type: "image/png" }),
        path.basename(saved.spiralPath),
      );
    }
    if (saved.audioPath) {
      const wavBuf = await fsp.readFile(saved.audioPath);
      console.log(
        "[deteksi-submit] adding vm_file:",
        saved.audioPath,
        "bytes:",
        wavBuf.length,
      );
      fdata.append(
        "vm_file",
        new Blob([wavBuf], { type: "audio/wav" }),
        path.basename(saved.audioPath),
      );
    }

    // Log FormData contents
    console.log("[deteksi-submit] FormData entries:");
    for (const [key, value] of fdata.entries()) {
      console.log(
        `  ${key}:`,
        typeof value,
        value instanceof Blob
          ? `Blob(${value.size} bytes, ${value.type})`
          : value,
      );
    }

    let modelJson: any = null;
    try {
      console.log("[deteksi-submit] forwarding to:", apiUrl);
      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
        body: fdata,
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        console.error("[deteksi-submit] model HTTP error:", resp.status, text);
        await Promise.all([
          saved.spiralPath
            ? fsp.unlink(saved.spiralPath).catch(() => undefined)
            : Promise.resolve(),
          saved.audioPath
            ? fsp.unlink(saved.audioPath).catch(() => undefined)
            : Promise.resolve(),
        ]);
        return json(
          {
            success: false,
            error: `HTTP ${resp.status}`,
            error_type: "http_status",
            details: text,
          },
          { status: 502 },
        );
      }
      try {
        const responseText = await resp.text();
        console.log("[deteksi-submit] raw API response:", responseText);
        try {
          modelJson = JSON.parse(responseText);
        } catch (parseError) {
          console.error("[deteksi-submit] JSON parse failed:", parseError);
          throw new Error("Invalid JSON response");
        }
      } catch (e) {
        const text = await resp.text().catch(() => "");
        console.error("[deteksi-submit] model JSON parse error:", e, text);
        await Promise.all([
          saved.spiralPath
            ? fsp.unlink(saved.spiralPath).catch(() => undefined)
            : Promise.resolve(),
          saved.audioPath
            ? fsp.unlink(saved.audioPath).catch(() => undefined)
            : Promise.resolve(),
        ]);
        return json(
          {
            success: false,
            error: "Invalid JSON",
            error_type: "parse",
            details: text,
          },
          { status: 502 },
        );
      }
    } catch (e) {
      console.error("[deteksi-submit] model network error:", e);
      await Promise.all([
        saved.spiralPath
          ? fsp.unlink(saved.spiralPath).catch(() => undefined)
          : Promise.resolve(),
        saved.audioPath
          ? fsp.unlink(saved.audioPath).catch(() => undefined)
          : Promise.resolve(),
      ]);
      return json(
        {
          success: false,
          error: "Network error to model API",
          error_type: "network",
          details: String(e),
        },
        { status: 504 },
      );
    }

    // Validate response data before cleanup
    // Direct database insert from raw API response
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get user ID from request headers (sent by client)
    const userId = request.headers.get("x-user-id");

    console.log("[deteksi-submit] user auth check:", {
      userId: userId,
      hasUserId: !!userId,
      requestHeaders: Object.fromEntries(request.headers.entries()),
    });

    if (!userId) {
      console.error("[deteksi-submit] No user ID provided in headers");
      return json(
        {
          success: false,
          error: "User ID not provided",
          error_type: "auth",
        },
        { status: 401 },
      );
    }

    // Prepare data for database insert
    const insertData = {
      user_id: userId,
      Hasil_Diagnosa_vm: modelJson?.vm_prediction ?? null,
      Score_Diagnosa_vm: modelJson?.vm_confidence ?? null,
      Hasil_Diagnosa_hm: modelJson?.hw_prediction ?? null,
      Score_Diagnosa_hm: modelJson?.hw_confidence ?? null,
    };

    console.log("[deteksi-submit] inserting to database:", insertData);
    console.log("[deteksi-submit] user ID being used:", userId);
    console.log("[deteksi-submit] insert data details:", {
      user_id: insertData.user_id,
      user_id_type: typeof insertData.user_id,
      user_id_length: insertData.user_id?.length,
      Hasil_Diagnosa_vm: insertData.Hasil_Diagnosa_vm,
      Score_Diagnosa_vm: insertData.Score_Diagnosa_vm,
      Hasil_Diagnosa_hm: insertData.Hasil_Diagnosa_hm,
      Score_Diagnosa_hm: insertData.Score_Diagnosa_hm,
    });

    // Insert to database
    const { data: inserted, error: dbErr } = await supabase
      .from("form")
      .insert([insertData])
      .select("id")
      .maybeSingle();

    if (dbErr || !inserted) {
      console.error("[deteksi-submit] Database insert error:", dbErr);
      return json(
        {
          success: false,
          error: "Failed to save to database",
          error_type: "database",
          details: dbErr?.message,
        },
        { status: 500 },
      );
    }

    console.log("[deteksi-submit] successfully inserted with ID:", inserted.id);

    // Return success response with inserted ID
    const out = {
      success: true,
      inserted_id: inserted.id,
      vm_prediction: modelJson?.vm_prediction,
      vm_confidence: modelJson?.vm_confidence,
      hw_prediction: modelJson?.hw_prediction,
      hw_confidence: modelJson?.hw_confidence,
      message: "Data saved successfully",
    };

    console.log("[deteksi-submit] raw API response:", modelJson);
    console.log(
      "[deteksi-submit] database insert completed with ID:",
      inserted.id,
    );

    // Cleanup uploaded files after successful processing
    console.log("[deteksi-submit] cleaning up uploaded files");
    await Promise.all([
      saved.spiralPath
        ? fsp.unlink(saved.spiralPath).catch(() => undefined)
        : Promise.resolve(),
      saved.audioPath
        ? fsp.unlink(saved.audioPath).catch(() => undefined)
        : Promise.resolve(),
    ]);
    console.log("[deteksi-submit] files cleaned up successfully");

    console.log("[deteksi-submit] sending response to client");

    return json(out);
  } catch (error) {
    console.error("[deteksi-submit] unexpected error:", error);
    return json(
      {
        success: false,
        error: "Gagal memproses",
        error_type: "unexpected",
        details: String(error),
      },
      { status: 500 },
    );
  }
};
