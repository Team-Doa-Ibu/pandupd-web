import React, { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import ReactMarkdown from "react-markdown";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "system",
      content:
        "Pandu-PD AI adalah alat skrining awal yang dirancang untuk membantu mendeteksi potensi gejala penyakit Parkinson. Alat ini tidak dimaksudkan untuk menggantikan konsultasi, pemeriksaan, atau diagnosis dari tenaga medis profesional.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const fetcher = useFetcher();

  // Handle API response
  useEffect(() => {
    if (fetcher.data) {
      setIsLoading(false);

      const data = fetcher.data as {
        success?: boolean;
        response?: string;
        error?: string;
      };

      if (data.success && data.response) {
        setChatHistory((prev) => [
          ...prev,
          { type: "system", content: data.response || "" },
        ]);
      } else if (data.error) {
        setChatHistory((prev) => [
          ...prev,
          { type: "system", content: `❌ ${data.error}` },
        ]);
      }
    }
  }, [fetcher.data]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();

    // Menambahkan pesan pengguna ke riwayat
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);

    // Reset input pesan
    setMessage("");
    setIsLoading(true);

    // Kirim pesan ke API
    fetcher.submit(
      { message: userMessage },
      { method: "post", action: "/api/chat" },
    );
  };

  return (
    <>
      {/* Tombol Chat - hanya gambar tanpa background */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center border-none bg-transparent p-0 transition-all"
        aria-label="Chat dengan Pandu-PD AI"
      >
        <img src="/icon-chatbot.png" alt="Chat" className="h-14 w-14" />
      </button>

      {/* Modal Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex max-h-[500px] w-80 flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-gray-800">Pandu-PD AI</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
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
                          Jelaskan apa itu Pandu-PD AI?
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{chat.content}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{chat.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
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

          {/* Input Form - Diubah sesuai gambar */}
          <form onSubmit={handleSubmit} className="border-t bg-white p-0">
            <div className="bg-white-800 relative mx-2 my-2 rounded-lg shadow">
              <input
                type="text"
                placeholder="Tanyakan Apa saja terkait aplikasi ini..."
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
      )}
    </>
  );
}
