import { json, type ActionFunctionArgs } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createScreeningPrompt } from "~/utils/geminiScreeningPrompt";

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let message: string;
    let vm: any = null;
    let hm: any = null;

    if (contentType.includes("application/json")) {
      const body = await request.json();
      message = body.message;
      vm = body.vm ?? null;
      hm = body.hm ?? null;
    } else {
      const formData = await request.formData();
      message = String(formData.get("message") || "");
      vm = formData.get("vm") ? JSON.parse(String(formData.get("vm"))) : null;
      hm = formData.get("hm") ? JSON.parse(String(formData.get("hm"))) : null;
    }

    if (!message || typeof message !== "string") {
      return json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY;
    console.log("[api.screening-chat] Environment check:", {
      VITE_GEMINI_API_KEY: apiKey ? "SET" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    });
    if (!apiKey) {
      return json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const fullPrompt = createScreeningPrompt(message, vm, hm);

    const models = [
      "gemini-1.5-flash-002",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        return json({ success: true, response: text, model_used: modelName });
      } catch (err: any) {
        if (err?.status === 503) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        if (modelName !== models[models.length - 1]) continue;
        throw err;
      }
    }
  } catch (error) {
    return json(
      { success: false, error: "Gagal memproses permintaan" },
      { status: 500 },
    );
  }
};
