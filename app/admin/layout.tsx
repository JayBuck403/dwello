// app/admin/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Newspaper, Settings, Users, House, BarChart3 } from "lucide-react";
import Link from "next/link";
import { AdminGuard } from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard - Dwello",
  description: "Professional admin area for managing the real estate platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminGuard>
          <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
              <div className="mb-10 text-2xl font-bold text-primary tracking-tight">
                Dwello Admin
              </div>
              <nav className="space-y-3 text-sm">
                <Link
                  href="/admin/overview"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <BarChart3 className="h-5 w-5 text-gray-500" />
                  Overview
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Users className="h-5 w-5 text-gray-500" />
                  Manage Users
                </Link>
                <Link
                  href="/admin/properties"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <House className="h-5 w-5 text-gray-500" />
                  Manage Listings
                </Link>
                <Link
                  href="/admin/blog/new"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Newspaper className="h-5 w-5 text-gray-500" />
                  New Blog Post
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  Settings
                </Link>
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

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-y-auto bg-gray-50">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {children}
              </div>
            </main>
          </div>
        </AdminGuard>
      </body>
    </html>
  );
}
