import React from "react";

interface SpiralScreeningCardProps {
  imageSrc: string;
  isDetected: boolean;
  confidenceScore: number;
}

export function SpiralScreeningCard({ 
  imageSrc, 
  isDetected, 
  confidenceScore 
}: SpiralScreeningCardProps) {
  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${isDetected ? "border-2 border-red-200" : ""}`}>
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <img 
            src="spiral-icon.png" 
            alt="Spiral Icon" 
            className="w-125 h-125 text-blue-500"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-800">Skrining dengan Gambar Spiral</h3>
      </div>
      
      <div className="w-full">
        <img 
          src="spiral-draw.png" 
          alt="Gambar Spiral" 
          className={`w-full h-64 object-cover ${isDetected ? "grayscale" : ""}`} 
        />
      </div>
      
      <div className="p-4">
        <div 
          className={`w-full py-3 rounded-full font-medium text-white flex items-center justify-center ${
            isDetected ? "bg-red-500" : "bg-gray-500"
          }`}
        >
          <span>Confidence Score: {confidenceScore}%</span>
        </div>
        
        <p className="mt-4 text-gray-600">
          {isDetected 
            ? "Ditemukan indikasi Parkinson pada Gambar Spiral" 
            : "Tidak ditemukan indikasi Parkinson pada Gambar Spiral"}
        </p>
      </div>
    </div>
  );
}