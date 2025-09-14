import {
  IconBook2,
  IconInfoCircle,
  IconSend,
  IconLoader2,
  IconCheck,
  IconPencil,
  IconMicrophone,
} from "@tabler/icons-react";
import Spiral from "../tools/spiral";
import Audio from "../tools/audio";
import { useState } from "react";
import { supabase } from "~/data/supabaseClient";

const DeteksiPage = () => {
  const [spiralSvg, setSpiralSvg] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<
    { id: string; text: string; customText: string; selected: boolean }[]
  >([
    {
      id: "motorik",
      text: "Gejala motorik seperti tremor, gemetar, dll",
      customText: "",
      selected: false,
    },
    {
      id: "bicara",
      text: "Gejala gangguan bicara seperti kesusahan artikulasi, bicara lambat, serak, dll",
      customText: "",
      selected: false,
    },
    { id: "lainnya", text: "Gejala lainnya", customText: "", selected: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleSpiralConfirm = (svg: string) => {
    setSpiralSvg(svg);
  };

  const handleAudioConfirm = (file: File) => {
    setAudioFile(file);
  };

  const handleSymptomToggle = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.map((symptom) =>
        symptom.id === id
          ? { ...symptom, selected: !symptom.selected }
          : symptom,
      ),
    );
  };

  const handleCustomTextChange = (id: string, text: string) => {
    setSelectedSymptoms((prev) =>
      prev.map((symptom) =>
        symptom.id === id ? { ...symptom, customText: text } : symptom,
      ),
    );
  };

  const postToSession = async (id: number, type?: string) => {
    const form = new FormData();
    form.append("id", String(id));
    if (type) form.append("type", type);
    await fetch("/screening-result", { method: "POST", body: form });
    window.location.href = "/screening-result";
  };

  const handleSubmit = async () => {
    if (!spiralSvg && !audioFile) return;
    setIsSubmitting(true);
    setShowOverlay(true);

    try {
      console.log("[deteksi] submitting...");
      // Get current user for headers
      const { data: userResp } = await supabase.auth.getUser();
      const user = userResp?.user;

      if (!user) {
        throw new Error("AUTH_ERROR: Belum login");
      }

      const form = new FormData();
      if (spiralSvg) form.append("spiralSvg", spiralSvg);
      if (audioFile) form.append("audio", audioFile);

      // Build symptoms string based on selection status
      const symptomsParts: string[] = [];

      selectedSymptoms.forEach((symptom) => {
        if (symptom.id === "motorik") {
          if (symptom.selected) {
            symptomsParts.push(
              "ada gejala motorik seperti tremor, gemetar, dll",
            );
          } else {
            symptomsParts.push("tidak ada tremor di tangan");
          }
        } else if (symptom.id === "bicara") {
          if (symptom.selected) {
            symptomsParts.push(
              "ada gejala gangguan suara seperti kesusahan bicara, artikulasi, lambat, serak, dll",
            );
          } else {
            symptomsParts.push("tidak ada gangguan bicara");
          }
        } else if (
          symptom.id === "lainnya" &&
          symptom.selected &&
          symptom.customText.trim()
        ) {
          symptomsParts.push(symptom.customText.trim());
        }
      });

      const combinedSymptoms = symptomsParts.join(", ");
      console.log("[deteksi] symptoms string:", combinedSymptoms);
      form.append("symptoms", combinedSymptoms);
      const res = await fetch("/api/deteksi-submit", {
        method: "POST",
        headers: {
          "x-user-id": user.id, // Send user ID in headers
        },
        body: form,
      });
      const text = await res.text();
      let model: any = null;
      try {
        model = JSON.parse(text);
      } catch (e) {
        console.error("[deteksi] parse error from server:", e, text);
        throw new Error("RESP_PARSE_ERROR");
      }
      if (!res.ok || !model?.success) {
        console.error("[deteksi] server/model error:", model);
        if (model?.error_type === "config")
          throw new Error("CONFIG_ERROR: API_MODEL_URL missing");
        if (model?.error_type === "network")
          throw new Error("NETWORK_ERROR: gagal konek ke model API");
        if (model?.error_type === "http_status")
          throw new Error(`HTTP_STATUS_ERROR: ${model?.details || ""}`);
        if (model?.error_type === "parse")
          throw new Error("MODEL_JSON_PARSE_ERROR");
        throw new Error(model?.error || "UNKNOWN_MODEL_ERROR");
      }

      console.log("[deteksi] model response:", model);
      console.log("[deteksi] raw values:", {
        vm_prediction: model.vm_prediction,
        vm_confidence: model.vm_confidence,
        hw_prediction: model.hw_prediction,
        hw_confidence: model.hw_confidence,
      });
      console.log("[deteksi] confidence conversions:", {
        vm_confidence_raw: model.vm_confidence,
        vm_confidence_type: typeof model.vm_confidence,
        vm_confidence_converted:
          model.vm_confidence === null || model.vm_confidence === undefined
            ? null
            : `${model.vm_confidence}`,
        hw_confidence_raw: model.hw_confidence,
        hw_confidence_type: typeof model.hw_confidence,
        hw_confidence_converted:
          model.hw_confidence === null || model.hw_confidence === undefined
            ? null
            : `${model.hw_confidence}`,
      });

      // Data already inserted in API endpoint
      console.log(
        "[deteksi] data already inserted in API with ID:",
        model.inserted_id,
      );

      setShowOverlay(false);
      await postToSession(model.inserted_id, undefined);
    } catch (error: any) {
      console.error("[deteksi] submit failed:", error);
      const msg =
        typeof error?.message === "string"
          ? error.message
          : "Gagal memproses. Coba lagi.";
      alert(msg);
      setShowOverlay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitEnabled = spiralSvg !== null || audioFile !== null;
  const completedTests = [
    selectedSymptoms.some((s) => s.selected),
    spiralSvg !== null,
    audioFile !== null,
  ].filter(Boolean).length;

  return (
    <div className="flex w-full flex-col items-center pt-20">
      {showOverlay && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/75">
          <div className="w-full max-w-6xl p-8">
            <div className="rounded-[32px] border border-blue-300 bg-gradient-to-br from-white to-blue-50 p-8">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mx-auto mb-5 h-24 w-24 animate-spin rounded-full border-8 border-gray-100 border-t-blue-500"></div>
                <h2 className="mb-2 text-2xl font-bold text-neutral-800">
                  Menganalisis Data...
                </h2>
                <p className="text-neutral-600">
                  Mohon tunggu, ini dapat memakan waktu beberapa detik
                </p>
              </div>

              {/* Progress Section */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-700">
                    Status Deteksi
                  </h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {completedTests}/3 Selesai
                  </span>
                </div>

                <div className="mb-4 space-y-3">
                  {/* Symptoms Status */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-2 ${selectedSymptoms.some((s) => s.selected) ? "bg-green-100" : "bg-neutral-100"}`}
                    >
                      {selectedSymptoms.some((s) => s.selected) ? (
                        <IconCheck size={20} className="text-green-600" />
                      ) : (
                        <IconInfoCircle
                          size={20}
                          className="text-neutral-400"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${selectedSymptoms.some((s) => s.selected) ? "text-green-700" : "text-neutral-500"}`}
                      >
                        Gejala
                      </p>
                      <p
                        className={`text-sm ${selectedSymptoms.some((s) => s.selected) ? "text-green-600" : "text-neutral-400"}`}
                      >
                        {selectedSymptoms.some((s) => s.selected)
                          ? "Gejala telah diisi"
                          : "Belum mengisi gejala"}
                      </p>
                    </div>
                  </div>

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
                <div className="w-full">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                      style={{ width: `${(completedTests / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section*/}
      <section
        className="relative mx-auto flex w-full max-w-6xl items-center justify-center overflow-hidden bg-white p-4"
        style={{ minHeight: "30vh" }}
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
            <img src="/Logo.svg" alt="Logo" className="h-10 rounded-full" />
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

      {/* Informasi Gejala Section */}
      <section className="mx-auto w-full p-4">
        <section className="mx-auto flex max-w-6xl flex-col items-center justify-center py-8">
          {/* label */}
          <div className="w-fit rounded-t-2xl border-x border-t border-neutral-300 bg-white p-2">
            <div className="flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-2 shadow-inner">
              <IconInfoCircle size={20} className="text-blue-500" />
              <p className="font-bold text-blue-500">Informasi Gejala </p>
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
                  Apakah Anda Memiliki Gejala Berikut?
                </p>
              </div>
              <p className="text-neutral-700">
                Pilih gejala berikut atau tambahkan deskripsi kustom untuk
                membantu analisis yang lebih akurat. Ini opsional tetapi sangat
                membantu.
              </p>
            </div>

            <div className="w-full space-y-4 rounded-2xl border border-dashed border-neutral-300 p-4">
              {selectedSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="rounded-lg border border-neutral-200 p-4"
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <span className="sr-only">{symptom.text}</span>
                    <input
                      type="checkbox"
                      checked={symptom.selected}
                      onChange={() => handleSymptomToggle(symptom.id)}
                      className="mt-1 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {symptom.id === "motorik" && (
                          <IconPencil size={20} className="text-blue-500" />
                        )}
                        {symptom.id === "bicara" && (
                          <IconMicrophone
                            size={20}
                            className="text-green-500"
                          />
                        )}
                        {symptom.id === "lainnya" && (
                          <IconInfoCircle
                            size={20}
                            className="text-amber-500"
                          />
                        )}
                        <p className="text-base font-bold text-neutral-700">
                          {symptom.text}
                        </p>
                      </div>
                      {symptom.id === "lainnya" ? (
                        <textarea
                          value={symptom.customText}
                          onChange={(e) =>
                            handleCustomTextChange(symptom.id, e.target.value)
                          }
                          placeholder="Jelaskan gejala lain yang Anda alami, misalnya: kesulitan berjalan, perubahan suara, dll."
                          className="min-h-[80px] w-full resize-none rounded-md border border-neutral-300 p-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          maxLength={500}
                        />
                      ) : (
                        <div className="text-sm text-neutral-600">
                          {symptom.customText}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
      {/*Detection Section*/}
      <section className="mx-auto w-full p-4">
        {/* Gambar Spiral */}
        <section
          id="analisis-gambar"
          className="mx-auto flex max-w-6xl flex-col items-center justify-center py-8"
        >
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
        </section>

        {/* Analisis Suara */}
        <section
          id="analisis-suara"
          className="mx-auto flex max-w-6xl flex-col items-center justify-center py-8"
        >
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
                  Bacalah teks yang tersedia sampai selesai atau sepanjang dua
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
                “Hal ini terjadi karena hamburan cahaya biru lebih sedikit
                karena panjang jalur atmosfer dan tingkat hamburan radiasi yang
                masuk berkurang. Dengan alasan yang sama, matahari tampak lebih
                putih dan kurang berwarna oranye seiring dengan peningkatan
                ketinggian pengamat. Hal ini terjadi karena proporsi sinar
                matahari yang lebih besar datang langsung ke mata pengamat.
                Gambar 5.7 adalah representasi skematik dari jalur energi
                elektromagnetik dalam spektrum tampak saat bergerak dari
                matahari ke Bumi dan kembali lagi menuju sensor yang dipasang
                pada satelit yang mengorbit. Jalur gelombang yang mewakili
                energi yang rentan terhadap hamburan (yaitu, panjang gelombang
                yang lebih pendek) saat bergerak dari matahari ke Bumi
                ditunjukkan. Bagi sensor, tampaknya seluruh energi tersebut
                telah dipantulkan dari titik P di permukaan tanah padahal,
                kenyataannya, tidak sepenuhnya demikian, karena sebagian energi
                telah tersebar di dalam atmosfer dan tidak pernah mencapai
                permukaan tanah sama sekali.”
              </p>
            </div>

            {/* analisis */}
            <div className="w-full rounded-2xl border border-dashed border-neutral-300 p-4">
              <Audio onConfirm={handleAudioConfirm} />
            </div>
          </div>
        </section>
      </section>

      {/* Submit Section */}
      <section className="mx-auto w-full p-4 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center">
          {/* Submit Card */}
          <div className="w-full space-y-6 rounded-[32px] border border-blue-300 bg-gradient-to-br from-white to-blue-50 p-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-800">
                Kirim Data Skrining
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
                  {completedTests}/3 Selesai
                </span>
              </div>

              <div className="space-y-3">
                {/* Symptoms Status */}
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${selectedSymptoms.some((s) => s.selected) ? "bg-green-100" : "bg-neutral-100"}`}
                  >
                    {selectedSymptoms.some((s) => s.selected) ? (
                      <IconCheck size={20} className="text-green-600" />
                    ) : (
                      <IconInfoCircle size={20} className="text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${selectedSymptoms.some((s) => s.selected) ? "text-green-700" : "text-neutral-500"}`}
                    >
                      Deskripsi Gejala
                    </p>
                    <p
                      className={`text-sm ${selectedSymptoms.some((s) => s.selected) ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {selectedSymptoms.some((s) => s.selected)
                        ? "Gejala telah diisi"
                        : "Belum mengisi gejala"}
                    </p>
                  </div>
                </div>

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
                    style={{ width: `${(completedTests / 3) * 100}%` }}
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
                      <span className="relative">Submit</span>
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
