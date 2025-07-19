import { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { Alert } from "../components/ui/Alert";

export default function AuthCallback() {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    redirect?: boolean;
  } | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error("[AUTH DEBUG] User belum login", user);
        setAlert({
          type: "error",
          title: "Gagal Login",
          message: "User belum login.",
          redirect: true,
        });
        return;
      }
      console.log("[AUTH DEBUG] User login:", user);

      // Upsert user_profile
      const profilePayload = {
        user_id: user.id,
        name: user.user_metadata?.name || "",
        email: user.email,
        no_telp: user.user_metadata?.phone || "-",
        alamat: user.user_metadata?.address || "-",
        tgl_lahir: user.user_metadata?.birth_date || null,
        pekerjaan: user.user_metadata?.occupation || "-",
      };
      console.log("[AUTH DEBUG] Upsert user_profile payload:", profilePayload);
      const { error: upsertProfileError } = await supabase
        .from("user_profile")
        .upsert([profilePayload], { onConflict: "user_id" });
      if (upsertProfileError) {
        console.error(
          "[AUTH DEBUG] Gagal upsert user_profile:",
          upsertProfileError,
        );
        setAlert({
          type: "error",
          title: "Gagal simpan profil",
          message: upsertProfileError.message,
          redirect: true,
        });
        return;
      }

      // Upsert role
      const rolePayload = { user_id: user.id, role: "User" };
      console.log("[AUTH DEBUG] Upsert role payload:", rolePayload);
      const { error: upsertRoleError } = await supabase
        .from("role")
        .upsert([rolePayload], { onConflict: "user_id" });
      if (upsertRoleError) {
        console.error("[AUTH DEBUG] Gagal upsert role:", upsertRoleError);
        setAlert({
          type: "error",
          title: "Gagal simpan role",
          message: upsertRoleError.message,
          redirect: true,
        });
        return;
      }

      // Jika semua aman, redirect ke /profile
      window.localStorage.setItem("justLoggedIn", "1");
      window.location.href = "/profile";
    };

    handleAuth();
  }, []);

  // Handler untuk close alert dan redirect ke login jika error
  const handleCloseAlert = () => {
    if (alert?.redirect) {
      window.location.href = "/login";
    } else {
      setAlert(null);
    }
  };

  return (
    <>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={!!alert}
          onCancel={handleCloseAlert}
          cancelText="Tutup"
        />
      )}
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg text-gray-600">Memproses login...</span>
      </div>
    </>
  );
}
