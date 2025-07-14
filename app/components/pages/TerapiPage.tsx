import { Link } from "@remix-run/react";

type Course = {
  id: string;
  name: string;
  thumbnail_url: string;
  progress: number;
  total_videos: number;
};

export default function CourseIndex() {
  // Data dummy - akan diganti dengan data dari backend
  const courses: Course[] = [
    {
      id: "1",
      name: "Terapi Dasar Parkinson",
      thumbnail_url: "DBS.jpg",
      progress: 2,
      total_videos: 3,
    },
    {
      id: "2",
      name: "Latihan Lanjutan Parkinson",
      thumbnail_url: "/gamma-knife-surgery.jpg",
      progress: 0,
      total_videos: 8,
    },
  ];

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
                src={course.thumbnail_url}
                alt={course.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h2 className="mb-2 text-xl font-bold text-neutral-700">
                  {course.name}
                </h2>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full bg-blue-600"
                        style={{
                          width: `${(course.progress / course.total_videos) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <p className="font-mono font-semibold text-neutral-700">
                      {Math.floor((course.progress / course.total_videos) * 100)}%
                    </p>
                  </div>
                  <p className="mt-1 text-xs font-mono text-neutral-500 uppercase">
                    {course.progress}/{course.total_videos} video selesai
                  </p>
                </div>
                <Link
                  to={`/terapi/${course.id}`}
                  className={`flex w-full justify-center rounded-full px-6 py-2 shadow-inner shadow-white/50 ${
                    course.progress > 0
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } font-medium text-white`}
                >
                  {course.progress > 0 ? "Lanjutkan" : "Mulai Terapi"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
