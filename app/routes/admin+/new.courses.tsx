import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import {
  IconPlus,
  IconList,
  IconBook,
  IconArrowLeft,
  IconTrash,
  IconEdit,
  IconEye,
  IconVideo,
} from "@tabler/icons-react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { AdminLayout } from "../../components/ui/AdminLayout";
import { Alert } from "../../components/ui/Alert";
import { supabase } from "../../data/supabaseClient";
import FormCourse from "./form-course";
import FormVideo from "./form-video";
// @ts-expect-error SummernoteLite error import.
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";

type Video = {
  id?: number | string;
  course_id?: number;
  title: string;
  judul?: string;
  duration: string;
  durasi?: string;
  order_index: number;
  description?: string;
  deskripsi?: string;
  youtube_url?: string;
  slug?: string;
};

export default function AdminNewCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(
    null,
  );
  const [uploadedThumbnailUrl, setUploadedThumbnailUrl] = useState<string>("");
  const [uploadImageFunction, setUploadImageFunction] = useState<
    (() => Promise<string>) | null
  >(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    type: "success",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // New state for view mode
  const [viewMode, setViewMode] = useState<"preview" | "video">("preview");

  // State untuk data course yang akan di-preview
  const [coursePreviewData, setCoursePreviewData] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    thumbnail_url: "",
  });

  // State untuk tracking apakah course sudah dibuat
  const [courseCreated, setCourseCreated] = useState(false);
  const [courseId, setCourseId] = useState<number | null>(null);

  // State untuk edit mode
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [originalCourseData, setOriginalCourseData] = useState<any>(null);

  // State untuk video detail
  const [selectedVideoForDetail, setSelectedVideoForDetail] =
    useState<any>(null);
  const [showVideoDetail, setShowVideoDetail] = useState(false);

  // State untuk drag and drop
  const [draggedVideoIndex, setDraggedVideoIndex] = useState<number | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  // State untuk edit video
  const [editingVideoData, setEditingVideoData] = useState<any>(null);
  const [isEditingVideo, setIsEditingVideo] = useState(false);

  // State untuk course slug
  const [courseSlug, setCourseSlug] = useState<string>("");

  // State untuk video slug
  const [videoSlug, setVideoSlug] = useState<string>("");

  // State untuk preview video
  const [videoPreviewData, setVideoPreviewData] = useState({
    title: "",
    duration: "",
    description: "",
    youtube_url: "",
  });

  const handleAddVideo = (videoData: any) => {
    // Check if course is actually created in database
    if (!courseCreated || !courseId) {
      setAlertConfig({
        type: "warning",
        title: "Course Belum Dibuat",
        message:
          "Harap simpan course terlebih dahulu dengan klik tombol 'Buat Course' sebelum menambahkan video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
      setViewMode("preview"); // Switch back to preview mode
      return;
    }

    if (editingVideoIndex !== null) {
      // Update existing video
      const updatedVideos = [...videos];
      updatedVideos[editingVideoIndex] = {
        ...videoData,
        order_index: editingVideoIndex + 1,
      };
      setVideos(updatedVideos);
      setEditingVideoIndex(null);
    } else {
      // Add new video with auto-assigned order index
      const newVideo = {
        ...videoData,
        order_index: getNextOrderIndex(),
      };

      // Add to local state first
      setVideos([...videos, newVideo]);

      // Save to database immediately
      saveVideoToDatabase(newVideo);
    }
    setSelectedVideo(null);
  };

  // Function to save video to database
  const saveVideoToDatabase = async (videoData: any) => {
    if (!courseId) return;

    try {
      console.log("🔍 Validating single video for database save:", {
        videoData: videoData,
        courseId: courseId,
        timestamp: new Date().toISOString(),
      });

      // Check if video slug already exists in the same course
      const slugExists = await checkVideoSlugExistsInCourse(
        videoData.slug,
        courseId,
      );

      console.log("📊 Single video slug validation result:", {
        videoSlug: videoData.slug,
        exists: slugExists.exists,
        error: slugExists.error,
        existingVideos: slugExists.videos || [],
        count: slugExists.videos?.length || 0,
      });

      if (slugExists.error) {
        console.error(
          "❌ Error validating single video slug:",
          slugExists.error,
        );
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi slug video. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (slugExists.exists) {
        console.log("⚠️ Single video slug conflict detected:", {
          requestedSlug: videoData.slug,
          conflictingVideos: slugExists.videos || [],
          timestamp: new Date().toISOString(),
        });

        setAlertConfig({
          type: "warning",
          title: "Slug Video Sudah Ada",
          message: `Slug "${videoData.slug}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Check if video title already exists in the same course
      const titleExists = await checkVideoTitleExistsInCourse(
        videoData.title || videoData.judul,
        courseId,
      );

      console.log("📊 Single video title validation result:", {
        videoTitle: videoData.title || videoData.judul,
        exists: titleExists.exists,
        error: titleExists.error,
        existingVideos: titleExists.videos || [],
        count: titleExists.videos?.length || 0,
      });

      if (titleExists.error) {
        console.error(
          "❌ Error validating single video title:",
          titleExists.error,
        );
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi judul video. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (titleExists.exists) {
        console.log("⚠️ Single video title conflict detected:", {
          requestedTitle: videoData.title || videoData.judul,
          conflictingVideos: titleExists.videos || [],
          timestamp: new Date().toISOString(),
        });

        setAlertConfig({
          type: "warning",
          title: "Judul Video Sudah Ada",
          message: `Judul "${videoData.title || videoData.judul}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      console.log("✅ Single video validation passed, preparing to save:", {
        videoData: videoData,
        courseId: courseId,
        timestamp: new Date().toISOString(),
      });

      const videoDataForDB = {
        courses_id: courseId,
        judul: videoData.title || videoData.judul || "",
        slug:
          videoData.slug ||
          generateVideoSlug(videoData.title || videoData.judul || ""),
        durasi: videoData.duration || videoData.durasi || "",
        no_urut: videoData.order_index,
        konten: videoData.description || videoData.deskripsi || "", // Use konten field
        link: videoData.youtube_url || "",
      };

      console.log("📹 Saving video to database:", videoDataForDB);

      const { data: savedVideo, error: saveError } = await supabase
        .from("sub_pembelajaran")
        .insert([videoDataForDB])
        .select()
        .single();

      if (saveError) {
        console.error("❌ Error saving video to database:", saveError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal menyimpan video ke database: ${saveError.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Update local video with database ID
      const updatedVideos = videos.map((video) =>
        video === videoData ? { ...video, id: savedVideo.id } : video,
      );
      setVideos(updatedVideos);

      console.log("✅ Video successfully saved to database:", savedVideo);

      // Auto-refresh video list from database for real-time update
      await refreshVideosFromDatabase();

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil ditambahkan ke database!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("❌ Error saving video:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menyimpan video. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const handleAddMultipleVideos = (videoDataArray: any[]) => {
    // Check if course is actually created in database
    if (!courseCreated || !courseId) {
      setAlertConfig({
        type: "warning",
        title: "Course Belum Dibuat",
        message:
          "Harap simpan course terlebih dahulu dengan klik tombol 'Buat Course' sebelum menambahkan video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
      setViewMode("preview"); // Switch back to preview mode
      return;
    }

    // Add multiple videos to local state first
    const newVideos = videoDataArray.map((videoData, index) => ({
      ...videoData,
      order_index: videos.length + index + 1,
    }));
    setVideos([...videos, ...newVideos]);

    // Save all videos to database
    saveMultipleVideosToDatabase(newVideos);
  };

  // Function to save multiple videos to database
  const saveMultipleVideosToDatabase = async (videoDataArray: any[]) => {
    if (!courseId) return;

    try {
      // Validate all videos before saving to prevent duplicates
      for (const videoData of videoDataArray) {
        // Check if video slug already exists in the same course
        const slugExists = await checkVideoSlugExistsInCourse(
          videoData.slug ||
            generateVideoSlug(videoData.title || videoData.judul || ""),
          courseId,
        );
        if (slugExists.error) {
          setAlertConfig({
            type: "error",
            title: "Error",
            message: `Gagal memvalidasi slug video "${videoData.title || videoData.judul}". Silakan coba lagi.`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }
        if (slugExists.exists) {
          setAlertConfig({
            type: "warning",
            title: "Slug Video Sudah Ada",
            message: `Slug "${videoData.slug || generateVideoSlug(videoData.title || videoData.judul || "")}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }

        // Check if video title already exists in the same course
        const titleExists = await checkVideoTitleExistsInCourse(
          videoData.title || videoData.judul,
          courseId,
        );
        if (titleExists.error) {
          setAlertConfig({
            type: "error",
            title: "Error",
            message: `Gagal memvalidasi judul video "${videoData.title || videoData.judul}". Silakan coba lagi.`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }
        if (titleExists.exists) {
          setAlertConfig({
            type: "warning",
            title: "Judul Video Sudah Ada",
            message: `Judul "${videoData.title || videoData.judul}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan judul yang berbeda.`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }
      }

      const videosDataForDB = videoDataArray.map((videoData) => ({
        courses_id: courseId,
        judul: videoData.title || videoData.judul || "",
        slug:
          videoData.slug ||
          generateVideoSlug(videoData.title || videoData.judul || ""),
        durasi: videoData.duration || videoData.durasi || "",
        no_urut: videoData.order_index,
        konten: videoData.description || videoData.deskripsi || "", // Use konten field
        link: videoData.youtube_url || "",
      }));

      console.log("📹 Saving multiple videos to database:", videosDataForDB);

      const { data: savedVideos, error: saveError } = await supabase
        .from("sub_pembelajaran")
        .insert(videosDataForDB)
        .select();

      if (saveError) {
        console.error(
          "❌ Error saving multiple videos to database:",
          saveError,
        );
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal menyimpan ${videoDataArray.length} video ke database: ${saveError.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Update local videos with database IDs
      const updatedVideos = videos.map((video) => {
        const savedVideo = savedVideos?.find(
          (sv) => sv.judul === video.title || sv.judul === video.judul,
        );
        return savedVideo ? { ...video, id: savedVideo.id } : video;
      });
      setVideos(updatedVideos);

      console.log(
        "✅ Multiple videos successfully saved to database:",
        savedVideos,
      );

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: `${savedVideos?.length || videoDataArray.length} video berhasil ditambahkan ke database!`,
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);

      // Auto-refresh video list from database for real-time update
      await refreshVideosFromDatabase();
    } catch (error) {
      console.error("❌ Error saving multiple videos:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message:
          "Terjadi kesalahan saat menyimpan multiple video. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  // Function to edit video
  const handleEditVideo = (index: number) => {
    const videoToEdit = videos[index];
    setEditingVideoData({ ...videoToEdit });
    setEditingVideoIndex(index);
    setIsEditingVideo(true);
  };

  // Function to save edited video
  const handleSaveEditedVideo = async () => {
    if (!editingVideoData || editingVideoIndex === null || !courseId) return;

    try {
      // Check if video slug already exists in the same course (excluding current video)
      const slugExists = await checkVideoSlugExistsInCourse(
        editingVideoData.slug,
        courseId,
        editingVideoData.id,
      );
      if (slugExists.error) {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi slug video. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (slugExists.exists) {
        setAlertConfig({
          type: "warning",
          title: "Slug Video Sudah Ada",
          message: `Slug "${editingVideoData.slug}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Check if video title already exists in the same course (excluding current video)
      const titleExists = await checkVideoTitleExistsInCourse(
        editingVideoData.title || editingVideoData.judul,
        courseId,
        editingVideoData.id,
      );
      if (titleExists.error) {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi judul video. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (titleExists.exists) {
        setAlertConfig({
          type: "warning",
          title: "Judul Video Sudah Ada",
          message: `Judul "${editingVideoData.title || editingVideoData.judul}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      const videoDataForDB = {
        judul: editingVideoData.title || editingVideoData.judul || "",
        slug:
          editingVideoData.slug ||
          generateVideoSlug(
            editingVideoData.title || editingVideoData.judul || "",
          ),
        durasi: editingVideoData.duration || editingVideoData.durasi || "",
        no_urut: editingVideoData.order_index,
        konten:
          editingVideoData.description || editingVideoData.deskripsi || "",
        link: editingVideoData.youtube_url || "",
      };

      console.log("📝 Saving edited video to database:", videoDataForDB);

      const { data: updatedVideo, error: updateError } = await supabase
        .from("sub_pembelajaran")
        .update(videoDataForDB)
        .eq("id", editingVideoData.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error updating video:", updateError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal mengupdate video: ${updateError.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Update local state
      const updatedVideos = [...videos];
      updatedVideos[editingVideoIndex] = {
        ...editingVideoData,
        id: updatedVideo.id,
      };
      setVideos(updatedVideos);

      console.log("✅ Video successfully updated:", updatedVideo);

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil diupdate!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);

      // Clear editing state
      clearVideoEditing();

      // Auto-refresh video list from database for real-time update
      await refreshVideosFromDatabase();
    } catch (error) {
      console.error("❌ Error updating video:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat mengupdate video. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  // Function to cancel video editing
  const handleCancelVideoEdit = () => {
    clearVideoEditing();
  };

  // Function to clear video editing state
  const clearVideoEditing = () => {
    setEditingVideoData(null);
    setEditingVideoIndex(null);
    setIsEditingVideo(false);
  };

  const handleDeleteVideo = (index: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus video ini?")) {
      const updatedVideos = videos.filter((_, i) => i !== index);
      // Reorder videos
      const reorderedVideos = updatedVideos.map((video, i) => ({
        ...video,
        order_index: i + 1,
      }));
      setVideos(reorderedVideos);
    }
  };

  // Function to update video in database
  const handleUpdateVideo = async (videoData: any) => {
    if (!courseId || editingVideoIndex === null) return;

    try {
      const videoToUpdate = videos[editingVideoIndex];

      // Prepare video data for database update
      const updatedVideoData = {
        judul: videoData.title || videoData.judul || "",
        durasi: videoData.duration || videoData.durasi || "",
        no_urut: videoData.order_index,
        konten: videoData.description || videoData.deskripsi || "", // Use konten field
        link: videoData.youtube_url || "",
      };

      console.log("📝 Updating video with data:", updatedVideoData);

      // Update video in database
      const { data: updatedVideo, error: updateError } = await supabase
        .from("sub_pembelajaran")
        .update(updatedVideoData)
        .eq("id", videoToUpdate.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error updating video:", updateError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal mengupdate video: ${updateError.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Update local state
      const updatedVideos = [...videos];
      updatedVideos[editingVideoIndex] = {
        ...videoData,
        order_index: videoData.order_index,
      };
      setVideos(updatedVideos);

      console.log("✅ Video successfully updated:", updatedVideo);

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil diupdate!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);

      // Clear selection
      clearVideoSelection();
    } catch (error) {
      console.error("❌ Error updating video:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat mengupdate video. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  // Function to delete video from database
  const handleDeleteVideoFromDB = async (index: number) => {
    if (!courseId) return;

    const videoToDelete = videos[index];
    if (!videoToDelete.id) {
      // If video doesn't have ID (not saved to DB yet), just remove from local state
      handleDeleteVideo(index);
      return;
    }

    if (
      confirm(
        `Apakah Anda yakin ingin menghapus video "${videoToDelete.title || videoToDelete.judul}"?`,
      )
    ) {
      try {
        // Get video data first to check if it has thumbnail
        const { data: videoData, error: fetchError } = await supabase
          .from("sub_pembelajaran")
          .select("thumbnail_url")
          .eq("id", videoToDelete.id)
          .single();

        if (fetchError) {
          console.error("❌ Error fetching video data:", fetchError);
          setAlertConfig({
            type: "error",
            title: "Error",
            message: `Gagal memuat data video: ${fetchError.message}`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }

        // Delete video from database
        const { error: deleteError } = await supabase
          .from("sub_pembelajaran")
          .delete()
          .eq("id", videoToDelete.id);

        if (deleteError) {
          console.error("❌ Error deleting video:", deleteError);
          setAlertConfig({
            type: "error",
            title: "Error",
            message: `Gagal menghapus video: ${deleteError.message}`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }

        // Delete thumbnail file if it exists and not default
        if (
          videoData.thumbnail_url &&
          videoData.thumbnail_url !== "/terapi/default.jpg"
        ) {
          try {
            // Extract filename from URL
            const filename = videoData.thumbnail_url.split("/").pop();
            if (filename) {
              console.log("🗑️ Deleting video thumbnail:", filename);

              // Delete from storage
              const { error: deleteThumbnailError } = await supabase.storage
                .from("terapi")
                .remove([filename]);

              if (deleteThumbnailError) {
                console.error(
                  "❌ Error deleting video thumbnail:",
                  deleteThumbnailError,
                );
              } else {
                console.log(
                  "✅ Video thumbnail deleted successfully:",
                  filename,
                );
              }
            }
          } catch (error) {
            console.error("❌ Error deleting video thumbnail:", error);
          }
        }

        // Remove from local state
        handleDeleteVideo(index);

        console.log("✅ Video successfully deleted from database");

        // Show success message
        setAlertConfig({
          type: "success",
          title: "Berhasil!",
          message: "Video berhasil dihapus!",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      } catch (error) {
        console.error("❌ Error deleting video:", error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Terjadi kesalahan saat menghapus video. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      }
    }
  };

  const clearVideoSelection = () => {
    setSelectedVideo(null);
    setEditingVideoIndex(null);
  };

  // Function to edit course
  const handleEditCourse = async () => {
    if (!courseId) return;

    try {
      setIsSubmitting(true);

      // Get form data from the FormCourse component inputs
      const nameInput = document.querySelector(
        'input[name="name"]',
      ) as HTMLInputElement;
      const slugInput = document.querySelector(
        'input[name="slug"]',
      ) as HTMLInputElement;
      const shortDescriptionInput = document.querySelector(
        'input[name="short_description"]',
      ) as HTMLInputElement;
      const descriptionInput = document.querySelector(
        'input[name="description"]',
      ) as HTMLInputElement;

      if (
        !nameInput ||
        !slugInput ||
        !shortDescriptionInput ||
        !descriptionInput
      ) {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Form fields tidak ditemukan",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Validate required fields
      if (
        !nameInput.value.trim() ||
        !slugInput.value.trim() ||
        !shortDescriptionInput.value.trim()
      ) {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Semua field wajib diisi",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Check if slug already exists (excluding current course)
      console.log("🔍 Validating course slug:", {
        slug: slugInput.value.trim(),
        courseId: courseId || "NEW_COURSE",
        timestamp: new Date().toISOString(),
      });

      const slugExists = await checkCourseSlugExists(
        slugInput.value.trim(),
        courseId || undefined,
      );

      console.log("📊 Slug validation result:", {
        slug: slugInput.value.trim(),
        exists: slugExists.exists,
        error: slugExists.error,
        existingCourses: slugExists.courses || [],
        count: slugExists.courses?.length || 0,
      });

      if (slugExists.error) {
        console.error("❌ Error validating slug:", slugExists.error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi slug. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (slugExists.exists) {
        // Get existing course details for better user feedback
        const existingCourses = slugExists.courses || [];
        const courseNames = existingCourses.map((c) => c.judul).join(", ");

        console.log("⚠️ Slug conflict detected:", {
          requestedSlug: slugInput.value.trim(),
          conflictingCourses: existingCourses,
          courseNames: courseNames,
          timestamp: new Date().toISOString(),
        });

        setAlertConfig({
          type: "warning",
          title: "Slug Sudah Ada",
          message: `Slug "${slugInput.value.trim()}" sudah digunakan oleh course: ${courseNames}. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      console.log("✅ Slug validation passed:", {
        slug: slugInput.value.trim(),
        timestamp: new Date().toISOString(),
      });

      // Check if title already exists (excluding current course)
      console.log("🔍 Validating course title:", {
        title: nameInput.value.trim(),
        courseId: courseId || "NEW_COURSE",
        timestamp: new Date().toISOString(),
      });

      const titleExists = await checkCourseTitleExists(
        nameInput.value.trim(),
        courseId || undefined,
      );

      console.log("📊 Title validation result:", {
        title: nameInput.value.trim(),
        exists: titleExists.exists,
        error: titleExists.error,
        existingCourses: titleExists.courses || [],
        count: titleExists.courses?.length || 0,
      });

      if (titleExists.error) {
        console.error("❌ Error validating title:", titleExists.error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memvalidasi judul. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }
      if (titleExists.exists) {
        // Get existing course details for better user feedback
        const existingCourses = titleExists.courses || [];
        const courseSlugs = existingCourses.map((c) => c.slug).join(", ");

        console.log("⚠️ Title conflict detected:", {
          requestedTitle: nameInput.value.trim(),
          conflictingCourses: existingCourses,
          courseSlugs: courseSlugs,
          timestamp: new Date().toISOString(),
        });

        setAlertConfig({
          type: "warning",
          title: "Judul Sudah Ada",
          message: `Judul "${nameInput.value.trim()}" sudah digunakan oleh course dengan slug: ${courseSlugs}. Silakan gunakan judul yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      console.log("✅ Title validation passed:", {
        title: nameInput.value.trim(),
        timestamp: new Date().toISOString(),
      });

      // Get current thumbnail URL to check if we need to delete old one
      const currentThumbnailUrl = coursePreviewData.thumbnail_url;

      // Upload thumbnail first if a new file is selected
      let finalThumbnailUrl = coursePreviewData.thumbnail_url;
      if (uploadImageFunction) {
        try {
          finalThumbnailUrl = await uploadImageFunction();
        } catch (uploadError) {
          console.error("❌ Error uploading thumbnail:", uploadError);
          setAlertConfig({
            type: "error",
            title: "Error",
            message: `Gagal mengupload gambar: ${uploadError}`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
          return;
        }
      }

      // Delete old thumbnail if it's different from the new one and not default
      if (currentThumbnailUrl && currentThumbnailUrl !== finalThumbnailUrl) {
        await deleteOldThumbnail(currentThumbnailUrl);
      }

      // Prepare course data for insert
      const courseDataForInsert = {
        judul: nameInput.value.trim(),
        slug: slugInput.value.trim(),
        short_deskripsi: shortDescriptionInput.value.trim(),
        deskripsi: descriptionInput.value.trim(),
        thumbnail_url: getDefaultThumbnail(finalThumbnailUrl),
      };

      console.log("📝 Creating course with data:", courseDataForInsert);

      // Insert course into database
      const { data: newCourse, error: insertError } = await supabase
        .from("courses")
        .insert([courseDataForInsert])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error creating course:", insertError);
        console.error("Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        });
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal membuat course: ${insertError.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: `Course berhasil dibuat dengan ID: ${newCourse.id}! Sekarang Anda bisa mengedit course atau menambahkan video.`,
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);

      // Set course as created and store course ID AFTER successful database insertion
      setCourseCreated(true);
      setCourseId(newCourse.id);

      // Log success for debugging
      console.log("✅ Course successfully created in database:", {
        courseId: newCourse.id,
        courseData: newCourse,
        timestamp: new Date().toISOString(),
      });

      // Verify data is actually saved by fetching it back from database
      console.log("🔍 Verifying data in database...");
      const { data: verifiedCourse, error: verifyError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", newCourse.id)
        .single();

      if (verifyError) {
        console.warn("⚠️ Warning: Could not verify course data:", verifyError);
      } else {
        console.log("✅ Data verification successful:", verifiedCourse);
      }

      // Insert videos if any
      if (videos.length > 0) {
        console.log("📹 Inserting videos to database...");

        // Validate all videos before inserting to prevent duplicates
        for (const video of videos) {
          console.log("🔍 Validating video:", {
            videoTitle: video.title || video.judul,
            videoSlug:
              video.slug || generateVideoSlug(video.title || video.judul || ""),
            courseId: newCourse.id,
            timestamp: new Date().toISOString(),
          });

          // Check if video slug already exists in the same course
          const videoSlug =
            video.slug || generateVideoSlug(video.title || video.judul || "");
          const slugExists = await checkVideoSlugExistsInCourse(
            videoSlug,
            newCourse.id,
          );

          console.log("📊 Video slug validation result:", {
            videoSlug: videoSlug,
            exists: slugExists.exists,
            error: slugExists.error,
            existingVideos: slugExists.videos || [],
            count: slugExists.videos?.length || 0,
          });

          if (slugExists.error) {
            console.error("❌ Error validating video slug:", slugExists.error);
            setAlertConfig({
              type: "error",
              title: "Error",
              message: `Gagal memvalidasi slug video "${video.title || video.judul}". Silakan coba lagi.`,
              onConfirm: () => setShowAlert(false),
            });
            setShowAlert(true);
            return;
          }
          if (slugExists.exists) {
            console.log("⚠️ Video slug conflict detected:", {
              requestedSlug: videoSlug,
              conflictingVideos: slugExists.videos || [],
              timestamp: new Date().toISOString(),
            });

            setAlertConfig({
              type: "warning",
              title: "Slug Video Sudah Ada",
              message: `Slug "${videoSlug}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
              onConfirm: () => setShowAlert(false),
            });
            setShowAlert(true);
            return;
          }

          console.log("✅ Video slug validation passed:", {
            videoSlug: videoSlug,
            timestamp: new Date().toISOString(),
          });

          // Check if video title already exists in the same course
          const titleExists = await checkVideoTitleExistsInCourse(
            video.title || video.judul || "",
            newCourse.id,
          );

          console.log("📊 Video title validation result:", {
            videoTitle: video.title || video.judul || "",
            exists: titleExists.exists,
            error: titleExists.error,
            existingVideos: titleExists.videos || [],
            count: titleExists.videos?.length || 0,
          });

          if (titleExists.error) {
            console.error(
              "❌ Error validating video title:",
              titleExists.error,
            );
            setAlertConfig({
              type: "error",
              title: "Error",
              message: `Gagal memvalidasi judul video "${video.title || video.judul}". Silakan coba lagi.`,
              onConfirm: () => setShowAlert(false),
            });
            setShowAlert(true);
            return;
          }
          if (titleExists.exists) {
            console.log("⚠️ Video title conflict detected:", {
              requestedTitle: video.title || video.judul,
              conflictingVideos: titleExists.videos || [],
              timestamp: new Date().toISOString(),
            });

            setAlertConfig({
              type: "warning",
              title: "Judul Video Sudah Ada",
              message: `Judul "${video.title || video.judul}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan judul yang berbeda.`,
              onConfirm: () => setShowAlert(false),
            });
            setShowAlert(true);
            return;
          }

          console.log("✅ Video title validation passed:", {
            videoTitle: video.title || video.judul,
            timestamp: new Date().toISOString(),
          });
        }

        const videoData = videos.map((video, index) => ({
          courses_id: newCourse.id, // Use newCourse.id since it's available in this context
          judul: video.title || video.judul || "",
          durasi: video.duration || video.durasi || "",
          no_urut: video.order_index, // Use correct field name
          konten: video.description || video.deskripsi || "", // Use konten field
          link: video.youtube_url || "", // Use correct field name
        }));

        console.log("📹 Video data to insert:", videoData);

        const { data: insertedVideos, error: videoError } = await supabase
          .from("sub_pembelajaran")
          .insert(videoData)
          .select();

        if (videoError) {
          console.error("❌ Error creating videos:", videoError);
          setAlertConfig({
            type: "warning",
            title: "Peringatan",
            message:
              "Course berhasil dibuat, tetapi ada masalah dengan video. Silakan tambahkan video nanti.",
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
        } else {
          console.log("✅ Videos successfully inserted:", insertedVideos);

          // Verify videos are actually saved by fetching them back
          console.log("🔍 Verifying videos in database...");
          const { data: verifiedVideos, error: verifyVideoError } =
            await supabase
              .from("sub_pembelajaran")
              .select("*")
              .eq("courses_id", newCourse.id);

          if (verifyVideoError) {
            console.warn(
              "⚠️ Warning: Could not verify video data:",
              verifyVideoError,
            );
          } else {
            console.log("✅ Video verification successful:", verifiedVideos);
          }

          setAlertConfig({
            type: "success",
            title: "Berhasil Lengkap!",
            message: `Course dan ${insertedVideos?.length || videos.length} video berhasil dibuat!`,
            onConfirm: () => setShowAlert(false),
          });
          setShowAlert(true);
        }
      } else {
        console.log("ℹ️ No videos to insert");
      }
    } catch (error) {
      console.error("❌ Error creating course:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to start editing course
  const startEditCourse = () => {
    setIsEditingCourse(true);
    setOriginalCourseData({ ...coursePreviewData });
  };

  // Function to cancel editing course
  const cancelEditCourse = () => {
    setIsEditingCourse(false);
    // Restore original data
    if (originalCourseData) {
      setCoursePreviewData(originalCourseData);
    }
  };

  // Function to update course preview data
  const handleCourseDataChange = (field: string, value: string) => {
    // Special handling for name field to auto-generate slug
    if (field === "name") {
      const slug = generateCourseSlug(value);
      setCourseSlug(slug);

      setCoursePreviewData((prev) => ({
        ...prev,
        [field]: value,
        slug: slug,
      }));
    } else {
      setCoursePreviewData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Function to check if course data is complete
  const isCourseDataComplete = () => {
    return (
      coursePreviewData.name.trim() &&
      coursePreviewData.short_description.trim() &&
      coursePreviewData.description.trim()
    );
  };

  // Real-time preview update using polling
  useEffect(() => {
    const updatePreviewData = () => {
      const nameInput = document.querySelector(
        'input[name="name"]',
      ) as HTMLInputElement;
      const shortDescInput = document.querySelector(
        'input[name="short_description"]',
      ) as HTMLInputElement;
      const descInput = document.querySelector(
        'input[name="description"]',
      ) as HTMLInputElement;
      const slugInput = document.querySelector(
        'input[name="slug"]',
      ) as HTMLInputElement;

      if (nameInput && shortDescInput && descInput && slugInput) {
        const title = nameInput.value || "";
        const slug = title ? generateCourseSlug(title) : "";

        // Update course slug state
        setCourseSlug(slug);

        const newData = {
          name: title,
          short_description: shortDescInput.value || "",
          description: descInput.value || "",
          slug: slug,
          thumbnail_url: coursePreviewData.thumbnail_url || "",
        };

        // Only update if data has changed
        if (JSON.stringify(newData) !== JSON.stringify(coursePreviewData)) {
          setCoursePreviewData(newData);
        }
      }
    };

    // Update immediately
    updatePreviewData();

    // Set up interval for real-time updates
    const interval = setInterval(updatePreviewData, 300); // Update every 300ms for better responsiveness

    return () => clearInterval(interval);
  }, [coursePreviewData.thumbnail_url]); // Only re-run when thumbnail changes

  // Load existing videos from database when course is created
  useEffect(() => {
    if (courseId && courseCreated) {
      loadExistingVideos();
    }
  }, [courseId, courseCreated]);

  // Function to load existing videos from database
  const loadExistingVideos = async () => {
    if (!courseId) return;

    try {
      console.log("📹 Loading existing videos for course ID:", courseId);

      const { data: existingVideos, error: loadError } = await supabase
        .from("sub_pembelajaran")
        .select("*")
        .eq("courses_id", courseId)
        .order("no_urut", { ascending: true });

      if (loadError) {
        console.error("❌ Error loading existing videos:", loadError);
        return;
      }

      if (existingVideos && existingVideos.length > 0) {
        // Convert database format to local format
        const convertedVideos = existingVideos.map((video) => ({
          id: video.id,
          title: video.judul,
          judul: video.judul,
          slug: video.slug,
          duration: video.durasi,
          durasi: video.durasi,
          order_index: video.no_urut,
          description: video.konten, // Map konten to description
          deskripsi: video.konten,
          youtube_url: video.link,
        }));

        console.log("✅ Loaded existing videos:", convertedVideos);
        setVideos(convertedVideos);
      } else {
        console.log("ℹ️ No existing videos found for this course");
      }
    } catch (error) {
      console.error("❌ Error loading existing videos:", error);
    }
  };

  // Function to refresh videos from database
  const refreshVideosFromDatabase = async () => {
    if (!courseId) return;

    try {
      console.log(
        "🔄 Refreshing videos from database for course ID:",
        courseId,
      );

      const { data: freshVideos, error: refreshError } = await supabase
        .from("sub_pembelajaran")
        .select("*")
        .eq("courses_id", courseId)
        .order("no_urut", { ascending: true });

      if (refreshError) {
        console.error("❌ Error refreshing videos:", refreshError);
        return;
      }

      if (freshVideos && freshVideos.length > 0) {
        // Convert database format to local format
        const convertedVideos = freshVideos.map((video) => ({
          id: video.id,
          title: video.judul,
          judul: video.judul,
          slug: video.slug,
          duration: video.durasi,
          durasi: video.durasi,
          order_index: video.no_urut,
          description: video.konten,
          deskripsi: video.konten,
          youtube_url: video.link,
        }));

        console.log("✅ Refreshed videos from database:", convertedVideos);
        setVideos(convertedVideos);
      } else {
        console.log("ℹ️ No videos found in database");
        setVideos([]);
      }
    } catch (error) {
      console.error("❌ Error refreshing videos:", error);
    }
  };

  // Function to get video details by ID
  const getVideoDetailsById = async (videoId: number | string) => {
    if (!videoId) return null;

    try {
      console.log("🔍 Getting video details for ID:", videoId);

      const { data: video, error: getError } = await supabase
        .from("sub_pembelajaran")
        .select("*")
        .eq("id", videoId)
        .single();

      if (getError) {
        console.error("❌ Error getting video details:", getError);
        return null;
      }

      if (video) {
        // Convert database format to local format
        const convertedVideo = {
          id: video.id,
          title: video.judul,
          judul: video.judul,
          slug: video.slug,
          duration: video.durasi,
          durasi: video.durasi,
          order_index: video.no_urut,
          description: video.konten,
          deskripsi: video.konten,
          youtube_url: video.link,
        };

        console.log("✅ Video details retrieved:", convertedVideo);
        return convertedVideo;
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting video details:", error);
      return null;
    }
  };

  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedVideoIndex(index);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };

  // Function to handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Function to handle drop
  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedVideoIndex === null || draggedVideoIndex === dropIndex) {
      setIsDragging(false);
      setDraggedVideoIndex(null);
      return;
    }

    try {
      // Reorder videos in local state
      const newVideos = [...videos];
      const draggedVideo = newVideos[draggedVideoIndex];

      // Remove dragged video from original position
      newVideos.splice(draggedVideoIndex, 1);

      // Insert at new position
      newVideos.splice(dropIndex, 0, draggedVideo);

      // Update order_index for all videos
      const updatedVideos = newVideos.map((video, index) => ({
        ...video,
        order_index: index + 1,
      }));

      setVideos(updatedVideos);

      // Update order in database for all videos
      await updateVideoOrderInDatabase(updatedVideos);

      console.log("✅ Video order updated successfully");

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Urutan video berhasil diubah!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("❌ Error updating video order:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Gagal mengubah urutan video. Silakan coba lagi.",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } finally {
      setIsDragging(false);
      setDraggedVideoIndex(null);
    }
  };

  // Function to update video order in database
  const updateVideoOrderInDatabase = async (updatedVideos: Video[]) => {
    if (!courseId) return;

    try {
      // Update each video's order in database
      for (const video of updatedVideos) {
        if (video.id) {
          const { error: updateError } = await supabase
            .from("sub_pembelajaran")
            .update({ no_urut: video.order_index })
            .eq("id", video.id);

          if (updateError) {
            console.error(
              `❌ Error updating video ${video.id} order:`,
              updateError,
            );
            throw updateError;
          }
        }
      }

      console.log("✅ All video orders updated in database");
    } catch (error) {
      console.error("❌ Error updating video orders in database:", error);
      throw error;
    }
  };

  // Function to auto-assign order index for new videos
  const getNextOrderIndex = () => {
    if (videos.length === 0) return 1;
    return Math.max(...videos.map((v) => v.order_index)) + 1;
  };

  // Function to check if course slug already exists
  const checkCourseSlugExists = async (slug: string, excludeId?: number) => {
    try {
      let query = supabase.from("courses").select("id, judul").eq("slug", slug);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data: existingCourses, error } = await query;

      if (error) {
        console.error("❌ Error checking course slug:", error);
        return { exists: false, error: true };
      }

      return {
        exists: existingCourses && existingCourses.length > 0,
        courses: existingCourses || [],
        error: false,
      };
    } catch (error) {
      console.error("❌ Error checking course slug:", error);
      return { exists: false, error: true };
    }
  };

  // Function to check if course title already exists
  const checkCourseTitleExists = async (title: string, excludeId?: number) => {
    try {
      let query = supabase
        .from("courses")
        .select("id, slug")
        .eq("judul", title);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data: existingCourses, error } = await query;

      if (error) {
        console.error("❌ Error checking course title:", error);
        return { exists: false, error: true };
      }

      return {
        exists: existingCourses && existingCourses.length > 0,
        courses: existingCourses || [],
        error: false,
      };
    } catch (error) {
      console.error("❌ Error checking course title:", error);
      return { exists: false, error: true };
    }
  };

  // Function to check if video slug already exists in the same course
  const checkVideoSlugExistsInCourse = async (
    slug: string,
    courseId: number,
    excludeId?: number,
  ) => {
    try {
      let query = supabase
        .from("sub_pembelajaran")
        .select("id, judul")
        .eq("courses_id", courseId)
        .eq("slug", slug);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data: existingVideos, error } = await query;

      if (error) {
        console.error("❌ Error checking video slug in course:", error);
        return { exists: false, error: true };
      }

      return {
        exists: existingVideos && existingVideos.length > 0,
        videos: existingVideos || [],
        error: false,
      };
    } catch (error) {
      console.error("❌ Error checking video slug in course:", error);
      return { exists: false, error: true };
    }
  };

  // Function to check if video title already exists in the same course
  const checkVideoTitleExistsInCourse = async (
    title: string,
    courseId: number,
    excludeId?: number,
  ) => {
    try {
      let query = supabase
        .from("sub_pembelajaran")
        .select("id, slug")
        .eq("courses_id", courseId)
        .eq("judul", title);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data: existingVideos, error } = await query;

      if (error) {
        console.error("❌ Error checking video title in course:", error);
        return { exists: false, error: true };
      }

      return {
        exists: existingVideos && existingVideos.length > 0,
        videos: existingVideos || [],
        error: false,
      };
    } catch (error) {
      console.error("❌ Error checking video title in course:", error);
      return { exists: false, error: true };
    }
  };

  // Function to generate course slug from title
  const generateCourseSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Function to generate video slug from title
  const generateVideoSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Function to handle course title change and auto-generate slug
  const handleCourseTitleChange = (title: string) => {
    const slug = generateCourseSlug(title);
    setCourseSlug(slug);

    // Update course preview data with new slug
    setCoursePreviewData((prev) => ({
      ...prev,
      name: title,
      judul: title,
      slug: slug,
    }));
  };

  // Function to handle course slug change (read-only, but can be manually overridden)
  const handleCourseSlugChange = (slug: string) => {
    setCourseSlug(slug);

    // Update course preview data with new slug
    setCoursePreviewData((prev) => ({
      ...prev,
      slug: slug,
    }));
  };

  // Function to handle video title change and auto-generate slug
  const handleVideoTitleChange = (title: string) => {
    const slug = generateVideoSlug(title);
    setVideoSlug(slug);

    if (editingVideoData) {
      setEditingVideoData({
        ...editingVideoData,
        title: title,
        judul: title,
        slug: slug,
      });
    }
  };

  // Function to show video detail
  const showVideoDetailById = async (videoId: number | string) => {
    if (!videoId) return;

    try {
      const videoDetails = await getVideoDetailsById(videoId);
      if (videoDetails) {
        setSelectedVideoForDetail(videoDetails);
        setShowVideoDetail(true);
      } else {
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Video tidak ditemukan di database",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error("❌ Error showing video detail:", error);
    }
  };

  // Function to close video detail
  const closeVideoDetail = () => {
    setShowVideoDetail(false);
    setSelectedVideoForDetail(null);
  };

  // Real-time video list update effect
  useEffect(() => {
    if (courseId && courseCreated) {
      // Set up interval for real-time updates
      const interval = setInterval(() => {
        refreshVideosFromDatabase();
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [courseId, courseCreated]);

  // Real-time video preview update effect
  useEffect(() => {
    const updatePreviewData = () => {
      const titleInput = document.getElementById(
        "new-video-title",
      ) as HTMLInputElement;
      const durationInput = document.getElementById(
        "new-video-duration",
      ) as HTMLInputElement;
      const youtubeUrlInput = document.getElementById(
        "new-video-youtube-url",
      ) as HTMLInputElement;

      if (titleInput && durationInput && youtubeUrlInput) {
        const newPreviewData = {
          title: titleInput.value || "",
          duration: durationInput.value || "",
          description: videoPreviewData.description || "",
          youtube_url: youtubeUrlInput.value || "",
        };

        // Only update if data has changed
        if (
          JSON.stringify(newPreviewData) !== JSON.stringify(videoPreviewData)
        ) {
          setVideoPreviewData(newPreviewData);
        }
      }
    };

    // Update immediately
    updatePreviewData();

    // Set up interval for real-time updates
    const interval = setInterval(updatePreviewData, 300); // Update every 300ms

    return () => clearInterval(interval);
  }, [videoPreviewData.description, videoPreviewData.youtube_url]); // Only re-run when description or youtube_url changes

  // Function to get course by slug
  const getCourseBySlug = async (slug: string) => {
    try {
      console.log("🔍 Getting course by slug:", {
        slug: slug,
        timestamp: new Date().toISOString(),
      });

      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("slug", slug)
        .single();

      console.log("📊 Get course by slug result:", {
        slug: slug,
        query: `SELECT * FROM courses WHERE slug = '${slug}'`,
        result: course,
        error: error,
        found: !!course,
      });

      if (error) {
        console.error("❌ Error getting course by slug:", error);
        return { course: null, error: true };
      }

      return {
        course: course,
        error: false,
      };
    } catch (error) {
      console.error("❌ Error getting course by slug:", error);
      return { course: null, error: true };
    }
  };

  // Function to get course by title
  const getCourseByTitle = async (title: string) => {
    try {
      console.log("🔍 Getting course by title:", {
        title: title,
        timestamp: new Date().toISOString(),
      });

      const { data: course, error } = await supabase
        .from("courses")
        .select("*")
        .eq("judul", title)
        .single();

      console.log("📊 Get course by title result:", {
        title: title,
        query: `SELECT * FROM courses WHERE judul = '${title}'`,
        result: course,
        error: error,
        found: !!course,
      });

      if (error) {
        console.error("❌ Error getting course by title:", error);
        return { course: null, error: true };
      }

      return {
        course: course,
        error: false,
      };
    } catch (error) {
      console.error("❌ Error getting course by title:", error);
      return { course: null, error: true };
    }
  };

  // Function to search courses by slug pattern
  const searchCoursesBySlug = async (slugPattern: string) => {
    try {
      console.log("🔍 Searching courses by slug pattern:", {
        slugPattern: slugPattern,
        timestamp: new Date().toISOString(),
      });

      const { data: courses, error } = await supabase
        .from("courses")
        .select("id, judul, slug, short_deskripsi, thumbnail, created_at")
        .ilike("slug", `%${slugPattern}%`)
        .order("created_at", { ascending: false });

      console.log("📊 Search courses by slug pattern result:", {
        slugPattern: slugPattern,
        query: `SELECT id, judul, slug, short_deskripsi, thumbnail, created_at FROM courses WHERE slug ILIKE '%${slugPattern}%' ORDER BY created_at DESC`,
        result: courses,
        error: error,
        count: courses?.length || 0,
      });

      if (error) {
        console.error("❌ Error searching courses by slug pattern:", error);
        return { courses: [], error: true };
      }

      return {
        courses: courses || [],
        error: false,
      };
    } catch (error) {
      console.error("❌ Error searching courses by slug pattern:", error);
      return { courses: [], error: true };
    }
  };

  // Function to get all courses with pagination
  const getAllCourses = async (page: number = 1, limit: number = 10) => {
    try {
      const offset = (page - 1) * limit;

      console.log("🔍 Getting all courses with pagination:", {
        page: page,
        limit: limit,
        offset: offset,
        timestamp: new Date().toISOString(),
      });

      const {
        data: courses,
        error,
        count,
      } = await supabase
        .from("courses")
        .select("id, judul, slug, short_deskripsi, thumbnail_url, created_at", {
          count: "exact",
        })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      console.log("📊 Get all courses result:", {
        page: page,
        limit: limit,
        offset: offset,
        query: `SELECT id, judul, slug, short_deskripsi, thumbnail_url, created_at FROM courses ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
        result: courses,
        error: error,
        count: count,
        returnedCount: courses?.length || 0,
      });

      if (error) {
        console.error("❌ Error getting all courses:", error);
        return { courses: [], error: true, count: 0 };
      }

      return {
        courses: courses || [],
        error: false,
        count: count || 0,
      };
    } catch (error) {
      console.error("❌ Error getting all courses:", error);
      return { courses: [], error: true, count: 0 };
    }
  };

  // Function to delete old thumbnail file (except default.jpg)
  const deleteOldThumbnail = async (thumbnailUrl: string) => {
    try {
      // Don't delete if it's the default image
      if (thumbnailUrl === "/terapi/default.jpg") {
        console.log("🛡️ Skipping deletion of default thumbnail:", thumbnailUrl);
        return;
      }

      // Extract filename from URL
      const filename = thumbnailUrl.split("/").pop();
      if (!filename) {
        console.log("⚠️ No filename found in thumbnail URL:", thumbnailUrl);
        return;
      }

      console.log("🗑️ Deleting old thumbnail:", filename);

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from("terapi")
        .remove([filename]);

      if (deleteError) {
        console.error("❌ Error deleting old thumbnail:", deleteError);
      } else {
        console.log("✅ Old thumbnail deleted successfully:", filename);
      }
    } catch (error) {
      console.error("❌ Error in deleteOldThumbnail:", error);
    }
  };

  // Function to set default thumbnail if none provided
  const getDefaultThumbnail = (thumbnailUrl?: string) => {
    if (!thumbnailUrl || thumbnailUrl.trim() === "") {
      return "/terapi/default.jpg";
    }
    return thumbnailUrl;
  };

  // Function to delete course and all related data
  const handleDeleteCourse = async () => {
    if (!courseId) return;

    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus course "${coursePreviewData.name}"?`,
      )
    ) {
      return;
    }

    try {
      console.log("🗑️ Deleting course and all related data...");

      // Get course data first to check thumbnail
      const { data: courseData, error: fetchError } = await supabase
        .from("courses")
        .select("thumbnail_url")
        .eq("id", courseId)
        .single();

      if (fetchError) {
        console.error("❌ Error fetching course data:", fetchError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memuat data course",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Delete all videos in this course first
      const { error: deleteVideosError } = await supabase
        .from("sub_pembelajaran")
        .delete()
        .eq("courses_id", courseId);

      if (deleteVideosError) {
        console.error("❌ Error deleting videos:", deleteVideosError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal menghapus video terkait",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      console.log("✅ All videos deleted successfully");

      // Delete course from database
      const { error: deleteCourseError } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (deleteCourseError) {
        console.error("❌ Error deleting course:", deleteCourseError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal menghapus course",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Delete course thumbnail if it exists and not default
      if (
        courseData.thumbnail_url &&
        courseData.thumbnail_url !== "/terapi/default.jpg"
      ) {
        try {
          // Extract filename from URL
          const filename = courseData.thumbnail_url.split("/").pop();
          if (filename) {
            console.log("🗑️ Deleting course thumbnail:", filename);

            // Delete from storage
            const { error: deleteError } = await supabase.storage
              .from("terapi")
              .remove([filename]);

            if (deleteError) {
              console.error("❌ Error deleting course thumbnail:", deleteError);
            } else {
              console.log(
                "✅ Course thumbnail deleted successfully:",
                filename,
              );
            }
          }
        } catch (error) {
          console.error("❌ Error deleting course thumbnail:", error);
        }
      }

      console.log("✅ Course and all related data deleted successfully");

      // Reset state
      setCourseCreated(false);
      setCourseId(null);
      setVideos([]);
      setCoursePreviewData({
        name: "",
        description: "",
        short_description: "",
        slug: "",
        thumbnail_url: "",
      });

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Course dan semua video terkait berhasil dihapus!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("❌ Error deleting course:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menghapus course",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout
        title="Tambah Course Baru"
        subtitle="Buat course baru dengan video pembelajaran"
      >
        {/* Alert Component */}
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          show={showAlert}
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setShowAlert(false)}
          confirmText="OK"
          cancelText="Batal"
        />

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

        {/* View Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Pilih Mode:</h3>
            <div className="flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconEye size={16} />
                Preview Course
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!courseCreated || !courseId) {
                    setAlertConfig({
                      type: "warning",
                      title: "Course Belum Dibuat",
                      message:
                        "Harap simpan course terlebih dahulu dengan klik tombol 'Buat Course' sebelum menambahkan video",
                      onConfirm: () => setShowAlert(false),
                    });
                    setShowAlert(true);
                    return;
                  }
                  setViewMode("video");
                }}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "video"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconVideo size={16} />
                Tambah Video
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form Course */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconPlus className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-700">
                  {courseCreated ? "Edit Course" : "Tambah Course Baru"}
                </h2>
              </div>
              {courseCreated && (
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                    ✓ Course Tersimpan
                  </div>
                  {courseId && (
                    <span className="text-xs text-gray-500">
                      ID: {courseId}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              <FormCourse
                mode="add"
                noForm={true}
                onImageUpload={(url) => {
                  setUploadedThumbnailUrl(url);
                  handleCourseDataChange("thumbnail_url", url);
                }}
                onUploadFunction={useCallback(
                  (uploadFn: () => Promise<string>) =>
                    setUploadImageFunction(() => uploadFn),
                  [],
                )}
              />

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    if (courseCreated && !isEditingCourse) {
                      // If course already exists and not in edit mode, start editing
                      startEditCourse();
                      return;
                    }

                    if (isEditingCourse) {
                      // If in edit mode, update the course
                      await handleEditCourse();
                      return;
                    }

                    setIsSubmitting(true);

                    try {
                      // Upload image first if a new file is selected
                      let finalThumbnailUrl = uploadedThumbnailUrl;
                      if (uploadImageFunction) {
                        try {
                          finalThumbnailUrl = await uploadImageFunction();
                        } catch (uploadError) {
                          setAlertConfig({
                            type: "error",
                            title: "Error",
                            message: `Gagal mengupload gambar: ${uploadError}`,
                            onConfirm: () => setShowAlert(false),
                          });
                          setShowAlert(true);
                          return;
                        }
                      }

                      // Get form data from the FormCourse component inputs
                      const nameInput = document.querySelector(
                        'input[name="name"]',
                      ) as HTMLInputElement;
                      const slugInput = document.querySelector(
                        'input[name="slug"]',
                      ) as HTMLInputElement;
                      const shortDescriptionInput = document.querySelector(
                        'input[name="short_description"]',
                      ) as HTMLInputElement;
                      const descriptionInput = document.querySelector(
                        'input[name="description"]',
                      ) as HTMLInputElement;

                      if (
                        !nameInput ||
                        !slugInput ||
                        !shortDescriptionInput ||
                        !descriptionInput
                      ) {
                        setAlertConfig({
                          type: "error",
                          title: "Error",
                          message: "Form fields tidak ditemukan",
                          onConfirm: () => setShowAlert(false),
                        });
                        setShowAlert(true);
                        return;
                      }

                      // Validate required fields
                      if (
                        !nameInput.value.trim() ||
                        !slugInput.value.trim() ||
                        !shortDescriptionInput.value.trim()
                      ) {
                        setAlertConfig({
                          type: "error",
                          title: "Error",
                          message: "Semua field wajib diisi",
                          onConfirm: () => setShowAlert(false),
                        });
                        setShowAlert(true);
                        return;
                      }

                      const courseData = {
                        judul: nameInput.value,
                        slug: slugInput.value,
                        short_deskripsi: shortDescriptionInput.value,
                        deskripsi: descriptionInput.value,
                        thumbnail: getDefaultThumbnail(finalThumbnailUrl),
                      };

                      // Validate course data before inserting
                      console.log("📋 Course data to insert:", courseData);

                      // Check if all required fields are filled
                      if (
                        !courseData.judul.trim() ||
                        !courseData.slug.trim() ||
                        !courseData.short_deskripsi.trim()
                      ) {
                        setAlertConfig({
                          type: "error",
                          title: "Data Tidak Lengkap",
                          message:
                            "Nama course, slug, dan deskripsi singkat wajib diisi",
                          onConfirm: () => setShowAlert(false),
                        });
                        setShowAlert(true);
                        return;
                      }

                      // Check Supabase connection
                      console.log("🔗 Checking Supabase connection...");
                      console.log(
                        "Supabase URL:",
                        import.meta.env.VITE_SUPABASE_URL,
                      );
                      console.log(
                        "Supabase Anon Key exists:",
                        !!import.meta.env.VITE_SUPABASE_ANON_KEY,
                      );

                      if (
                        !import.meta.env.VITE_SUPABASE_URL ||
                        !import.meta.env.VITE_SUPABASE_ANON_KEY
                      ) {
                        setAlertConfig({
                          type: "error",
                          title: "Konfigurasi Error",
                          message:
                            "Konfigurasi Supabase tidak lengkap. Silakan cek environment variables.",
                          onConfirm: () => setShowAlert(false),
                        });
                        setShowAlert(true);
                        return;
                      }

                      // Update preview data
                      setCoursePreviewData({
                        name: nameInput.value,
                        slug: slugInput.value,
                        short_description: shortDescriptionInput.value,
                        description: descriptionInput.value,
                        thumbnail_url: finalThumbnailUrl,
                      });

                      console.log("Course data to insert:", courseData);

                      // Check if Supabase client is properly configured
                      console.log(
                        "Supabase URL:",
                        import.meta.env.VITE_SUPABASE_URL,
                      );
                      console.log(
                        "Supabase Anon Key exists:",
                        !!import.meta.env.VITE_SUPABASE_ANON_KEY,
                      );

                      // Insert course first
                      const { data: course, error: courseError } =
                        await supabase
                          .from("courses")
                          .insert([courseData])
                          .select()
                          .single();

                      if (courseError) {
                        console.error("Error creating course:", courseError);
                        console.error("Error details:", {
                          message: courseError.message,
                          details: courseError.details,
                          hint: courseError.hint,
                          code: courseError.code,
                        });
                        setAlertConfig({
                          type: "error",
                          title: "Error",
                          message: `Gagal membuat course: ${courseError.message}`,
                          onConfirm: () => setShowAlert(false),
                        });
                        setShowAlert(true);
                        return;
                      }

                      // Show success message
                      setAlertConfig({
                        type: "success",
                        title: "Berhasil!",
                        message: `Course berhasil dibuat dengan ID: ${course.id}! Sekarang Anda bisa mengedit course atau menambahkan video.`,
                        onConfirm: () => setShowAlert(false),
                      });
                      setShowAlert(true);

                      // Set course as created and store course ID AFTER successful database insertion
                      setCourseCreated(true);
                      setCourseId(course.id);

                      // Log success for debugging
                      console.log(
                        "✅ Course successfully created in database:",
                        {
                          courseId: course.id,
                          courseData: course,
                          timestamp: new Date().toISOString(),
                        },
                      );

                      // Verify data is actually saved by fetching it back from database
                      console.log("🔍 Verifying data in database...");
                      const { data: verifiedCourse, error: verifyError } =
                        await supabase
                          .from("courses")
                          .select("*")
                          .eq("id", course.id)
                          .single();

                      if (verifyError) {
                        console.warn(
                          "⚠️ Warning: Could not verify course data:",
                          verifyError,
                        );
                      } else {
                        console.log(
                          "✅ Data verification successful:",
                          verifiedCourse,
                        );
                      }

                      // Insert videos if any
                      if (videos.length > 0) {
                        console.log("📹 Inserting videos to database...");

                        // Validate all videos before inserting to prevent duplicates
                        for (const video of videos) {
                          console.log("🔍 Validating video:", {
                            videoTitle: video.title || video.judul,
                            videoSlug:
                              video.slug ||
                              generateVideoSlug(
                                video.title || video.judul || "",
                              ),
                            courseId: course.id,
                            timestamp: new Date().toISOString(),
                          });

                          // Check if video slug already exists in the same course
                          const videoSlug =
                            video.slug ||
                            generateVideoSlug(video.title || video.judul || "");
                          const slugExists = await checkVideoSlugExistsInCourse(
                            videoSlug,
                            course.id,
                          );

                          console.log("📊 Video slug validation result:", {
                            videoSlug: videoSlug,
                            exists: slugExists.exists,
                            error: slugExists.error,
                            existingVideos: slugExists.videos || [],
                            count: slugExists.videos?.length || 0,
                          });

                          if (slugExists.error) {
                            console.error(
                              "❌ Error validating video slug:",
                              slugExists.error,
                            );
                            setAlertConfig({
                              type: "error",
                              title: "Error",
                              message: `Gagal memvalidasi slug video "${video.title || video.judul}". Silakan coba lagi.`,
                              onConfirm: () => setShowAlert(false),
                            });
                            setShowAlert(true);
                            return;
                          }
                          if (slugExists.exists) {
                            console.log("⚠️ Video slug conflict detected:", {
                              requestedSlug: videoSlug,
                              conflictingVideos: slugExists.videos || [],
                              timestamp: new Date().toISOString(),
                            });

                            setAlertConfig({
                              type: "warning",
                              title: "Slug Video Sudah Ada",
                              message: `Slug "${videoSlug}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
                              onConfirm: () => setShowAlert(false),
                            });
                            setShowAlert(true);
                            return;
                          }

                          console.log("✅ Video slug validation passed:", {
                            videoSlug: videoSlug,
                            timestamp: new Date().toISOString(),
                          });

                          // Check if video title already exists in the same course
                          const titleExists =
                            await checkVideoTitleExistsInCourse(
                              video.title || video.judul || "",
                              course.id,
                            );

                          console.log("📊 Video title validation result:", {
                            videoTitle: video.title || video.judul || "",
                            exists: titleExists.exists,
                            error: titleExists.error,
                            existingVideos: titleExists.videos || [],
                            count: titleExists.videos?.length || 0,
                          });

                          if (titleExists.error) {
                            console.error(
                              "❌ Error validating video title:",
                              titleExists.error,
                            );
                            setAlertConfig({
                              type: "error",
                              title: "Error",
                              message: `Gagal memvalidasi judul video "${video.title || video.judul}". Silakan coba lagi.`,
                              onConfirm: () => setShowAlert(false),
                            });
                            setShowAlert(true);
                            return;
                          }
                          if (titleExists.exists) {
                            console.log("⚠️ Video title conflict detected:", {
                              requestedTitle: video.title || video.judul,
                              conflictingVideos: titleExists.videos || [],
                              timestamp: new Date().toISOString(),
                            });

                            setAlertConfig({
                              type: "warning",
                              title: "Judul Video Sudah Ada",
                              message: `Judul "${video.title || video.judul}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan judul yang berbeda.`,
                              onConfirm: () => setShowAlert(false),
                            });
                            setShowAlert(true);
                            return;
                          }

                          console.log("✅ Video title validation passed:", {
                            videoTitle: video.title || video.judul,
                            timestamp: new Date().toISOString(),
                          });
                        }

                        const videoData = videos.map((video, index) => ({
                          courses_id: courseId, // Use courseId since it's available in this context
                          judul: video.title || video.judul || "",
                          durasi: video.duration || video.durasi || "",
                          no_urut: video.order_index, // Use correct field name
                          konten: video.description || video.deskripsi || "", // Use konten field
                          link: video.youtube_url || "", // Use correct field name
                        }));

                        console.log("📹 Video data to insert:", videoData);

                        const { data: insertedVideos, error: videoError } =
                          await supabase
                            .from("sub_pembelajaran")
                            .insert(videoData)
                            .select();

                        if (videoError) {
                          console.error(
                            "❌ Error creating videos:",
                            videoError,
                          );
                          setAlertConfig({
                            type: "warning",
                            title: "Peringatan",
                            message:
                              "Course berhasil dibuat, tetapi ada masalah dengan video. Silakan tambahkan video nanti.",
                            onConfirm: () => setShowAlert(false),
                          });
                          setShowAlert(true);
                        } else {
                          console.log(
                            "✅ Videos successfully inserted:",
                            insertedVideos,
                          );

                          // Verify videos are actually saved by fetching them back
                          console.log("🔍 Verifying videos in database...");
                          const {
                            data: verifiedVideos,
                            error: verifyVideoError,
                          } = await supabase
                            .from("sub_pembelajaran")
                            .select("*")
                            .eq("courses_id", course.id);

                          if (verifyVideoError) {
                            console.warn(
                              "⚠️ Warning: Could not verify video data:",
                              verifyVideoError,
                            );
                          } else {
                            console.log(
                              "✅ Video verification successful:",
                              verifiedVideos,
                            );
                          }

                          setAlertConfig({
                            type: "success",
                            title: "Berhasil Lengkap!",
                            message: `Course dan ${insertedVideos?.length || videos.length} video berhasil dibuat!`,
                            onConfirm: () => setShowAlert(false),
                          });
                          setShowAlert(true);
                        }
                      } else {
                        console.log("ℹ️ No videos to insert");
                      }
                    } catch (error) {
                      console.error("❌ Error creating course:", error);
                      setAlertConfig({
                        type: "error",
                        title: "Error",
                        message: "Terjadi kesalahan. Silakan coba lagi.",
                        onConfirm: () => setShowAlert(false),
                      });
                      setShowAlert(true);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-400"
                      : isEditingCourse
                        ? "bg-orange-600 hover:bg-orange-700"
                        : courseCreated
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : isEditingCourse ? (
                    <>
                      <IconEdit size={16} />
                      Update Course
                    </>
                  ) : courseCreated ? (
                    <>
                      <IconEdit size={16} />
                      Edit Course
                    </>
                  ) : (
                    <>
                      <IconPlus size={16} />
                      Buat Course
                    </>
                  )}
                </button>

                {/* Cancel Edit Button */}
                {isEditingCourse && (
                  <button
                    type="button"
                    onClick={cancelEditCourse}
                    className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Batal Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Conditional based on view mode */}
          {viewMode === "preview" ? (
            // Course Preview Section
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconEye className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Preview Course
                  </h2>
                </div>
                {courseCreated && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      ✓ Course Tersimpan
                    </div>
                    {courseId && (
                      <span className="text-xs text-gray-500">
                        ID: {courseId}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Lihat bagaimana course akan ditampilkan
              </p>

              {isCourseDataComplete() ? (
                <div className="space-y-4">
                  {/* Course Status Info */}
                  {courseCreated && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <span className="text-xs text-white">✓</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800">
                            Course Berhasil Dibuat!
                          </h4>
                          <p className="text-sm text-green-600">
                            Course ID: {courseId} • Sekarang Anda bisa mengedit
                            course atau menambahkan video
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Course Thumbnail Preview */}
                  {coursePreviewData.thumbnail_url && (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <img
                        src={coursePreviewData.thumbnail_url}
                        alt="Course thumbnail"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Course Info Preview */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {coursePreviewData.name || "Nama Course"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Slug: /courses/{coursePreviewData.slug || "slug-course"}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700">
                        Deskripsi Singkat:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {coursePreviewData.short_description ||
                          "Deskripsi singkat course akan muncul di sini..."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700">
                        Deskripsi Lengkap:
                      </h4>
                      <div
                        className="prose prose-sm max-w-none text-sm text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html:
                            coursePreviewData.description ||
                            "<p>Deskripsi lengkap course akan muncul di sini...</p>",
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    {!courseCreated || !courseId ? (
                      <div className="space-y-3">
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                              <span className="text-xs text-white">!</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-yellow-800">
                                Course Belum Disimpan
                              </h4>
                              <p className="text-sm text-yellow-600">
                                Klik tombol "Buat Course" di sebelah kiri untuk
                                menyimpan course ke database terlebih dahulu
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Only allow if course is actually created in database
                            if (!courseCreated || !courseId) {
                              setAlertConfig({
                                type: "warning",
                                title: "Course Belum Dibuat",
                                message:
                                  "Harap simpan course terlebih dahulu dengan klik tombol 'Buat Course' sebelum menambahkan video",
                                onConfirm: () => setShowAlert(false),
                              });
                              setShowAlert(true);
                              return;
                            }
                            setViewMode("video");
                          }}
                          disabled={!courseCreated || !courseId}
                          className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            courseCreated && courseId
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "cursor-not-allowed bg-gray-300 text-gray-500"
                          }`}
                        >
                          {courseCreated && courseId
                            ? "Lanjut ke Tambah Video"
                            : "Simpan Course Dulu"}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setViewMode("video")}
                        className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                      >
                        Lanjut ke Tambah Video
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <IconBook className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <p className="text-sm">Belum ada data course</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Isi form course di sebelah kiri untuk melihat preview
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Video List Section
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconList className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Daftar Video
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {videos.length} video
                  </span>
                  {courseCreated && courseId && (
                    <button
                      onClick={refreshVideosFromDatabase}
                      className="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                      title="Refresh video list dari database"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh
                    </button>
                  )}
                  {courseCreated && courseId && (
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        ✓ Course Tersimpan
                      </div>
                      <span className="text-xs text-gray-500">
                        ID: {courseId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Kelola video pembelajaran dalam course ini
              </p>

              {/* Course Status Info for Video Mode */}
              {courseCreated && courseId ? (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Course Siap untuk Video
                      </h4>
                      <p className="text-sm text-blue-600">
                        Course ID: {courseId} • Silakan tambahkan video
                        pembelajaran untuk course ini
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                      <span className="text-xs text-white">!</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-800">
                        Course Belum Disimpan
                      </h4>
                      <p className="text-sm text-yellow-600">
                        Kembali ke mode Preview dan klik tombol "Buat Course"
                        untuk menyimpan course ke database terlebih dahulu
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Summary Info */}
              {courseCreated && courseId && videos.length > 0 && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <span className="text-xs text-white">📹</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">
                          Video yang Sudah Ditambahkan
                        </h4>
                        <p className="text-sm text-green-600">
                          Total: {videos.length} video •{" "}
                          {videos.filter((v) => v.id).length} tersimpan di
                          database
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-600">
                        Terakhir update:{" "}
                        {new Date().toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Video Statistics */}
                  <div className="mt-3 grid grid-cols-3 gap-4 text-xs">
                    <div className="rounded border border-green-200 bg-white p-2">
                      <p className="font-medium text-green-700">Total Video</p>
                      <p className="text-lg font-bold text-green-600">
                        {videos.length}
                      </p>
                    </div>
                    <div className="rounded border border-green-200 bg-white p-2">
                      <p className="font-medium text-green-700">
                        Tersimpan di DB
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {videos.filter((v) => v.id).length}
                      </p>
                    </div>
                    <div className="rounded border border-green-200 bg-white p-2">
                      <p className="font-medium text-green-700">
                        Belum Tersimpan
                      </p>
                      <p className="text-lg font-bold text-yellow-600">
                        {videos.filter((v) => !v.id).length}
                      </p>
                    </div>
                  </div>

                  {/* Database Field Summary */}
                </div>
              )}

              {/* Add Video Form */}
              <div className="mb-6 rounded-lg border border-gray-200 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <IconPlus className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">
                    {editingVideoIndex !== null
                      ? "Edit Video"
                      : "Tambah Video Baru"}
                  </h3>
                </div>

                {courseCreated && courseId ? (
                  isEditingVideo ? (
                    // Edit Video Form
                    <div className="space-y-4">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Edit Video:{" "}
                          {editingVideoData?.title || editingVideoData?.judul}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ID: {editingVideoData?.id}
                        </span>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Judul Video
                        </label>
                        <input
                          type="text"
                          value={
                            editingVideoData?.title ||
                            editingVideoData?.judul ||
                            ""
                          }
                          onChange={(e) =>
                            handleVideoTitleChange(e.target.value)
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Masukkan judul video"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Slug URL
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            /videos/
                          </span>
                          <input
                            type="text"
                            value={editingVideoData?.slug || videoSlug}
                            readOnly
                            className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="slug-otomatis-dari-judul"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Slug otomatis di-generate dari judul video (tidak
                          dapat diedit)
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Durasi
                        </label>
                        <input
                          type="text"
                          value={
                            editingVideoData?.duration ||
                            editingVideoData?.durasi ||
                            ""
                          }
                          onChange={(e) =>
                            setEditingVideoData({
                              ...editingVideoData,
                              duration: e.target.value,
                              durasi: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Contoh: 10:30"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Deskripsi
                        </label>
                        <SummernoteLite
                          value={
                            editingVideoData?.description ||
                            editingVideoData?.deskripsi ||
                            ""
                          }
                          placeholder="Tulis deskripsi video..."
                          tabsize={2}
                          lang="id"
                          height={200}
                          dialogsInBody={true}
                          blockquoteBreakingLevel={0}
                          toolbar={[
                            ["style", ["style"]],
                            [
                              "font",
                              [
                                "bold",
                                "underline",
                                "clear",
                                "strikethrough",
                                "superscript",
                                "subscript",
                              ],
                            ],
                            ["fontsize", ["fontsize"]],
                            ["fontname", ["fontname"]],
                            ["color", ["color"]],
                            ["para", ["ul", "ol", "paragraph"]],
                            ["table", ["table"]],
                            ["insert", ["link", "picture", "video", "hr"]],
                            ["view", ["codeview", "help"]],
                          ]}
                          fontNames={[
                            "Arial",
                            "Georgia",
                            "Verdana",
                            "e.t.c...",
                          ]}
                          callbacks={{
                            onChange: (content: string) => {
                              setEditingVideoData({
                                ...editingVideoData,
                                description: content,
                                deskripsi: content,
                              });
                            },
                          }}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          YouTube URL
                        </label>
                        <input
                          type="url"
                          value={editingVideoData?.youtube_url || ""}
                          onChange={(e) =>
                            setEditingVideoData({
                              ...editingVideoData,
                              youtube_url: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Urutan
                        </label>
                        <input
                          type="number"
                          value={editingVideoData?.order_index || 1}
                          onChange={(e) =>
                            setEditingVideoData({
                              ...editingVideoData,
                              order_index: parseInt(e.target.value) || 1,
                            })
                          }
                          min="1"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Urutan otomatis: {getNextOrderIndex()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveEditedVideo}
                          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          💾 Simpan Perubahan
                        </button>
                        <button
                          onClick={handleCancelVideoEdit}
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          ❌ Batal Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Add New Video Form
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Left Column - Form Inputs */}
                      <div className="space-y-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Tambah Video Baru
                          </h3>
                          <p className="text-sm text-gray-600">
                            Isi form di bawah untuk menambahkan video baru
                          </p>
                        </div>

                        {/* Video Title Input */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Judul Video
                          </label>
                          <input
                            type="text"
                            id="new-video-title"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Masukkan judul video"
                            onChange={(e) => {
                              const title = e.target.value;
                              const slug = generateVideoSlug(title);
                              setVideoSlug(slug);
                              setVideoPreviewData((prev) => ({
                                ...prev,
                                title,
                              }));
                            }}
                          />
                        </div>

                        {/* Video Slug Input (Read-only) */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Slug URL
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              /videos/
                            </span>
                            <input
                              type="text"
                              value={videoSlug}
                              readOnly
                              className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="slug-otomatis-dari-judul"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Slug otomatis di-generate dari judul video (tidak
                            dapat diedit)
                          </p>
                        </div>

                        {/* Video Duration Input */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Durasi
                          </label>
                          <input
                            type="text"
                            id="new-video-duration"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Contoh: 10:30"
                            onChange={(e) => {
                              setVideoPreviewData((prev) => ({
                                ...prev,
                                duration: e.target.value,
                              }));
                            }}
                          />
                        </div>

                        {/* Video Description Input with Summernote Lite */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Deskripsi
                          </label>
                          <SummernoteLite
                            placeholder="Tulis deskripsi video..."
                            tabsize={2}
                            lang="id"
                            height={200}
                            dialogsInBody={true}
                            blockquoteBreakingLevel={0}
                            toolbar={[
                              ["style", ["style"]],
                              [
                                "font",
                                [
                                  "bold",
                                  "underline",
                                  "clear",
                                  "strikethrough",
                                  "superscript",
                                  "subscript",
                                ],
                              ],
                              ["fontsize", ["fontsize"]],
                              ["fontname", ["fontname"]],
                              ["color", ["color"]],
                              ["para", ["ul", "ol", "paragraph"]],
                              ["table", ["table"]],
                              ["insert", ["link", "picture", "video", "hr"]],
                              ["view", ["codeview", "help"]],
                            ]}
                            fontNames={[
                              "Arial",
                              "Georgia",
                              "Verdana",
                              "e.t.c...",
                            ]}
                            callbacks={{
                              onChange: (content: string) => {
                                setVideoPreviewData((prev) => ({
                                  ...prev,
                                  description: content,
                                }));
                              },
                            }}
                          />
                          <input
                            type="hidden"
                            id="new-video-description"
                            value={videoPreviewData.description}
                          />
                        </div>

                        {/* YouTube URL Input */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            id="new-video-youtube-url"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://www.youtube.com/watch?v=..."
                            onChange={(e) => {
                              setVideoPreviewData((prev) => ({
                                ...prev,
                                youtube_url: e.target.value,
                              }));
                            }}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={() => {
                              const titleInput = document.getElementById(
                                "new-video-title",
                              ) as HTMLInputElement;
                              const durationInput = document.getElementById(
                                "new-video-duration",
                              ) as HTMLInputElement;
                              const descriptionInput = document.getElementById(
                                "new-video-description",
                              ) as HTMLTextAreaElement;
                              const youtubeUrlInput = document.getElementById(
                                "new-video-youtube-url",
                              ) as HTMLInputElement;

                              if (
                                titleInput &&
                                durationInput &&
                                descriptionInput &&
                                youtubeUrlInput
                              ) {
                                // Validate required fields
                                if (!titleInput.value.trim()) {
                                  setAlertConfig({
                                    type: "warning",
                                    title: "Judul Video Wajib",
                                    message:
                                      "Harap isi judul video terlebih dahulu",
                                    onConfirm: () => setShowAlert(false),
                                  });
                                  setShowAlert(true);
                                  titleInput.focus();
                                  return;
                                }

                                const videoData = {
                                  title: titleInput.value,
                                  judul: titleInput.value,
                                  slug: videoSlug,
                                  duration: durationInput.value,
                                  durasi: durationInput.value,
                                  description: descriptionInput.value,
                                  deskripsi: descriptionInput.value,
                                  youtube_url: youtubeUrlInput.value,
                                  order_index: getNextOrderIndex(),
                                };

                                handleAddVideo(videoData);

                                // Clear form
                                titleInput.value = "";
                                durationInput.value = "";
                                descriptionInput.value = "";
                                youtubeUrlInput.value = "";
                                setVideoSlug("");
                              }
                            }}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            📹 Tambah Video
                          </button>

                          <button
                            onClick={() => {
                              const titleInput = document.getElementById(
                                "new-video-title",
                              ) as HTMLInputElement;
                              const durationInput = document.getElementById(
                                "new-video-duration",
                              ) as HTMLInputElement;
                              const descriptionInput = document.getElementById(
                                "new-video-description",
                              ) as HTMLTextAreaElement;
                              const youtubeUrlInput = document.getElementById(
                                "new-video-youtube-url",
                              ) as HTMLInputElement;

                              if (
                                titleInput &&
                                durationInput &&
                                descriptionInput &&
                                youtubeUrlInput
                              ) {
                                // Validate required fields
                                if (!titleInput.value.trim()) {
                                  setAlertConfig({
                                    type: "warning",
                                    title: "Judul Video Wajib",
                                    message:
                                      "Harap isi judul video terlebih dahulu",
                                    onConfirm: () => setShowAlert(false),
                                  });
                                  setShowAlert(true);
                                  titleInput.focus();
                                  return;
                                }

                                const videoData = {
                                  title: titleInput.value,
                                  judul: titleInput.value,
                                  slug: videoSlug,
                                  duration: durationInput.value,
                                  durasi: durationInput.value,
                                  description: descriptionInput.value,
                                  deskripsi: descriptionInput.value,
                                  youtube_url: youtubeUrlInput.value,
                                  order_index: getNextOrderIndex(),
                                };

                                // Add to local state first
                                setVideos([...videos, videoData]);

                                // Clear form
                                titleInput.value = "";
                                durationInput.value = "";
                                descriptionInput.value = "";
                                youtubeUrlInput.value = "";
                                setVideoSlug("");

                                // Show success message
                                setAlertConfig({
                                  type: "success",
                                  title: "Berhasil!",
                                  message:
                                    "Video berhasil ditambahkan ke list (belum tersimpan di database)",
                                  onConfirm: () => setShowAlert(false),
                                });
                                setShowAlert(true);
                              }
                            }}
                            className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            📋 Tambah ke List
                          </button>
                        </div>

                        {/* Save All Videos Button */}
                        {videos.filter((v) => !v.id).length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <div className="mb-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-yellow-600">⚠️</span>
                                <span className="text-sm font-medium text-yellow-800">
                                  Video Pending:{" "}
                                  {videos.filter((v) => !v.id).length} video
                                  belum tersimpan di database
                                </span>
                              </div>
                              <p className="text-xs text-yellow-600">
                                Klik tombol di bawah untuk menyimpan semua video
                                ke database sekaligus
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                const pendingVideos = videos.filter(
                                  (v) => !v.id,
                                );
                                if (pendingVideos.length > 0) {
                                  saveMultipleVideosToDatabase(pendingVideos);
                                }
                              }}
                              className="w-full rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                              💾 Simpan Semua Video ke Database (
                              {videos.filter((v) => !v.id).length})
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Video Preview */}
                      <div className="space-y-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Preview Video
                          </h3>
                          <p className="text-sm text-gray-600">
                            Preview video yang akan ditambahkan
                          </p>
                        </div>

                        {/* Video Preview Card */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                          <div className="mb-3">
                            <h4 className="font-medium text-gray-900">
                              {videoPreviewData.title || "Judul Video"}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Durasi:
                              </span>
                              <span className="text-sm text-gray-600">
                                {videoPreviewData.duration || "00:00"}
                              </span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                Urutan:
                              </span>
                              <span className="text-sm text-gray-600">
                                #{getNextOrderIndex()}
                              </span>
                            </div>
                          </div>

                          {/* Video Slug Preview */}
                          <div className="mb-3">
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Slug URL:
                            </p>
                            <div className="rounded border border-gray-200 bg-white px-2 py-1">
                              <span className="font-mono text-xs text-gray-600">
                                /videos/{videoSlug || "slug-otomatis"}
                              </span>
                            </div>
                          </div>

                          {/* Video Description Preview */}
                          <div className="mb-3">
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Deskripsi:
                            </p>
                            <div className="min-h-[60px] rounded border border-gray-200 bg-white p-2">
                              <div
                                className="prose prose-sm max-w-none text-xs text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    videoPreviewData.description ||
                                    "Deskripsi video akan ditampilkan di sini...",
                                }}
                              />
                            </div>
                          </div>

                          {/* YouTube URL Preview */}
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              YouTube URL:
                            </p>
                            <div className="rounded border border-gray-200 bg-white px-2 py-1">
                              <span className="break-all font-mono text-xs text-blue-600">
                                {videoPreviewData.youtube_url ||
                                  "https://www.youtube.com/watch?v=..."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                    <IconBook className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600">
                      Form Video Tidak Tersedia
                    </p>
                    <p className="text-xs text-gray-500">
                      Course harus disimpan terlebih dahulu sebelum bisa
                      menambahkan video
                    </p>
                  </div>
                )}
              </div>

              {/* Video List */}
              <div className="space-y-3">
                {/* Drag and Drop Instructions */}
                {videos.length > 1 && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-xs text-white">🔄</span>
                      </div>
                      <h4 className="font-medium text-blue-800">
                        Drag & Drop untuk Mengubah Urutan
                      </h4>
                    </div>
                    <p className="text-sm text-blue-600">
                      Gunakan drag and drop untuk mengubah urutan video. Urutan
                      akan otomatis diupdate di database.
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-500">
                      <span>💡 Tips:</span>
                      <span>• Drag video ke posisi yang diinginkan</span>
                      <span>• Urutan otomatis diupdate</span>
                      <span>• Perubahan langsung tersimpan</span>
                    </div>
                  </div>
                )}

                {videos.map((video, index) => (
                  <div
                    key={video.id || index}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
                      isDragging && draggedVideoIndex === index
                        ? "border-blue-400 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                  >
                    {/* Drag Handle */}
                    <div className="flex items-center gap-3">
                      <div className="flex cursor-grab flex-col items-center text-gray-400 hover:text-blue-500">
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                        <div className="h-1 w-1 rounded-full bg-current"></div>
                      </div>

                      <div className="flex-1">
                        {/* Video Header - Title and ID */}
                        <div className="mb-3 flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {video.title || video.judul}
                          </h3>
                          {video.id && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                              ID: {video.id}
                            </span>
                          )}
                          {!video.id && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                              Belum Tersimpan
                            </span>
                          )}
                        </div>

                        {/* Video Info Grid - Simplified */}
                        <div className="mb-3 grid grid-cols-2 gap-4 lg:grid-cols-4">
                          {/* Durasi */}
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Durasi:
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {video.duration ||
                                video.durasi ||
                                "Tidak ada durasi"}
                            </p>
                          </div>

                          {/* Urutan */}
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Urutan:
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              #{video.order_index}
                            </p>
                          </div>

                          {/* Slug */}
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Slug:
                            </p>
                            <div className="rounded border border-gray-200 bg-gray-50 px-2 py-1">
                              <p className="break-all font-mono text-xs text-gray-600">
                                {video.slug || "slug-otomatis"}
                              </p>
                            </div>
                          </div>

                          {/* Status Data */}
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Status Data:
                            </p>
                            {video.id ? (
                              <div className="flex items-center gap-1">
                                <span className="text-green-600">✓</span>
                                <span className="text-xs font-medium text-green-600">
                                  {new Date().toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-600">⏳</span>
                                <span className="text-xs font-medium text-yellow-600">
                                  Belum Tersimpan
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      {video.id && (
                        <button
                          onClick={() =>
                            video.id && showVideoDetailById(video.id)
                          }
                          className="rounded p-1 text-gray-400 hover:bg-green-100 hover:text-green-600"
                          title="Lihat Detail Video"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Edit Video Button */}
                      <button
                        onClick={() => handleEditVideo(index)}
                        className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                        title="Edit Video"
                        disabled={isEditingVideo}
                      >
                        <IconEdit size={16} />
                      </button>

                      {/* Delete Video Button */}
                      <button
                        onClick={() => handleDeleteVideoFromDB(index)}
                        className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                        title="Hapus Video"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {videos.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    <IconBook className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-sm">Belum ada video ditambahkan</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Tambahkan video pembelajaran di atas
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>

      {/* Video Detail Modal */}
      {showVideoDetail && selectedVideoForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Detail Video:{" "}
                {selectedVideoForDetail.title || selectedVideoForDetail.judul}
              </h3>
              <button
                onClick={closeVideoDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Video ID */}
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Video ID:</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {selectedVideoForDetail.id}
                </span>
              </div>

              {/* Video Title */}
              <div>
                <span className="font-medium text-gray-700">Judul Video:</span>
                <p className="mt-1 text-gray-900">
                  {selectedVideoForDetail.title || selectedVideoForDetail.judul}
                </p>
              </div>

              {/* Video Slug */}
              {selectedVideoForDetail.slug && (
                <div>
                  <span className="font-medium text-gray-700">Slug URL:</span>
                  <p className="mt-1 font-mono text-gray-900">
                    /videos/{selectedVideoForDetail.slug}
                  </p>
                </div>
              )}

              {/* Video Duration */}
              <div>
                <span className="font-medium text-gray-700">Durasi:</span>
                <p className="mt-1 text-gray-900">
                  {selectedVideoForDetail.duration ||
                    selectedVideoForDetail.durasi}
                </p>
              </div>

              {/* Video Order */}
              <div>
                <span className="font-medium text-gray-700">Urutan:</span>
                <p className="mt-1 text-gray-900">
                  #{selectedVideoForDetail.order_index}
                </p>
              </div>

              {/* Video Description */}
              {(selectedVideoForDetail.description ||
                selectedVideoForDetail.deskripsi) && (
                <div>
                  <span className="font-medium text-gray-700">Deskripsi:</span>
                  <div
                    className="prose prose-sm mt-2 max-w-none text-gray-900"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedVideoForDetail.description ||
                        selectedVideoForDetail.deskripsi ||
                        "",
                    }}
                  />
                </div>
              )}

              {/* YouTube URL */}
              {selectedVideoForDetail.youtube_url && (
                <div>
                  <span className="font-medium text-gray-700">
                    YouTube URL:
                  </span>
                  <p className="mt-1 break-all text-blue-600">
                    {selectedVideoForDetail.youtube_url}
                  </p>
                </div>
              )}

              {/* Database Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-medium text-gray-700">
                  Informasi Database:
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Field konten:</span>
                    <p className="mt-1 break-all font-mono text-xs text-gray-900">
                      {selectedVideoForDetail.description ||
                        selectedVideoForDetail.deskripsi ||
                        "Tidak ada deskripsi"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Field link:</span>
                    <p className="mt-1 break-all font-mono text-xs text-gray-900">
                      {selectedVideoForDetail.youtube_url || "Tidak ada URL"}
                    </p>
                  </div>
                  {selectedVideoForDetail.slug && (
                    <div>
                      <span className="text-gray-600">Field slug:</span>
                      <p className="mt-1 break-all font-mono text-xs text-gray-900">
                        {selectedVideoForDetail.slug}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeVideoDetail}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
