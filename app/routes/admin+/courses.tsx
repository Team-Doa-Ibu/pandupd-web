import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import {
  IconBook,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AdminLayout } from "../../components/ui/AdminLayout";
import { Alert } from "../../components/ui/Alert";
import { supabase } from "../../data/supabaseClient";
import { deleteFileFromTerapi } from "../../utils/fileUpload";

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

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"judul" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Bulk delete state
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: "info" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
    onConfirm: () => setShowAlert(false),
    onCancel: () => setShowAlert(false),
    confirmText: "OK",
    cancelText: "Batal",
  });

  useEffect(() => {
    fetchCourses();
  }, [sortBy, sortOrder]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order(sortBy, { ascending: sortOrder === "asc" });

      if (error) {
        console.error("Error fetching courses:", error);
        showAlertMessage("error", "Error", "Gagal memuat data course");
        return;
      }

      setCourses(data || []);
    } catch (error) {
      console.error("Error:", error);
      showAlertMessage("error", "Error", "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const showAlertMessage = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
  ) => {
    setAlertConfig({
      type,
      title,
      message,
      onConfirm: onConfirm || (() => setShowAlert(false)),
      onCancel: onCancel || (() => setShowAlert(false)),
      confirmText: type === "warning" ? "Ya, Hapus" : "OK",
      cancelText: type === "warning" ? "Batal" : "Tutup",
    });
    setShowAlert(true);
  };

  const handleDeleteCourse = async (courseId: number, courseName: string) => {
    showAlertMessage(
      "warning",
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus course "${courseName}"?`,
      async () => {
        try {
          // Get course data first to check thumbnail
          const { data: courseData, error: fetchError } = await supabase
            .from("courses")
            .select("thumbnail")
            .eq("id", courseId)
            .single();

          if (fetchError) {
            console.error("Error fetching course data:", fetchError);
            showAlertMessage("error", "Error", "Gagal memuat data course");
            return;
          }

          // Delete course from database first
          const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", courseId);

          if (error) {
            console.error("Error deleting course:", error);
            showAlertMessage("error", "Error", "Gagal menghapus course");
            return;
          }

          // Delete thumbnail file if it exists and not default
          if (courseData.thumbnail) {
            console.log(
              "🔍 Checking thumbnail for deletion:",
              courseData.thumbnail,
            );

            if (courseData.thumbnail !== "/terapi/default.jpg") {
              try {
                // Extract filename from URL
                const filename = courseData.thumbnail.split("/").pop();
                if (filename) {
                  console.log("🗑️ Deleting course thumbnail file:", filename);

                  // Delete from local storage
                  const deleteResult = await deleteFileFromTerapi(filename);

                  if (!deleteResult.success) {
                    console.error(
                      "❌ Error deleting thumbnail file:",
                      deleteResult.error,
                    );
                    showAlertMessage(
                      "warning",
                      "Peringatan",
                      "Course berhasil dihapus, tetapi ada masalah saat menghapus file thumbnail",
                    );
                  } else {
                    console.log(
                      "✅ Course thumbnail file deleted successfully:",
                      filename,
                    );
                  }
                } else {
                  console.warn(
                    "⚠️ Could not extract filename from thumbnail URL:",
                    courseData.thumbnail,
                  );
                }
              } catch (error) {
                console.error("❌ Error deleting thumbnail file:", error);
                showAlertMessage(
                  "warning",
                  "Peringatan",
                  "Course berhasil dihapus, tetapi ada masalah saat menghapus file thumbnail",
                );
              }
            } else {
              console.log(
                "ℹ️ Skipping deletion of default thumbnail:",
                courseData.thumbnail,
              );
            }
          } else {
            console.log("ℹ️ No thumbnail to delete for course:", courseName);
          }

          showAlertMessage("success", "Berhasil", "Course berhasil dihapus");
          fetchCourses();
        } catch (error) {
          console.error("Error:", error);
          showAlertMessage(
            "error",
            "Error",
            "Terjadi kesalahan saat menghapus course",
          );
        }
      },
      () => {
        // Cancel action - do nothing
        console.log("Delete cancelled by user");
      },
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCourses.length === 0) {
      showAlertMessage(
        "warning",
        "Peringatan",
        "Pilih course yang ingin dihapus terlebih dahulu",
      );
      return;
    }

    const courseNames = filteredCourses
      .filter((course) => selectedCourses.includes(course.id))
      .map((course) => course.judul)
      .join(", ");

    showAlertMessage(
      "warning",
      "Konfirmasi Hapus",
      `Apakah Anda yakin ingin menghapus ${selectedCourses.length} course berikut?\n\n${courseNames}`,
      performBulkDelete,
      () => setShowAlert(false),
    );
  };

  const performBulkDelete = async () => {
    try {
      // Get all course data first to check thumbnails
      const { data: coursesData, error: fetchError } = await supabase
        .from("courses")
        .select("id, thumbnail")
        .in("id", selectedCourses);

      if (fetchError) {
        console.error("Error fetching courses data:", fetchError);
        showAlertMessage("error", "Error", "Gagal memuat data course");
        return;
      }

      // Delete courses from database first
      const { error } = await supabase
        .from("courses")
        .delete()
        .in("id", selectedCourses);

      if (error) {
        console.error("Error deleting courses:", error);
        showAlertMessage("error", "Error", "Gagal menghapus course");
        return;
      }

      // Delete thumbnail files if they exist and not default
      const filesToDelete = coursesData
        .filter(
          (course) =>
            course.thumbnail && course.thumbnail !== "/terapi/default.jpg",
        )
        .map((course) => {
          const filename = course.thumbnail.split("/").pop();
          return {
            courseId: course.id,
            filename,
            thumbnailUrl: course.thumbnail,
          };
        })
        .filter((item) => item.filename);

      console.log(`🗑️ Found ${filesToDelete.length} thumbnail files to delete`);

      if (filesToDelete.length > 0) {
        const deletePromises = filesToDelete.map(async (item) => {
          try {
            console.log(
              `🗑️ Deleting thumbnail file: ${item.filename} (Course ID: ${item.courseId})`,
            );

            const deleteResult = await deleteFileFromTerapi(item.filename);

            if (!deleteResult.success) {
              console.error(
                `❌ Error deleting thumbnail file ${item.filename}:`,
                deleteResult.error,
              );
              return {
                success: false,
                filename: item.filename,
                error: deleteResult.error,
              };
            } else {
              console.log(
                `✅ Thumbnail file deleted successfully: ${item.filename}`,
              );
              return { success: true, filename: item.filename };
            }
          } catch (error) {
            console.error(
              `❌ Error deleting thumbnail file ${item.filename}:`,
              error,
            );
            return { success: false, filename: item.filename, error };
          }
        });

        const deleteResults = await Promise.all(deletePromises);
        const successfulDeletes = deleteResults.filter(
          (result) => result.success,
        ).length;
        const failedDeletes = deleteResults.filter(
          (result) => !result.success,
        ).length;

        console.log(
          `📊 File deletion summary: ${successfulDeletes} successful, ${failedDeletes} failed`,
        );

        if (failedDeletes > 0) {
          showAlertMessage(
            "warning",
            "Peringatan",
            `${selectedCourses.length} course berhasil dihapus, tetapi ${failedDeletes} file thumbnail gagal dihapus`,
          );
        } else {
          showAlertMessage(
            "success",
            "Berhasil",
            `${selectedCourses.length} course berhasil dihapus`,
          );
        }
      } else {
        console.log("ℹ️ No thumbnail files to delete");
        showAlertMessage(
          "success",
          "Berhasil",
          `${selectedCourses.length} course berhasil dihapus`,
        );
      }

      setSelectedCourses([]);
      setSelectAll(false);
      fetchCourses();
    } catch (error) {
      console.error("Error:", error);
      showAlertMessage(
        "error",
        "Error",
        "Terjadi kesalahan saat menghapus course",
      );
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCourses([]);
      setSelectAll(false);
    } else {
      const allIds = currentCourses.map((course) => course.id);
      setSelectedCourses(allIds);
      setSelectAll(true);
    }
  };

  const handleSelectCourse = (courseId: number) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
      setSelectAll(false);
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
      // Check if all courses on current page are now selected
      if (selectedCourses.length + 1 === currentCourses.length) {
        setSelectAll(true);
      }
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Kelola Course" subtitle="Loading...">
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
        title="Kelola Course"
        subtitle="Tambah, edit, dan hapus course terapi Parkinson"
      >
        {/* Alert Component */}
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          show={showAlert}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
          confirmText={alertConfig.confirmText}
          cancelText={alertConfig.cancelText}
        />

        {/* Header Actions */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Daftar Course ({courses.length})
            </h2>
            {selectedCourses.length > 0 && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {selectedCourses.length} dipilih
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {selectedCourses.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <IconTrash size={16} />
                Hapus {selectedCourses.length} Course
              </button>
            )}
            <Link
              to="/admin/new/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <IconPlus size={16} />
              Tambah Course Baru
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari course berdasarkan nama, deskripsi, atau slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as "judul" | "created_at");
                setCurrentPage(1); // Reset to first page when sorting
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="created_at">Tanggal Dibuat</option>
              <option value="judul">Nama Course</option>
            </select>
            <button
              onClick={() => {
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                setCurrentPage(1); // Reset to first page when sorting
              }}
              className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              <IconSortAscending
                className={`h-4 w-4 ${sortOrder === "desc" ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Items Per Page Selector */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-700">course per halaman</span>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Terakhir Update
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course.id)}
                          onChange={() => handleSelectCourse(course.id)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={
                                course.thumbnail || "/placeholder-course.jpg"
                              }
                              alt={course.judul}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {course.judul}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-sm text-gray-900">
                          {course.short_deskripsi}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(course.created_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(course.updated_at)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/view/courses/${course.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title="Lihat Detail"
                          >
                            <IconEye size={16} />
                          </Link>
                          <Link
                            to={`/admin/edit/courses/${course.id}`}
                            className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                            title="Edit Course"
                          >
                            <IconEdit size={16} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteCourse(course.id, course.judul)
                            }
                            className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                            title="Hapus Course"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <IconBook className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {searchTerm
                            ? "Tidak ada course yang ditemukan"
                            : "Belum ada course"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm
                            ? "Coba ubah kata kunci pencarian Anda"
                            : "Mulai dengan membuat course pertama"}
                        </p>
                        {!searchTerm && (
                          <div className="mt-6">
                            <Link
                              to="/admin/new/courses"
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                              <IconPlus size={16} />
                              Tambah Course Baru
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {startIndex + 1} -{" "}
              {Math.min(endIndex, filteredCourses.length)} dari{" "}
              {filteredCourses.length} course
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredCourses.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
            <div>
              {searchTerm && (
                <span className="text-blue-600">
                  Hasil pencarian untuk: "{searchTerm}"
                </span>
              )}
            </div>
            <div className="text-gray-500">
              Urutkan berdasarkan:{" "}
              {sortBy === "created_at" ? "Tanggal Dibuat" : "Nama Course"}(
              {sortOrder === "asc" ? "A-Z" : "Z-A"})
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
