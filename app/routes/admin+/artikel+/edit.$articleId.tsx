import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "@remix-run/react";
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconUpload,
} from "@tabler/icons-react";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { AdminLayout } from "~/components/ui/AdminLayout";
import { Alert } from "~/components/ui/Alert";
import TinyEditor from "~/components/ui/TinyEditor";
import { supabase } from "~/data/supabaseClient";
import { uploadImageToArtikel } from "~/utils/fileUpload";

export default function AdminArtikelEdit() {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      confirmText: "OK",
      cancelText: "Tutup",
    });
    setShowAlert(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const id = Number(articleId);
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error || !data) {
          showAlertMessage(
            "warning",
            "Fallback",
            "Data artikel tidak ditemukan di database. Pastikan tabel 'articles' tersedia.",
          );
        } else {
          setTitle((data as any).title || "");
          setDescription((data as any).description || "");
          setContent((data as any).isi || "");
          setImageUrl((data as any).image || "");
        }
      } catch (e) {
        showAlertMessage("error", "Error", "Gagal memuat data artikel");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [articleId]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const result = await uploadImageToArtikel(file);
    setUploading(false);
    if (!result.success || !result.url) {
      showAlertMessage(
        "error",
        "Gagal Upload",
        result.error || "Gagal mengupload gambar",
      );
      return;
    }
    setImageUrl(result.url);
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !content.trim()) {
      showAlertMessage(
        "warning",
        "Validasi",
        "Isi judul, deskripsi dan konten artikel",
      );
      return;
    }
    setSaving(true);
    try {
      const id = Number(articleId);
      const { error } = await supabase
        .from("articles")
        .update({ title, description, isi: content, image: imageUrl })
        .eq("id", id);
      if (error) {
        showAlertMessage(
          "warning",
          "Fallback",
          "Tabel articles belum tersedia atau update gagal.",
        );
        setSaving(false);
        return;
      }
      showAlertMessage(
        "success",
        "Berhasil",
        "Artikel berhasil diperbarui",
        () => navigate("/admin/artikel"),
      );
    } catch (e) {
      showAlertMessage(
        "error",
        "Error",
        "Terjadi kesalahan saat menyimpan artikel",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Edit Artikel" subtitle="Loading...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Edit Artikel" subtitle="Ubah konten artikel">
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

        <div className="mb-6 flex items-center gap-2">
          <Link
            to="/admin/artikel"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <IconArrowLeft size={16} /> Kembali ke daftar
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Judul
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Masukkan judul artikel"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Deskripsi singkat
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Ringkasan singkat artikel"
                rows={3}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Konten
              </label>
              <TinyEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Gambar thumbnail
              </label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-lg border">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="thumbnail"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
                  <IconUpload size={16} /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                <IconDeviceFloppy size={16} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
