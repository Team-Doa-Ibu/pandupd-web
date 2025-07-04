import React, { useEffect, useState } from 'react';

interface ProgressLoadingProps {
  title?: string;
  subtitle?: string;
  redirectUrl?: string;
  redirectTime?: number;
  spinnerColor?: string;
  progressColor?: string;
  onLoadingComplete?: () => void;
}

export default function ProgressLoading({
  title = "Memproses Data...",
  subtitle = "Mohon tunggu sebentar",
  redirectUrl,
  redirectTime = 3600,
  spinnerColor = "border-amber-400", 
  progressColor = "bg-amber-400",
  onLoadingComplete
}: ProgressLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, redirectTime / 100);

    const timer = setTimeout(() => {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, redirectTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [redirectTime, redirectUrl, onLoadingComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
      <div className="text-center">
        {/* Loading Spinner */}
        <div 
          className={`w-24 h-24 border-8 border-gray-100 ${spinnerColor} rounded-full animate-spin mx-auto mb-5`}
          style={{ borderTopColor: 'currentColor' }}
        ></div>
        
        {/* Loading Text */}
        <div className="text-gray-800 text-2xl mb-2 animate-pulse">{title}</div>
        
        {/* Loading Subtext */}
        <div className="text-gray-500 text-base">{subtitle}</div>
        
        {/* Progress Bar */}
        <div className="w-48 h-1 bg-gray-100 rounded mt-5 mb-2 overflow-hidden">
          <div 
            className={`h-full ${progressColor} rounded`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}