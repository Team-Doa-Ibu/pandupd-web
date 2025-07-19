import React, { useEffect, useState } from "react";
import { allArticles, Article } from "~/data/articles";

interface DetailPageProps {
  articleId?: string;
}

export function DetailPage({ articleId }: DetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const foundArticle = allArticles.find((art) => art.id === articleId);
      if (foundArticle) {
        setArticle(foundArticle);
        setError(null);
      } else {
        setArticle(null);
        setError(`Artikel dengan ID ${articleId} tidak ditemukan`);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memuat artikel");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-6 py-16">
        <p className="text-center text-xl">Memuat artikel...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto min-h-screen px-6 py-16">
        <h1 className="text-2xl font-bold text-red-600">
          Artikel tidak ditemukan
        </h1>
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  // Estimasi waktu baca (misal: 200 kata/menit)
  const wordCount = article.isi.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header dengan background gradient */}
      <div className="w-full bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-400 py-10">
        <div className="container mx-auto mt-16 px-6">
          <h1 className="mb-2 text-4xl font-bold text-white">Artikel</h1>
          <div className="flex items-center space-x-2 text-lg text-white">
            <button
              className="hover:text-yellow-200 focus:outline-none"
              onClick={() => window.history.back()}
              type="button"
            >
              {" "}
              Artikel{" "}
            </button>
            <span>&gt;</span>
            <span>{article.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl flex-1 px-6 py-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-800">
          {article.title} untuk Penyakit Parkinson
        </h2>
        <div className="mb-8 border-b py-2">
          <div className="text-sm text-gray-500">{readTime} menit membaca</div>
        </div>

        {/* Gambar Artikel */}
        <div className="mb-8 flex justify-center">
          <img
            src={`/${article.image}`}
            alt={article.title}
            className="w-full rounded-lg object-cover"
          />
        </div>

        {/* Konten Artikel */}
        <div className="prose prose-lg max-w-none">
          <h3 className="mb-2 text-xl font-bold">Apa itu {article.title}?</h3>
          <div dangerouslySetInnerHTML={{ __html: article.isi }} />
        </div>

        {/* Interaksi */}
        <div className="mt-12 flex items-center border-t py-4">
          <p className="mr-4">Apakah Artikel ini membantu?</p>
          <button className="flex items-center space-x-2 rounded-lg px-4 py-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11V19C7 19.2652 6.89464 19.5196 6.70711 19.7071C6.51957 19.8946 6.26522 20 6 20H4C3.73478 20 3.48043 19.8946 3.29289 19.7071C3.10536 19.5196 3 19.2652 3 19V12C3 11.7348 3.10536 11.4804 3.29289 11.2929C3.48043 11.1054 3.73478 11 4 11H7ZM7 11C8.06087 11 9.07828 10.5786 9.82843 9.82843C10.5786 9.07828 11 8.06087 11 7V6C11 5.46957 11.2107 4.96086 11.5858 4.58579C11.9609 4.21071 12.4696 4 13 4C13.5304 4 14.0391 4.21071 14.4142 4.58579C14.7893 4.96086 15 5.46957 15 6V11H18C18.5304 11 19.0391 11.2107 19.4142 11.5858C19.7893 11.9609 20 12.4696 20 13L19 18C18.8562 18.6135 18.5834 19.1402 18.2227 19.501C17.8619 19.8617 17.4328 20.0368 17 20H10C9.20435 20 8.44129 19.6839 7.87868 19.1213C7.31607 18.5587 7 17.7956 7 17"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{article.likes}</span>
          </button>
          <button className="ml-2 flex items-center space-x-2 rounded-lg px-4 py-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 13.0009V5.00091C7 4.73569 6.89464 4.48134 6.70711 4.2938C6.51957 4.10627 6.26522 4.00091 6 4.00091H4C3.73478 4.00091 3.48043 4.10627 3.29289 4.2938C3.10536 4.48134 3 4.73569 3 5.00091V12.0009C3 12.2661 3.10536 12.5205 3.29289 12.708C3.48043 12.8956 3.73478 13.0009 4 13.0009H7ZM7 13.0009C8.06087 13.0009 9.07828 13.4223 9.82843 14.1725C10.5786 14.9226 11 15.94 11 17.0009V18.0009C11 18.5313 11.2107 19.04 11.5858 19.4151C11.9609 19.7902 12.4696 20.0009 13 20.0009C13.5304 20.0009 14.0391 19.7902 14.4142 19.4151C14.7893 19.04 15 18.5313 15 18.0009V13.0009H18C18.5304 13.0009 19.0391 12.7902 19.4142 12.4151C19.7893 12.04 20 11.5313 20 11.0009L19 6.00091C18.8562 5.38743 18.5834 4.86067 18.2227 4.49994C17.8619 4.13922 17.4328 3.96409 17 4.00091H10C9.20435 4.00091 8.44129 4.31698 7.87868 4.87959C7.31607 5.4422 7 6.20526 7 7.00091"
                stroke="#404040"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{article.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
