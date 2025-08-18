import { useState, useRef, useEffect } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
// Define Video type that works for both new and edit scenarios
type Video = {
  id?: number | string;
  courses_id?: number;
  title?: string;
  judul?: string;
  duration?: string;
  durasi?: string;
  order_index: number;
  description?: string;
  deskripsi?: string;
  youtube_url?: string;
};
// @ts-expect-error SummernoteLite error import.
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";

interface VideoFormProps {
  video?: Video | null; // null = create, Video = edit
  onClear?: () => void; // called when "Batal" is clicked
  onSubmit?: (videoData: any | any[]) => void; // called when form is submitted (single video or array of videos)
}

export default function FormVideo({
  video = null,
  onClear,
  onSubmit,
}: VideoFormProps) {
  const isEdit = Boolean(video);
  const [editorData, setEditorData] = useState(
    (video?.description || video?.deskripsi) ?? "",
  );
  const [showMultipleForm, setShowMultipleForm] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [multipleVideos, setMultipleVideos] = useState<
    Array<{
      title: string;
      description: string;
      youtube_url: string;
      duration: string;
      order_index: number;
    }>
  >([]);
  const noteRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      const videoData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        youtube_url: formData.get("youtube_url") as string,
        duration: formData.get("duration") as string,
        order_index: parseInt(formData.get("order_index") as string),
      };
      onSubmit(videoData);
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorData(content);
  };

  // Reset editor when video changes
  useEffect(() => {
    setEditorData((video?.description || video?.deskripsi) ?? "");
    setEditorKey((prev) => prev + 1);
  }, [video?.id]);

  const handleMultipleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (multipleVideos.length === 0) {
      alert("Tambahkan setidaknya satu video");
      return;
    }

    // Submit all videos at once as an array
    onSubmit?.(multipleVideos);

    // Clear form
    setMultipleVideos([]);
    setShowMultipleForm(false);
  };

  const addMultipleVideo = () => {
    const newVideo = {
      title: "",
      description: "",
      youtube_url: "",
      duration: "",
      order_index: multipleVideos.length + 1,
    };
    setMultipleVideos([...multipleVideos, newVideo]);
  };

  const updateMultipleVideo = (index: number, field: string, value: string) => {
    const updatedVideos = [...multipleVideos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setMultipleVideos(updatedVideos);
  };

  const removeMultipleVideo = (index: number) => {
    const updatedVideos = multipleVideos.filter((_, i) => i !== index);
    // Reorder videos
    const reorderedVideos = updatedVideos.map((video, i) => ({
      ...video,
      order_index: i + 1,
    }));
    setMultipleVideos(reorderedVideos);
  };

  return (
    <ProtectedRoute adminOnly>
      {/* Toggle between single and multiple form */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setShowMultipleForm(false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !showMultipleForm
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tambah Satu Video
        </button>
        <button
          type="button"
          onClick={() => setShowMultipleForm(true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            showMultipleForm
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tambah Banyak Video
        </button>
      </div>

      {!showMultipleForm ? (
        // Single Video Form
        <form
          key={video?.id ?? "new"}
          method="post"
          onSubmit={handleSubmit}
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
                defaultValue={(video?.title || video?.judul) ?? ""}
                className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
          </div>

          {/* Deskripsi */}

          <div className="mb-4">
            <label className="mb-2 block text-neutral-700">
              Deskripsi
              <SummernoteLite
                key={editorKey}
                ref={noteRef}
                defaultCodeValue={
                  editorData || "<p>Tulis deskripsi video...</p>"
                }
                placeholder={"Tulis deskripsi video..."}
                tabsize={2}
                lang="zh-CN"
                height={250}
                dialogsInBody={true}
                blockquoteBreakingLevel={0}
                toolbar={[
                  ["style", ["style"]],
                  [
                    "font",
                    [
                      "bold",
                      "underline",
                      "clear",
                      "strikethrough",
                      "superscript",
                      "subscript",
                    ],
                  ],
                  ["fontsize", ["fontsize"]],
                  ["fontname", ["fontname"]],
                  ["color", ["color"]],
                  ["para", ["ul", "ol", "paragraph"]],
                  ["table", ["table"]],
                  ["insert", ["link", "picture", "video", "hr"]],
                  ["view", ["codeview", "help"]],
                ]}
                fontNames={["Arial", "Georgia", "Verdana", "e.t.c..."]}
                callbacks={{
                  onChange: (content: string) => handleEditorChange(content),
                }}
              />
              <input type="hidden" name="description" value={editorData} />
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
                  defaultValue={(video?.duration || video?.durasi) ?? ""}
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
      ) : (
        // Multiple Videos Form
        <form
          onSubmit={handleMultipleSubmit}
          className="rounded-xl border border-neutral-200 bg-white p-6"
        >
          <div className="mb-4">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Tambah Banyak Video Sekaligus
            </h3>
            <p className="text-sm text-gray-600">
              Tambahkan beberapa video sekaligus untuk course ini
            </p>
          </div>

          {/* Multiple Videos List */}
          <div className="mb-6 space-y-4">
            {multipleVideos.map((video, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Video #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeMultipleVideo(index)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Judul Video
                    </label>
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) =>
                        updateMultipleVideo(index, "title", e.target.value)
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Masukkan judul video"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      URL YouTube
                    </label>
                    <input
                      type="text"
                      value={video.youtube_url}
                      onChange={(e) =>
                        updateMultipleVideo(
                          index,
                          "youtube_url",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="https://youtube.com/watch?v=..."
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Durasi
                    </label>
                    <input
                      type="text"
                      value={video.duration}
                      onChange={(e) =>
                        updateMultipleVideo(index, "duration", e.target.value)
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      placeholder="Contoh: 15:30"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Urutan
                    </label>
                    <input
                      type="number"
                      value={video.order_index}
                      onChange={(e) =>
                        updateMultipleVideo(
                          index,
                          "order_index",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Deskripsi
                  </label>
                  <SummernoteLite
                    defaultCodeValue={
                      video.description || "<p>Tulis deskripsi video...</p>"
                    }
                    placeholder={"Tulis deskripsi video..."}
                    tabsize={2}
                    lang="zh-CN"
                    height={200}
                    dialogsInBody={true}
                    blockquoteBreakingLevel={0}
                    toolbar={[
                      ["style", ["style"]],
                      [
                        "font",
                        [
                          "bold",
                          "underline",
                          "clear",
                          "strikethrough",
                          "superscript",
                          "subscript",
                        ],
                      ],
                      ["fontsize", ["fontsize"]],
                      ["fontname", ["fontname"]],
                      ["color", ["color"]],
                      ["para", ["ul", "ol", "paragraph"]],
                      ["table", ["table"]],
                      ["insert", ["link", "picture", "video", "hr"]],
                      ["view", ["codeview", "help"]],
                    ]}
                    fontNames={["Arial", "Georgia", "Verdana", "e.t.c..."]}
                    callbacks={{
                      onChange: (content: string) =>
                        updateMultipleVideo(index, "description", content),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add More Video Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={addMultipleVideo}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center text-gray-600 hover:border-blue-400 hover:text-blue-600"
            >
              + Tambah Video Lainnya
            </button>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-end">
            <button
              type="button"
              onClick={() => {
                setShowMultipleForm(false);
                setMultipleVideos([]);
              }}
              className="rounded-full border border-neutral-300 px-6 py-2 text-neutral-700 hover:bg-neutral-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={multipleVideos.length === 0}
              className={`rounded-full px-6 py-2 text-white shadow-inner shadow-white/50 ${
                multipleVideos.length === 0
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Tambah {multipleVideos.length} Video
            </button>
          </div>
        </form>
      )}
    </ProtectedRoute>
  );
}
