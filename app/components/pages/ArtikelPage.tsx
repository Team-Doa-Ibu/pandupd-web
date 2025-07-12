import React from "react";
import { ArticleCard } from "../ui/article-card";

export function ArtikelPage() {
  // Data artikel terapi
  const terapiArticles = [
    {
      id: 1,
      image: "physiotherapy.png",
      title: "Fisioterapi",
      description:
        "Terapi untuk mengatasi kekakuan otot dan sendi, meningkatkan kemampuan gerak dan keseimbangan.",
      isi: "<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>",
        likes: 12,
      dislikes: 2,
    },
    {
      id: 2,
      image: "speech-therapy.png",
      title: "Terapi Wicara",
      description:
        "Membantu pasien yang mengalami kesulitan berbicara dan komunikasi akibat Parkinson.",
        isi: "<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>",
      likes: 12,
      dislikes: 2,
    },
    {
      id: 3,
      image: "psychoteraphy.jpg",
      title: "Psikoterapi",
      description:
        "Dukungan mental oleh psikolog untuk mengatasi dampak psikologis dari penyakit Parkinson.",
        isi: "<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>",
      likes: 12,
      dislikes: 2,
    },
  ];

  // Data artikel operasi
  const operasiArticles = [
    {
      id: 4,
      image: "DBS.jpg",
      title: "Deep Brain Stimulation (DBS)",
      description:
        "Prosedur bedah yang melibatkan pemasangan elektroda ke area otak tertentu untuk mengurangi gejala Parkinson.",
        isi: "<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>",
      likes: 14,
      dislikes: 7,
    },
    {
      id: 5,
      image: "gamma-knife-surgery.jpg",
      title: "Operasi Otak Gamma",
      description:
        "Teknik operasi menggunakan sinar gamma untuk menargetkan area otak tertentu.",
        isi: "<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>",
      likes: 10,
      dislikes: 3,
    },
  ];

  return (
    <div className="pt-18 bg-white pb-16">
      {/* Header dengan background gradient - Disesuaikan dengan navbar */}
      <div className="w-full bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-400 py-10">
        <div className="container mx-auto mt-16 px-6">
          <h1 className="mb-2 text-4xl font-bold text-white">Artikel</h1>
          <p className="text-lg text-white">
            Berikut ini adalah kumpulan artikel yang bermanfaat bagi anda yang
            terindikasi mengidap Parkinson
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Pertanyaan Utama */}
        <div className="py-8">
          <h2 className="mb-6 mt-4 text-center text-2xl font-semibold text-gray-800">
            Apa langkah selanjutnya yang perlu diambil jika dicurigai mengidap
            penyakit Parkinson?
          </h2>
        </div>

        {/* Bagian Terapi */}
        <div className="mb-10">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Terapi</h2>
          <p className="mb-6 border-b pb-4 text-gray-600">
            Jika Anda memiliki Parkinson, ada beberapa terapi yang bisa Anda
            coba, tetapi ingat harus dengan arahan ahli.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {terapiArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                image={article.image}
                title={article.title}
                description={article.description}
                likes={article.likes}
                dislikes={article.dislikes}
              />
            ))}
          </div>
        </div>

        {/* Bagian Operasi */}
        <div className="mb-10">
          <h2 className="mb-2 text-xl font-semibold text-gray-800">Operasi</h2>
          <p className="mb-6 border-b pb-4 text-gray-600">
            Jika terapi tidak cukup efektif, beberapa pasien mungkin
            mempertimbangkan operasi untuk mengurangi gejala Parkinson.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {operasiArticles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                image={article.image}
                title={article.title}
                description={article.description}
                likes={article.likes}
                dislikes={article.dislikes}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
