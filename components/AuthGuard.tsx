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
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
