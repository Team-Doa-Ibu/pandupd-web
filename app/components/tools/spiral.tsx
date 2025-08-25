import {
  IconCircleCheckFilled,
  IconX,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

interface SpiralProps {
  onConfirm: (svg: string) => void;
}

interface Point {
  x: number;
  y: number;
}

export default function Spiral({ onConfirm }: SpiralProps) {
  const [drawingMode, setDrawingMode] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fixed canvas size untuk konsistensi sempurna
  const FIXED_CANVAS_SIZE = 600;
  const [containerSize, setContainerSize] = useState(FIXED_CANVAS_SIZE);
  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  // Update container size when fullscreen changes
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        setContainerSize(size);
      }
    };

    updateContainerSize();

    // Add resize listener for fullscreen
    const handleResize = () => {
      updateContainerSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isFullscreen]);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && drawingMode) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas size
        canvas.width = FIXED_CANVAS_SIZE;
        canvas.height = FIXED_CANVAS_SIZE;

        // Set initial background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);

        // Load background image
        const bgImage = new Image();
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);
          redrawPaths();
        };
        bgImage.onerror = () => {
          // Fallback: draw dots manually if image fails to load
          ctx.fillStyle = "#000000";
          for (let i = 0; i < FIXED_CANVAS_SIZE; i += 20) {
            for (let j = 0; j < FIXED_CANVAS_SIZE; j += 20) {
              ctx.beginPath();
              ctx.arc(i, j, 2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
          redrawPaths();
        };
        bgImage.src = "/titik.svg";

        console.log("Canvas initialized with size:", FIXED_CANVAS_SIZE);
      }
    }
  }, [drawingMode]);

  // Redraw canvas when paths change
  useEffect(() => {
    if (drawingMode && canvasRef.current) {
      // Small delay to ensure canvas is ready
      const timer = setTimeout(() => {
        redrawPaths();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [paths, currentPath, drawingMode]);

  // Force redraw when fullscreen changes
  useEffect(() => {
    if (drawingMode && canvasRef.current) {
      const timer = setTimeout(() => {
        redrawPaths();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, drawingMode]);

  // Redraw all paths
  const redrawPaths = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);

    // Redraw background
    const bgImage = new Image();
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);
      drawAllPaths(ctx);
    };
    bgImage.onerror = () => {
      // Fallback background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, FIXED_CANVAS_SIZE, FIXED_CANVAS_SIZE);

      // Draw dots manually
      ctx.fillStyle = "#000000";
      for (let i = 0; i < FIXED_CANVAS_SIZE; i += 20) {
        for (let j = 0; j < FIXED_CANVAS_SIZE; j += 20) {
          ctx.beginPath();
          ctx.arc(i, j, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      drawAllPaths(ctx);
    };
    bgImage.src = "/titik.svg";
  };

  // Draw all paths on the given context
  const drawAllPaths = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = "#a1a1a4";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw completed paths
    paths.forEach((path) => {
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      for (let i = 1; i < currentPath.length; i++) {
        ctx.lineTo(currentPath[i].x, currentPath[i].y);
      }
      ctx.stroke();
    }
  };

  // Mouse event handlers
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate scale factors
    const scaleX = FIXED_CANVAS_SIZE / rect.width;
    const scaleY = FIXED_CANVAS_SIZE / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Clamp coordinates to canvas bounds
    return {
      x: Math.max(0, Math.min(FIXED_CANVAS_SIZE, x)),
      y: Math.max(0, Math.min(FIXED_CANVAS_SIZE, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawingMode || isConfirmed) return;

    console.log("Mouse down at:", e.clientX, e.clientY);
    setIsDrawing(true);
    const pos = getMousePos(e);
    console.log("Canvas position:", pos);
    setCurrentPath([pos]);

    // Start drawing immediately
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#a1a1a4";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        console.log("Started drawing at:", pos.x, pos.y);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawingMode || isConfirmed) return;

    const pos = getMousePos(e);
    setCurrentPath((prev) => [...prev, pos]);

    // Draw line in real-time
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        console.log("Drawing line to:", pos.x, pos.y);
      }
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    console.log("Mouse up, path length:", currentPath.length);
    setIsDrawing(false);
    if (currentPath.length > 1) {
      setPaths((prev) => [...prev, currentPath]);
      console.log("Added path with", currentPath.length, "points");
      setCurrentPath([]);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const handleStartDrawing = () => {
    setDrawingMode(true);
    setIsConfirmed(false);
    setPaths([]);
    setCurrentPath([]);
  };

  const handleCancel = () => {
    setDrawingMode(false);
    setIsConfirmed(false);
    setPaths([]);
    setCurrentPath([]);
    if (isFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setPaths([]);
    setCurrentPath([]);
  };

  const handleConfirm = async () => {
    // Convert canvas to SVG
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const svg = `
        <svg width="${FIXED_CANVAS_SIZE}" height="${FIXED_CANVAS_SIZE}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="white"/>
          ${[...paths, currentPath]
            .map((path) =>
              path.length > 1
                ? `<path d="M ${path.map((p) => `${p.x} ${p.y}`).join(" L ")}" stroke="#a1a1a4" stroke-width="4" fill="none"/>`
                : "",
            )
            .join("")}
        </svg>
      `;

      onConfirm(svg);
      setIsConfirmed(true);
      if (isFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Calculate scale factor untuk mempertahankan proporsi
  const scaleFactor = containerSize / FIXED_CANVAS_SIZE;
  const scaledCanvasSize = FIXED_CANVAS_SIZE * scaleFactor;

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
          <div
            ref={containerRef}
            className={`relative mx-auto aspect-square w-full max-w-[600px] rounded-none border border-neutral-300 transition-all duration-300 ${
              isFullscreen
                ? "fixed inset-0 z-50 max-w-none border-0 bg-white shadow-2xl"
                : "hover:shadow-lg"
            }`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Fullscreen Toggle Button */}
            {drawingMode && !isConfirmed && (
              <button
                onClick={toggleFullscreen}
                className={`absolute right-4 top-4 z-10 rounded-full p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                  isFullscreen
                    ? "bg-red-500 text-white shadow-red-500/50 hover:bg-red-600"
                    : "bg-white/90 text-gray-700 shadow-gray-500/30 hover:bg-white"
                }`}
                title={
                  isFullscreen ? "Keluar Fullscreen (Esc)" : "Masuk Fullscreen"
                }
                aria-label={
                  isFullscreen ? "Keluar Fullscreen" : "Masuk Fullscreen"
                }
              >
                {isFullscreen ? (
                  <IconMinimize
                    size={24}
                    className="transition-transform duration-200"
                  />
                ) : (
                  <IconMaximize
                    size={24}
                    className="transition-transform duration-200"
                  />
                )}
              </button>
            )}

            {/* Canvas Container dengan fixed size */}
            <div
              style={{
                width: `${scaledCanvasSize}px`,
                height: `${scaledCanvasSize}px`,
                position: "relative",
                overflow: "hidden",
                borderRadius: isFullscreen ? "0px" : "8px",
              }}
            >
              <canvas
                ref={canvasRef}
                width={FIXED_CANVAS_SIZE}
                height={FIXED_CANVAS_SIZE}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  width: "100%",
                  height: "100%",
                  cursor: drawingMode && !isConfirmed ? "crosshair" : "default",
                  pointerEvents: isConfirmed ? "none" : "auto",
                  imageRendering: "crisp-edges",
                  aspectRatio: "1 / 1",
                  objectFit: "contain",
                }}
              />
            </div>
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
