// app/routes/admin/courses.tsx
import { Link } from "@remix-run/react";
import { IconList } from "@tabler/icons-react";
import FormCourse from "./form-course";
import { ProtectedRoute } from "../../components/ProtectedRoute";

// Tipe data untuk course (akan disediakan oleh backend)
type Course = {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
};

export default function AdminCourses() {
  // Data dummy - akan diganti dengan data dari backend
  const courses: Course[] = [
    {
      id: "1",
      name: "Terapi Dasar Parkinson",
      description: "Serangkaian latihan dasar untuk pasien Parkinson",
      thumbnail_url: "/images/course1-thumb.jpg",
    },
    {
      id: "2",
      name: "Latihan Lanjutan Parkinson",
      description: "Latihan tingkat lanjut untuk meningkatkan mobilitas",
      thumbnail_url: "/images/course2-thumb.jpg",
    },
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="mx-auto min-h-screen w-full bg-neutral-50">
        <div className="fixed w-full bg-blue-700/80 p-4 text-center font-mono text-2xl font-bold uppercase text-white backdrop-blur-lg">
          Atmint datang
        </div>

        {/* Grid container */}
        <div className="mx-auto grid grid-cols-1 gap-4 p-4 pt-20 md:grid-cols-2">
          {/* Buat Course Baru */}
          <div className="rounded-xl border border-blue-300 bg-blue-100 pt-4 text-blue-600">
            <h2 className="mb-4 px-4 text-xl font-bold">Tambah Course Baru</h2>
            <FormCourse />
          </div>

          {/* Daftar Course */}
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-500">
              <IconList />
              <h2 className="text-xl font-bold">Daftar Course</h2>
            </div>
            <p className="mb-4 pl-2 text-neutral-700">
              Anda dapat mengubah course yang tersedia dibawah ini
            </p>
            <ul className="overflow-hidden rounded-xl border border-neutral-300 bg-white">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="border-b border-neutral-300 last:border-b-0"
                >
                  <Link
                    to={`/admin/cihuy/videos/${course.id}`}
                    className="block p-4 hover:bg-blue-50"
                  >
                    <h3 className="font-semibold text-blue-500">
                      {course.name}
                    </h3>
                    <p className="truncate text-sm text-neutral-500">
                      {course.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
