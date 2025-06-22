import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Doa Ibu - Platform Prediksi Parkinson" },
    { name: "description", content: "Platform kami menawarkan dua fitur utama untuk membantu memprediksi penyakit Parkinson" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-teal-800 font-bold text-sm">P</span>
          </div>
          <span className="text-white font-bold text-lg">ParkED</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Utama
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Terapi
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Artikel
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">
            Riwayat
          </a>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Masuk
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Sistem Deteksi Dini<br />
              Penyakit <span className="text-yellow-400">Parkinson</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Platform AI terdepan untuk deteksi dini penyakit Parkinson melalui analisis gambar spiral dan pola suara dengan akurasi tinggi.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Mulai Skrining
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-teal-800 transition-colors">
                Pelajari Lebih
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-black rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400 font-mono text-sm">
                  <div>$ python detect_parkinson.py</div>
                  <div className="text-white/60">Analyzing spiral pattern...</div>
                  <div className="text-yellow-400">Confidence: 94.2%</div>
                  <div className="text-green-400">Status: Normal</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Hasil Analisis</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Tremor Detection</span>
                    <span className="text-green-400">Normal</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Motor Control</span>
                    <span className="text-green-400">Good</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Pattern Analysis</span>
                    <span className="text-green-400">Stable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Parkinson Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Apa itu <span className="text-orange-600">PARKINSON</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Penyakit Parkinson adalah gangguan neurodegeneratif yang mempengaruhi sistem saraf pusat. Kondisi ini ditandai dengan tremor, kekakuan otot, dan kesulitan dalam gerakan.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Deteksi dini sangat penting untuk penanganan yang lebih efektif dan meningkatkan kualitas hidup penderita.
              </p>
              <div className="flex gap-4">
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Pelajari Lebih Lanjut
                </button>
                <button className="border-2 border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors">
                  Lihat Statistik
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Gejala Utama Parkinson</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Tremor pada tangan dan kaki</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Kekakuan otot (rigidity)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Gerakan lambat (bradykinesia)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Gangguan keseimbangan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metode Prediksi Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Metode <span className="text-blue-600">PREDIKSI</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami menggunakan teknologi AI terdepan untuk mendeteksi gejala awal Parkinson melalui dua metode yang telah terbukti akurat.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skrining dengan Gambar Spiral */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Skrining dengan Gambar Spiral
                  </h3>
                  <p className="text-blue-600 font-semibold">Analisis Motor Halus</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Teknologi computer vision menganalisis pola gambar spiral yang Anda buat untuk mendeteksi tremor dan gangguan koordinasi motorik halus.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Estimasi waktu: 2-3 menit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Akurasi: 94.2%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Fokus: Kemampuan motorik halus</span>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Mulai Tes Spiral
              </button>
            </div>

            {/* Skrining dengan Analisis Suara */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Skrining dengan Analisis Suara
                  </h3>
                  <p className="text-green-600 font-semibold">Analisis Pola Bicara</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                AI menganalisis karakteristik suara Anda untuk mendeteksi perubahan pola bicara, intonasi, dan kualitas vokal yang terkait dengan Parkinson.
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Estimasi waktu: 1-2 menit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Akurasi: 91.8%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Fokus: Pola suara dan intonasi</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Mulai Tes Suara
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Bagaimana cara menggunakan <span className="text-blue-600">PARKED</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Panduan langkah demi langkah untuk menggunakan platform kami
            </p>
          </div>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Daftar Akun</h3>
                  <p className="text-gray-700">
                    Buat akun baru atau masuk dengan akun yang sudah ada untuk mengakses fitur lengkap platform kami.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Metode Skrining</h3>
                  <p className="text-gray-700">
                    Pilih antara skrining dengan gambar spiral atau analisis suara sesuai dengan preferensi Anda.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ikuti Instruksi</h3>
                  <p className="text-gray-700">
                    Ikuti panduan yang diberikan untuk menggambar spiral atau merekam suara dengan benar.
                  </p>
                </div>
              </div>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Dapatkan Hasil</h3>
                  <p className="text-gray-700">
                    Sistem AI akan menganalisis data Anda dan memberikan hasil prediksi dalam hitungan detik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About AI Section */}
      <section className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Tentang <span className="text-blue-400">Artificial Intelligence</span> kami
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Sistem AI kami dikembangkan menggunakan teknologi machine learning terdepan dengan dataset yang telah divalidasi secara klinis. Platform ini mampu mendeteksi pola-pola halus yang mungkin tidak terlihat oleh mata manusia.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">94.2%</div>
                  <div className="text-gray-400">Akurasi Spiral</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">91.8%</div>
                  <div className="text-gray-400">Akurasi Suara</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">10K+</div>
                  <div className="text-gray-400">Data Training</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">2.5s</div>
                  <div className="text-gray-400">Waktu Analisis</div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Pelajari Teknologi
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                  Lihat Penelitian
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-20 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-500 rounded animate-pulse"></div>
                  </div>
                  <div className="h-20 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded animate-pulse"></div>
                  </div>
                  <div className="h-20 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-purple-500 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-white/20 rounded-full">
                    <div className="h-3 bg-blue-500 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full">
                    <div className="h-3 bg-green-500 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full">
                    <div className="h-3 bg-purple-500 rounded-full w-5/6 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">P</span>
                </div>
                <span className="text-2xl font-bold">ParkED</span>
              </div>
              <p className="text-gray-400 text-lg mb-6 max-w-md">
                Platform AI terdepan untuk deteksi dini penyakit Parkinson dengan teknologi machine learning yang telah teruji secara klinis.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Layanan</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Skrining Spiral</li>
                <li className="hover:text-white cursor-pointer transition-colors">Analisis Suara</li>
                <li className="hover:text-white cursor-pointer transition-colors">Konsultasi Online</li>
                <li className="hover:text-white cursor-pointer transition-colors">Riwayat Pemeriksaan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-6">Informasi</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition-colors">Tentang Kami</li>
                <li className="hover:text-white cursor-pointer transition-colors">Artikel Kesehatan</li>
                <li className="hover:text-white cursor-pointer transition-colors">Penelitian</li>
                <li className="hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400">
                &copy; 2024 ParkED. Semua hak dilindungi undang-undang.
              </p>
              <div className="flex gap-6 text-gray-400">
                <span className="hover:text-white cursor-pointer transition-colors">Syarat & Ketentuan</span>
                <span className="hover:text-white cursor-pointer transition-colors">Kebijakan Privasi</span>
                <span className="hover:text-white cursor-pointer transition-colors">Bantuan</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
