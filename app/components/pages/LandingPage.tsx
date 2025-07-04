import { Link } from "@remix-run/react";

export const LandingPage = () => {
  return (
    <div
      className="flex w-full flex-col overflow-x-hidden"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/image-5.png')" }}
          aria-hidden="true"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0 z-10 bg-neutral-800/40"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-20 mx-auto flex w-full flex-col gap-10 px-4 pb-12 pt-32 sm:max-w-6xl md:px-0">
          {/* Headline & CTA */}
          <div className="flex flex-col gap-3 sm:gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 text-pretty text-center sm:text-start">
              <h1 className="mb-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Sistem Deteksi Dini
                <br />
                Penyakit <span className="text-yellow-400">Parkinson</span>
                <br />
                Berbasis <span className="text-blue-400">AI</span>
              </h1>
            </div>
            <div className="flex flex-1 flex-col gap-4 text-pretty text-center sm:text-start">
              <p className="px-4 text-sm text-white sm:px-0 sm:text-base">
                Teknologi kecerdasan buatan kami membantu mengidentifikasi
                tanda-tanda awal Parkinson dengan cepat dan akurat. Ambil
                langkah pencegahan sekarang untuk masa depan yang lebih baik.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-4">
                <Link
                  to="/deteksi"
                  className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600"
                >
                  Coba Sekarang
                </Link>
                <button className="rounded-full bg-white px-6 py-2 font-semibold text-neutral-800 transition hover:bg-blue-50">
                  Pelajari lebih
                </button>
              </div>
            </div>
          </div>

          {/* Card Section*/}
          <div className="flex w-full flex-col gap-6 md:flex-row">
            {/* Container box putih untuk seluruh bagian card */}
            <div className="flex w-full flex-col gap-4 rounded-3xl bg-white/20 p-4 shadow-lg backdrop-blur-sm md:flex-row">
              {/* Left: Image Card */}
              <div className="relative flex max-h-[340px] min-h-[260px] flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-neutral-800/80 shadow-lg">
                <img
                  src="/image-4.png"
                  alt="Parkinson"
                  className="h-full w-full object-cover object-center opacity-70"
                />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="mb-1 text-lg font-bold text-yellow-400 drop-shadow sm:text-xl">
                    Jangan Tunggu Gejala Muncul!
                  </p>
                  <p className="text-sm text-white drop-shadow">
                    Cegah lebih awal untuk kehidupan yang lebih berkualitas.
                  </p>
                </div>
              </div>

              {/* Right: Feature Cards */}
              <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-5 shadow">
                  <div className="bg-blue-120 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
                    {/* Mengganti SVG AI Canggih dengan img */}
                    <img
                      src="/AI-icon.png"
                      alt="AI Chip"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-bold text-neutral-800">
                      Didukung AI Canggih
                    </div>
                    <div className="text-sm text-neutral-600">
                      Teknologi kecerdasan buatan terbaru menganalisis data
                      medis dengan tingkat akurasi tinggi, membantu deteksi dini
                      Parkinson agar pengguna dapat mengambil langkah yang tepat
                      lebih awal.
                    </div>
                  </div>
                </div>

                <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-5 shadow">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                    {/* Mengganti SVG Deteksi Cepat dengan img */}
                    <img
                      src="/fast-icon.png"
                      alt="Lightning"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="mb-1 font-bold text-neutral-800">
                      Deteksi Cepat & Mudah
                    </div>
                    <div className="text-sm text-neutral-600">
                      Dengan proses sederhana dan intuitif, pengguna dapat
                      memperoleh hasil analisis hanya dalam beberapa langkah,
                      tanpa perlu pemeriksaan yang rumit atau memakan waktu
                      lama.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Apa itu PARKINSON? - Sesuai dengan gambar */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            {/* Gambar neuron dengan overlay teks - UBAH MENJADI FULL PICTURE */}
            <div className="w-full md:w-[40%]">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/Neuron.png"
                  alt="Ilustrasi neuron Parkinson dengan statistik"
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Teks informasi - PERBAIKAN LAYOUT */}
            <div className="w-full px-2 md:w-[60%]">
              <h2 className="mb-3 text-2xl font-bold text-neutral-800 md:text-3xl">
                Apa itu <span className="text-orange-500">PARKINSON?</span>
              </h2>
              <p className="mb-4 text-sm italic text-neutral-700">
                Penyakit Parkinson adalah gangguan sistem saraf progresif yang
                mempengaruhi gerakan.
              </p>
              <p className="text-sm leading-relaxed text-neutral-600">
                Gejala dimulai secara bertahap, terkadang dengan tremor yang
                hampir tidak terlihat pada satu tangan. Tremor adalah gejala
                umum, tetapi gangguan ini juga sering menyebabkan kekakuan atau
                perlambatan gerakan. Pada tahap awal penyakit Parkinson, wajah
                Anda mungkin menunjukkan sedikit atau tidak ada ekspresi. Lengan
                Anda mungkin tidak berayun saat Anda berjalan. Suara Anda
                mungkin menjadi lembut atau pelo. Gejala penyakit Parkinson
                memburuk seiring berjalannya waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Metode PREDIKSI*/}
      <section className="w-full bg-neutral-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-neutral-800 md:text-3xl">
            Metode <span className="text-orange-500">PREDIKSI</span>
          </h2>
          <p className="mb-8 text-center text-sm text-neutral-600">
            Platform kami menyediakan dua fitur utama untuk mendeteksi
            kemungkinan penyakit Parkinson
          </p>

          {/* Card Container dengan background abu-abu */}
          <div className="rounded-3xl border border-neutral-300 bg-neutral-200 p-4 shadow-md sm:p-4">
            {/* Card putih yang terbagi dua dengan gap di tengah */}
            <div className="flex flex-col md:flex-row md:gap-4">
              {/* Card 1: Skrining dengan Gambar Spiral */}
              <div className="mb-6 flex-1 rounded-2xl bg-white p-4 shadow-sm sm:p-5 md:mb-0">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 sm:h-12 sm:w-12">
                    <img
                      src="/spiral-icon.png"
                      alt="Spiral icon"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800 sm:text-lg">
                    Skrining dengan Gambar Spiral
                  </h3>
                </div>

                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src="/spiral-draw.png"
                    alt="Gambar spiral untuk skrining Parkinson"
                    className="h-auto w-full"
                  />
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <img
                    src="/working-time-icon.png"
                    alt="<1-2 Menit"
                    className="h-6 w-auto sm:h-8"
                  />
                  <img
                    src="/motorik-halus-icon.png"
                    alt="Akurasi tinggi"
                    className="h-6 w-auto sm:h-8"
                  />
                </div>

                <p className="text-xs text-neutral-600 sm:text-sm">
                  Menggambar spiral membantu kami untuk menganalisis gerakan
                  tangan untuk mendeteksi tanda-tanda awal tremor dan penyakit
                  Parkinson.
                </p>
              </div>

              {/* Card 2: Skrining dengan Analisis Suara */}
              <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 sm:h-12 sm:w-12">
                    <img
                      src="/voice-spectrum-icon.png"
                      alt="Voice icon"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="text-base font-bold text-neutral-800 sm:text-lg">
                    Skrining dengan Analisis Suara
                  </h3>
                </div>

                <div className="mb-3 overflow-hidden rounded-lg">
                  <img
                    src="/voice-analysis.png"
                    alt="Analisis suara untuk skrining Parkinson"
                    className="h-auto w-full"
                  />
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <img
                    src="/working-time-icon.png"
                    alt="<1-2 Menit"
                    className="h-6 w-auto sm:h-8"
                  />
                  <img
                    src="/pola-suara-icon.png"
                    alt="Motorik Halus"
                    className="h-6 w-auto sm:h-8"
                  />
                </div>

                <p className="text-xs text-neutral-600 sm:text-sm">
                  Menganalisis perubahan nada suara untuk menganalisis pola
                  suara untuk deteksi tanda-tanda awal penyakit Parkinson.
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8 flex justify-center sm:mt-10">
            <button className="rounded-full bg-blue-500 px-6 py-1.5 text-sm font-medium text-white transition hover:bg-blue-600 sm:px-8 sm:py-2 sm:text-base">
              Coba Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Bagian Cara Menggunakan */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-neutral-800 md:text-3xl">
            Bagaimana cara menggunakan{" "}
            <span className="text-amber-500">PANDU‑PD?</span>
          </h2>
          <p className="mb-8 text-center text-sm text-neutral-600">
            Ikuti langkah sederhana ini untuk menggunakan platform kami
          </p>

          {/* Langkah-langkah Container */}
          <div className="max-w-6xl rounded-[44px] border border-amber-300 bg-amber-50 p-4 shadow-sm sm:p-6">
            {/* Langkah 1 */}
            <div className="mb-4 w-full rounded-3xl border border-neutral-300 bg-neutral-100 p-3">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-yellow-200 px-5 py-3">
                  <span className="font-mono font-semibold text-neutral-800">
                    Langkah Pertama
                  </span>
                  <span className="font-mono font-semibold text-neutral-800">
                    01
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <img
                        src="/How-It-Works1.png"
                        alt="Login icon"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-neutral-800">Masuk</h3>
                      <p className="text-neutral-600">
                        Daftar atau masuk ke akun NIGGER Anda untuk memulai
                        proses skrining
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Langkah 2 */}
            <div className="mb-4 rounded-3xl bg-neutral-100 p-3">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-yellow-200 px-5 py-3">
                  <span className="font-mono font-semibold text-neutral-800">
                    Langkah Kedua
                  </span>
                  <span className="font-mono font-semibold text-neutral-800">
                    02
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <img
                        src="/How-It-Works2.png"
                        alt="Clipboard icon"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-neutral-800">
                        Pilih Metode & Lakukan
                      </h3>
                      <p className="text-neutral-600">
                        Pilih satu atau lebih metode skrining yang tersedia
                        sesuai kebutuhan Anda
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Langkah 3 */}
            <div className="rounded-3xl bg-neutral-100 p-3">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-yellow-200 px-5 py-3">
                  <span className="font-mono font-semibold text-neutral-800">
                    Langkah Ketiga
                  </span>
                  <span className="font-mono font-semibold text-neutral-800">
                    03
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <img
                        src="/How-It-Works3.png"
                        alt="Stethoscope icon"
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold text-neutral-800">
                        Tunggu Hasil analisis
                      </h3>
                      <p className="text-neutral-600">
                        Hasil skrining akan segera tersedia setelah proses
                        analisis selesai
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Tentang Alat Prediksi Parkinson */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          {/* Judul di tengah */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-neutral-800 md:text-3xl">
              Tentang{" "}
              <span className="text-orange-500">Alat Prediksi Parkinson</span>{" "}
              kami
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Memahami Alat Prediksi Parkinson
            </p>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Bagian kiri - Teks */}
            <div className="w-full lg:w-1/2">
              <div className="mb-8 text-sm leading-relaxed text-neutral-700">
                <p>
                  Model pembelajaran mesin kami dilatih menggunakan kumpulan
                  data pasien yang besar untuk mengidentifikasi pola dari
                  penderita yang menunjukkan penyakit Parkinson. Dengan
                  menganalisis rekaman suara, sampel tulisan tangan, dan pola
                  cara berjalan, algoritma kami dapat mendeteksi perubahan halus
                  yang mungkin menunjukkan tahap awal penyakit. Keuntungan
                  menggunakan pembelajaran mesin termasuk akurasi yang lebih
                  tinggi, deteksi dini, dan kemampuan untuk terus meningkat
                  seiring bertambahnya data yang dikumpulkan.
                </p>
              </div>

              {/* Bagian kartu metode - 2 kolom */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Kolom kiri - Analisis Gambar Spiral */}
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                  <div className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <img
                        src="/tabler-icon-books.png"
                        alt="Chart icon"
                        className="h-6 w-6 text-orange-500"
                      />
                      <span className="whitespace-nowrap font-bold text-neutral-800">
                        Analisis Gambar Spiral
                      </span>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <div className="mb-2 text-sm text-neutral-500">
                        Sumber Penelitian
                      </div>

                      <div className="mb-4">
                        <a
                          href="#"
                          className="flex items-center justify-between rounded-full bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <span>Toye & Kompalli (2021)</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      <div className="mb-2 text-sm text-neutral-500">Data</div>

                      <div className="mb-2">
                        <a
                          href="#"
                          className="flex items-center justify-between rounded-full bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <span>Italian Voice and Speech</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      <div className="mb-4">
                        <a
                          href="#"
                          className="flex items-center justify-between rounded-full bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <span>MDVR-KCL</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      <div className="mb-2 text-sm text-neutral-500">Model</div>

                      <div>
                        <div className="text-sm text-neutral-700">
                          scikit-learn&apos;s KNN Classifier
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kolom kanan - Analisis Pola Suara */}
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                  <div className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <img
                        src="/tabler-icon-books.png"
                        alt="Chart icon"
                        className="h-6 w-6 text-orange-500"
                      />
                      <span className="font-bold text-neutral-800">
                        Analisis Pola Suara
                      </span>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <div className="mb-2 text-sm text-neutral-500">
                        Sumber Penelitian
                      </div>

                      <div className="mb-4">
                        <a
                          href="#"
                          className="flex items-center justify-between rounded-full bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <span>Kamran et al. (2021)</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      <div className="mb-2 text-sm text-neutral-500">Data</div>

                      <div className="mb-4">
                        <a
                          href="#"
                          className="flex items-center justify-between rounded-full bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          <span>NewHandPD Dataset</span>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>

                      <div className="mb-2 text-sm text-neutral-500">Model</div>

                      <div className="mb-4">
                        <div className="text-sm text-neutral-700">
                          TensorFlow/Keras&apos;s ImageNet
                          <br />
                          (Convolutional Layers/
                          <br />
                          Base Model)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian kanan - Gambar */}
            <div className="order-first mt-8 w-full lg:order-last lg:mt-0 lg:w-1/2">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/processor-image.png"
                  alt="Ilustrasi chip AI untuk prediksi Parkinson"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
