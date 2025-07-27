import { useState, useRef } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
// @ts-expect-error SummernoteLite error import.
import SummernoteLite from "react-summernote-lite";
import "react-summernote-lite/dist/summernote-lite.min.css";

export type CourseFormData = {
  name: string;
  short_description: string;
  description?: string;
  thumbnail_url?: string;
};

interface FormCourseProps {
  mode?: "add" | "edit";
  initialData?: Partial<CourseFormData>;
}

export default function FormCourse({
  mode = "add",
  initialData = {},
}: FormCourseProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editorData, setEditorData] = useState(initialData.description || "");
  const isEdit = mode === "edit";
  const noteRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleEditorChange = (content: string) => {
    setEditorData(content);
  };

  return (
    <ProtectedRoute adminOnly>
      <form method="post" className="rounded-xl bg-white p-6">
        <h2 className="mb-4 text-xl font-bold text-blue-700">
          {isEdit ? "Edit Info Course" : ""}
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-neutral-700">
            Nama Course
            <input
              type="text"
              name="name"
              defaultValue={initialData.name}
              className="w-full rounded-md border px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            Penjelasan Tentang Course
            <SummernoteLite
              ref={noteRef}
              defaultCodeValue={"<p>This is the default html value</p>"}
              placeholder={"Write something here..."}
              tabsize={2}
              lang="zh-CN"
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
              className="block w-full cursor-pointer rounded-md border border-neutral-300 bg-white text-sm text-neutral-500 file:mr-4 file:cursor-pointer file:rounded-none file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <p className="mt-2 text-sm text-gray-500">
            SVG, PNG, JPG or GIF (MAX. 1280×720px or 16:9 Ratio).
          </p>
        </div>

        <div className="flex w-full justify-end gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full border border-neutral-300 px-6 py-2 text-sm font-bold text-neutral-500 hover:bg-neutral-100"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            name="_action"
            value={isEdit ? "update-course" : "create-course"}
            className="rounded-full bg-blue-500 px-6 py-2 font-bold text-white shadow-inner shadow-white/50 hover:bg-blue-600"
          >
            {isEdit ? "Simpan Perubahan" : "Buat Course"}
          </button>
        </div>
      </form>
    </ProtectedRoute>
  );
}
