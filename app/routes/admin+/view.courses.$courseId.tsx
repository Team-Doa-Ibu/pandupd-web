import { useEffect, useState } from "react";
import { Link, useParams } from "@remix-run/react";
import {
  IconArrowLeft,
  IconBook,
  IconVideo,
  IconEdit,
  IconTrash,
  IconLoader,
  IconX,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AdminLayout } from "../../components/ui/AdminLayout";
import { supabase } from "../../data/supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Course = {
  id: number;
  judul: string;
  slug: string;
  short_deskripsi: string;
  deskripsi: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
};

type Video = {
  id: number;
  judul: string;
  slug: string;
  durasi: string;
  no_urut: number;
  created_at: string;
};

export default function AdminCourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      // Fetch course data
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) {
        console.error("Error fetching course:", courseError);
        setError("Course tidak ditemukan");
        return;
      }

      setCourse(courseData);

      // Fetch videos for this course
      const { data: videosData, error: videosError } = await supabase
        .from("sub_pembelajaran")
        .select("id, judul, slug, durasi, no_urut, created_at")
        .eq("courses_id", courseId)
        .order("no_urut", { ascending: true });

      if (videosError) {
        console.error("Error fetching videos:", videosError);
      } else {
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Terjadi kesalahan saat mengambil data course");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;

    if (
      !confirm(`Apakah Anda yakin ingin menghapus course "${course.judul}"?`)
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id);

      if (error) {
        console.error("Error deleting course:", error);
        alert("Gagal menghapus course");
        return;
      }

      alert("Course berhasil dihapus");
      window.location.href = "/admin/courses";
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus course");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Detail Course" subtitle="Loading...">
          <div className="flex h-64 items-center justify-center">
            <div className="flex items-center gap-3">
              <IconLoader className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-gray-600">Memuat data course...</span>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (error || !course) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Detail Course" subtitle="Error">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <IconX className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Course tidak ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {error || "Course yang Anda cari tidak ada atau telah dihapus."}
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <IconArrowLeft size={16} />
                  Kembali ke Daftar Course
                </Link>
              </div>
            </div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Detail Course" subtitle={course.judul}>
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <IconArrowLeft size={16} />
            Kembali ke Daftar Course
          </Link>
        </div>

        {/* Course Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Course Image */}
            <div className="flex-shrink-0">
              <img
                src={course.thumbnail || "/placeholder-course.jpg"}
                alt={course.judul}
                className="h-48 w-80 rounded-lg object-cover"
              />
            </div>

            {/* Course Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {course.judul}
                </h1>
                <p className="mt-2 text-gray-600">{course.short_deskripsi}</p>
              </div>

              {/* Course Stats */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <IconVideo className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Total Video
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {videos.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Dibuat
                      </p>
                      <p className="text-sm text-green-600">
                        {new Date(course.created_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="flex items-center gap-2">
                    <IconClock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">
                        Update Terakhir
                      </p>
                      <p className="text-sm text-purple-600">
                        {new Date(course.updated_at).toLocaleDateString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/admin/courses/${course.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <IconEdit size={16} />
                  Edit Course
                </Link>
                <button
                  onClick={handleDeleteCourse}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <IconTrash size={16} />
                  Hapus Course
                </button>
                <Link
                  to={`/admin/courses/${course.id}/videos`}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <IconVideo size={16} />
                  Kelola Video
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <IconBook className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Deskripsi Course
            </h2>
          </div>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {course.deskripsi}
            </ReactMarkdown>
          </div>
        </div>

        {/* Videos List */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconVideo className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Daftar Video
              </h2>
            </div>
            <span className="text-sm text-gray-500">{videos.length} video</span>
          </div>

          {videos.length > 0 ? (
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      #{video.no_urut}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {video.judul}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Durasi: {video.durasi} • Dibuat:{" "}
                        {formatDate(video.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/videos/${video.id}/edit`}
                      className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                      title="Edit Video"
                    >
                      <IconEdit size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <IconVideo className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Belum ada video dalam course ini
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tambahkan video pertama untuk course ini
              </p>
              <div className="mt-6">
                <Link
                  to={`/admin/courses/${course.id}/videos/new`}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <IconVideo size={16} />
                  Tambah Video Pertama
                </Link>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
