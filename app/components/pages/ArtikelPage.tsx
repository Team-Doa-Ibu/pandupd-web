import React from "react";
import { ArticleCard } from "../ui/article-card";
import { allArticles } from "~/data/articles";

// Untuk terapi:
const terapiArticles = allArticles.filter(a => Number(a.id) <= 3);
// Untuk operasi:
const operasiArticles = allArticles.filter(a => Number(a.id) > 3);

export function ArtikelPage() {
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
