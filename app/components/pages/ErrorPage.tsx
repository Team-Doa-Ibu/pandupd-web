import React from "react";

export default function ErrorPage({
  code = 404,
  message,
}: {
  code?: number;
  message?: string;
}) {
  let title = "Terjadi Kesalahan";
  let desc = message || "Halaman tidak ditemukan.";

  if (code === 404) {
    title = "404 - Halaman Tidak Ditemukan";
    desc = message || "Maaf, halaman yang Anda cari tidak tersedia.";
  } else if (code === 403) {
    title = "403 - Akses Ditolak";
    desc = message || "Anda tidak memiliki izin untuk mengakses halaman ini.";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center rounded-xl bg-white p-10 shadow-lg">
        <div className="mb-4 text-6xl font-bold text-blue-500">{code}</div>
        <h1 className="mb-2 text-2xl font-bold">{title}</h1>
        <p className="mb-6 text-center text-gray-600">{desc}</p>
        <a
          href="/"
          className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
