import React, { useState, useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { TestTypeBadge, ConfidenceScoreBadge } from "../ui/Badge";
import { supabase } from "../../data/supabaseClient";

// Tipe data untuk item riwayat
interface HistoryItem {
  id: string;
  date: string;
  time: string;
  testType: string;
  result: string;
  score?: number;
  showDateAndAction: boolean;
  rowSpan?: number;
  createdAt: string; // Tambahkan field untuk created_at asli dari database
}

// Komponen Button Buka
const OpenButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 transition-colors duration-150 hover:border-neutral-300 hover:bg-neutral-50"
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
      className="rounded-full bg-red-500 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-red-600"
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
  const [historyData, setHistoryData] = useState<HistoryItem[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter dan pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest"); // Default: newest first
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const itemsPerPage = 5; // Jumlah record per halaman

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Fungsi untuk mengelompokkan data berdasarkan record ID
  const groupDataByRecord = (data: HistoryItem[]) => {
    const groups: { [key: string]: HistoryItem[] } = {};

    data.forEach((item) => {
      const recordId = item.id.split("-")[0]; // Ambil ID record (sebelum -vm atau -hm)
      if (!groups[recordId]) {
        groups[recordId] = [];
      }
      groups[recordId].push(item);
    });

    return Object.values(groups);
  };

  // Kelompokkan semua data berdasarkan record
  const allGroupedData = groupDataByRecord(historyData);

  // Filter data berdasarkan range tanggal jika ada
  const filteredGroupedData = allGroupedData.filter((group) => {
    if (!startDate && !endDate) return true; // Tidak ada filter, tampilkan semua

    const groupDate = new Date(group[0].createdAt);
    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;

    // Filter berdasarkan range tanggal
    if (start && end) {
      return groupDate >= start && groupDate <= end;
    } else if (start) {
      return groupDate >= start;
    } else if (end) {
      return groupDate <= end;
    }

    return true;
  });

  // Urutkan group berdasarkan created_at asli dari database (bukan date/time yang sudah di-format)
  const sortedGroupedData = filteredGroupedData.sort((groupA, groupB) => {
    // Ambil created_at asli dari database untuk sorting yang akurat
    const originalDataA = historyData.find((item) => item.id === groupA[0].id);
    const originalDataB = historyData.find((item) => item.id === groupB[0].id);

    if (!originalDataA || !originalDataB) return 0;

    // Gunakan created_at asli untuk sorting
    const dateA = new Date(originalDataA.createdAt || "");
    const dateB = new Date(originalDataB.createdAt || "");

    return sortOrder === "newest"
      ? dateB.getTime() - dateA.getTime() // Descending order (terbaru dulu)
      : dateA.getTime() - dateB.getTime(); // Ascending order (terlama dulu)
  });

  // Hitung total halaman berdasarkan jumlah group, bukan item individual
  const totalPages = Math.ceil(sortedGroupedData.length / itemsPerPage) || 1;

  // Dapatkan group data untuk halaman saat ini
  const currentGroupedData = sortedGroupedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Debug pagination
  console.log("[History] Pagination debug:", {
    totalItems: historyData.length,
    totalGroups: allGroupedData.length,
    filteredGroups: filteredGroupedData.length,
    itemsPerPage,
    currentPage,
    totalPages,
    sortOrder,
    dateFilter: {
      startDate,
      endDate,
      hasFilter: !!(startDate || endDate),
    },
    currentGroupedDataLength: currentGroupedData.length,
    currentGroupedData: currentGroupedData.map((group) => ({
      recordId: group[0].id.split("-")[0],
      date: group[0].date,
      time: group[0].time,
      createdAt: group[0].createdAt, // Tambahkan created_at asli
      itemCount: group.length,
      items: group.map((item) => ({ id: item.id, testType: item.testType })),
    })),
    sortingInfo: `Data diurutkan berdasarkan created_at asli dari database: ${sortOrder === "newest" ? "terbaru" : "terlama"} dulu`,
    filteringInfo:
      startDate || endDate
        ? `Data difilter dari ${startDate || "awal"} sampai ${endDate || "akhir"}`
        : "Tidak ada filter tanggal",
  });

  const formatDateDisplay = (isoString: string) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return { date: `${day}/${month}/${year}`, time: `${hours}:${minutes} WIB` };
  };

  // Fetch data dari Supabase dan transform ke tampilan
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: userResp, error: userErr } =
          await supabase.auth.getUser();
        // Debug user
        console.log("[History] getUser error:", userErr);
        console.log("[History] userResp:", userResp);
        const user = userResp?.user;
        if (!user) {
          console.log("[History] No user logged in");
          setHistoryData([]);
          setIsLoading(false);
          return;
        }
        console.log("[History] Current user id:", user.id);

        // Ambil data dari tabel form milik user ini
        const { data, error: dbError } = await supabase
          .from("form")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        // Debug query
        console.log("[History] form query error:", dbError);
        console.log("[History] form rows:", data);

        if (dbError) throw dbError;

        const items: HistoryItem[] = [];
        for (const row of data || []) {
          const { date, time } = formatDateDisplay(row.created_at as string);

          const hasVm =
            (row.Hasil_Diagnosa_vm !== null &&
              row.Hasil_Diagnosa_vm !== undefined) ||
            (row.Score_Diagnosa_vm !== null &&
              row.Score_Diagnosa_vm !== undefined &&
              row.Score_Diagnosa_vm !== "") ||
            (row.File_Diagnosa_vm !== null &&
              row.File_Diagnosa_vm !== undefined &&
              row.File_Diagnosa_vm !== "");
          const hasHm =
            (row.Hasil_Diagnosa_hm !== null &&
              row.Hasil_Diagnosa_hm !== undefined) ||
            (row.Score_Diagnosa_hm !== null &&
              row.Score_Diagnosa_hm !== undefined &&
              row.Score_Diagnosa_hm !== "") ||
            (row.File_Diagnosa_hm !== null &&
              row.File_Diagnosa_hm !== undefined &&
              row.File_Diagnosa_hm !== "");

          // Debug individual row data
          console.log("[History] Processing row:", {
            id: row.id,
            hasVm,
            hasHm,
            vm_score_raw: row.Score_Diagnosa_vm,
            vm_score_type: typeof row.Score_Diagnosa_vm,
            vm_score_string: String(row.Score_Diagnosa_vm),
            vm_score_parsed: (() => {
              if (
                row.Score_Diagnosa_vm !== null &&
                row.Score_Diagnosa_vm !== undefined &&
                row.Score_Diagnosa_vm !== ""
              ) {
                const scoreStr = String(row.Score_Diagnosa_vm);
                const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
                return numericMatch ? parseFloat(numericMatch[1]) : 0;
              }
              return 0;
            })(),
            vm_result: row.Hasil_Diagnosa_vm,
            vm_file: row.File_Diagnosa_vm,
            hm_score_raw: row.Score_Diagnosa_hm,
            hm_score_type: typeof row.Score_Diagnosa_hm,
            hm_score_string: String(row.Score_Diagnosa_hm),
            hm_score_parsed: (() => {
              if (
                row.Score_Diagnosa_hm !== null &&
                row.Score_Diagnosa_hm !== undefined &&
                row.Score_Diagnosa_hm !== ""
              ) {
                const scoreStr = String(row.Score_Diagnosa_hm);
                const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
                return numericMatch ? parseFloat(numericMatch[1]) : 0;
              }
              return 0;
            })(),
            hm_result: row.Hasil_Diagnosa_hm,
            hm_file: row.File_Diagnosa_hm,
          });

          // Logika untuk menampilkan data berdasarkan ketersediaan VM dan HM
          if (hasVm && hasHm) {
            // Kedua data ada - tampilkan 2 baris dengan rowSpan
            console.log(
              `[History] Row ${row.id}: Both VM and HM data available, showing 2 rows`,
            );

            // Baris VM (tampilkan tanggal & aksi) - rowSpan 2 untuk gabungkan tanggal & aksi
            {
              let scoreNum = 0;
              if (
                row.Score_Diagnosa_vm !== null &&
                row.Score_Diagnosa_vm !== undefined &&
                row.Score_Diagnosa_vm !== ""
              ) {
                const scoreStr = String(row.Score_Diagnosa_vm);
                // Handle various varchar formats like "85.5", "85", "85%", etc.
                const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
                if (numericMatch) {
                  scoreNum = parseFloat(numericMatch[1]);
                  if (Number.isNaN(scoreNum)) scoreNum = 0;
                }
              }
              const resultStr =
                row.Hasil_Diagnosa_vm === true
                  ? "Parkinson"
                  : row.Hasil_Diagnosa_vm === false
                    ? "Sehat"
                    : "Tidak diketahui";
              items.push({
                id: `${row.id}-vm`,
                date,
                time,
                testType: "Suara",
                result: resultStr,
                score: scoreNum,
                showDateAndAction: true,
                rowSpan: 2,
                createdAt: row.created_at as string, // Tambahkan createdAt
              });
            }
            // Baris HM (sembunyikan tanggal & aksi)
            {
              let scoreNum = 0;
              if (
                row.Score_Diagnosa_hm !== null &&
                row.Score_Diagnosa_hm !== undefined &&
                row.Score_Diagnosa_hm !== ""
              ) {
                const scoreStr = String(row.Score_Diagnosa_hm);
                // Handle various varchar formats like "85.5", "85", "85%", etc.
                const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
                if (numericMatch) {
                  scoreNum = parseFloat(numericMatch[1]);
                  if (Number.isNaN(scoreNum)) scoreNum = 0;
                }
              }
              const resultStr =
                row.Hasil_Diagnosa_hm === true
                  ? "Parkinson"
                  : row.Hasil_Diagnosa_hm === false
                    ? "Sehat"
                    : "Tidak diketahui";
              items.push({
                id: `${row.id}-hm`,
                date,
                time,
                testType: "Gambar",
                result: resultStr,
                score: scoreNum,
                showDateAndAction: false,
                rowSpan: 0,
                createdAt: row.created_at as string, // Tambahkan createdAt
              });
            }
          } else if (hasVm) {
            // Hanya ada data VM, tampilkan 1 baris saja
            console.log(
              `[History] Row ${row.id}: Only VM data available, showing 1 row`,
            );

            let scoreNum = 0;
            if (
              row.Score_Diagnosa_vm !== null &&
              row.Score_Diagnosa_vm !== undefined &&
              row.Score_Diagnosa_vm !== ""
            ) {
              const scoreStr = String(row.Score_Diagnosa_vm);
              // Handle various varchar formats like "85.5", "85", "85%", etc.
              const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
              if (numericMatch) {
                scoreNum = parseFloat(numericMatch[1]);
                if (Number.isNaN(scoreNum)) scoreNum = 0;
              }
            }
            const resultStr =
              row.Hasil_Diagnosa_vm === true
                ? "Parkinson"
                : row.Hasil_Diagnosa_vm === false
                  ? "Sehat"
                  : "Tidak diketahui";
            items.push({
              id: `${row.id}-vm`,
              date,
              time,
              testType: "Suara",
              result: resultStr,
              score: scoreNum,
              showDateAndAction: true,
              rowSpan: 1,
              createdAt: row.created_at as string, // Tambahkan createdAt
            });
          } else if (hasHm) {
            // Hanya ada data HM, tampilkan 1 baris saja
            console.log(
              `[History] Row ${row.id}: Only HM data available, showing 1 row`,
            );

            let scoreNum = 0;
            if (
              row.Score_Diagnosa_hm !== null &&
              row.Score_Diagnosa_hm !== undefined &&
              row.Score_Diagnosa_hm !== ""
            ) {
              const scoreStr = String(row.Score_Diagnosa_hm);
              // Handle various varchar formats like "85.5", "85", "85%", etc.
              const numericMatch = scoreStr.match(/(\d+(?:\.\d+)?)/);
              if (numericMatch) {
                scoreNum = parseFloat(numericMatch[1]);
                if (Number.isNaN(scoreNum)) scoreNum = 0;
              }
            }
            const resultStr =
              row.Hasil_Diagnosa_hm === true
                ? "Parkinson"
                : row.Hasil_Diagnosa_hm === false
                  ? "Sehat"
                  : "Tidak diketahui";
            items.push({
              id: `${row.id}-hm`,
              date,
              time,
              testType: "Gambar",
              result: resultStr,
              score: scoreNum,
              showDateAndAction: true,
              rowSpan: 1,
              createdAt: row.created_at as string, // Tambahkan createdAt
            });
          } else {
            // Tidak ada data yang valid, skip row ini
            console.log(
              `[History] Row ${row.id}: No valid data available, skipping row`,
            );
          }
        }

        // Debug hasil mapping
        console.log("[History] transformed items:", items);

        if (isMounted) setHistoryData(items);
      } catch (err) {
        console.error("[History] fetch error:", err);
        if (isMounted) setError("Gagal memuat riwayat. Silakan coba lagi.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Fungsi untuk menangani perubahan sorting
  const handleSortChange = (newSortOrder: "newest" | "oldest") => {
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset ke halaman pertama ketika sorting berubah
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const fetcher = useFetcher();

  // Handler untuk tombol aksi
  const handleOpenItem = (id: string) => {
    const [rowId, kind] = id.split("-");
    const baseId = Number(rowId);
    const type = kind === "vm" ? "suara" : "gambar";
    fetcher.submit(
      { id: String(baseId), type },
      { method: "post", action: "/screening-result" },
    );
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const [rowId] = id.split("-");
      const baseId = Number(rowId);
      // Hapus seluruh record form untuk id tersebut
      const { error } = await supabase.from("form").delete().eq("id", baseId);
      if (error) throw error;
      // Refresh list lokal
      setHistoryData((prev) =>
        prev.filter((it) => !it.id.startsWith(`${baseId}-`)),
      );
    } catch (e) {
      console.error("Gagal menghapus item:", e);
      alert("Gagal menghapus item");
    }
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
        {/* Filter Section - Date Range Only */}
        <div className="mb-6 rounded-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Date Range Filter */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-fit flex-col gap-1 sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-neutral-800">
                  Filter Tanggal:
                </label>
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

                {/* Clear Filter Button */}
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setCurrentPage(1); // Reset ke halaman pertama
                    }}
                    className="ml-2 rounded-md bg-neutral-200 px-3 py-2 text-sm text-neutral-700 transition-colors duration-150 hover:bg-neutral-300"
                  >
                    Hapus Filter
                  </button>
                )}
              </div>
            </div>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-800">
                Urutkan:
              </span>
              <div className="flex rounded-md border border-neutral-300 bg-white">
                <button
                  onClick={() => handleSortChange("newest")}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    sortOrder === "newest"
                      ? "bg-blue-500 text-white"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Terbaru
                </button>
                <button
                  onClick={() => handleSortChange("oldest")}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    sortOrder === "oldest"
                      ? "bg-blue-500 text-white"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Terlama
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section - Improved Badges and Buttons */}
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 font-mono">
                <th className="border-b border-neutral-200 px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                  TANGGAL
                </th>
                <th className="border-b border-neutral-200 px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                  JENIS TES
                </th>
                <th className="border-b border-neutral-200 px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                  HASIL
                </th>
                <th className="border-b border-neutral-200 px-6 py-4 text-right text-sm font-semibold text-neutral-700">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-neutral-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600"></div>
                      Memuat data...
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-red-500"
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                currentGroupedData.map((group, groupIndex) => (
                  <React.Fragment key={group[0].id.split("-")[0]}>
                    {group.map((item, itemIndex) => (
                      <tr
                        key={item.id}
                        className="border-b border-neutral-100 transition-colors duration-150 hover:bg-neutral-50"
                      >
                        {item.showDateAndAction ? (
                          <td
                            className="whitespace-nowrap px-6 py-4 align-top"
                            rowSpan={item.rowSpan || 1}
                          >
                            <div className="text-sm font-medium text-neutral-900">
                              {item.date}
                            </div>
                            <div className="mt-1 text-xs text-neutral-500">
                              {item.time}
                            </div>
                          </td>
                        ) : null}
                        <td className="whitespace-nowrap px-6 py-4 align-top">
                          <TestTypeBadge type={item.testType} />
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 align-top">
                          <ConfidenceScoreBadge
                            score={item.score || 0}
                            result={item.result}
                          />
                        </td>
                        {item.showDateAndAction ? (
                          <td
                            className="whitespace-nowrap px-6 py-4 text-right align-top"
                            rowSpan={item.rowSpan || 1}
                          >
                            <div className="flex items-center justify-end space-x-2">
                              <OpenButton
                                onClick={() => handleOpenItem(item.id)}
                              />
                              <DeleteButton
                                onClick={() => handleDeleteItem(item.id)}
                              />
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}

              {!isLoading && !error && currentGroupedData.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-neutral-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="mb-4 h-12 w-12 text-neutral-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">
                        Tidak ada data riwayat deteksi
                      </p>
                      <p className="mt-1 text-sm text-neutral-400">
                        Mulai dengan melakukan deteksi pertama Anda
                      </p>
                    </div>
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
              <div className="text-sm text-neutral-700">
                Menampilkan{" "}
                {sortedGroupedData.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                -{" "}
                {Math.min(currentPage * itemsPerPage, sortedGroupedData.length)}{" "}
                dari {sortedGroupedData.length} record
              </div>
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
