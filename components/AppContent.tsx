"use client";

import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/AuthGuard";
import { UserGuard } from "@/components/AuthGuard";

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = [
    "/login",
    "/register",
    "/verify-email",
    "/verify-email-pending",
  ].includes(pathname);

  const isAdminPage = pathname.startsWith("/admin");

  // Auth pages don't need any guard
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Admin pages need AdminGuard
  if (isAdminPage) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  // All other pages need UserGuard (for regular users)
  return <UserGuard>{children}</UserGuard>;
}
