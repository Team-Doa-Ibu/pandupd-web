import React from "react";
import RegisterPage from "../components/pages/RegisterPage";
import { supabase } from "../data/supabaseClient";
import { json } from "@remix-run/node";

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();
  const email = (form.get("email") as string) || "";
  const password = (form.get("password") as string) || "";
  const fullname = (form.get("fullname") as string) || "";

  // 1. Cek apakah email sudah terdaftar
  const { data } = await supabase
    .from("user_profile")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (data) {
    return json(
      {
        error: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
      },
      { status: 400 },
    );
  }

  // 2. Register ke Supabase Auth (akan kirim email verifikasi)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: fullname },
      emailRedirectTo: `${process.env.ORIGIN || "http://localhost:3000"}/login`,
    },
  });

  if (signUpError) {
    return json({ error: signUpError.message }, { status: 400 });
  }

  // 3. Insert ke user_profile dan role (jika user sudah terdaftar di Auth)
  const user = signUpData.user;
  if (user) {
    // Insert ke user_profile
    const { error: profileError } = await supabase.from("user_profile").insert([
      {
        user_id: user.id,
        name: fullname,
        email,
        phone: "",
        address: "",
        birth_date: "",
        occupation: "",
      },
    ]);
    if (profileError) {
      return json({ error: profileError.message }, { status: 400 });
    }
    // Insert ke role
    const { error: roleError } = await supabase
      .from("role")
      .insert([{ user_id: user.id, role: "user" }]);
    if (roleError) {
      return json({ error: roleError.message }, { status: 400 });
    }
  }

  return json({
    success: true,
    message: "Cek email Anda untuk verifikasi sebelum login.",
  });
};

export default function register() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
