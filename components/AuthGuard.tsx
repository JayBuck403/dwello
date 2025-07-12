"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      setLoading(false);
      if (!authUser) {
        router.push("/login");
        return;
      }
      // Check for admin custom claim
      const token = await authUser.getIdTokenResult();
      if (token.claims.admin || token.claims.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        router.push("/dashboard"); // Not an admin, redirect to dashboard
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export function UserGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      setLoading(false);
      
      if (!authUser) {
        // If user is not authenticated and trying to access a protected page
        if (pathname.startsWith("/dashboard")) {
          router.push("/login");
        }
        // For public pages like home, properties, etc., allow access
        return;
      }
      
      // User is authenticated, allow access to all non-admin pages
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Allow access to all pages for authenticated users
  // For unauthenticated users, only allow access to public pages
  if (!user && pathname.startsWith("/dashboard")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
