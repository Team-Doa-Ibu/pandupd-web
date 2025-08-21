import React, { useState } from "react";
import { Form, Link } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";
import { Alert } from "../ui/Alert";
import type { SyntheticEvent } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

type AlertState = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
};

export default function RegisterPage() {
  const backgroundImagePath = "login-bg.png";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
  });
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Password validation
  const passwordValid = {
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[^A-Za-z0-9]/.test(form.password),
    length: form.password.length >= 8,
  };
  const isPasswordValid =
    passwordValid.upper &&
    passwordValid.number &&
    passwordValid.symbol &&
    passwordValid.length;
  const isMatch =
    form.password === form.confirmPassword && form.confirmPassword.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setAlert({
        type: "error",
        title: "Password tidak valid",
        message:
          "Password harus minimal 8 karakter, mengandung huruf besar, angka, dan simbol.",
      });
      return;
    }
    if (!isMatch) {
      setAlert({
        type: "error",
        title: "Konfirmasi password tidak cocok",
        message: "Pastikan password dan konfirmasi password sama.",
      });
      return;
    }
    // Cek email sudah terdaftar
    const { data } = await supabase
      .from("user_profile")
      .select("email")
      .eq("email", form.email)
      .maybeSingle();
    if (data) {
      setAlert({
        type: "error",
        title: "Email sudah terdaftar",
        message: "Silakan gunakan email lain atau login.",
      });
      return;
    }
    // Register ke Supabase Auth (akan kirim email verifikasi)
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.fullname },
        emailRedirectTo: window.location.origin + "/auth/callback",
      },
    });
    if (signUpError) {
      setAlert({
        type: "error",
        title: "Gagal mendaftar",
        message: signUpError.message,
      });
      return;
    }
    setAlert({
      type: "success",
      title: "Registrasi Berhasil",
      message: "Cek email Anda untuk verifikasi sebelum login.",
    });
    setForm({ email: "", password: "", confirmPassword: "", fullname: "" });
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('${backgroundImagePath}')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {alert && (
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            show={!!alert}
            onCancel={() => setAlert(null)}
            cancelText="Tutup"
          />
        )}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center">
            <img src="Logo.svg" alt="Logo" className="h-8" />
          </div>
        </div>
        <h2 className="mb-1 text-center text-2xl font-semibold text-gray-800">
          Selamat Datang
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Masuk
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="sr-only">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama Lengkap"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>
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
              value={form.email}
              onChange={handleChange}
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
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Konfirmasi Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Konfirmasi Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          <div className="mb-2 text-xs">
            {form.confirmPassword.length > 0 &&
              (isMatch ? (
                <span className="text-green-600">Password cocok ✔️</span>
              ) : (
                <span className="text-red-500">Password belum cocok</span>
              ))}
          </div>
          <div className="mb-2 flex flex-col gap-1 text-xs">
            <span
              className={
                passwordValid.length ? "text-green-600" : "text-gray-400"
              }
            >
              • Minimal 8 karakter
            </span>
            <span
              className={
                passwordValid.upper ? "text-green-600" : "text-gray-400"
              }
            >
              • Ada huruf besar
            </span>
            <span
              className={
                passwordValid.number ? "text-green-600" : "text-gray-400"
              }
            >
              • Ada angka
            </span>
            <span
              className={
                passwordValid.symbol ? "text-green-600" : "text-gray-400"
              }
            >
              • Ada simbol (misal: !@#$%^&*)
            </span>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Daftar
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">Atau</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: window.location.origin + "/auth/callback",
              },
            });
          }}
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
          Daftar dengan Google
        </button>
      </div>
    </div>
  );
}
