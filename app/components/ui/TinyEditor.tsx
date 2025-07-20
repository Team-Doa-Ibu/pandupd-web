import { useEffect, useState } from "react";

export default function TinyEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [Editor, setEditor] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import("@tinymce/tinymce-react").then((mod) => {
      setEditor(() => mod.Editor);
    });
  }, []);

  if (!isClient || !Editor)
    return <p className="text-sm text-gray-500">Memuat editor…</p>;

  return (
    <Editor
      apiKey="3n2rya60e0lnkahvb9hejhv7wafioku3i8hjcxkistu464d3"
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | styles | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
        placeholder: "Tulis penjelasan lengkap tentang course ini...",
        directionality: "ltr",
        content_style: "body { direction: ltr; text-align: left; }",
      }}
    />
  );
}
