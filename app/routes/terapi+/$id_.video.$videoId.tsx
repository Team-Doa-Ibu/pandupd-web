import { useEffect, useState } from "react";
import { Form, Link, useParams, useNavigate } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";
import {
  IconChevronRight,
  IconCircleCheckFilled,
  IconList,
} from "@tabler/icons-react";
import { Navbar } from "~/components/ui/Navbar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tipe data untuk video (akan disediakan oleh backend)
type Course = {
  id: number;
  judul: string;
  slug: string;
};

type SubPembelajaran = {
  id: number;
  courses_id: number;
  judul: string;
  slug: string;
  konten: string;
  link: string;
  durasi: string;
  no_urut: number;
};

export default function VideoPlayer() {
  const { id: courseSlug, videoId: subSlug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<SubPembelajaran | null>(
    null,
  );
  const [allVideos, setAllVideos] = useState<SubPembelajaran[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user
        const user = await supabase.auth.getUser();
        setUserId(user.data.user?.id || "");

        // Fetch course by slug
        const { data: courseData } = await supabase
          .from("courses")
          .select("id, judul, slug")
          .eq("slug", courseSlug)
          .single();
        setCourse(courseData);
        if (!courseData) {
          setCurrentVideo(null);
          return;
        }

        // Fetch all sub_pembelajaran for playlist
        const { data: allSubs } = await supabase
          .from("sub_pembelajaran")
          .select("id, courses_id, judul, slug, konten, link, durasi, no_urut")
          .eq("courses_id", courseData.id)
          .order("no_urut", { ascending: true });
        setAllVideos(allSubs || []);

        // Fetch current sub_pembelajaran by slug dan courses_id
        const { data: subData } = await supabase
          .from("sub_pembelajaran")
          .select("id, courses_id, judul, slug, konten, link, durasi, no_urut")
          .eq("slug", subSlug)
          .eq("courses_id", courseData.id)
          .single();
        setCurrentVideo(subData);
        if (!subData) return;
        // Fetch user progress untuk sub_pembelajaran ini hanya jika subData ada
        const { data: progress } = await supabase
          .from("user_progress")
          .select("is_completed")
          .eq("user_id", user.data.user?.id || "")
          .eq("sub_pembelajaran", subData.id)
          .single();
        setIsCompleted(progress?.is_completed || false);
      } catch (err) {
        // Optional: bisa log error ke monitoring, tapi tidak tampilkan di UI
      }
    };
    fetchData();
  }, [courseSlug, subSlug]);

  // Fungsi untuk mendapatkan YouTube ID dari URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYouTubeId(currentVideo?.link || "");

  // Handle mark as completed
  const handleMarkCompleted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !currentVideo || !course) return;
    // Upsert user_progress
    await supabase.from("user_progress").upsert(
      [
        {
          user_id: userId,
          course_id: course.id,
          sub_pembelajaran: currentVideo.id,
          is_completed: true,
        },
      ],
      { onConflict: "user_id,sub_pembelajaran" },
    );
    setIsCompleted(true);
  };

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
              to={`/terapi/${course?.slug}`}
              className="text-neutral-500 hover:text-neutral-700 hover:underline"
            >
              {course?.judul}
            </Link>
            <IconChevronRight size={16} className="text-neutral-500" />
            <p className="text-amber-600">{currentVideo?.judul}</p>
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
                    title={currentVideo?.judul || ""}
                  />
                )}
              </div>

              {/* deskripsi */}
              <div className="rounded-xl bg-white p-4">
                <h1 className="mb-4 mt-2 text-2xl font-bold text-neutral-700">
                  <span>#{currentVideo?.no_urut} </span>
                  {currentVideo?.judul}
                </h1>
                <div className="prose prose-neutral max-w-none rounded-md bg-neutral-50 p-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentVideo?.konten}
                  </ReactMarkdown>
                </div>

                {!isCompleted && (
                  <form
                    onSubmit={handleMarkCompleted}
                    className="mt-4 flex flex-col items-center justify-center gap-4 rounded-md bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-lg font-bold text-blue-700">
                      Sudah paham?
                    </p>
                    <button
                      type="submit"
                      className="rounded-full bg-blue-500 px-6 py-2 font-medium text-white shadow-inner shadow-white/50 hover:bg-blue-600"
                    >
                      Tandai sebagai Selesai
                    </button>
                  </form>
                )}
                {isCompleted && (
                  <div className="mt-4 flex items-center gap-2 font-bold text-blue-700">
                    <IconCircleCheckFilled
                      className="text-blue-500"
                      size={24}
                    />
                    Materi ini sudah selesai dipelajari
                  </div>
                )}
              </div>
            </div>

            {/* playlist */}
            <div className="lg:col-span-1">
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <div className="flex items-center gap-1 border-b border-neutral-200 p-4">
                  <IconList className="text-blue-500" size={24} />
                  <h2 className="text-lg font-bold text-blue-500">Playlist</h2>
                </div>
                <ul className="space-y-2 overflow-y-auto p-4 lg:max-h-[440px]">
                  {allVideos.map((video) => (
                    <li key={video.id}>
                      <Link
                        to={`/terapi/${course?.slug}/video/${video.slug}`}
                        className={`block rounded-md p-3 ${
                          video.id === currentVideo?.id
                            ? "bg-blue-500 text-white"
                            : "bg-neutral-50 hover:bg-neutral-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="line-clamp-1 font-medium">
                            #{video.no_urut} {video.judul}
                          </p>
                          <div className="flex flex-row items-center gap-1">
                            <span className="text-neutral-500">
                              {currentVideo?.id !== undefined &&
                                video.id < currentVideo.id && (
                                  <IconCircleCheckFilled
                                    className="text-blue-500"
                                    size={24}
                                  />
                                )}
                            </span>
                            <p>{video.durasi}</p>
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
