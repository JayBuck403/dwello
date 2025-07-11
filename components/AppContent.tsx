"use client";

import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/AuthGuard";

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = [
    "/login",
    "/register",
    "/verify-email",
    "/verify-email-pending",
  ].includes(pathname);

  return isAuthPage ? children : <AdminGuard>{children}</AdminGuard>;
}
