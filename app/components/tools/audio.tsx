import { useState, useRef, useEffect, useCallback } from "react";
import {
  IconMicrophone,
  IconPlayerPlay,
  IconPlayerStop,
  IconPlayerPause,
  IconTrash,
  IconUpload,
  IconCircleCheckFilled,
  IconX,
} from "@tabler/icons-react";
import WaveSurfer from "wavesurfer.js";

interface AudioProps {
  onConfirm: (audioFile: File) => void;
}

export default function Audio({ onConfirm }: AudioProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<File | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [mode, setMode] = useState<"idle" | "record" | "upload">("idle");
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const waveformContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Inisialisasi WaveSurfer saat mode masuk ke 'record' atau 'upload'
  useEffect(() => {
    if (!waveformContainerRef.current || waveformRef.current) {
      console.log(
        "⏳ Skip inisialisasi WaveSurfer (container null / sudah dibuat)",
      );
      return;
    }

    if (mode !== "record" && mode !== "upload") {
      console.log("❌ Bukan mode aktif, skip inisialisasi WaveSurfer");
      return;
    }

    console.log("✅ Membuat WaveSurfer instance...");
    waveformRef.current = WaveSurfer.create({
      container: waveformContainerRef.current,
      waveColor: "#3b82f6",
      progressColor: "#1d4ed8",
      cursorColor: "#1e40af",
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      barGap: 2,
      normalize: true,
      interact: true,
    });

    const wavesurfer = waveformRef.current;

    const handleReady = () => {
      console.log("🎉 Waveform ready");
      if (audioRef.current && wavesurfer.getMediaElement()) {
        audioRef.current.src = wavesurfer.getMediaElement().src;
      }
    };

    wavesurfer.on("ready", handleReady);
    wavesurfer.on("play", () => {
      console.log("▶️ Playing...");
      setIsPlaying(true);
    });
    wavesurfer.on("pause", () => {
      console.log("⏸️ Paused");
      setIsPlaying(false);
    });
    wavesurfer.on("finish", () => {
      console.log("⏹️ Playback finished");
      setIsPlaying(false);
    });
    wavesurfer.on("error", (err) => console.error("❌ WaveSurfer error:", err));

    return () => {
      console.log("🧹 Membersihkan WaveSurfer");
      wavesurfer.destroy();
      waveformRef.current = null;
    };
  }, [mode]);

  // Load audio ke WaveSurfer ketika audioUrl berubah
  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return;

    console.log("🔄 Loading audio ke WaveSurfer:", audioUrl);
    const wavesurfer = waveformRef.current;
    wavesurfer.empty();

    wavesurfer
      .load(audioUrl)
      .then(() => console.log("✅ Audio loaded"))
      .catch((err) => {
        console.error("❌ Gagal load audio:", err);
      });

    return () => {
      wavesurfer.stop();
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setRecordedAudio(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeLeft(120);
      setMode("record");
    } catch (err) {
      console.error("❌ Error accessing microphone:", err);
      alert("Tidak dapat mengakses mikrofon. Pastikan izin sudah diberikan.");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  }, [isRecording]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft, stopRecording]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.includes("audio/")) {
        alert("Format file harus audio");
        return;
      }
      setUploadedAudio(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setMode("upload");
    }
  };

  const togglePlayPause = () => {
    if (waveformRef.current) {
      if (waveformRef.current.isPlaying()) {
        waveformRef.current.pause();
      } else {
        waveformRef.current.play();
      }
    }
  };

  const handleConfirm = () => {
    if (recordedAudio) {
      const audioFile = new File([recordedAudio], "recording.wav", {
        type: "audio/wav",
      });
      onConfirm(audioFile);
      setIsConfirmed(true);
    } else if (uploadedAudio) {
      onConfirm(uploadedAudio);
      setIsConfirmed(true);
    }
  };

  const handleReset = () => {
    waveformRef.current?.stop();
    waveformRef.current?.empty();
    setRecordedAudio(null);
    setUploadedAudio(null);
    setAudioUrl(null);
    setMode("idle");
    setTimeLeft(120);
    setIsPlaying(false);
    setIsConfirmed(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-4">
      {mode === "idle" && (
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <button
            onClick={startRecording}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-white shadow-inner shadow-white/50 hover:bg-blue-600"
          >
            <IconMicrophone size={20} />
            Rekam Suara
          </button>
          <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-neutral-50 px-6 py-3 text-neutral-700 shadow-inner shadow-white hover:bg-neutral-100">
            <IconUpload size={20} />
            Upload Suara
            <input
              type="file"
              accept=".wav,audio/wav,audio/mpeg"
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>
      )}

      {(mode === "record" || mode === "upload") && (
        <>
          <div className="relative h-[120px] rounded-lg border border-neutral-300 p-4">
            {/* Waveform tetap ada, tapi disembunyikan saat merekam */}
            <div
              ref={waveformContainerRef}
              className={isRecording ? "hidden" : ""}
              style={{
                minHeight: "100px",
                width: "100%",
              }}
            />

            {/* Timer recording ditampilkan di atasnya secara absolut */}
            {mode === "record" && isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-2 h-4 w-4 animate-ping rounded-full bg-red-500" />
                <div className="text-2xl font-bold text-red-600">
                  {formatTime(timeLeft)}
                </div>
                <div className="mt-1 text-sm text-neutral-500">
                  Sedang merekam...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {mode === "record" && isRecording ? (
              <>
                <button
                  onClick={stopRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                >
                  <IconPlayerStop size={18} />
                  Stop
                </button>
                <button
                  onClick={handleReset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-100"
                >
                  <IconTrash size={18} />
                  Batal
                </button>
              </>
            ) : (
              <>
                {!isConfirmed && (
                  <>
                    <button
                      onClick={handleReset}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-300 bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
                    >
                      <IconX size={18} />
                      Batal
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-100 focus:outline focus:outline-blue-300"
                    >
                      {isPlaying ? (
                        <IconPlayerPause size={18} />
                      ) : (
                        <IconPlayerPlay size={18} />
                      )}
                      {isPlaying ? "Jeda" : "Putar"}
                    </button>
                  </>
                )}

                {isConfirmed ? (
                  <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-50 p-4 text-center">
                    <IconCircleCheckFilled
                      className="text-blue-700"
                      size={24}
                    />
                    <p className="font-semibold text-blue-700">
                      Suara telah dikonfirmasi
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleConfirm}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-inner shadow-white/50 hover:bg-blue-700"
                  >
                    Konfirmasi
                  </button>
                )}
              </>
            )}
          </div>

          <audio ref={audioRef} controls className="hidden">
            <track kind="captions" src="" srcLang="en" label="English" />
          </audio>
        </>
      )}

      {mode === "upload" && (
        <div className="text-sm text-neutral-500">
          Format: WAV/MP3, 44.1 kHz, 16 bit
        </div>
      )}
    </div>
  );
}
