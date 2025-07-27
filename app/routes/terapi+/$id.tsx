import { useEffect, useState } from "react";
import { useParams, Link } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";
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

type Course = {
  id: number;
  judul: string;
  thumbnail: string;
  slug: string;
  short_deskripsi: string;
  deskripsi: string;
};

type SubPembelajaran = {
  id: number;
  judul: string;
  slug: string;
  durasi: string;
  no_urut: number;
};

export default function CourseDetail() {
  const { id: courseSlug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<SubPembelajaran[]>([]);
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch course by slug
      const { data: courseData } = await supabase
        .from("courses")
        .select("id, judul, thumbnail, slug, short_deskripsi, deskripsi")
        .eq("slug", courseSlug)
        .single();
      setCourse(courseData);
      if (!courseData) return;

      // Fetch sub_pembelajaran for this course
      const { data: subs } = await supabase
        .from("sub_pembelajaran")
        .select("id, judul, slug, durasi, no_urut")
        .eq("courses_id", courseData.id)
        .order("no_urut", { ascending: true });
      setVideos(subs || []);

      // Fetch user progress for this course
      const user = await supabase.auth.getUser();
      const { data: userProgress } = await supabase
        .from("user_progress")
        .select("sub_pembelajaran, is_completed")
        .eq("course_id", courseData.id)
        .eq("user_id", user.data.user?.id || "");
      const completed = (userProgress || [])
        .filter((p: { is_completed: boolean }) => p.is_completed)
        .map((p: { sub_pembelajaran: number }) => p.sub_pembelajaran);
      setCompletedIds(completed);
    };
    fetchData();
  }, [courseSlug]);

  if (!course) return null;

  // Temukan video pertama yang belum ditonton
  const nextVideo =
    videos.find((v) => !completedIds.includes(v.id)) || videos[0];

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
              <p className="text-amber-500">{course.judul}</p>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white sm:text-4xl">
              {course.judul}
            </h1>
            <p className="text-neutral-400">{course.short_deskripsi}</p>
          </div>
        </div>

        {/* container */}
        <section className="mx-4 flex flex-col overflow-hidden">
          {/* CTA Button */}
          <div className="mx-auto mt-4 flex w-full max-w-6xl items-center justify-between rounded-xl border border-blue-600 bg-gradient-to-r from-blue-200 to-white p-4 sm:flex-row">
            <h1 className="text-xl font-bold text-blue-700 sm:text-2xl">
              Mulai terapi?
            </h1>
            {nextVideo && (
              <Link
                to={`/terapi/${course.slug}/video/${nextVideo.slug}`}
                className="rounded-full bg-blue-500 px-4 py-1 font-medium text-white shadow-inner shadow-white/50 hover:bg-blue-600 sm:px-6 sm:py-2"
              >
                {completedIds.length > 0 ? "Lanjutkan Terapi" : "Mulai Terapi"}
              </Link>
            )}
          </div>

          {/* main container */}
          <div className="mx-auto my-4 w-full max-w-6xl space-y-4 overflow-hidden rounded-xl border border-neutral-300 bg-white p-4 lg:px-8">
            <div className="flex flex-col">
              <div className="mx-auto mb-8 sm:mt-4">
                <img
                  src={
                    course.thumbnail.startsWith("http")
                      ? course.thumbnail
                      : course.thumbnail.startsWith("/")
                        ? course.thumbnail
                        : "/" + course.thumbnail
                  }
                  alt="course-image"
                  className="aspect-video max-h-64 rounded-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <h1 className="mb-4 flex w-fit gap-1 rounded-full border border-amber-500 bg-amber-100 px-4 py-1 font-bold text-neutral-700">
                <IconBook className="text-neutral-700" />
                tentang kelas
              </h1>
              <div className="prose prose-neutral max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {(course.deskripsi || "").replaceAll("\\n", "\n")}
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
                <li key={video.id}>
                  <Link
                    to={`/terapi/${course.slug}/video/${video.slug}`}
                    className="block rounded-lg bg-neutral-50 p-4 transition-colors hover:bg-neutral-100"
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
                            <span className="mx-1">#{video.no_urut}</span>
                            {video.judul}
                          </h3>
                        </div>
                        <div className="flex flex-col-reverse items-end gap-1 sm:flex-row sm:items-center sm:justify-center sm:gap-2">
                          <span className="text-neutral-500">
                            {completedIds.includes(video.id) && (
                              <div className="flex items-center justify-center rounded-full bg-blue-500 px-4 py-1 text-xs font-bold uppercase text-white">
                                selesai
                              </div>
                            )}
                          </span>
                          <p className="text-sm text-neutral-500">
                            {video.durasi}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
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
