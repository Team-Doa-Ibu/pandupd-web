import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from "@remix-run/react";
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
  id?: number | string;
  course_id?: number;
  title?: string;
  judul?: string;
  duration?: string;
  durasi?: string;
  order_index: number;
  description?: string;
  deskripsi?: string;
  youtube_url?: string;
  slug?: string;
};

export default function AdminEditCourse() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Memoized callback for upload function
  const handleUploadFunction = useCallback(
    (uploadFn: () => Promise<string>) => setUploadImageFunction(() => uploadFn),
    [],
  );

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

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

  // Real-time video list update effect
  useEffect(() => {
    if (courseId) {
      // Set up interval for real-time updates
      const interval = setInterval(() => {
        refreshVideosFromDatabase();
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [courseId]);

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

  // All hooks must be called before any early returns
  // This ensures hooks are called in the same order every time

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
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Course tidak ditemukan",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      console.log("Fetched course:", courseData);
      setCourse(courseData);
      setUploadedThumbnailUrl(courseData.thumbnail || "");

      // Set course preview data
      setCoursePreviewData({
        name: courseData.judul,
        slug: courseData.slug,
        short_description: courseData.short_deskripsi,
        description: courseData.deskripsi,
        thumbnail_url: courseData.thumbnail || "",
      });
      setCourseSlug(courseData.slug);

      // Fetch videos data
      console.log("Fetching videos for course_id:", courseId);
      const { data: videosData, error: videosError } = await supabase
        .from("sub_pembelajaran")
        .select("*")
        .eq("courses_id", parseInt(courseId))
        .order("no_urut", { ascending: true });

      if (videosError) {
        console.error("Error fetching videos:", videosError);
        console.error(
          "Error details:",
          videosError.message,
          videosError.details,
        );
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memuat data video",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Map database fields to form fields
      const mappedVideos = (videosData || []).map((video) => ({
        ...video,
        title: video.judul, // Map judul to title for form
        duration: video.durasi, // Map durasi to duration for form
        description: video.deskripsi, // Map deskripsi to description for form
      }));

      console.log("Fetched videos:", videosData);
      console.log("Mapped videos:", mappedVideos);
      console.log("Videos count:", mappedVideos.length);
      setVideos(mappedVideos);
    } catch (error) {
      console.error("Error:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat memuat data",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } finally {
      console.log("Loading completed");
      setLoading(false);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);

    try {
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

      // Get current thumbnail URL to check if we need to delete old one
      const currentThumbnailUrl = course?.thumbnail || "";

      // Upload image first if a new file is selected
      let finalThumbnailUrl = uploadedThumbnailUrl || currentThumbnailUrl;
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

      // Delete old thumbnail if it's different from the new one and not default
      if (
        currentThumbnailUrl &&
        currentThumbnailUrl !== finalThumbnailUrl &&
        currentThumbnailUrl !== "/terapi/default.jpg"
      ) {
        try {
          // Extract filename from URL
          const filename = currentThumbnailUrl.split("/").pop();
          if (filename) {
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
          }
        } catch (error) {
          console.error("❌ Error in deleteOldThumbnail:", error);
        }
      }

      const courseData = {
        judul: nameInput.value.trim(),
        slug: slugInput.value.trim(),
        short_deskripsi: shortDescriptionInput.value.trim(),
        deskripsi: descriptionInput.value.trim(),
        thumbnail: finalThumbnailUrl || "/terapi/default.jpg",
      };

      // Update course
      const { error: courseError } = await supabase
        .from("courses")
        .update(courseData)
        .eq("id", courseId);

      if (courseError) {
        console.error("Error updating course:", courseError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal mengupdate course. Silakan coba lagi.",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Update local course data
      setCourse((prev) => (prev ? { ...prev, ...courseData } : null));

      // Show success message
      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Course berhasil diupdate!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
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

  const handleAddVideo = async (videoData: any) => {
    if (!courseId) return;
    try {
      // Validate slug uniqueness within this course
      const videoSlug =
        videoData.slug ||
        generateVideoSlug(videoData.title || videoData.judul || "");
      const slugExists = await checkVideoSlugExistsInCourse(
        videoSlug,
        parseInt(courseId!),
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
          message: `Slug "${videoSlug}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan slug yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Validate title uniqueness within this course
      const videoTitle = videoData.title || videoData.judul || "";
      const titleExists = await checkVideoTitleExistsInCourse(
        videoTitle,
        parseInt(courseId!),
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
          message: `Judul "${videoTitle}" sudah digunakan oleh video lain dalam course ini. Silakan gunakan judul yang berbeda.`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Map to database fields
      const videoDataForDB = {
        courses_id: parseInt(courseId!),
        judul: videoTitle,
        slug: videoSlug,
        durasi: videoData.duration || videoData.durasi || "",
        no_urut: (videos.length || 0) + 1,
        konten: videoData.description || videoData.deskripsi || "",
        link: videoData.youtube_url || "",
      };

      const { data, error } = await supabase
        .from("sub_pembelajaran")
        .insert([videoDataForDB])
        .select()
        .single();

      if (error) {
        console.error("Error adding video:", error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: `Gagal menambahkan video: ${error.message}`,
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      setVideos([...videos, { ...videoData, id: data.id }]);
      setSelectedVideo(null);

      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil ditambahkan!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menambahkan video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const handleAddMultipleVideos = async (videoDataArray: any[]) => {
    try {
      const newVideos = videoDataArray.map((videoData, index) => ({
        courses_id: parseInt(courseId!),
        judul: videoData.title || videoData.judul || "",
        slug:
          videoData.slug ||
          generateVideoSlug(videoData.title || videoData.judul || ""),
        durasi: videoData.duration || videoData.durasi || "",
        no_urut: videos.length + index + 1,
        konten: videoData.description || videoData.deskripsi || "",
        link: videoData.youtube_url || "",
      }));

      const { data, error } = await supabase
        .from("sub_pembelajaran")
        .insert(newVideos)
        .select();

      if (error) {
        console.error("Error adding videos:", error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal menambahkan video",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      setVideos([
        ...videos,
        ...videoDataArray.map((v, i) => ({ ...v, id: data?.[i]?.id })),
      ]);
      setSelectedVideo(null);

      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: `${data?.length || newVideos.length} video berhasil ditambahkan!`,
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menambahkan video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const handleUpdateVideo = async (videoData: any) => {
    if (editingVideoIndex === null) return;

    try {
      const videoToUpdate = videos[editingVideoIndex];
      const computedSlug =
        videoData.slug ||
        videoToUpdate.slug ||
        generateVideoSlug(
          videoData.title ||
            videoData.judul ||
            videoToUpdate.title ||
            videoToUpdate.judul ||
            "",
        );

      const updatedVideo = {
        judul:
          videoData.title ||
          videoData.judul ||
          videoToUpdate.title ||
          videoToUpdate.judul ||
          "",
        slug: computedSlug,
        durasi:
          videoData.duration ||
          videoData.durasi ||
          videoToUpdate.duration ||
          videoToUpdate.durasi ||
          "",
        no_urut: videoData.order_index || videoToUpdate.order_index,
        konten:
          videoData.description ||
          videoData.deskripsi ||
          videoToUpdate.description ||
          videoToUpdate.deskripsi ||
          "",
        link: videoData.youtube_url || videoToUpdate.youtube_url || "",
      };

      const { error } = await supabase
        .from("sub_pembelajaran")
        .update(updatedVideo)
        .eq("id", videoToUpdate.id);

      if (error) {
        console.error("Error updating video:", error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal mengupdate video",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      const updatedVideos = [...videos];
      updatedVideos[editingVideoIndex] = {
        ...videoToUpdate,
        ...updatedVideo,
      } as any;
      setVideos(updatedVideos);
      setEditingVideoIndex(null);
      setSelectedVideo(null);

      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil diupdate!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat mengupdate video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const handleDeleteVideo = async (index: number) => {
    setAlertConfig({
      type: "warning",
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus video ini?",
      onConfirm: async () => {
        setShowAlert(false);
        await performDeleteVideo(index);
      },
    });
    setShowAlert(true);
  };

  const performDeleteVideo = async (index: number) => {
    try {
      const videoToDelete = videos[index];

      // Get video data first to check if it has thumbnail
      const { data: videoData, error: fetchError } = await supabase
        .from("sub_pembelajaran")
        .select("thumbnail_url")
        .eq("id", videoToDelete.id)
        .single();

      if (fetchError) {
        console.error("Error fetching video data:", fetchError);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal memuat data video",
          onConfirm: () => setShowAlert(false),
        });
        setShowAlert(true);
        return;
      }

      // Delete video from database
      const { error } = await supabase
        .from("sub_pembelajaran")
        .delete()
        .eq("id", videoToDelete.id);

      if (error) {
        console.error("Error deleting video:", error);
        setAlertConfig({
          type: "error",
          title: "Error",
          message: "Gagal menghapus video",
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
              console.log("✅ Video thumbnail deleted successfully:", filename);
            }
          }
        } catch (error) {
          console.error("❌ Error deleting video thumbnail:", error);
        }
      }

      const updatedVideos = videos.filter((_, i) => i !== index);
      // Reorder videos
      const reorderedVideos = updatedVideos.map((video, i) => ({
        ...video,
        order_index: i + 1,
      }));
      setVideos(reorderedVideos);

      setAlertConfig({
        type: "success",
        title: "Berhasil!",
        message: "Video berhasil dihapus!",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      setAlertConfig({
        type: "error",
        title: "Error",
        message: "Terjadi kesalahan saat menghapus video",
        onConfirm: () => setShowAlert(false),
      });
      setShowAlert(true);
    }
  };

  const clearVideoSelection = () => {
    setSelectedVideo(null);
    setEditingVideoIndex(null);
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

  if (loading) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Edit Course" subtitle="Loading...">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute adminOnly>
        <AdminLayout title="Edit Course" subtitle="Course tidak ditemukan">
          <div className="py-12 text-center">
            <p className="mb-4 text-gray-500">Course tidak ditemukan</p>
            <Link
              to="/admin/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <IconArrowLeft size={16} />
              Kembali ke Daftar Course
            </Link>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <AdminLayout title="Edit Course" subtitle={`Course: ${course.judul}`}>
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
                onClick={() => setViewMode("video")}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "video"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <IconVideo size={16} />
                Kelola Video
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
                <IconEdit className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-700">Edit Course</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  ✓ Course Tersimpan
                </div>
                {courseId && (
                  <span className="text-xs text-gray-500">ID: {courseId}</span>
                )}
              </div>
            </div>
            <div>
              <FormCourse
                mode="edit"
                initialData={{
                  name: course.judul,
                  slug: course.slug,
                  short_description: course.short_deskripsi,
                  description: course.deskripsi,
                  thumbnail: course.thumbnail,
                }}
                onImageUpload={(url) => {
                  setUploadedThumbnailUrl(url);
                  setCoursePreviewData((prev) => ({
                    ...prev,
                    thumbnail_url: url,
                  }));
                }}
                onUploadFunction={handleUploadFunction}
              />

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <IconEdit size={16} />
                      Update Course
                    </>
                  )}
                </button>
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
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Lihat bagaimana course akan ditampilkan
              </p>

              <div className="space-y-4">
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
              </div>
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
                </div>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Kelola video pembelajaran dalam course ini
              </p>

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

                {course.created_at && course.id ? (
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
                                  handleAddMultipleVideos(pendingVideos);
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
                        <h3 className="font-semibold text-gray-900">
                          {video.judul || video.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Durasi: {video.durasi || video.duration} • Urutan: #
                          {video.order_index}
                        </p>
                        {(video.deskripsi || video.description) && (
                          <div className="mt-2">
                            <p className="mb-1 text-xs font-medium text-gray-500">
                              Deskripsi:
                            </p>
                            <div
                              className="prose prose-sm max-w-none overflow-hidden text-sm text-gray-600"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                              dangerouslySetInnerHTML={{
                                __html:
                                  video.deskripsi || video.description || "",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditVideo(index)}
                        className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                        title="Edit Video"
                      >
                        <IconEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(index)}
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
