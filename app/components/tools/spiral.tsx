import { IconCircleCheckFilled, IconX } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

interface SpiralProps {
  onConfirm: (svg: string) => void;
}

export default function Spiral({ onConfirm }: SpiralProps) {
  const [drawingMode, setDrawingMode] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  const handleStartDrawing = () => {
    setDrawingMode(true);
    setIsConfirmed(false);
  };

  const handleCancel = () => {
    setDrawingMode(false);
    setIsConfirmed(false);
    canvasRef.current?.clearCanvas();
  };

  const handleReset = () => {
    setIsConfirmed(false);
    canvasRef.current?.clearCanvas();
  };

  const handleConfirm = async () => {
    const svg = await canvasRef.current?.exportSvg();
    if (svg) {
      onConfirm(svg);
      setIsConfirmed(true);
    }
  };

  return (
    <div className="space-y-2">
      {!drawingMode && !isConfirmed && (
        <button
          onClick={handleStartDrawing}
          className="w-full rounded-lg bg-blue-500 px-6 py-3 text-white shadow-inner shadow-white/50 hover:bg-blue-600"
        >
          Mulai Gambar
        </button>
      )}

      {(drawingMode || isConfirmed) && (
        <>
          <div className="relative mx-auto aspect-square w-full max-w-[600px] rounded-none border border-neutral-300">
            <ReactSketchCanvas
              ref={canvasRef}
              width="100%"
              height="100%"
              strokeWidth={4}
              strokeColor="#a1a1a4"
              canvasColor="#ffffff"
              backgroundImage="/titik.svg"
              preserveBackgroundImageAspectRatio="xMidYMid meet"
              style={{
                borderRadius: "8px !important",
                pointerEvents: isConfirmed ? "none" : "auto",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="flex gap-2">
            {!isConfirmed && (
              <>
                <button
                  onClick={handleCancel}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-300 bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                >
                  <IconX size={18} />
                  Batal
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                >
                  Ulang
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-full bg-blue-600 px-4 py-2 text-white shadow-inner shadow-white/50 hover:bg-blue-700"
                >
                  Konfirmasi
                </button>
              </>
            )}
          </div>
        </>
      )}

      {isConfirmed && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-50 p-4 text-center">
          <IconCircleCheckFilled className="text-blue-700" size={24} />
          <p className="font-semibold text-blue-700">
            Gambar spiral telah dikonfirmasi
          </p>
        </div>
      )}
    </div>
  );
}
