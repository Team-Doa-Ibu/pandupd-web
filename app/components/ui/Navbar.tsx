import { useEffect, useState } from "react";
import { useLocation } from "@remix-run/react";
import { supabase } from "../../data/supabaseClient";
import { IconUser } from "@tabler/icons-react";
import { Alert } from "../ui/Alert";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
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
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  function handleLogouts() {
    setAlert({
      type: "warning",
      title: "Logout",
      message: "Anda yakin ingin logout?",
      onConfirm: confirmLogouts,
      confirmText: "Ya, logout",
      cancelText: "Batal",
    });
  }

  // Handler konfirmasi logout
  const confirmLogouts = async () => {
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
    <>
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
          </ul>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          {!user ? (
            <a href="/login">
              <button className="rounded-full bg-blue-500 px-5 py-1.5 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600">
                Masuk
              </button>
            </a>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                <IconUser size={18} />
                <span className="whitespace-nowrap">
                  {user.user_metadata?.name || user.email}
                </span>
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border bg-white shadow-lg">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="/history"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Riwayat
                  </a>
                  <hr />
                  <button
                    onClick={handleLogouts}
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
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

            <li className="mt-2 border-t border-gray-100 pt-2">
              <div className="px-6 py-2">
                {!user ? (
                  <a href="/login">
                    <button className="w-full rounded-full bg-blue-500 px-5 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600">
                      Masuk
                    </button>
                  </a>
                ) : (
                  <div className="relative">
                    <button
                      className="flex w-full items-center gap-2 rounded-full bg-blue-500 px-5 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600"
                      onClick={() => setDropdownOpen((v) => !v)}
                    >
                      <IconUser size={20} />
                      <span>{user.user_metadata?.name || user.email}</span>
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border bg-white shadow-lg">
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </a>
                        <a
                          href="/history"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Riwayat
                        </a>
                        <hr />
                        <button
                          onClick={handleLogouts}
                          className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
