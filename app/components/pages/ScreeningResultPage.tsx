import React from "react";
import { SpiralScreeningCard } from "../ui/SpiralScreeningCard";
import { VoiceAnalysisCard } from "../ui/VoiceAnalysisCard";

export default function ScreeningResultPage() {
  // Contoh data hasil skrining
  const spiralResult = {
    isDetected: true,
    imageSrc: "/images/spiral-test.jpg"
  };
  
  const voiceResult = {
    isDetected: false,
    imageSrc: "/images/voice-analysis.jpg"
  };

  return (
    <div className="container mx-auto px-4 py-20 mt-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          Hasil <span className="text-orange-500">SKRINING</span>
        </h1>
        <p className="mt-2 text-gray-600">
          Berikut ini hasil skrining penyakit parkinson.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <SpiralScreeningCard
          imageSrc={spiralResult.imageSrc}
          isDetected={spiralResult.isDetected}
        />

        <VoiceAnalysisCard
          imageSrc={voiceResult.imageSrc}
          isDetected={voiceResult.isDetected}
        />
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Ulangi Skrining
        </button>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600">
          Lakukan Terapi
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      
      {/* Catatan Penting */}
      <div className="max-w-4xl mx-auto mt-10 bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-800">Catatan Penting</h3>
          <p className="text-gray-700 mt-1 text-sm">
            Hasil skrining ini bersifat indikatif dan tidak menggantikan skrining medis profesional. Silakan berkonsultasi dengan spesialis untuk evaluasi lebih lanjut dan rencana pengobatan yang sesuai.
          </p>
        </div>
      </div>
    </div>
  );
}