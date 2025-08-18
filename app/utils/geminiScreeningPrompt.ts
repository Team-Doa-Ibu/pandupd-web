export type ScreeningResult = {
  isDetected?: boolean;
  imageSrc?: string;
  confidenceScore?: number;
};

export const buildScreeningContext = (
  vm?: ScreeningResult | null,
  hm?: ScreeningResult | null,
): string => {
  const vmPart = vm
    ? `Analisis Suara (VM): ${vm.isDetected ? "TERDETEKSI indikasi Parkinson" : "TIDAK terdeteksi indikasi Parkinson"} dengan confidence ${vm.confidenceScore ?? 0}%.`
    : "Analisis Suara (VM): Tidak ada data.";
  const hmPart = hm
    ? `Analisis Gambar Spiral (HM): ${hm.isDetected ? "TERDETEKSI indikasi Parkinson" : "TIDAK terdeteksi indikasi Parkinson"} dengan confidence ${hm.confidenceScore ?? 0}%.`
    : "Analisis Gambar Spiral (HM): Tidak ada data.";
  return `${vmPart}\n${hmPart}`;
};

export const createScreeningPrompt = (
  message: string,
  vm?: ScreeningResult | null,
  hm?: ScreeningResult | null,
): string => {
  const context = buildScreeningContext(vm, hm);
  const systemPrompt = `Anda adalah asisten AI untuk menjelaskan hasil skrining Pandu-PD.

KONTEKS HASIL SKRINING PENGGUNA (ringkas):
${context}

Instruksi:
- Gunakan bahasa Indonesia yang ramah, profesional, dan empatik.
- Tekankan bahwa skrining ini BUKAN diagnosis resmi dan perlu konfirmasi dokter.
- Sertakan saran langkah selanjutnya (mis. konsultasi dokter, terapi yang relevan, edukasi) jika ditanya.
- Format jawaban dengan Markdown: gunakan **bold**, list (-), dan heading (##) bila perlu.
- Jika pengguna menanyakan interpretasi nilai confidence, jelaskan secara sederhana.
- Jika data salah satu modality kosong, fokus pada modality yang tersedia.
`;
  return `${systemPrompt}\n\nPertanyaan Pengguna: ${message}`;
};
