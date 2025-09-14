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
    const symptoms = form.get("symptoms");

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
      await saveSvgAsPng(spiralSvg, pngPath);
      saved.spiralPath = pngPath;
    }

    // Save/convert audio -> WAV 44.1kHz 16-bit
    if (audioFile && typeof (audioFile as any).arrayBuffer === "function") {
      const file = audioFile as unknown as File;
      const arrayBuffer = await file.arrayBuffer();
      const inputTmp = path.join(os.tmpdir(), `audio_in_${timestamp}`);
      const outputName = `audio_${timestamp}.wav`;
      const outputPath = path.join(audioDir, outputName);
      await fsp.writeFile(inputTmp, Buffer.from(arrayBuffer));
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
    }

    // Forward to external API (multipart/form-data)
    // const apiUrl = "https://jay-fit-safely.ngrok-free.app/api/diagnosis";
    const apiUrl = process.env.VITE_API_MODEL_URL || "";
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
    // Build an explicit summary of what will be sent
    const outgoingSummary: {
      apiUrl: string;
      symptoms?: string;
      files: {
        hw_file?: { filename: string; bytes: number; type: string };
        vm_file?: { filename: string; bytes: number; type: string };
      };
    } = { apiUrl, files: {} };

    if (symptoms) {
      outgoingSummary.symptoms = symptoms as string;
      fdata.append("symptoms", symptoms as string);
    }

    if (saved.spiralPath) {
      const pngBuf = await fsp.readFile(saved.spiralPath);
      const spiralFilename = path.basename(saved.spiralPath);
      fdata.append(
        "hw_file",
        new Blob([pngBuf], { type: "image/png" }),
        spiralFilename,
      );
      outgoingSummary.files.hw_file = {
        filename: spiralFilename,
        bytes: pngBuf.length,
        type: "image/png",
      };
    }
    if (saved.audioPath) {
      const wavBuf = await fsp.readFile(saved.audioPath);
      const audioFilename = path.basename(saved.audioPath);
      fdata.append(
        "vm_file",
        new Blob([wavBuf], { type: "audio/wav" }),
        audioFilename,
      );
      outgoingSummary.files.vm_file = {
        filename: audioFilename,
        bytes: wavBuf.length,
        type: "audio/wav",
      };
    }

    // New: clear, structured summary of the outgoing payload
    console.log("[deteksi-submit] Outgoing payload summary:", outgoingSummary);

    let modelJson: any = null;
    try {
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
    const { supabase } = await import("~/data/supabaseClient");

    // Get user ID from request headers (sent by client)
    const userId = request.headers.get("x-user-id");

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
      symptoms: modelJson?.message ?? null,
    };

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

    // Cleanup uploaded files after successful processing
    await Promise.all([
      saved.spiralPath
        ? fsp.unlink(saved.spiralPath).catch(() => undefined)
        : Promise.resolve(),
      saved.audioPath
        ? fsp.unlink(saved.audioPath).catch(() => undefined)
        : Promise.resolve(),
    ]);

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
