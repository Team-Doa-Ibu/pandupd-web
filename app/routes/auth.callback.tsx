import { useEffect, useState } from "react";
import { supabase } from "../data/supabaseClient";
import { Alert } from "../components/ui/Alert";
import ProgressLoading from "~/components/ui/progress-loading";

export default function AuthCallback() {
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
    redirect?: boolean;
  } | null>(null);
  const [loadingDone, setLoadingDone] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAlert({
          type: "error",
          title: "Gagal Login",
          message: "User belum login.",
          redirect: true,
        });
        return;
      }

      // Cek apakah user_profile sudah ada
      const { data: existingProfile, error: profileFetchError } = await supabase
        .from("user_profile")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileFetchError) {
        setAlert({
          type: "error",
          title: "Gagal cek profil",
          message: profileFetchError.message,
          redirect: true,
        });
        return;
      }

      if (!existingProfile) {
        // Insert user_profile jika belum ada
        const profilePayload = {
          user_id: user.id,
          name: user.user_metadata?.name || "",
          email: user.email,
          no_telp: user.user_metadata?.phone || "-",
          alamat: user.user_metadata?.address || "-",
          tgl_lahir: user.user_metadata?.birth_date || null,
          pekerjaan: user.user_metadata?.occupation || "-",
        };
        const { error: insertProfileError } = await supabase
          .from("user_profile")
          .insert([profilePayload]);
        if (insertProfileError) {
          setAlert({
            type: "error",
            title: "Gagal simpan profil",
            message: insertProfileError.message,
            redirect: true,
          });
          return;
        }
      }

      // Insert role hanya jika belum ada
      const { data: existingRole, error: fetchRoleError } = await supabase
        .from("role")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchRoleError) {
        setAlert({
          type: "error",
          title: "Gagal cek role",
          message: fetchRoleError.message,
          redirect: true,
        });
        return;
      }

      if (!existingRole) {
        const rolePayload = { user_id: user.id, role: "User" };
        const { error: insertRoleError } = await supabase
          .from("role")
          .insert([rolePayload]);
        if (insertRoleError) {
          setAlert({
            type: "error",
            title: "Gagal simpan role",
            message: insertRoleError.message,
            redirect: true,
          });
          return;
        }
      }

      // Jika semua aman, tampilkan loading, lalu redirect ke /profile
      window.localStorage.setItem("justLoggedIn", "1");
      setShouldShowLoading(true);
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
  const handleLoadingComplete = () => {
    setLoadingDone(true);
    window.location.href = "/profile";
  };
  return (
    <>
      {alert ? (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={!!alert}
          onCancel={handleCloseAlert}
          cancelText="Tutup"
        />
      ) : (
        <ProgressLoading
          title="Memproses Data..."
          subtitle="Mohon tunggu sebentar"
          spinnerColor="border-amber-400"
          progressColor="bg-amber-400"
          onLoadingComplete={handleLoadingComplete}
          redirectTime={2000}
        />
      )}
    </>
  );
}
