import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import {
  IconHome,
  IconBook,
  IconVideo,
  IconUsers,
  IconSettings,
  IconLogout,
  IconMenu2,
  IconX,
  IconDashboard,
  IconArticle,
  IconChartBar,
  IconChevronRight,
} from "@tabler/icons-react";
import { supabase } from "../../data/supabaseClient";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AdminSidebar({ isOpen = false, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = "/login";
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: IconDashboard,
      href: "/admin/cihuy",
      description: "Overview admin panel",
    },
    {
      title: "Kelola Course",
      icon: IconBook,
      href: "/admin/courses",
      description: "Tambah, edit, dan hapus course",
    },
    {
      title: "Artikel",
      icon: IconArticle,
      href: "/admin/articles",
      description: "Kelola artikel kesehatan",
    },
    {
      title: "Users",
      icon: IconUsers,
      href: "/admin/users",
      description: "Kelola pengguna",
    },
    {
      title: "Settings",
      icon: IconSettings,
      href: "/admin/settings",
      description: "Pengaturan sistem",
    },
  ];

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? "w-16" : "w-64"}`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                <IconHome className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-800">Admin Panel</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded p-1 text-gray-500 hover:bg-gray-100 lg:block"
            >
              {isCollapsed ? (
                <IconChevronRight size={16} />
              ) : (
                <IconX size={16} />
              )}
            </button>

            <button
              onClick={onToggle}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <IconX size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-r-2 border-blue-500 bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={onToggle}
              >
                <Icon
                  size={20}
                  className={`${
                    active
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {!isCollapsed && (
                  <div className="flex-1">
                    <span>{item.title}</span>
                    {!isCollapsed && (
                      <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <IconLogout
              size={20}
              className="text-gray-400 group-hover:text-red-500"
            />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}

// Mobile Toggle Button Component
export function AdminSidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
    >
      <IconMenu2 size={20} className="text-gray-700" />
    </button>
  );
}
