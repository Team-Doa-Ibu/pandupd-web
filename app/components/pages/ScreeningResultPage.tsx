import React, { useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { SpiralScreeningCard } from "../ui/SpiralScreeningCard";
import { VoiceAnalysisCard } from "../ui/VoiceAnalysisCard";
import { ScreeningChatBot } from "../ui/ScreeningChatBot";
import { supabase } from "~/data/supabaseClient";

interface ResultData {
  isDetected?: boolean;
  imageSrc?: string;
  confidenceScore?: number;
}

export default function ScreeningResultPage({
  loaderId,
  focusType,
}: {
  loaderId?: number;
  focusType?: string;
}) {
  const [searchParams] = useSearchParams();
  const idParam = loaderId ? String(loaderId) : searchParams.get("id");
  const typeParam = focusType ?? searchParams.get("type");

  const [vm, setVm] = useState<ResultData | null>(null);
  const [hm, setHm] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!idParam) {
          setError("Missing id");
          return;
        }
        const id = Number(idParam);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          return;
        }
        const { data, error: dbError } = await supabase
          .from("form")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        if (dbError) throw dbError;
        if (!data) {
          setError("Data not found");
          return;
        }
        const hasVm =
          Boolean(data.File_Diagnosa_vm) ||
          data.Hasil_Diagnosa_vm !== null ||
          data.Score_Diagnosa_vm !== null;
        const hasHm =
          Boolean(data.File_Diagnosa_hm) ||
          data.Hasil_Diagnosa_hm !== null ||
          data.Score_Diagnosa_hm !== null;

        const vmData: ResultData | null = hasVm
          ? {
              isDetected: data.Hasil_Diagnosa_vm === true,
              imageSrc: data.File_Diagnosa_vm || "/images/voice-analysis.jpg",
              confidenceScore: data.Score_Diagnosa_vm
                ? Number(String(data.Score_Diagnosa_vm).replace(/[^0-9.]/g, ""))
                : 0,
            }
          : null;

        const hmData: ResultData | null = hasHm
          ? {
              isDetected: data.Hasil_Diagnosa_hm === true,
              imageSrc: data.File_Diagnosa_hm || "/images/spiral-test.jpg",
              confidenceScore: data.Score_Diagnosa_hm
                ? Number(String(data.Score_Diagnosa_hm).replace(/[^0-9.]/g, ""))
                : 0,
            }
          : null;

        if (!mounted) return;
        setVm(vmData);
        setHm(hmData);
      } catch (e) {
        console.error("[ScreeningResult] error:", e);
        if (mounted) setError("Gagal memuat data hasil skrining");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [idParam]);

  const spiralResult = {
    isDetected: hm?.isDetected ?? false,
    imageSrc: hm?.imageSrc ?? "/images/spiral-test.jpg",
    confidenceScore: hm?.confidenceScore ?? 0,
  };

  const voiceResult = {
    isDetected: vm?.isDetected ?? false,
    imageSrc: vm?.imageSrc ?? "/images/voice-analysis.jpg",
    confidenceScore: vm?.confidenceScore ?? 0,
  };

  const cardCount = (hm ? 1 : 0) + (vm ? 1 : 0);
  const gridClass =
    cardCount === 1
      ? "mx-auto grid max-w-4xl gap-6 grid-cols-1 place-items-center"
      : "mx-auto grid max-w-4xl gap-6 md:grid-cols-2";

  return (
    <>
      <div className="container mx-auto mt-10 px-4 py-20">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">
            Hasil <span className="text-orange-500">SKRINING</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Berikut ini hasil skrining penyakit parkinson.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto max-w-4xl text-center text-neutral-500">
            Memuat...
          </div>
        ) : error ? (
          <div className="mx-auto max-w-4xl text-center text-red-500">
            {error}
          </div>
        ) : (
          <div className={gridClass}>
            {hm && (
              <div className="w-full max-w-xl">
                <SpiralScreeningCard
                  imageSrc={spiralResult.imageSrc as string}
                  isDetected={Boolean(spiralResult.isDetected)}
                  confidenceScore={Number(spiralResult.confidenceScore)}
                />
              </div>
            )}

            {vm && (
              <div className="w-full max-w-xl">
                <VoiceAnalysisCard
                  imageSrc={voiceResult.imageSrc as string}
                  isDetected={Boolean(voiceResult.isDetected)}
                  confidenceScore={Number(voiceResult.confidenceScore)}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex justify-center gap-4">
          <button className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 hover:bg-gray-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Ulangi Skrining
          </button>

          <button className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-white hover:bg-blue-600">
            Lakukan Terapi
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Catatan Penting</h3>
            <p className="mt-1 text-sm text-gray-700">
              Hasil skrining ini bersifat indikatif dan tidak menggantikan
              skrining medis profesional. Silakan berkonsultasi dengan spesialis
              untuk evaluasi lebih lanjut dan rencana pengobatan yang sesuai.
            </p>
          </div>
        </div>
      </div>

      <ScreeningChatBot vm={vm || undefined} hm={hm || undefined} />
    </>
  );
}
