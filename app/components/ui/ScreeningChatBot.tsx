import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export type ScreeningChatBotProps = {
  vm?: {
    isDetected?: boolean;
    imageSrc?: string;
    confidenceScore?: number;
  } | null;
  hm?: {
    isDetected?: boolean;
    imageSrc?: string;
    confidenceScore?: number;
  } | null;
};

export function ScreeningChatBot({ vm, hm }: ScreeningChatBotProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      type: "system",
      content:
        "Hasil skrining Anda siap dibahas. Ingat, ini skrining awal dan bukan diagnosis. Tanyakan apa pun tentang hasil ini atau langkah selanjutnya.",
    },
  ] as { type: "system" | "user"; content: string }[]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/screening-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, vm, hm }),
      });
      const data = await res.json();
      if (data?.success && data?.response) {
        setChatHistory((prev) => [
          ...prev,
          { type: "system", content: String(data.response) },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            type: "system",
            content: "❌ Maaf, terjadi kendala. Coba lagi nanti.",
          },
        ]);
      }
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { type: "system", content: "❌ Gagal terhubung ke layanan AI." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-bold">
            Tanya <span className="text-orange-400">Asisten Virtual</span>
          </h2>
          <p className="mb-8 text-center text-gray-600">
            Ajukan pertanyaan terkait hasil skrining Anda. Jawaban akan
            mempertimbangkan konteks hasil Anda.
          </p>

          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-white p-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="font-bold text-gray-800">PANDU-PD AI</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        chat.type === "user"
                          ? "bg-yellow-400 text-gray-800"
                          : "border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      {chat.type === "system" && index === 0 ? (
                        <div>
                          <div className="mb-1 font-bold">
                            Ringkasan Hasil Skrining
                          </div>
                          <p>{chat.content}</p>
                        </div>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{chat.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg border border-gray-200 bg-white p-3 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t bg-white p-0">
              <div className="bg-white-800 relative mx-2 my-2 rounded-lg shadow">
                <input
                  type="text"
                  placeholder="Tanyakan apa saja terkait hasil Anda..."
                  className="w-full border-none bg-transparent px-4 py-3 text-black focus:outline-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-orange-400 text-white hover:bg-orange-500 disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Asisten virtual ini menggunakan AI untuk memberikan informasi umum
              berdasarkan hasil skrining Anda.
            </p>
            <p className="mt-1">
              Untuk konsultasi medis, silakan hubungi dokter atau tenaga medis
              profesional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
