import React from "react";
import { useEffect } from "react";

export const LandingPage = () => {
  // Fungsi untuk memuat font Lato secara dinamis
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-x-hidden" style={{ fontFamily: "'Lato', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/image-5.png')" }}
          aria-hidden="true"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 pt-32 pb-12 flex flex-col gap-10">
          {/* Headline & CTA */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">
                Sistem Deteksi Dini<br />
                Penyakit <span className="text-yellow-400">Parkinson</span>
                <br />
                Berbasis <span className="text-blue-400">AI</span>
              </h1>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-white text-base">
                Teknologi kecerdasan buatan kami membantu mengidentifikasi tanda-tanda awal Parkinson dengan cepat dan akurat. Ambil langkah pencegahan sekarang untuk masa depan yang lebih baik.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-600 transition">
                  Coba Sekarang
                </button>
                <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-blue-50 transition">
                  Pelajari lebih
                </button>
              </div>
            </div>
          </div>

          {/* Card Section - Perbaikan untuk sesuai dengan foto */}
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Container box putih untuk seluruh bagian card */}
            <div className="w-full bg-gray-100/30 backdrop-blur-sm rounded-3xl p-4 shadow-lg flex flex-col md:flex-row gap-6">
              {/* Left: Image Card */}
              <div className="flex-1 relative bg-black/80 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-end min-h-[260px] max-h-[340px]">
                <img
                  src="/image-4.png"
                  alt="Parkinson"
                  className="w-full h-full object-cover object-center opacity-70"
                />
                <div className="absolute p-6 bottom-0 left-0 w-full">
                  <p className="font-bold text-yellow-400 text-lg sm:text-xl mb-1 drop-shadow">
                    Jangan Tunggu Gejala Muncul!
                  </p>
                  <p className="text-white text-sm drop-shadow">
                    Cegah lebih awal untuk kehidupan yang lebih berkualitas.
                  </p>
                </div>
              </div>
              
              {/* Right: Feature Cards */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white rounded-2xl shadow p-5 flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                    {/* Mengganti SVG AI Canggih dengan img */}
                    <img 
                      src="/AI-icon.png" 
                      alt="AI Chip" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">Didukung AI Canggih</div>
                    <div className="text-gray-600 text-sm">
                      Teknologi kecerdasan buatan terbaru menganalisis data medis dengan tingkat akurasi tinggi, membantu deteksi dini Parkinson agar pengguna dapat mengambil langkah yang tepat lebih awal.
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow p-5 flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                    {/* Mengganti SVG Deteksi Cepat dengan img */}
                    <img 
                      src="/fast-icon.png" 
                      alt="Lightning" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-1">Deteksi Cepat & Mudah</div>
                    <div className="text-gray-600 text-sm">
                      Dengan proses sederhana dan intuitif, pengguna dapat memperoleh hasil analisis hanya dalam beberapa langkah, tanpa perlu pemeriksaan yang rumit atau memakan waktu lama.
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
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Gambar neuron dengan overlay teks - UBAH MENJADI FULL PICTURE */}
            <div className="w-full md:w-[40%]">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/Neuron.png" 
                  alt="Ilustrasi neuron Parkinson dengan statistik"
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Teks informasi - PERBAIKAN LAYOUT */}
            <div className="w-full md:w-[60%]">
              <h2 className="text-2xl text-black md:text-3xl font-bold mb-3">
                Apa itu <span className="text-orange-500">PARKINSON?</span>
              </h2>
              <p className="text-gray-700 italic mb-4 text-sm">
                Penyakit Parkinson adalah gangguan sistem saraf progresif yang mempengaruhi gerakan.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gejala dimulai secara bertahap, terkadang dengan tremor yang hampir tidak terlihat pada satu tangan. Tremor adalah gejala umum, tetapi gangguan ini juga sering menyebabkan kekakuan atau perlambatan gerakan. Pada tahap awal penyakit Parkinson, wajah Anda mungkin menunjukkan sedikit atau tidak ada ekspresi. Lengan Anda mungkin tidak berayun saat Anda berjalan. Suara Anda mungkin menjadi lembut atau pelo. Gejala penyakit Parkinson memburuk seiring berjalannya waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian Metode PREDIKSI - PERBAIKAN GAP ANTARA CARD */}
      <section className="w-full bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl text-black font-bold text-center mb-2">
            Metode <span className="text-orange-500">PREDIKSI</span>
          </h2>
          <p className="text-gray-600 text-sm text-center mb-8">
            Platform kami menyediakan dua fitur utama untuk mendeteksi kemungkinan penyakit Parkinson
          </p>
          
          {/* Card Container dengan background abu-abu */}
          <div className="bg-gray-200 rounded-3xl p-4 sm:p-6 shadow-md">
            {/* Card putih yang terbagi dua dengan gap di tengah */}
            <div className="flex flex-col md:flex-row md:gap-6">
              {/* Card 1: Skrining dengan Gambar Spiral */}
              <div className="flex-1 bg-white rounded-2xl p-4 sm:p-5 mb-6 md:mb-0 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/spiral-icon.png" 
                      alt="Spiral icon" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Skrining dengan Gambar Spiral</h3>
                </div>
                
                <div className="rounded-lg overflow-hidden mb-3">
                  <img 
                    src="/spiral-draw.png" 
                    alt="Gambar spiral untuk skrining Parkinson" 
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <img 
                    src="/working-time-icon.png" 
                    alt="<1-2 Menit" 
                    className="h-6 sm:h-8 w-auto"
                  />
                  <img 
                    src="/motorik-halus-icon.png" 
                    alt="Akurasi tinggi" 
                    className="h-6 sm:h-8 w-auto"
                  />
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm">
                  Menggambar spiral membantu kami untuk menganalisis gerakan tangan untuk mendeteksi tanda-tanda awal tremor dan penyakit Parkinson.
                </p>
              </div>
              
              {/* Card 2: Skrining dengan Analisis Suara */}
              <div className="flex-1 bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gray-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/voice-spectrum-icon.png" 
                      alt="Voice icon" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">Skrining dengan Analisis Suara</h3>
                </div>
                
                <div className="rounded-lg overflow-hidden mb-3">
                  <img 
                    src="/voice-analysis.png" 
                    alt="Analisis suara untuk skrining Parkinson" 
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <img 
                    src="/working-time-icon.png" 
                    alt="<1-2 Menit" 
                    className="h-6 sm:h-8 w-auto"
                  />
                  <img 
                    src="/pola-suara-icon.png" 
                    alt="Motorik Halus" 
                    className="h-6 sm:h-8 w-auto"
                  />
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm">
                  Menganalisis perubahan nada suara untuk menganalisis pola suara untuk deteksi tanda-tanda awal penyakit Parkinson.
                </p>
              </div>
            </div>
          </div>
          
          {/* Button */}
          <div className="flex justify-center mt-8 sm:mt-10">
            <button className="bg-blue-500 text-white text-sm sm:text-base font-medium px-6 sm:px-8 py-1.5 sm:py-2 rounded-full hover:bg-blue-600 transition">
              Coba Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Bagian Cara Menggunakan */}
      <section className="w-full bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl text-black font-bold text-center mb-2">
            Bagaimana cara menggunakan <span className="text-orange-500">PANDU‑PD?</span>
          </h2>
          <p className="text-gray-600 text-sm text-center mb-8">
            Ikuti langkah sederhana ini untuk menggunakan platform kami
          </p>
          
          {/* Langkah-langkah Container */}
          <div className="bg-yellow-50 rounded-3xl p-4 sm:p-6 border border-yellow-200 shadow-sm">
            {/* Langkah 1 */}
            <div className="bg-gray-100 rounded-3xl p-3 mb-4">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-yellow-200 py-3 px-5 flex justify-between items-center">
                  <span className="font-mono font-semibold text-gray-800">Langkah Pertama</span>
                  <span className="font-mono font-semibold text-gray-800">01</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <img 
                        src="/How-It-Works1.png" 
                        alt="Login icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">Masuk</h3>
                      <p className="text-gray-600">Daftar atau masuk ke akun NIGGER Anda untuk memulai proses skrining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Langkah 2 */}
            <div className="bg-gray-100 rounded-3xl p-3 mb-4">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-yellow-200 py-3 px-5 flex justify-between items-center">
                  <span className="font-mono font-semibold text-gray-800">Langkah Kedua</span>
                  <span className="font-mono font-semibold text-gray-800">02</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <img 
                        src="/How-It-Works2.png" 
                        alt="Clipboard icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">Pilih Metode & Lakukan</h3>
                      <p className="text-gray-600">Pilih satu atau lebih metode skrining yang tersedia sesuai kebutuhan Anda</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Langkah 3 */}
            <div className="bg-gray-100 rounded-3xl p-3">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-yellow-200 py-3 px-5 flex justify-between items-center">
                  <span className="font-mono font-semibold text-gray-800">Langkah Ketiga</span>
                  <span className="font-mono font-semibold text-gray-800">03</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <img 
                        src="/How-It-Works3.png" 
                        alt="Stethoscope icon" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-2">Tunggu Hasil analisis</h3>
                      <p className="text-gray-600">Hasil skrining akan segera tersedia setelah proses analisis selesai</p>
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
        <div className="max-w-5xl mx-auto px-4">
          {/* Judul di tengah */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl text-black font-bold">
              Tentang <span className="text-orange-500">Alat Prediksi Parkinson</span> kami
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Memahami Alat Prediksi Parkinson
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Bagian kiri - Teks */}
            <div className="w-full lg:w-1/2">
              <div className="text-gray-700 text-sm leading-relaxed mb-8">
                <p>
                  Model pembelajaran mesin kami dilatih menggunakan kumpulan data pasien yang besar untuk mengidentifikasi pola dari penderita yang menunjukkan penyakit Parkinson. Dengan menganalisis rekaman suara, sampel tulisan tangan, dan pola cara berjalan, algoritma kami dapat mendeteksi perubahan halus yang mungkin menunjukkan tahap awal penyakit. Keuntungan menggunakan pembelajaran mesin termasuk akurasi yang lebih tinggi, deteksi dini, dan kemampuan untuk terus meningkat seiring bertambahnya data yang dikumpulkan.
                </p>
              </div>
              
              {/* Bagian kartu metode - 2 kolom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom kiri - Analisis Gambar Spiral */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <img 
                        src="/tabler-icon-books.png" 
                        alt="Chart icon" 
                        className="w-6 h-6 text-orange-500" 
                      />
                      <span className="text-gray-800 font-bold whitespace-nowrap">Analisis Gambar Spiral</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-gray-500 text-sm mb-2">Sumber Penelitian</div>
                      
                      <div className="mb-4">
                        <a href="#" className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                          <span>Toye & Kompalli (2021)</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                      
                      <div className="text-gray-500 text-sm mb-2">Data</div>
                      
                      <div className="mb-2">
                        <a href="#" className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                          <span>Italian Voice and Speech</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                      
                      <div className="mb-4">
                        <a href="#" className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                          <span>MDVR-KCL</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                      
                      <div className="text-gray-500 text-sm mb-2">Model</div>
                      
                      <div>
                        <div className="text-sm text-gray-700">
                          scikit-learn's KNN Classifier
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Kolom kanan - Analisis Pola Suara */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <img 
                        src="/tabler-icon-books.png" 
                        alt="Chart icon" 
                        className="w-6 h-6 text-orange-500" 
                      />
                      <span className="text-gray-800 font-bold">Analisis Pola Suara</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-gray-500 text-sm mb-2">Sumber Penelitian</div>
                      
                      <div className="mb-4">
                        <a href="#" className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                          <span>Kamran et al. (2021)</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                      
                      <div className="text-gray-500 text-sm mb-2">Data</div>
                      
                      <div className="mb-4">
                        <a href="#" className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-700 hover:bg-gray-100">
                          <span>NewHandPD Dataset</span>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>

                      
                      <div className="text-gray-500 text-sm mb-2">Model</div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-700">
                          TensorFlow/Keras's ImageNet<br />
                          (Convolutional Layers/<br />
                          Base Model)
                        </div>
                      </div>
                      

                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bagian kanan - Gambar */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-0 order-first lg:order-last">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/processor-image.png" 
                  alt="Ilustrasi chip AI untuk prediksi Parkinson" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
