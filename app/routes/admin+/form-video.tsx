import { ProtectedRoute } from "../../components/ProtectedRoute";
import type { Video } from "./cihuy.videos.$courseId";

interface VideoFormProps {
  video?: Video | null; // null = create, Video = edit
  onClear?: () => void; // called when “Batal” is clicked
}

export default function FormVideo({ video = null, onClear }: VideoFormProps) {
  const isEdit = Boolean(video);

  return (
    <ProtectedRoute adminOnly>
      <form
        key={video?.id ?? "new"}
        method="post"
        className="rounded-xl border border-neutral-200 bg-white p-6"
      >
        {/* hidden id when editing */}
        {isEdit && <input type="hidden" name="videoId" value={video!.id} />}

        {/* Judul */}
        <div className="mb-4">
          <label className="mb-2 block text-neutral-700">
            Judul Video
            <input
              type="text"
              name="title"
              defaultValue={video?.title ?? ""}
              className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <label className="mb-2 block text-neutral-700">
            Deskripsi
            <textarea
              name="description"
              defaultValue={video?.description ?? ""}
              className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </label>
        </div>

        {/* URL YouTube */}
        <div className="mb-4">
          <label className="mb-2 block text-neutral-700">
            URL YouTube
            <input
              type="text"
              name="youtube_url"
              defaultValue={video?.youtube_url ?? ""}
              className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
        </div>

        {/* Durasi & Urutan */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-neutral-700">
              Durasi
              <input
                type="text"
                name="duration"
                defaultValue={video?.duration ?? ""}
                className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: 15:30"
              />
            </label>
          </div>
          <div>
            <label className="mb-2 block text-neutral-700">
              Urutan
              <input
                min={1}
                type="number"
                name="order_index"
                defaultValue={video?.order_index ?? ""}
                className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
          {isEdit && (
            <>
              <button
                type="submit"
                name="_action"
                value="delete-video"
                className="rounded-full bg-red-500 px-6 py-2 text-white shadow-inner shadow-white/50 hover:bg-red-600"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={onClear}
                className="rounded-full border border-neutral-300 px-6 py-2 text-neutral-700 hover:bg-neutral-100"
              >
                Batal
              </button>
            </>
          )}
          <button
            type="submit"
            name="_action"
            value={isEdit ? "update-video" : "add-video"}
            className="rounded-full bg-blue-500 px-6 py-2 text-white shadow-inner shadow-white/50 hover:bg-blue-600"
          >
            {isEdit ? "Simpan Perubahan" : "Tambah Video"}
          </button>
        </div>
      </form>
    </ProtectedRoute>
  );
}
