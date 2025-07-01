import React from "react";

export function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-screen-xl box-border bg-white rounded-full shadow flex items-center px-6 py-2">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full" />
        <span className="font-semibold text-black">Parked</span>
      </div>
      <div className="flex-1 flex justify-center">
        <ul className="flex gap-6">
          <li>
            <a href="#" className="text-blue-600 font-semibold">
              Utama
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Terapi
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Artikel
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              Riwayat
            </a>
          </li>
        </ul>
      </div>
      <div>
        <button className="bg-blue-500 text-white px-5 py-1.5 rounded-full font-semibold hover:bg-blue-600 transition">
          Masuk
        </button>
      </div>
    </nav>
  );
}