import { json, type ActionFunctionArgs } from "@remix-run/node";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;

    if (!file || !fileName) {
      return json(
        { error: "File atau nama file tidak ditemukan" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "artikel");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/artikel/${fileName}`;
    return json({
      success: true,
      url,
      message: "File artikel berhasil diupload",
    });
  } catch (error) {
    console.error("Upload artikel error:", error);
    return json({ error: "Gagal mengupload file artikel" }, { status: 500 });
  }
}
