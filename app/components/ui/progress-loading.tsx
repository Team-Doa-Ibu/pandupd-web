import React, { useEffect, useState } from "react";

interface ProgressLoadingProps {
  title?: string;
  subtitle?: string;
  redirectUrl?: string;
  redirectTime?: number;
  spinnerColor?: string;
  progressColor?: string;
  onLoadingComplete?: () => void;
  overlay?: boolean; // if true, render transparent overlay
}

export default function ProgressLoading({
  title = "Memproses Data...",
  subtitle = "Mohon tunggu sebentar",
  redirectUrl,
  redirectTime = 3600,
  spinnerColor = "border-amber-400",
  progressColor = "bg-amber-400",
  onLoadingComplete,
  overlay = false,
}: ProgressLoadingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
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
    <div
      className={
        overlay
          ? "fixed inset-0 z-[1000] flex items-center justify-center bg-white/75"
          : "flex min-h-screen flex-col items-center justify-center bg-white font-sans"
      }
    >
      <div className="text-center">
        <div
          className={`mx-auto mb-5 h-24 w-24 animate-spin rounded-full border-8 border-gray-100 ${spinnerColor}`}
          style={{ borderTopColor: "currentColor" }}
        ></div>
        <div className="mb-2 animate-pulse text-2xl text-gray-800">{title}</div>
        <div className="text-base text-gray-600">{subtitle}</div>
        <div className="mb-2 mt-5 w-80 overflow-hidden rounded bg-gray-100">
          <div
            className={`h-2 ${progressColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
