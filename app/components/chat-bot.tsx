import React, { useState } from "react";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "system",
      content: "NIGGER adalah alat skrining awal yang dirancang untuk membantu mendeteksi potensi gejala penyakit Parkinson. Alat ini tidak dimaksudkan untuk menggantikan konsultasi, pemeriksaan, atau diagnosis dari tenaga medis profesional.",
    },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Menambahkan pesan pengguna ke riwayat
    setChatHistory([...chatHistory, { type: "user", content: message }]);
    
    // Reset input pesan
    setMessage("");
    
    // Simulasi respons bot (dalam implementasi nyata, ini akan memanggil API)
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          type: "system", 
          content: "Terima kasih atas pertanyaan Anda. Kami sedang memproses informasi dan akan segera memberikan jawaban." 
        }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Tombol Chat - hanya gambar tanpa background */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center transition-all z-50 border-none bg-transparent p-0"
        aria-label="Chat dengan NIGGER AI"
      >
        <img 
          src="/icon-chatbot.png" 
          alt="Chat" 
          className="w-14 h-14"
        />
      </button>

      {/* Modal Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-gray-800">NIGGER AI</span>
            </div>
            <button 
              onClick={toggleChat}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`flex ${chat.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      chat.type === "user" 
                        ? "bg-yellow-400 text-gray-800" 
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {chat.type === "system" && index === 0 ? (
                      <div>
                        <div className="font-bold mb-1">Jelaskan apa itu NIGGER?</div>
                        <p>{chat.content}</p>
                      </div>
                    ) : (
                      <p>{chat.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Form - Diubah sesuai gambar */}
          <form onSubmit={handleSubmit} className="p-0 bg-white border-t">
            <div className="relative bg-white-800 rounded-lg mx-2 my-2 shadow">
              <input
                type="text"
                placeholder="Tanyakan Apa saja terkait aplikasi ini..."
                className="w-full border-none py-3 px-4 focus:outline-none text-black bg-transparent"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-400 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
