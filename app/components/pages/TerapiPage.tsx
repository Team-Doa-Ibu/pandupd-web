import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";

type Course = {
  id: number;
  judul: string;
  thumbnail: string;
  slug: string;
  short_deskripsi: string;
};

type UserProgress = {
  course_id: number;
  sub_pembelajaran: number;
  is_completed: boolean;
};

type SubPembelajaran = {
  id: number;
  courses_id: number;
  slug: string;
};

export default function CourseIndex() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [totalVideos, setTotalVideos] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCourses = async () => {
      const { data: courseData } = await supabase
        .from("courses")
        .select("id, judul, thumbnail, slug, short_deskripsi");
      setCourses(courseData || []);

      // Fetch sub_pembelajaran for each course
      const progressObj: Record<string, number> = {};
      const totalObj: Record<string, number> = {};
      for (const course of courseData || []) {
        const { data: subs } = await supabase
          .from("sub_pembelajaran")
          .select("id")
          .eq("courses_id", course.id);
        totalObj[course.slug] = subs?.length || 0;

        // Fetch user_progress for this course
        const user = await supabase.auth.getUser();
        const { data: userProgress } = await supabase
          .from("user_progress")
          .select("sub_pembelajaran, is_completed")
          .eq("course_id", course.id)
          .eq("user_id", user.data.user?.id || "");
        const completed = (userProgress || []).filter(
          (p) => p.is_completed,
        ).length;
        progressObj[course.slug] = completed;
      }
      setProgress(progressObj);
      setTotalVideos(totalObj);
    };
    fetchCourses();
  }, []);

  return (
    <div className="pt-18 bg-white pb-16">
      <div className="w-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-400 px-4 py-10">
        <div className="mx-auto mt-16 max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-white">Terapi</h1>
          <p className="text-lg text-white">
            Berikut ini adalah kelas terapi parkinson yang kami sediakan untuk
            membantu pasien parkinson
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 xl:px-0">
        <h1 className="mb-8 text-2xl font-bold text-neutral-700">
          Daftar Course
        </h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-lg"
            >
              <img
                src={course.thumbnail}
                alt={course.judul}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="mb-2 text-xl font-bold text-neutral-700">
                  {course.judul}
                </h2>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-blue-600"
                        style={{
                          width: `${((progress[course.slug] || 0) / (totalVideos[course.slug] || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="font-mono font-semibold text-neutral-700">
                      {Math.floor(
                        ((progress[course.slug] || 0) /
                          (totalVideos[course.slug] || 1)) *
                          100,
                      )}
                      %
                    </p>
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase text-neutral-500">
                    {progress[course.slug] || 0}/{totalVideos[course.slug] || 0}{" "}
                    video selesai
                  </p>
                </div>
                <Link
                  to={`/terapi/${course.slug}`}
                  className={`flex w-full justify-center rounded-full px-6 py-2 shadow-inner shadow-white/50 ${
                    (progress[course.slug] || 0) > 0
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } font-medium text-white`}
                >
                  {(progress[course.slug] || 0) > 0
                    ? "Lanjutkan"
                    : "Mulai Terapi"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
