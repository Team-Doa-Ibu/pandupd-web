import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import {
  IconBook,
  IconVideo,
  IconUsers,
  IconChartBar,
  IconArrowRight,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AdminLayout } from "../../components/ui/AdminLayout";
import { supabase } from "../../data/supabaseClient";

type DashboardStats = {
  totalCourses: number;
  totalVideos: number;
  totalUsers: number;
  totalSessions: number;
};

type RecentCourse = {
  id: number;
  judul: string;
  slug: string;
  short_deskripsi: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalVideos: 0,
    totalUsers: 0,
    totalSessions: 0,
  });
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch courses count
        const { count: coursesCount } = await supabase
          .from("courses")
          .select("*", { count: "exact", head: true });

        // Fetch videos count
        const { count: videosCount } = await supabase
          .from("sub_pembelajaran")
          .select("*", { count: "exact", head: true });

        // Fetch users count
        const { count: usersCount } = await supabase
          .from("user_profile")
          .select("*", { count: "exact", head: true });

        // Fetch completed sessions count
        const { count: sessionsCount } = await supabase
          .from("user_progress")
          .select("*", { count: "exact", head: true })
          .eq("is_completed", true);

        // Fetch recent courses
        const { data: courses } = await supabase
          .from("courses")
          .select("id, judul, slug, short_deskripsi, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalCourses: coursesCount || 0,
          totalVideos: videosCount || 0,
          totalUsers: usersCount || 0,
          totalSessions: sessionsCount || 0,
        });

        setRecentCourses(courses || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Dashboard" subtitle="Loading...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout
        title="Dashboard Admin"
        subtitle="Overview sistem terapi Parkinson"
      >
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IconBook className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Course
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IconVideo className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Video</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalVideos}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IconUsers className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <IconChartBar className="h-8 w-8 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSessions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/courses/new"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <IconPlus className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Tambah Course Baru
                    </p>
                    <p className="text-sm text-gray-500">
                      Buat course terapi baru
                    </p>
                  </div>
                </div>
                <IconArrowRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link
                to="/admin/courses"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <IconBook className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Kelola Course</p>
                    <p className="text-sm text-gray-500">
                      Edit dan hapus course
                    </p>
                  </div>
                </div>
                <IconArrowRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Link
                to="/admin/videos"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                    <IconVideo className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Kelola Video</p>
                    <p className="text-sm text-gray-500">
                      Tambah dan edit video
                    </p>
                  </div>
                </div>
                <IconArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Recent Courses */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Course Terbaru
              </h3>
              <Link
                to="/admin/courses"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-3">
              {recentCourses.length > 0 ? (
                recentCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {course.judul}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {course.short_deskripsi}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Dibuat: {formatDate(course.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/courses/${course.id}`}
                        className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        title="Lihat Detail"
                      >
                        <IconEye size={16} />
                      </Link>
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                        title="Edit Course"
                      >
                        <IconEdit size={16} />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <IconBook className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Belum ada course yang dibuat
                  </p>
                  <Link
                    to="/admin/courses/new"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <IconPlus size={16} />
                    Buat Course Pertama
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
