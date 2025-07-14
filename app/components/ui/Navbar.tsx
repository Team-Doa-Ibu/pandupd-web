import { useState } from "react";
import { useLocation } from "@remix-run/react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="fixed left-1/2 top-6 z-50 box-border flex w-[95%] max-w-screen-xl -translate-x-1/2 items-center justify-between rounded-full border border-neutral-300 bg-white px-3 py-2 shadow-md sm:max-w-6xl sm:p-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
          <span className="font-semibold text-black">PANDU‑PD</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden flex-1 justify-center md:flex">
          <ul className="flex gap-6 font-bold">
            <li>
              <a
                href="/"
                className={
                  currentPath === "/"
                    ? "text-blue-600"
                    : "text-neutral-500 hover:text-neutral-800"
                }
              >
                Utama
              </a>
            </li>
            <li>
              <a
                href="/terapi"
                className={
                  currentPath === "/terapi"
                    ? "text-blue-600"
                    : "text-neutral-500 hover:text-neutral-800"
                }
              >
                Terapi
              </a>
            </li>
            <li>
              <a
                href="/artikel"
                className={
                  currentPath === "/artikel"
                    ? "text-blue-600"
                    : "text-neutral-500 hover:text-neutral-800"
                }
              >
                Artikel
              </a>
            </li>
            <li>
              <a
                href="/history"
                className={
                  currentPath === "/history"
                    ? "text-blue-600"
                    : "text-neutral-500 hover:text-neutral-800"
                }
              >
                Riwayat
              </a>
            </li>
          </ul>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <a href="/login">
            <button className="rounded-full bg-blue-500 px-5 py-1.5 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600">
              Masuk
            </button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center rounded-md p-2 text-gray-600 hover:text-blue-600 focus:outline-none md:hidden"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed left-1/2 top-20 z-40 mt-2 w-[95%] max-w-screen-xl -translate-x-1/2 rounded-xl border border-neutral-300 bg-white py-4 shadow-lg md:hidden">
          <ul className="flex flex-col text-sm font-bold">
            <li>
              <a
                href="/"
                className={`block px-6 py-2 ${currentPath === "/" ? "text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
              >
                Utama
              </a>
            </li>
            <li>
              <a
                href="/terapi"
                className={`block px-6 py-2 ${currentPath === "/terapi" ? "text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
              >
                Terapi
              </a>
            </li>
            <li>
              <a
                href="/artikel"
                className={`block px-6 py-2 ${currentPath === "/artikel" ? "text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
              >
                Artikel
              </a>
            </li>
            <li>
              <a
                href="/history"
                className={`block px-6 py-2 ${currentPath === "/history" ? "text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
              >
                Riwayat
              </a>
            </li>
            <li className="mt-2 border-t border-gray-100 pt-2">
              <div className="px-6 py-2">
                <a href="/login">
                  <button className="w-full rounded-full bg-blue-500 px-5 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600">
                    Masuk
                  </button>
                </a>
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
