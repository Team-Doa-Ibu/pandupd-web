import { json, type ActionFunctionArgs } from "@remix-run/node";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const fileName = formData.get("fileName") as string;

    if (!fileName) {
      return json({ error: "Nama file tidak ditemukan" }, { status: 400 });
    }

    // Define file path
    const filePath = path.join(process.cwd(), "public", "terapi", fileName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    // Don't delete default.jpg
    if (fileName === "default.jpg") {
      return json(
        { error: "Tidak dapat menghapus file default" },
        { status: 403 },
      );
    }

    // Delete file
    await unlink(filePath);

    console.log(`✅ File deleted successfully: ${fileName}`);

    return json({
      success: true,
      message: "File berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    return json(
      {
        error: "Gagal menghapus file",
      },
      { status: 500 },
    );
  }
}
