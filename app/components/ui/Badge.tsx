// app/components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  text: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const Badge = ({ text, bgColor, borderColor, textColor }: BadgeProps) => {
  return (
    <span 
      className="inline-block px-3 py-1 text-xs font-medium rounded-full border"
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor
      }}
    >
      {text}
    </span>
  );
};

export const TestTypeBadge = ({ type }: { type: string }) => {
  if (type === 'Gambar') {
    return <Badge 
      text="Gambar"
      bgColor="#FFEDD5" 
      borderColor="#FB923C"
      textColor="#C2410C"
    />;
  } else if (type === 'Suara') {
    return <Badge 
      text="Suara"
      bgColor="#DBEAFE"
      borderColor="#60A5FA"
      textColor="#1D4ED8"
    />;
  } else {
    return <Badge 
      text={type}
      bgColor="#F3F4F6"
      borderColor="#D1D5DB"
      textColor="#4B5563"
    />;
  }
};

export const ConfidenceScoreBadge = ({ score, result }: { score: number, result: string }) => {
  // Menentukan warna berdasarkan hasil
  let bgColor, borderColor, textColor;
  
  if (result === 'Sehat') {
    bgColor = "#DCFCE7";
    borderColor = "#4ADE80";
    textColor = "#15803D";
  } else if (result === 'Parkinson') {
    bgColor = "#FEE2E2";
    borderColor = "#F87171";
    textColor = "#B91C1C";
  } else {
    // Default untuk kasus lain
    bgColor = "#F3F4F6";
    borderColor = "#D1D5DB";
    textColor = "#4B5563";
  }
  
  return <Badge 
    text={`${result} (${score}%)`}
    bgColor={bgColor}
    borderColor={borderColor}
    textColor={textColor}
  />;
};