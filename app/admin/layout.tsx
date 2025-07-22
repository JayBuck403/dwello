"use client";
// app/admin/layout.tsx
import { useState } from "react";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Newspaper, Settings, Users, House, BarChart3, Menu, X } from "lucide-react";
import Link from "next/link";
import { AdminGuard } from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

// Removed metadata export from this file

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: "/admin/overview", label: "Overview", icon: BarChart3 },
    { href: "/admin/agents", label: "Manage Agents", icon: Users },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/properties", label: "Manage Listings", icon: House },
    { href: "/admin/blog/new", label: "New Blog Post", icon: Newspaper },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminGuard>
          <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header with Hamburger for mobile */}
            <header className="md:hidden flex items-center justify-between bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-40">
              <button
                aria-label="Open sidebar menu"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded hover:bg-gray-100 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-xl font-bold text-primary">Dwello Admin</span>
              <div /> {/* Spacer for symmetry */}
            </header>

            <div className="flex flex-1">
              {/* Sidebar (desktop) */}
              <aside className="hidden md:flex w-64 bg-white shadow-lg p-6 flex-col">
                <div className="mb-10 text-2xl font-bold text-primary tracking-tight">
                  Dwello Admin
                </div>
                <nav className="space-y-3 text-sm">
                  {navLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-gray-500" />
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <Link
                    href="/"
                    className="block text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    ← Back to Site
                  </Link>
                </div>
              </aside>

              {/* Sidebar Drawer (mobile) */}
              {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex">
                  <div
                    className="fixed inset-0 bg-black/40"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar menu"
                  />
                  <aside className="relative w-64 max-w-full h-full bg-white shadow-lg p-6 flex flex-col animate-in slide-in-from-left-10">
                    <button
                      aria-label="Close sidebar menu"
                      onClick={() => setSidebarOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 focus:outline-none"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="mb-10 text-2xl font-bold text-primary tracking-tight">
                      Dwello Admin
                    </div>
                    <nav className="space-y-3 text-sm">
                      {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="h-5 w-5 text-gray-500" />
                          {label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto pt-6 border-t border-gray-200">
                      <Link
                        href="/"
                        className="block text-sm text-gray-600 hover:text-primary transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        ← Back to Site
                      </Link>
                    </div>
                  </aside>
                </div>
              )}

              {/* Main Content */}
              <main className="flex-1 p-2 md:p-10 overflow-y-auto bg-gray-50 min-h-screen">
                <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-gray-200">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AdminGuard>
      </body>
    </html>
  );
}
