export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export const uploadImageToTerapi = async (
  file: File,
): Promise<UploadResult> => {
  try {
    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau SVG.",
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5MB.",
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `course-${timestamp}-${randomString}.${fileExtension}`;

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    // Upload to server
    console.log("Uploading file:", fileName);
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Upload failed:", errorData);
      return {
        success: false,
        error: errorData.error || "Gagal mengupload gambar",
      };
    }

    const result = await response.json();
    console.log("Upload successful:", result);
    return {
      success: true,
      url: result.url,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengupload gambar",
    };
  }
};

export const deleteFileFromTerapi = async (
  fileName: string,
): Promise<DeleteResult> => {
  try {
    // Don't delete default.jpg
    if (fileName === "default.jpg") {
      console.log("🛡️ Skipping deletion of default file:", fileName);
      return {
        success: true,
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("fileName", fileName);

    // Delete from server
    console.log("Deleting file:", fileName);
    const response = await fetch("/api/delete-file", {
      method: "POST",
      body: formData,
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Delete failed:", errorData);
      return {
        success: false,
        error: errorData.error || "Gagal menghapus file",
      };
    }

    const result = await response.json();
    console.log("Delete successful:", result);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat menghapus file",
    };
  }
};

// Artikel-specific helpers
export const uploadImageToArtikel = async (
  file: File,
): Promise<UploadResult> => {
  try {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "Tipe file tidak didukung." };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal 5MB.",
      };
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `artikel-${timestamp}-${randomString}.${fileExtension}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    const response = await fetch("/api/upload-article-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Gagal mengupload gambar",
      };
    }

    const result = await response.json();
    return { success: true, url: result.url };
  } catch (error) {
    console.error("Upload artikel error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mengupload gambar",
    };
  }
};

export const deleteFileFromArtikel = async (
  fileName: string,
): Promise<DeleteResult> => {
  try {
    const formData = new FormData();
    formData.append("fileName", fileName);

    const response = await fetch("/api/delete-article-file", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || "Gagal menghapus file",
      };
    }

    await response.json();
    return { success: true };
  } catch (error) {
    console.error("Delete artikel error:", error);
    return { success: false, error: "Terjadi kesalahan saat menghapus file" };
  }
};
