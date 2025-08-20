import { json, type ActionFunctionArgs } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createFullPrompt } from "~/utils/geminiPrompt";

// Simple in-memory rate limiter (per-process). For production, replace with Redis or durable storage
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max 20 requests per IP per minute
const ipHits = new Map<string, { count: number; resetAt: number }>();

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Basic rate limiting
  try {
    const ipHeader = request.headers.get("x-forwarded-for");
    const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown";
    const now = Date.now();
    const entry = ipHits.get(ip);
    if (!entry || now > entry.resetAt) {
      ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      if (entry.count >= RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return json(
          { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
      entry.count += 1;
    }
  } catch {
    // Ignore errors when parsing request body
  }

  try {
    let message: string;

    // Check content type to determine how to parse the body
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Parse as JSON
      const jsonData = await request.json();
      message = jsonData.message;
    } else {
      // Parse as form data (default for Remix fetcher.submit)
      const formData = await request.formData();
      message = formData.get("message") as string;
    }

    if (!message || typeof message !== "string") {
      return json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    console.log("[api.chat] Environment check:", {
      VITE_GEMINI_API_KEY: apiKey ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    });
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY not found in environment variables");
      return json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Processing chat message:", message.substring(0, 50) + "...");
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Create full prompt using utility function
    const fullPrompt = createFullPrompt(message);

    // List model fallback untuk retry
    const models = [
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];
    let lastError: unknown = null;

    // Retry dengan berbagai model
    for (let i = 0; i < models.length; i++) {
      try {
        if (process.env.NODE_ENV !== "production")
          console.log(`Attempting with model: ${models[i]}`);
        const model = genAI.getGenerativeModel({ model: models[i] });

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        if (process.env.NODE_ENV !== "production")
          console.log(
            `Gemini response received successfully with model: ${models[i]}`,
          );

        return json({
          response: text,
          success: true,
          model_used: models[i],
        });
      } catch (modelError: unknown) {
        if (process.env.NODE_ENV !== "production")
          console.log(`Model ${models[i]} failed`);
        lastError = modelError;

        // Jika error 503 (overloaded), tunggu sebentar sebelum retry
        const overloaded =
          (modelError as { status?: number } | undefined)?.status === 503;
        if (overloaded && i < models.length - 1) {
          if (process.env.NODE_ENV !== "production")
            console.log("Model overloaded, waiting before retry...");
          await new Promise((resolve) => setTimeout(resolve, 1000 + i * 500)); // Progressive delay
        }

        // Jika bukan error terakhir, lanjut ke model berikutnya
        if (i < models.length - 1) continue;

        // Jika semua model gagal, throw error terakhir
        throw lastError;
      }
    }
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);

    // Pesan error yang lebih spesifik berdasarkan jenis error
    let errorMessage =
      "Maaf, terjadi kesalahan dalam memproses pesan Anda. Silakan coba lagi.";
    let statusCode = 500;

    const err = error as { status?: number; message?: string } | undefined;
    if (err?.status === 503) {
      errorMessage =
        "Layanan AI sedang sibuk saat ini. Mohon tunggu sebentar dan coba lagi.";
      statusCode = 503;
    } else if (err?.status === 429) {
      errorMessage =
        "Terlalu banyak permintaan. Mohon tunggu sebentar sebelum mencoba lagi.";
      statusCode = 429;
    } else if (err?.status === 401 || err?.status === 403) {
      errorMessage =
        "Terjadi masalah konfigurasi. Silakan hubungi administrator.";
      statusCode = 500;
    } else if (
      typeof err?.message === "string" &&
      err.message.includes("overloaded")
    ) {
      errorMessage =
        "Layanan AI sedang penuh. Silakan coba lagi dalam beberapa saat.";
      statusCode = 503;
    }

    return json(
      {
        error: errorMessage,
        success: false,
        retry_suggested: err?.status === 503 || err?.status === 429,
      },
      { status: statusCode },
    );
  }
};
