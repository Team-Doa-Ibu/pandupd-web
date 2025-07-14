import { Link } from "@remix-run/react";
import {
  IconBook,
  IconChevronRight,
  IconList,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import { Footer } from "~/components/ui/footer";
import { Navbar } from "~/components/ui/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tipe data untuk video (akan disediakan oleh backend)
type Video = {
  id: string;
  title: string;
  duration: string;
  order_index: number;
};

export default function CourseDetail() {
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
    // ... tambahkan video lainnya
  ];

  // Dummy: video yang sudah ditonton (ID video)
  const completedVideoIds = ["1", "2"];

  // Temukan video pertama yang belum ditonton
  const nextVideo =
    videos.find((v) => !completedVideoIds.includes(v.id)) || videos[0];

  return (
    <>
      <Navbar />
      <div className="bg-neutral-50 pb-4">
        <div className="w-full bg-neutral-800 px-4 py-10">
          <div className="mx-auto mt-16 max-w-6xl">
            <div className="mb-2 flex items-center gap-1">
              <Link
                to="/terapi"
                className="text-neutral-400 hover:text-white hover:underline"
              >
                Terapi
              </Link>
              <IconChevronRight size={16} className="text-neutral-400" />
              <p className="text-amber-500">{course.name}</p>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-4xl">
              {course.name}
            </h1>
            <p className="text-neutral-400">{course.short_description}</p>
          </div>
        </div>

        {/* container */}
        <section className="mx-4 flex flex-col overflow-hidden">
          {/* CTA Button */}
          <div className="mx-auto mt-4 flex w-full max-w-6xl items-center justify-between rounded-xl border border-blue-600 bg-gradient-to-r from-blue-200 to-white p-4 sm:flex-row">
            <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
              Mulai terapi?
            </h1>
            <Link
              to={`/terapi/${course.id}/video/${nextVideo.id}`}
              className="rounded-full bg-blue-500 px-4 py-1 font-medium text-white shadow-inner shadow-white/50 hover:bg-blue-600 sm:px-6 sm:py-2"
            >
              {completedVideoIds.length > 0
                ? "Lanjutkan Terapi"
                : "Mulai Terapi"}
            </Link>
          </div>

          {/* main container */}
          <div className="mx-auto my-4 w-full max-w-6xl space-y-4 overflow-hidden rounded-xl border border-neutral-300 bg-white p-4 lg:px-8">
            <div className="flex flex-col">
              <div className="mx-auto mb-8 sm:mt-4">
                <img
                  src={course.thumbnail_url}
                  alt="course-image"
                  className="aspect-video max-h-64 rounded-md object-cover"
                />
              </div>
              <h1 className="mb-4 flex w-fit gap-1 rounded-full border border-amber-500 bg-amber-100 px-4 py-1 font-bold text-neutral-700">
                <IconBook className="text-neutral-700" />
                tentang kelas
              </h1>
              <div className="prose prose-neutral max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {course.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* video list container */}
          <div className="mx-auto w-full max-w-6xl rounded-xl border border-neutral-300 bg-white p-4">
            <div className="flex gap-2">
              <IconList className="text-blue-500" size={24} />
              <h2 className="mb-4 text-xl font-bold text-blue-500">
                Daftar Video
              </h2>
            </div>
            <ul className="space-y-2 overflow-auto">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="cursor-pointer rounded-lg bg-neutral-50 p-4 transition-colors hover:bg-neutral-100"
                >
                  <div className="flex items-center">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                          <IconPlayerPlayFilled
                            className="text-white"
                            size={18}
                          />
                        </div>
                        <h3 className="line-clamp-2 text-neutral-700">
                          <span className="mx-1">#{video.order_index}</span>
                          {video.title}
                        </h3>
                      </div>
                      <div className="flex flex-col-reverse items-end gap-1 sm:gap-2 sm:flex-row sm:items-center sm:justify-center">
                        <span className="text-neutral-500">
                          {completedVideoIds.includes(video.id) && (
                            <div className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-1 text-xs font-bold uppercase text-white">
                              selesai
                            </div>
                          )}
                        </span>
                        <p className="text-sm text-neutral-500">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
