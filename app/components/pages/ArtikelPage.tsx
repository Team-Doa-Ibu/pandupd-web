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
      likes: 12,
      dislikes: 2,
    },
    {
      id: 2,
      image: "speech-therapy.png",
      title: "Terapi Wicara",
      description:
        "Membantu pasien yang mengalami kesulitan berbicara dan komunikasi akibat Parkinson.",
      likes: 12,
      dislikes: 2,
    },
    {
      id: 3,
      image: "psychoteraphy.jpg",
      title: "Psikoterapi",
      description:
        "Dukungan mental oleh psikolog untuk mengatasi dampak psikologis dari penyakit Parkinson.",
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
      likes: 14,
      dislikes: 7,
    },
    {
      id: 5,
      image: "gamma-knife-surgery.jpg",
      title: "Operasi Otak Gamma",
      description:
        "Teknik operasi menggunakan sinar gamma untuk menargetkan area otak tertentu.",
      likes: 10,
      dislikes: 3,
    },
  ];

  return (
    <div className="pt-18 bg-white pb-16">
      {/* Header dengan background gradient - Disesuaikan dengan navbar */}
      <div className="w-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 px-4 py-10">
        <div className="mx-auto mt-16 max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-white">Artikel</h1>
          <p className="text-lg text-white">
            Berikut ini adalah kumpulan artikel yang bermanfaat bagi anda yang
            terindikasi mengidap Parkinson
          </p>
        </div>
      </div>

      <div className="mx-auto px-4">
        {/* Pertanyaan Utama */}
        <div className="py-8">
          <h2 className="mb-6 mt-4 text-center text-2xl font-semibold text-neutral-700">
            Apa langkah selanjutnya yang perlu diambil jika dicurigai mengidap
            penyakit Parkinson?
          </h2>
        </div>

        {/* Bagian Terapi */}
        <div className="mx-auto mb-10 max-w-6xl">
          <h2 className="mb-1 text-xl font-semibold text-neutral-800">
            Terapi
          </h2>
          <p className="mb-6 border-b border-neutral-300 pb-4 text-gray-600">
            Jika Anda memiliki Parkinson, ada beberapa terapi yang bisa Anda
            coba, tetapi ingat harus dengan arahan ahli.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {terapiArticles.map((article) => (
              <ArticleCard
                key={article.id}
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
        <div className="mx-auto mb-10 max-w-6xl">
          <h2 className="mb-1 text-xl font-semibold text-neutral-800">
            Operasi
          </h2>
          <p className="mb-6 border-b border-neutral-300 pb-4 text-gray-600">
            Jika terapi tidak cukup efektif, beberapa pasien mungkin
            mempertimbangkan operasi untuk mengurangi gejala Parkinson.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {operasiArticles.map((article) => (
              <ArticleCard
                key={article.id}
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
