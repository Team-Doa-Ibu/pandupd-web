"use client";

import {
  IconBook2,
  IconInfoCircle,
  IconSend,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";
import Spiral from "../tools/spiral";
import Audio from "../tools/audio";
import { useState } from "react";

const DeteksiPage = () => {
  const [spiralSvg, setSpiralSvg] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSpiralConfirm = (svg: string) => {
    setSpiralSvg(svg);
  };

  const handleAudioConfirm = (file: File) => {
    setAudioFile(file);
  };

  const handleSubmit = async () => {
    if (!spiralSvg && !audioFile) return;

    setIsSubmitting(true);

    try {
      // Simulasi
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock ID for navigation
      const resultId = Date.now().toString();

      // Navigate to results page
      console.log(`Navigating to: /deteksi/hasil/${resultId}`);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = spiralSvg !== null || audioFile !== null;
  const completedTests = [spiralSvg !== null, audioFile !== null].filter(
    Boolean,
  ).length;

  return (
    <div className="flex w-full flex-col items-center pt-20">
      {/* Hero Section*/}
      <section
        className="relative mx-auto flex w-full max-w-6xl items-center justify-center overflow-hidden bg-white p-4"
        style={{ minHeight: "60vh" }}
      >
        {/* Dot Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(#d4d4d4 1px, transparent 1px), radial-gradient(#d4d4d4 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 20px 20px",
          }}
        ></div>

        <div className="pointer-events-none absolute inset-0 z-10 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]"></div>

        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
            <span className="font-semibold text-neutral-700">PANDU‑PD</span>
          </div>
          <h1 className="text-3xl font-bold text-neutral-800">
            Selamat Datang di{" "}
            <span className="italic text-amber-500">Skrining</span> Test
            Parkinson
          </h1>
          <p className="max-w-3xl text-pretty text-neutral-500">
            Pada halaman ini, Anda dapat memasukkan data untuk kedua metode tes
            screening Parkinson yang didukung oleh PANDU-PD. Jangan lupa untuk
            submit jika telah menyelesaikan tes.
          </p>
        </div>
      </section>

      {/*Detection Section*/}
      <section className="mx-auto w-full p-4">
        {/* Gambar Spiral */}
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-8">
          {/* label */}
          <div className="w-fit rounded-t-2xl border-x border-t border-neutral-300 bg-white p-2">
            <div className="flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2 shadow-inner">
              <img src="spiral-icon.svg" alt="spiral" />
              <p className="font-bold text-blue-500">Analisis Gambar</p>
            </div>
          </div>
          {/* content */}
          <div className="w-full space-y-4 rounded-[32px] border border-neutral-300 bg-white p-4">
            {/* info */}
            <div className="flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              {/* icon */}
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-500 p-2">
                  <IconInfoCircle size={24} className="text-white" />
                </div>
                <p className="font-bold text-neutral-700">
                  Ikuti langkah-langkah berikut
                </p>
              </div>
              <ol className="w-full list-decimal pl-6 text-neutral-800">
                <li>Klik tombol &quot;Mulai Gambar&quot; dibawah</li>
                <li>
                  Gambarlah pola spiral yang terlihat pada area kanvas pada
                  layar
                </li>
                <li>
                  Jika sudah selesai menggambar, klik tombol
                  &quot;Konfirmasi&quot;
                </li>
                <li>
                  Anda dapat langsung melakukan deteksi langsung tombol
                  &quot;submit&quot; dibawah.
                </li>
              </ol>
            </div>

            {/* analisis */}
            <div className="w-full rounded-2xl border border-dashed border-neutral-300 p-4">
              <Spiral onConfirm={handleSpiralConfirm} />
            </div>
          </div>
        </div>

        {/* Analisis Suara */}
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-8">
          {/* label */}
          <div className="w-fit rounded-t-2xl border-x border-t border-neutral-300 bg-white p-2">
            <div className="flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2 shadow-inner">
              <img src="audio-icon.svg" alt="spiral" />
              <p className="font-bold text-blue-500">Analisis Suara</p>
            </div>
          </div>
          {/* content */}
          <div className="w-full space-y-4 rounded-[32px] border border-neutral-300 bg-white p-4">
            {/* info */}
            <div className="flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-4">
              {/* icon */}
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-500 p-2">
                  <IconInfoCircle size={24} className="text-white" />
                </div>
                <p className="font-bold text-neutral-700">
                  Perhatikan langkah-langkah berikut, sesuaikan dengan metode
                  yang anda pilih
                </p>
              </div>
              {/* metode 1 */}
              <ol className="w-full list-decimal pl-6 text-neutral-700">
                <span className="font-bold">
                  Metode 1: Rekam Suara Langsung
                </span>
                <li>Perhatikan satu paragraf teks yang tersedia dibawah</li>
                <li>
                  Klik tombol &quot;Mulai Rekam&quot; untuk memulai merekam
                  suara
                </li>
                <li>
                  Pastikan anda mengizinkan akses mikrofon pada browser anda
                </li>
                <li>
                  Bacalah teks yang tersedia sampai selesai atau sepanjang satu
                  menit
                </li>
                <li>
                  Klik tombol &quot;konfirmasi&quot; jika anda telah selesai
                  membaca
                </li>
                {/* metode 2 */}
              </ol>
              <ol className="w-full list-decimal pl-6 text-neutral-700">
                <span className="font-bold">Metode 2: Unggah File Suara</span>
                <li>
                  Siapkan File Audio Anda. Pastikan sesuai dengan spesifikasi
                  berikut :{" "}
                  <span className="font-mono text-sm font-bold italic">
                    .wav, 44.1 kHz, 16 bit.
                  </span>{" "}
                  atau gunakan converter{" "}
                  <a
                    className="italic text-blue-500 underline"
                    target="blank"
                    href="https://onlineaudioconverter.com/"
                  >
                    berikut
                  </a>
                </li>
                <li>
                  Klik Tombol &quot;Unggah Suara&quot;, Cari dan pilih file
                  audio yang ingin Anda unggah dari perangkat Anda.
                </li>
                <li>
                  Setelah file berhasil diunggah, pastikan tidak ada kesalahan
                  dan klik &quot;Konfirmasi&quot; .
                </li>
              </ol>
            </div>

            <div className="space-y-4 rounded-2xl border border-neutral-300 bg-white p-4">
              <div className="flex items-center justify-center gap-2 text-neutral-700">
                <IconBook2 />
                <h1 className="font-bold">Bacalah Teks Dibawah</h1>
              </div>
              <p className="text-justify text-neutral-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                quis enim at tortor sodales tempus eu non tortor. Phasellus nec
                accumsan turpis. Etiam ac leo vitae ante vulputate ornare eget
                et purus. Sed viverra urna nec accumsan lacinia. Nulla sodales
                suscipit arcu, at congue enim dictum quis. Nullam venenatis
                tristique nunc in convallis. Aliquam congue turpis velit, vel
                cursus odio tempor in. Ut diam massa, fringilla vel urna non,
                faucibus suscipit orci. Aenean hendrerit semper risus, non
                venenatis risus congue eget. Aliquam sit amet aliquet felis,
                eget aliquam magna. Morbi non ligula arcu. Fusce dapibus turpis
                nulla, et suscipit justo hendrerit sed. Curabitur pellentesque
                est ut turpis mattis, et condimentum est efficitur. Vestibulum
                ornare ut libero a dapibus. Pellentesque sit amet scelerisque
                dui. Suspendisse vel interdum tellus.
              </p>
            </div>

            {/* analisis */}
            <div className="w-full rounded-2xl border border-dashed border-neutral-300 p-4">
              <Audio onConfirm={handleAudioConfirm} />
            </div>
          </div>
        </div>
      </section>

      {/* Submit Section */}
      <section className="mx-auto w-full p-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
          {/* Submit Card */}
          <div className="w-full space-y-6 rounded-[32px] border border-blue-300 bg-gradient-to-br from-white to-blue-50 p-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-800">
                Kirim Hasil Deteksi
              </h2>
              <p className="mt-2 text-neutral-600">
                Pastikan Anda telah menyelesaikan minimal satu metode deteksi
                sebelum mengirim
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-700">
                  Status Deteksi
                </h3>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {completedTests}/2 Selesai
                </span>
              </div>

              <div className="space-y-3">
                {/* Spiral Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${spiralSvg ? "bg-green-100" : "bg-neutral-100"}`}
                  >
                    {spiralSvg ? (
                      <IconCheck size={20} className="text-green-600" />
                    ) : (
                      <img
                        src="spiral-icon.svg"
                        alt="spiral"
                        className="h-5 w-5 opacity-50"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${spiralSvg ? "text-green-700" : "text-neutral-500"}`}
                    >
                      Analisis Gambar Spiral
                    </p>
                    <p
                      className={`text-sm ${spiralSvg ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {spiralSvg
                        ? "Gambar spiral berhasil dibuat"
                        : "Belum menggambar spiral"}
                    </p>
                  </div>
                </div>

                {/* Audio Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${audioFile ? "bg-green-100" : "bg-neutral-100"}`}
                  >
                    {audioFile ? (
                      <IconCheck size={20} className="text-green-600" />
                    ) : (
                      <img
                        src="audio-icon.svg"
                        alt="audio"
                        className="h-5 w-5 opacity-50"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${audioFile ? "text-green-700" : "text-neutral-500"}`}
                    >
                      Analisis Suara
                    </p>
                    <p
                      className={`text-sm ${audioFile ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {audioFile
                        ? `File audio: ${audioFile.name}`
                        : "Belum merekam atau mengunggah audio"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-neutral-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${(completedTests / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={!isSubmitEnabled || isSubmitting}
                className={`group relative flex w-full max-w-md items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-lg font-semibold transition-all duration-500 ease-in-out ${
                  isSubmitEnabled && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl"
                    : "cursor-not-allowed bg-neutral-300 text-neutral-500"
                }`}
              >
                {/* Animated background elements */}
                {isSubmitEnabled && !isSubmitting && (
                  <>
                    {/* Pulse animation */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100"></div>

                    {/* Shine effect */}
                    <div className="absolute -left-16 top-0 h-full w-16 skew-x-12 bg-white/30 transition-all duration-700 group-hover:left-[110%]"></div>
                  </>
                )}

                {/* Button content */}
                <div className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <IconLoader2
                        size={24}
                        className="animate-spin transition-transform duration-500 group-hover:rotate-12"
                      />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <IconSend
                        size={24}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-12"
                      />
                      <span className="relative">Kirim Hasil Deteksi</span>
                    </>
                  )}
                </div>

                {/* Ripple effect container */}
                {isSubmitEnabled && !isSubmitting && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute h-0 w-0 rounded-full bg-white/30 opacity-0 transition-all duration-700 group-active:h-64 group-active:w-64 group-active:scale-150 group-active:opacity-100"></div>
                  </div>
                )}
              </button>
              {/* Helper Text */}
              {!isSubmitEnabled && (
                <p className="text-center text-sm text-neutral-500">
                  Selesaikan minimal satu metode deteksi untuk melanjutkan
                </p>
              )}

              {isSubmitEnabled && !isSubmitting && (
                <p className="text-center text-sm text-green-600">
                  Siap untuk mengirim hasil deteksi Anda
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeteksiPage;
