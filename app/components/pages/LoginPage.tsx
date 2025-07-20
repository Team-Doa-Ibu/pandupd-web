import React, { useState } from "react";
import { Link } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";
import { Alert } from "../ui/Alert";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

export default function LoginPage() {
  const backgroundImagePath = "login-bg.png";
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Handler untuk login Google
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };

  // Handler login manual
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Login ke Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. Jika error (salah email/password atau email belum verifikasi)
    if (error || !data.user) {
      let message = "Email atau password salah.";
      if (error?.message?.toLowerCase().includes("email not confirmed")) {
        message =
          "Akun belum diverifikasi. Silakan cek email Anda untuk verifikasi sebelum login.";
      }
      setAlert({
        type: "error",
        title: "Login Gagal",
        message,
      });
      return;
    }

    // 3. Jika user belum verifikasi email
    if (!data.user.email_confirmed_at) {
      setAlert({
        type: "error",
        title: "Login Gagal",
        message:
          "Akun belum diverifikasi. Silakan cek email Anda untuk verifikasi sebelum login.",
      });
      return;
    }

    // 4. Sukses, redirect ke /auth/callback
    window.location.href = "/auth/callback";
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImagePath}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={!!alert}
          onConfirm={alert.onConfirm}
          onCancel={() => setAlert(null)}
          confirmText={alert.onConfirm ? "OK" : undefined}
          cancelText={!alert.onConfirm ? "Tutup" : undefined}
        />
      )}
      <div className="z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center">
            <img src="logo.png" alt="" className="h-8" />
          </div>
        </div>
        <h2 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          Selamat Datang Kembali
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Daftar
          </Link>
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword ? "Sembunyikan password" : "Lihat password"
              }
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Masuk
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
}
