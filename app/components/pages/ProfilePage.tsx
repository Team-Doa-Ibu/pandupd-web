import React, { useState } from "react";

export default function ProfilePage() {
  // State untuk mode edit
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [isEditingAdditional, setIsEditingAdditional] = useState(false);
  
  // Data profil (dalam implementasi nyata akan diambil dari API/database)
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@mail.com",
    password: "••••••••••",
    phone: "0851568623434",
    address: "Jl. Putra Tajur, Pemagarsari, Kec. Parung",
    birthDate: "07/06/1970",
    occupation: "Pengangguran"
  });

  // Handler untuk update data profil
  const handleUpdateProfile = (section, data) => {
    setProfile({...profile, ...data});
    
    // Reset mode edit
    if (section === 'basic') setIsEditingBasic(false);
    if (section === 'security') setIsEditingSecurity(false);
    if (section === 'additional') setIsEditingAdditional(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan background gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-12 px-4">
        <div className="container mx-auto max-w-4xl mt-16">
          <h1 className="text-3xl font-bold text-white">Profil</h1>
          <p className="text-blue-100 mt-2">
            Kelola informasi pribadi Anda. Semua yang penting, di satu tempat.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-6">
        {/* Card Profil Utama */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{profile.email}</span>
              </div>
            </div>
            <button className="mt-4 md:mt-0 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
              Logout
            </button>
          </div>
        </div>

        {/* Informasi Dasar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Informasi Dasar</h3>

          {isEditingBasic ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Nama Depan</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={profile.firstName}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Nama Belakang</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={profile.lastName}
                  />
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => handleUpdateProfile('basic', {
                  // Di sini Anda akan mengambil nilai dari input
                  // dan memperbarui state profile
                })}
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Nama Depan</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.firstName}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Nama Belakang</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.lastName}
                  </div>
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => setIsEditingBasic(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Keamanan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Keamanan</h3>
          
          {isEditingSecurity ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={profile.email}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Password</label>
                  <input 
                    type="password" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue="password123"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Nomor Telepon</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={profile.phone}
                />
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => handleUpdateProfile('security', {
                  // Di sini Anda akan mengambil nilai dari input
                  // dan memperbarui state profile
                })}
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Email</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.email}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Password</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.password}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Nomor Telepon</label>
                <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                  {profile.phone}
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => setIsEditingSecurity(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Informasi Tambahan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Informasi Tambahan</h3>
          
          {isEditingAdditional ? (
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Alamat</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  defaultValue={profile.address}
                  rows={3}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Tanggal Lahir</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={profile.birthDate}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Pekerjaan</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue={profile.occupation}
                  />
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                onClick={() => handleUpdateProfile('additional', {
                  // Di sini Anda akan mengambil nilai dari input
                  // dan memperbarui state profile
                })}
              >
                Simpan
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Alamat</label>
                <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50 min-h-[80px]">
                  {profile.address}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 mb-2">Tanggal Lahir</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.birthDate}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Pekerjaan</label>
                  <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                    {profile.occupation}
                  </div>
                </div>
              </div>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
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