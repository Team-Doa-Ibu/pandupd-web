import React, { useState } from "react";

export function ScreeningChatBot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "system",
      content: "Hasil skrining Anda menunjukkan adanya indikasi penyakit Parkinson. Perlu diingat bahwa ini adalah skrining awal dan bukan diagnosis medis. Silakan konsultasikan hasil ini dengan dokter spesialis untuk evaluasi lebih lanjut.",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Menambahkan pesan pengguna ke riwayat
    setChatHistory([...chatHistory, { type: "user", content: message }]);
    
    // Reset input pesan
    setMessage("");
    
    // Simulasi respons bot (dalam implementasi nyata, ini akan memanggil API)
    setTimeout(() => {
      // Logika sederhana untuk respons chatbot
      let botResponse = "Maaf, saya tidak mengerti pertanyaan Anda. Bisa dijelaskan lebih detail?";
      
      const userInput = message.toLowerCase();
      if (userInput.includes("terapi") || userInput.includes("pengobatan")) {
        botResponse = "Untuk terapi Parkinson, kami menyarankan konsultasi dengan dokter spesialis saraf. Anda juga bisa melihat rekomendasi terapi di halaman Terapi kami.";
      } else if (userInput.includes("hasil") || userInput.includes("skrining")) {
        botResponse = "Hasil skrining hanya bersifat indikatif. Untuk diagnosis resmi, diperlukan pemeriksaan medis oleh dokter spesialis.";
      } else if (userInput.includes("gejala") || userInput.includes("tanda")) {
        botResponse = "Gejala umum Parkinson meliputi tremor, kekakuan otot, dan gerakan yang melambat. Namun, setiap orang mungkin mengalami gejala yang berbeda.";
      }

      setChatHistory(prev => [
        ...prev, 
        { 
          type: "system", 
          content: botResponse
        }
      ]);
    }, 500);
  };

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">
            Tanya <span className="text-orange-400">Asisten Virtual</span>
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Jika Anda memiliki pertanyaan tentang hasil skrining atau penyakit Parkinson, silakan tanyakan pada asisten virtual kami.
          </p>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-white p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="font-bold text-gray-800">PANDU-PD AI</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
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
                          <div className="font-bold mb-1">Hasil Skrining Anda</div>
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

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-0 bg-white border-t">
              <div className="relative bg-white-800 rounded-lg mx-2 my-2 shadow">
                <input
                  type="text"
                  placeholder="Tanyakan Apa saja terkait hasil skrining Anda..."
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

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Asisten virtual ini menggunakan AI untuk memberikan informasi umum tentang penyakit Parkinson.</p>
            <p className="mt-1">Untuk konsultasi medis, silakan hubungi dokter atau tenaga medis profesional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}