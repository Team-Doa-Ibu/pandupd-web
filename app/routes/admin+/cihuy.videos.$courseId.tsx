// app/routes/admin/videos.$courseId.tsx
import { Link } from "@remix-run/react";
import { IconArrowLeft, IconBook, IconVideo } from "@tabler/icons-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FormVideo from "./form-video";
import FormCourse from "./form-course";

// Tipe data untuk video (akan disediakan oleh backend)
export type Video = {
  id: string;
  title: string;
  duration: string;
  order_index: number;
  description?: string;
  youtube_url?: string;
};

export default function AdminVideos() {
  // Data dummy - akan diganti dengan data dari backend
  const course = {
    id: "1",
    name: "Terapi Dasar Parkinson",
    short_description:
      "Terapi ini membantu pasien parkinson dalam meningkatkan mobilitas dan kualitas hidup sehari-hari melalui serangkaian latihan yang dirancang khusus.",
    description:
      "### 🎯 Course Terapi Parkinson - Memahami & Mengatasi Gejala Sejak Dini\n\nSebuah program interaktif yang dirancang untuk membantu pasien Parkinson, caregiver, serta profesional kesehatan mengenali dan menangani gejala Parkinson dengan terapi berbasis bukti dan teknologi.\n ### 🧩 Apa yang Akan Dipelajari?\n\n Dalam course ini, kamu akan mempelajari berbagai teknik dan pendekatan yang mudah dipahami dan dipraktikkan, antara lain:\n\n #### 1. Latihan Fisik & Motorik\n\n- 🌀 **Menggambar Spiral** – Deteksi awal tremor dan gangguan motorik.\n\n- 🖐️ **Latihan Gerakan Halus** – Melatih kemampuan motorik untuk aktivitas sehari-hari.\n\n",
    thumbnail_url: "/DBS.jpg",
  };
  const videos: Video[] = [
    {
      id: "1",
      title: "Pengenalan Parkinson",
      duration: "10:30",
      order_index: 1,
    },
    { id: "2", title: "Latihan Pernapasan", duration: "12:45", order_index: 2 },
    { id: "3", title: "Peregangan Dasar", duration: "15:20", order_index: 3 },
  ];

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);

  const clearSelection = () => setSelectedVideo(null);
  return (
    <div className="mx-auto bg-neutral-50">
      <div className="fixed w-full bg-blue-700/80 p-4 text-center font-mono text-2xl font-bold uppercase text-white backdrop-blur-lg">
        Atmint datang
      </div>
      <div className="mb-4 flex flex-col items-start gap-2 px-4 pt-20">
        <Link
          to="/admin/cihuy"
          className="diu flex gap-1 rounded-full border border-blue-300 bg-transparent px-4 py-2 text-blue-500 transition-colors hover:bg-blue-100"
        >
          <IconArrowLeft />{" "}
          <span className="font-semibold">Atmin mau balik</span>
        </Link>
        <div className="mx-auto my-4 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
            <IconVideo className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-700">
            Kelola Video Course
          </h1>
        </div>

        {/* Preview */}
        <div className="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-4">
          {/* Card */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <img
              src={course.thumbnail_url}
              alt={course.name}
              className="h-48 w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-4">
              <h2 className="text-xl font-bold text-neutral-700">
                {course.name}
              </h2>
              <p className="w-fit rounded-full bg-blue-100 px-3 py-1 font-mono text-xs font-bold uppercase text-blue-700">
                Total Video: {videos.length}
              </p>
              <p className="text-sm text-neutral-500">
                {course.short_description}
              </p>
            </div>
          </div>

          {/* Penjelasan Tentang Course */}
          <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 md:col-span-3">
            <h1 className="mb-4 flex w-fit gap-1 rounded-full border border-amber-500 bg-amber-100 px-4 py-1 font-bold text-neutral-700">
              <IconBook className="text-neutral-700" />
              Penjelasan Tentang Course
            </h1>
            <div className="prose prose-neutral mt-2 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {course.description}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        {isEditingCourse && (
          <div className="mx-auto mt-6 w-full max-w-4xl rounded-xl border border-neutral-200 bg-white p-4">
            <FormCourse
              mode="edit"
              initialData={{
                name: course.name,
                short_description: course.short_description,
                description: course.description,
                thumbnail_url: course.thumbnail_url,
              }}
            />
          </div>
        )}
        <div className="mx-auto mt-4 flex gap-2">
          <button
            className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white shadow-inner shadow-white/50 hover:bg-blue-600"
            onClick={() => setIsEditingCourse(true)}
          >
            Edit Course Info
          </button>

          <button className="rounded-full bg-red-500 px-4 py-2 font-bold text-white shadow-inner shadow-white/50 hover:bg-red-600">
            Hapus Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-neutral-700">
            {selectedVideo ? "Edit Video" : "Tambah Video Baru"}
          </h2>

          <FormVideo video={selectedVideo} onClear={clearSelection} />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-neutral-700">
            Daftar Video
          </h2>
          <ul className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {videos.map((video) => (
              <li key={video.id} className="border-b last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSelectedVideo(video)}
                  className="block w-full cursor-pointer p-4 text-left  hover:bg-blue-50 focus:bg-gradient-to-l focus:outline-none focus:from-blue-100 focus:to-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-blue-500">{video.title}</h3>
                      <p className="text-sm text-neutral-500">
                        Durasi: {video.duration} Menit
                      </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-center font-mono text-sm font-bold text-white">
                      #{video.order_index}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
