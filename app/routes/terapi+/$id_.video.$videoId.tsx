import { Form, Link } from "@remix-run/react";
import {
  IconChevronRight,
  IconCircleCheckFilled,
  IconList,
} from "@tabler/icons-react";
import { Navbar } from "~/components/ui/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tipe data untuk video (akan disediakan oleh backend)
type Video = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  youtube_url: string;
  duration: string;
  order_index: number;
};

export default function VideoPlayer() {
  // Data dummy - akan diganti dengan data dari backend
  const course = {
    id: "1",
    name: "Terapi Dasar Parkinson",
  };

  // Data dummy - akan diganti dengan data dari backend
  const currentVideo: Video = {
    id: "3",
    course_id: "1",
    title: "Peregangan Dasar",
    description:
      "Video ini akan mengajarkan teknik peregangan dasar yang aman untuk pasien Parkinson. Lakukan setiap pagi untuk hasil terbaik.\n\nSPEAK OUT! Home Practice Sessions: Every Monday - Friday at 10 am CT! For 20 minutes, we practice speaking & living with INTENT to improve speech & swallowing in Parkinson's.\n\n- cihuy\n- psht\n- gus pixmen\n\n> Korupsi setiap pagi untuk hasil terbaik.",
    youtube_url: "https://www.youtube.com/watch?v=CUYs1NcRPdE",
    duration: "15:20",
    order_index: 3,
  };

  const allVideos: Video[] = [
    {
      id: "1",
      course_id: "1",
      title: "Pengenalan Parkinson",
      duration: "10:30",
      order_index: 1,
      youtube_url: "",
      description: "Pengenalan tentang penyakit Parkinson dan gejalanya.",
    },
    {
      id: "2",
      course_id: "1",
      title: "Latihan Pernapasan",
      duration: "12:45",
      order_index: 2,
      youtube_url: "",
      description: "Latihan pernapasan untuk relaksasi dan fokus.",
    },
    currentVideo,
    

    // ... tambahkan video lainnya
  ];

  // Dummy: apakah video ini sudah selesai ditonton?
  const isCompleted = false;

  // Fungsi untuk mendapatkan YouTube ID dari URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(currentVideo.youtube_url);

  return (
    <>
      <Navbar />
      <div className="w-full bg-neutral-50 pb-16">
        {/* Top Margin */}
        <div className="w-full px-4 py-4">
          <div className="mx-auto mt-16 max-w-6xl"></div>
        </div>
        {/* main container */}
        <div className="mx-auto max-w-6xl px-4">
          {/* Link */}
          <div className="my-6 flex flex-wrap items-center gap-1">
            <Link
              to="/terapi"
              className="text-neutral-500 hover:text-neutral-700 hover:underline"
            >
              Terapi
            </Link>
            <IconChevronRight size={16} className="text-neutral-500" />
            <Link
              to={`/terapi/${course.id}`}
              className="text-neutral-500 hover:text-neutral-700 hover:underline"
            >
              {course.name}
            </Link>
            <IconChevronRight size={16} className="text-neutral-500" />
            <p className="text-amber-600">{currentVideo.title}</p>
          </div>

          {/* video */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-neutral-200 bg-white lg:col-span-2">
              <div className="overflow-hidden rounded-t-xl bg-black">
                {youtubeId && (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    className="aspect-video h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={currentVideo.title}
                  />
                )}
              </div>

              {/* deskripsi */}
              <div className="rounded-xl bg-white p-4">
                <h1 className="mb-4 mt-2 text-2xl font-bold text-neutral-700">
                  <span>#{currentVideo.order_index} </span>
                  {currentVideo.title}
                </h1>
                <div className="prose prose-neutral max-w-none rounded-md bg-neutral-50 p-4">
                  {" "}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentVideo.description}
                  </ReactMarkdown>
                </div>

                {!isCompleted && (
                  <Form
                    method="post"
                    className="mt-4 flex flex-col items-center justify-center gap-4 rounded-md bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-lg font-bold text-blue-700">
                      Sudah paham?
                    </p>
                    <button
                      name="_action"
                      value="mark-completed"
                      className="rounded-full bg-blue-500 px-6 py-2 font-medium text-white shadow-inner shadow-white/50 hover:bg-blue-600"
                    >
                      Tandai sebagai Selesai
                    </button>
                  </Form>
                )}
              </div>
            </div>

            {/* playlist */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-1 border-b border-neutral-200 p-4">
                  <IconList className="text-blue-500" size={24} />
                  <h2 className="text-lg font-bold text-blue-500">
                    Playlist
                  </h2>
                </div>
                <ul className="space-y-2 overflow-y-auto p-4 lg:max-h-[440px]">
                  {allVideos.map((video) => (
                    <li key={video.id}>
                      <Link
                        to={`/course/${currentVideo.course_id}/video/${video.id}`}
                        className={`block rounded-md p-3 ${
                          video.id === currentVideo.id
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-50 hover:bg-neutral-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="line-clamp-1 font-medium">
                            #{video.order_index} {video.title}
                          </p>
                          <div className="flex flex-row items-center gap-1">
                            <span className="text-neutral-500">
                              {/* kondisi sementara, ubah sesuai kondisi dan logika sebenarnya*/}
                              {video.id < currentVideo.id && (
                                <IconCircleCheckFilled
                                  className="text-blue-500"
                                  size={24}
                                />
                              )}
                            </span>
                            <p>{video.duration}</p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
