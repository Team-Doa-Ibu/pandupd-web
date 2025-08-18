import { useState, useRef, useEffect } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { Alert } from "../../components/ui/Alert";
import { uploadImageToTerapi, type UploadResult } from "~/utils/fileUpload";
// @ts-expect-error SummernoteLite error import.
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";

export type CourseFormData = {
  name: string;
  slug: string;
  short_description: string;
  description?: string;
  thumbnail?: string;
};

interface FormCourseProps {
  mode?: "add" | "edit";
  initialData?: Partial<CourseFormData>;
  noForm?: boolean;
  onImageUpload?: (url: string) => void;
  onUploadFunction?: (uploadFn: () => Promise<string>) => void;
}

export default function FormCourse({
  mode = "add",
  initialData = {},
  noForm = false,
  onImageUpload,
  onUploadFunction,
}: FormCourseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editorData, setEditorData] = useState(initialData.description || "");
  const [courseName, setCourseName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    initialData.thumbnail || "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData.thumbnail || "",
  );
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
  const [editorKey, setEditorKey] = useState(0);
  const isEdit = mode === "edit";
  const noteRef = useRef<any>(null);

  // Function to generate slug from course name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  // Handle course name change and auto-generate slug
  const handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setCourseName(name);
    // Always auto-generate slug from course name
    setSlug(generateSlug(name));
  };

  // Initialize slug when component mounts or initialData changes
  useEffect(() => {
    if (initialData.name && !slug) {
      setSlug(generateSlug(initialData.name));
    }
  }, [initialData.name]); // Removed slug from dependencies to prevent infinite loop

  // Reset preview when initial data changes
  useEffect(() => {
    if (initialData.thumbnail) {
      setPreviewUrl(initialData.thumbnail);
    }
  }, [initialData.thumbnail]);

  // Expose upload function to parent component
  useEffect(() => {
    if (onUploadFunction) {
      onUploadFunction(uploadFileIfSelected);
    }
  }, [selectedFile]); // Removed onUploadFunction from dependencies to prevent infinite loop

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview URL for immediate visual feedback
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Function to upload file and return URL - called during form submission
  const uploadFileIfSelected = async (): Promise<string> => {
    if (!selectedFile) {
      return uploadedImageUrl; // Return existing URL if no new file
    }

    try {
      setIsUploading(true);
      const result: UploadResult = await uploadImageToTerapi(selectedFile);

      if (result.success && result.url) {
        console.log("Image uploaded successfully:", result.url);
        return result.url;
      } else {
        console.error("Upload failed:", result.error);
        throw new Error(result.error || "Gagal mengupload gambar");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditorChange = (content: string) => {
    try {
      setEditorData(content);
    } catch (error) {
      console.error("Editor change error:", error);
    }
  };

  const formContent = (
    <>
      {/* Alert Component */}
      <Alert
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        show={showAlert}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setShowAlert(false)}
        confirmText="OK"
        cancelText="Tutup"
      />

      <h2 className="mb-4 text-xl font-bold text-blue-700">
        {isEdit ? "Edit Info Course" : ""}
      </h2>

      <div className="mb-4">
        <label className="mb-2 block text-neutral-700">
          Nama Course
          <input
            type="text"
            name="name"
            value={courseName}
            onChange={handleCourseNameChange}
            className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-neutral-700">
          Slug URL
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">/courses/</span>
            <input
              type="text"
              name="slug"
              value={slug}
              readOnly
              className="flex-1 rounded-md border bg-gray-50 px-4 py-2 text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="parkinson-web"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Slug otomatis di-generate dari nama course
          </p>
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-neutral-700">
          Deskripsi Singkat
          <input
            type="text"
            name="short_description"
            defaultValue={initialData.short_description}
            className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-neutral-700">
          <SummernoteLite
            key={editorKey}
            ref={noteRef}
            defaultCodeValue={initialData.description}
            placeholder={"Write something here..."}
            tabsize={2}
            lang="id"
            height={350}
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
            fontNames={["Arial", "Georgia", "Verdana", "e.t.c..."]}
            callbacks={{
              onChange: (content: string) => handleEditorChange(content),
            }}
          />
          <input type="hidden" name="description" value={editorData} />
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-neutral-700">
          Foto Thumbnail
          <input
            type="file"
            onChange={handleFileChange}
            accept=".svg,.png,.jpg,.jpeg,.gif"
            disabled={isUploading}
            className={`block w-full cursor-pointer rounded-md border border-neutral-300 bg-white text-sm text-neutral-500 file:mr-4 file:cursor-pointer file:rounded-none file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isUploading ? "cursor-not-allowed opacity-50" : ""
            }`}
          />
        </label>
        {isUploading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            Mengupload gambar...
          </div>
        )}
        {selectedFile && (
          <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Gambar siap diupload saat menyimpan
          </div>
        )}
        {previewUrl && (
          <div className="mt-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Preview:</p>
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              className="h-20 w-32 rounded-md border border-gray-300 object-cover shadow-sm"
            />
            {selectedFile && (
              <p className="mt-1 text-xs text-gray-500">
                File terpilih: {selectedFile.name} (
                {Math.round(selectedFile.size / 1024)} KB)
              </p>
            )}
          </div>
        )}
        <p className="mt-2 text-sm text-gray-500">
          SVG, PNG, JPG or GIF (MAX. 5MB). Gambar akan disimpan di folder
          /terapi
        </p>
        {/* Hidden input for uploaded image URL */}
        <input type="hidden" name="thumbnail" value={uploadedImageUrl} />
        {/* Hidden input to track if there's a new file to upload */}
        <input
          type="hidden"
          name="has_new_file"
          value={selectedFile ? "true" : "false"}
        />
        {/* Debug info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 text-xs text-gray-500">
            Debug: Current URL = {uploadedImageUrl || "none"} | New file ={" "}
            {selectedFile?.name || "none"}
          </div>
        )}
      </div>
    </>
  );

  if (noForm) {
    return (
      <ProtectedRoute adminOnly>
        <div className="rounded-xl bg-white p-6">{formContent}</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute adminOnly>
      <form method="post" className="rounded-xl bg-white p-6">
        {formContent}
      </form>
    </ProtectedRoute>
  );
}
