import React, { useState, useEffect } from "react";
import { supabase } from "../../data/supabaseClient";
import Swal from "sweetalert2";
import { Alert } from "../ui/Alert";

export default function ProfilePage() {
  // State untuk mode edit
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [isEditingAdditional, setIsEditingAdditional] = useState(false);

  // Data profil (dalam implementasi nyata akan diambil dari API/database)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@mail.com",
    password: "••••••••••",
    phone: "0851568623434",
    address: "Jl. Putra Tajur, Pemagarsari, Kec. Parung",
    birthDate: "07/06/1970",
    occupation: "Pengangguran",
  });

  // State untuk notifikasi
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    title?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);

  useEffect(() => {
    // Tampilkan alert selamat datang hanya jika baru login
    if (window.localStorage.getItem("justLoggedIn") === "1") {
      setAlert({
        type: "success",
        title: "Selamat datang!",
        message: "Anda berhasil login.",
        cancelText: "Tutup",
      });
      window.localStorage.removeItem("justLoggedIn");
    }
  }, []);

  useEffect(() => {
    const syncProfileAndRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Cek user_profile
      const { data: profile } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!profile) {
        await supabase.from("user_profile").insert([
          {
            user_id: user.id,
            name: user.user_metadata?.name || "",
            email: user.email,
            phone: user.user_metadata?.phone || "",
            address: user.user_metadata?.address || "",
            birth_date: user.user_metadata?.birth_date || "",
            occupation: user.user_metadata?.occupation || "",
          },
        ]);
      }

      // Cek role
      const { data: role } = await supabase
        .from("role")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!role) {
        await supabase
          .from("role")
          .insert([{ user_id: user.id, role: "User" }]);
      }
    };
    syncProfileAndRole();

    // Ambil data profil user dari Supabase
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil data dari tabel 'user_profile' berdasarkan user_id
      const { data: profileData, error } = await supabase
        .from("user_profile")
        .select("name, email, no_telp, alamat, tgl_lahir, pekerjaan")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile((prev) => ({
          ...prev,
          name: profileData.name || prev.name,
          email: user.email ? user.email : prev.email,
          phone: profileData.no_telp || prev.phone,
          address: profileData.alamat || prev.address,
          birthDate: profileData.tgl_lahir || prev.birthDate,
          occupation: profileData.pekerjaan || prev.occupation,
        }));
      } else if (user.email) {
        setProfile((prev) => ({
          ...prev,
          email: user.email ? user.email : prev.email,
        }));
      }
    };
    fetchProfile();
  }, []);

  // Handler untuk update data profil
  const handleUpdateProfile = (section: any, data: any) => {
    setProfile({ ...profile, ...data });

    // Reset mode edit
    if (section === "basic") setIsEditingBasic(false);
    if (section === "security") setIsEditingSecurity(false);
    if (section === "additional") setIsEditingAdditional(false);
  };

  function handleLogout() {
    setAlert({
      type: "warning",
      title: "Logout",
      message: "Anda yakin ingin logout?",
      onConfirm: confirmLogout,
      confirmText: "Ya, logout",
      cancelText: "Batal",
    });
  }

  // Handler konfirmasi logout
  const confirmLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAlert({
        type: "success",
        message: "Berhasil logout. Anda akan diarahkan ke halaman login.",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      setAlert({ type: "error", message: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alert notification */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={!!alert}
          onConfirm={alert.onConfirm}
          onCancel={() => setAlert(null)}
          confirmText={alert.confirmText}
          cancelText={alert.cancelText}
        />
      )}
      {/* Header dengan background gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-12">
        <div className="container mx-auto mt-16 max-w-4xl">
          <h1 className="text-3xl font-bold text-white">Profil</h1>
          <p className="mt-2 text-blue-100">
            Kelola informasi pribadi Anda. Semua yang penting, di satu tempat.
          </p>
        </div>
      </div>

      <div className="container mx-auto -mt-6 max-w-4xl px-4">
        {/* Card Profil Utama */}
        <div className="mb-6 mt-16 rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-col items-center justify-between md:flex-row md:items-start">
            <div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <div className="mt-1 flex items-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{profile.email}</span>
              </div>
            </div>
            <button
              className="mt-4 rounded-full bg-red-100 px-4 py-2 text-red-600 transition hover:bg-red-200 md:mt-0"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Informasi Dasar */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-blue-500">
            Informasi Dasar
          </h3>

          {isEditingBasic ? (
            <div>
              <div>
                <label className="mb-2 block text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={profile.name}
                />
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue={profile.email}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-600">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue={profile.phone}
                  />
                </div>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => handleUpdateProfile("basic", {})}
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div>
                <label className="mb-2 block text-gray-600">Nama Lengkap</label>
                <div className="mb-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                  {profile.name}
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">Email</label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.email}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-gray-600">
                    Nomor Telepon
                  </label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.phone}
                  </div>
                </div>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsEditingBasic(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Keamanan */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-blue-500">Keamanan</h3>

          {isEditingSecurity ? (
            <div>
              <div>
                <label className="mb-2 block text-gray-600">
                  Password Lama
                </label>
                <input
                  type="password"
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={profile.password}
                />
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">
                    Password Baru
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue=""
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-gray-600">
                    Ulangi Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue=""
                  />
                </div>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => handleUpdateProfile("security", {})}
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div>
                <label className="mb-2 block text-gray-600">
                  Password Lama
                </label>
                <div className="mb-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                  {profile.password}
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">
                    Password Baru
                  </label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.password}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-gray-600">
                    Ulangi Password
                  </label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.password}
                  </div>
                </div>{" "}
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsEditingSecurity(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Informasi Tambahan */}
        <div className="mb-10 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-blue-500">
            Informasi Tambahan
          </h3>

          {isEditingAdditional ? (
            <div>
              <div className="mb-4">
                <label className="mb-2 block text-gray-600">Alamat</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  defaultValue={profile.address}
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">
                    Tanggal Lahir
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue={profile.birthDate}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-gray-600">Pekerjaan</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    defaultValue={profile.occupation}
                  />
                </div>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() =>
                  handleUpdateProfile("additional", {
                    // Di sini Anda akan mengambil nilai dari input
                    // dan memperbarui state profile
                  })
                }
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="mb-2 block text-gray-600">Alamat</label>
                <div className="min-h-[80px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                  {profile.address}
                </div>
              </div>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-gray-600">
                    Tanggal Lahir
                  </label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.birthDate}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-gray-600">Pekerjaan</label>
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    {profile.occupation}
                  </div>
                </div>
              </div>
              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => setIsEditingAdditional(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
