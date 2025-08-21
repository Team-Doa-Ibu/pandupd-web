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

    const filePath = path.join(process.cwd(), "public", "artikel", fileName);
    if (!existsSync(filePath)) {
      return json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    await unlink(filePath);
    return json({ success: true, message: "File artikel berhasil dihapus" });
  } catch (error) {
    console.error("Delete artikel file error:", error);
    return json({ error: "Gagal menghapus file artikel" }, { status: 500 });
  }
}
