import React, { useState, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import ReactMarkdown from "react-markdown";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle API response and auto-scroll
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

  // Auto-scroll to bottom when chat history changes or when loading starts/stops
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();

    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    fetcher.submit(
      { message: userMessage },
      { method: "post", action: "/api/chat" },
    );
  };

  // itung ukuran dinamis
  const getChatDimensions = () => {
    if (typeof window === "undefined") return {};

    const isMobile = window.innerWidth < 640;

    if (isExpanded) {
      return {
        width: isMobile ? "calc(100vw - 32px)" : "90vw",
        height: "90vh",
        maxWidth: "1200px",
        maxHeight: "800px",
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 60,
      };
    }

   return {
     width: isMobile ? "calc(100vw - 32px)" : "384px",
     maxWidth: "600px", 
     height: "500px",
     bottom: isMobile ? "80px" : "96px",
     right: isMobile ? "16px" : "24px",
     left: isMobile ? "16px" : undefined, 
   };

  };

  return (
    <>
      {/* Overlay HYTAM */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity" />
      )}

      {/* Tombol Chat */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center border-none bg-transparent p-0 transition-all"
        aria-label="Chat dengan Pandu-PD AI"
      >
        <img src="/icon-chatbot.png" alt="Chat" className="h-14 w-14" />
      </button>

      {/* Modal Chat */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed z-50 flex flex-col overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-300"
          style={{
            ...getChatDimensions(),
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-white p-4">
            <div className="flex items-center gap-2">
              <img src="/LogoAsset.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-gray-800">Pandu-PD AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-gray-700"
                aria-label={isExpanded ? "Minimize" : "Maximize"}
              >
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
                  {isExpanded ? (
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  ) : (
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  )}
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
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
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t bg-white p-2">
            <div className="flex w-full items-center gap-2 rounded-lg bg-white p-2 shadow">
              <textarea
                placeholder="Tanyakan apa saja terkait aplikasi ini..."
                className="scrollbar-thin scrollbar-thumb-gray-300 flex-1 resize-none border-none bg-transparent text-black focus:outline-none"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                }}
                disabled={isLoading}
                rows={1}
                style={{ minHeight: "48px", maxHeight: "150px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400 text-white hover:bg-orange-500 disabled:bg-gray-400"
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
