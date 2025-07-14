import React, { useState, useRef } from 'react';
import { TestTypeBadge, ConfidenceScoreBadge } from '../ui/Badge';

// Tipe data untuk item riwayat
interface HistoryItem {
  id: string;
  date: string;
  time: string;
  testType: string;
  result: string;
  score?: number;
}

// Komponen Button Buka
const OpenButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
    >
      <span className="mr-1">Buka</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

// Komponen Button Hapus
const DeleteButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-red-500 px-4 py-1 text-xs text-white hover:bg-red-600"
    >
      Hapus
    </button>
  );
};

// Tipe data untuk props komponen
interface HistoryPageProps {
  initialData?: HistoryItem[];
}

export default function HistoryPage({ initialData = [] }: HistoryPageProps) {
  // State untuk data
  const [historyData] = useState<HistoryItem[]>(
    initialData.length > 0
      ? initialData
      : [
          {
            id: "1",
            date: "22 Juni 2023",
            time: "10:30 WIB",
            testType: "Gambar",
            result: "Sehat",
            score: 79,
          },
          {
            id: "2",
            date: "22 Juni 2023",
            time: "13:15 WIB",
            testType: "Suara",
            result: "Sehat",
            score: 82,
          },
          {
            id: "3",
            date: "22 Juni 2023",
            time: "21:55 WIB",
            testType: "Gambar",
            result: "Parkinson",
            score: 65,
          },
        ],
  );

  // State untuk filter dan pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hitung total halaman
  const totalPages = Math.ceil(historyData.length / itemsPerPage);

  // Dapatkan data untuk halaman saat ini
  const currentData = historyData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Handler untuk tombol aksi
  const handleOpenItem = (id: string) => {
    console.log(`Membuka item dengan id: ${id}`);
    // Implementasi navigasi ke halaman detail
  };

  const handleDeleteItem = (id: string) => {
    console.log(`Menghapus item dengan id: ${id}`);
    // Implementasi penghapusan item
  };

  return (
    <div className="pt-18 bg-white pb-16">
      {/* Header dengan background gradient - Disesuaikan dengan navbar */}
      <div className="w-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 px-4 py-10">
        <div className="mx-auto mt-16 max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Riwayat Deteksi
          </h1>
          <p className="text-lg text-white">
            Lihat dan kelola riwayat deteksi Parkinson yang telah Anda lakukan
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl p-6">
        {/* Filter Section - Tanpa Icon */}
        <div className="mb-6 rounded-lg">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Filter Dropdown - Tanpa Icon */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="filter"
                className="mr-2 text-sm font-medium text-neutral-800"
              >
                Filter Berdasarkan:
              </label>
              <select
                id="filter"
                className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:h-full"
                style={{ width: "120px" }}
              >
                <option value="" className="bg-white text-neutral-800">
                  Tanggal
                </option>
                <option value="" className="bg-white text-neutral-800">
                  Jenis
                </option>
                <option value="" className="bg-white text-neutral-800">
                  Hasil
                </option>
              </select>
            </div>

            {/* Date Range Picker - Tanpa Icon */}
            <div className="flex w-fit flex-col gap-1 sm:flex-row sm:items-center">
              {/* From Date */}
              <div className="flex">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <span className="mx-2 text-neutral-800">s/d</span>

              {/* To Date */}
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Improved Badges and Buttons */}
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-100 font-mono">
                <th className="border-b px-6 py-3 text-left text-sm font-bold text-neutral-700">
                  TANGGAL
                </th>
                <th className="border-b px-6 py-3 text-left text-sm font-bold text-neutral-700">
                  JENIS TES
                </th>
                <th className="border-b px-6 py-3 text-left text-sm font-bold text-neutral-700">
                  HASIL
                </th>
                <th className="border-b px-6 py-3 text-right text-sm font-bold text-neutral-700">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-neutral-900">
                      {item.date}
                    </div>
                    <div className="text-sm text-neutral-500">{item.time}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <TestTypeBadge type={item.testType} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ConfidenceScoreBadge score={item.score || 0} result={item.result} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <OpenButton onClick={() => handleOpenItem(item.id)} />
                      <DeleteButton onClick={() => handleDeleteItem(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}

              {currentData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-neutral-500"
                  >
                    Tidak ada data riwayat deteksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div></div>
              <div>
                <nav
                  className="relative z-0 inline-flex -space-x-px rounded-md"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Sebelumnya</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                          : "border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Selanjutnya</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
