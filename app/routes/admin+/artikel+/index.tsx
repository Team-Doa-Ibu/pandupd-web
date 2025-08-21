import { useEffect, useMemo, useState } from "react";
import { Link } from "@remix-run/react";
import {
  IconFileDescription,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconSortAscending,
} from "@tabler/icons-react";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { AdminLayout } from "~/components/ui/AdminLayout";
import { Alert } from "~/components/ui/Alert";
import { supabase } from "~/data/supabaseClient";
import { allArticles } from "~/data/articles";
import { deleteFileFromArtikel } from "~/utils/fileUpload";

type Article = {
  id: number;
  title: string;
  image: string;
  description: string;
  isi: string;
  likes: number;
  dislikes: number;
  created_at?: string;
  updated_at?: string;
};

export default function AdminArtikelList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
    confirmText: "OK",
    cancelText: "Batal",
  });

  useEffect(() => {
    fetchArticles();
  }, [sortBy, sortOrder]);

  const showAlertMessage = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => {
    setAlertConfig({
      type,
      title,
      message,
      onConfirm: onConfirm || (() => setShowAlert(false)),
      onCancel: onCancel || (() => setShowAlert(false)),
      confirmText: type === "warning" ? "Ya, Hapus" : "OK",
      cancelText: type === "warning" ? "Batal" : "Tutup",
    });
    setShowAlert(true);
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (error) {
        console.warn("Supabase articles error, falling back to static:", error);
        const mapped: Article[] = allArticles.map((a) => ({
          id: Number(a.id),
          title: a.title,
          image: `/` + a.image.replace(/^\/+/, ""),
          description: a.description,
          isi: a.isi,
          likes: a.likes,
          dislikes: a.dislikes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setArticles(mapped);
        return;
      }

      setArticles((data as any) || []);
    } catch (e) {
      console.error(e);
      showAlertMessage("error", "Error", "Gagal memuat data artikel");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return articles.filter((a) =>
      [a.title, a.description].some((v) =>
        (v || "").toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [articles, searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (article: Article) => {
    showAlertMessage(
      "warning",
      "Konfirmasi Hapus",
      `Hapus artikel "${article.title}"?`,
      async () => {
        try {
          // Try delete from DB
          const { error } = await supabase
            .from("articles")
            .delete()
            .eq("id", article.id);

          if (error) {
            showAlertMessage(
              "warning",
              "Peringatan",
              "Artikel dari data statis tidak bisa dihapus di sini",
            );
            return;
          }

          // Delete file if under /artikel
          if (article.image && article.image.startsWith("/artikel/")) {
            const filename = article.image.split("/").pop();
            if (filename) {
              await deleteFileFromArtikel(filename);
            }
          }

          showAlertMessage("success", "Berhasil", "Artikel dihapus");
          fetchArticles();
        } catch (err) {
          console.error(err);
          showAlertMessage("error", "Error", "Gagal menghapus artikel");
        }
      },
      () => setShowAlert(false),
    );
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Kelola Artikel" subtitle="Loading...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout
        title="Kelola Artikel"
        subtitle="Tambah, edit, dan hapus artikel Parkinson"
      >
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          show={showAlert}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
        />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Daftar Artikel ({articles.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/artikel/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <IconPlus size={16} />
              Tambah Artikel Baru
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel berdasarkan judul atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="title">Judul</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <IconSortAscending
                className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Artikel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Terakhir Update
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.length > 0 ? (
                  filtered.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={article.image || "/placeholder-article.jpg"}
                              alt={article.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">
                          {article.description}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(article.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(article.updated_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/artikel/edit/${article.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                            title="Edit Artikel"
                          >
                            <IconEdit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article)}
                            className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                            title="Hapus Artikel"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <IconFileDescription className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {searchTerm
                            ? "Tidak ada artikel yang ditemukan"
                            : "Belum ada artikel"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm
                            ? "Coba ubah kata kunci pencarian Anda"
                            : "Mulai dengan membuat artikel pertama"}
                        </p>
                        {!searchTerm && (
                          <div className="mt-6">
                            <Link
                              to="/admin/artikel/new"
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              <IconPlus size={16} />
                              Tambah Artikel Baru
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
