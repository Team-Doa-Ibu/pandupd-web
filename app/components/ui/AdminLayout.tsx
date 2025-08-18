import { useState } from "react";
import { AdminSidebar, AdminSidebarToggle } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      {/* Mobile Toggle */}
      <AdminSidebarToggle onToggle={() => setSidebarOpen(true)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="px-4 py-6 lg:px-8">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
