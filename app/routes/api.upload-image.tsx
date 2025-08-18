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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public", "terapi");

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Return the public URL
    const url = `/terapi/${fileName}`;

    return json({
      success: true,
      url,
      message: "File berhasil diupload",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return json(
      {
        error: "Gagal mengupload file",
      },
      { status: 500 },
    );
  }
}
