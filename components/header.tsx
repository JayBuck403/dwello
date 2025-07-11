"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState({ name: "", email: "", photoURL: "" });
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as FirebaseUser);
        setUserData({
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        });
      } else {
        setUser(null);
        setUserData({ name: "", email: "", photoURL: "" });
      }
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { href: "/properties", label: "Properties" },
    { href: "/agents", label: "Agents" },
    { href: "/blog", label: "Blog" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between relative z-50">
      {/* Brand */}
      <Link href="/" className="text-xl font-bold text-primary">
        Dwello
      </Link>
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 text-sm text-gray-700">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-primary font-medium transition-colors duration-150 ${
              isActive(link.href) ? "text-primary underline underline-offset-4" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* User Actions */}
      <div className="hidden md:flex gap-4 items-center">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                <Avatar>
                  {userData.photoURL ? (
                    <AvatarImage src={userData.photoURL} alt={userData.name || userData.email || "User"} />
                  ) : (
                    <AvatarFallback>
                      {userData.name
                        ? userData.name.split(" ").map((n) => n[0]).join("")
                        : userData.email?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2">
                <div className="font-medium text-sm text-gray-900">{userData.name || "User"}</div>
                <div className="text-xs text-gray-500">{userData.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}> <UserIcon className="w-4 h-4 mr-2" /> Profile </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard")}> <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive"> <LogOut className="w-4 h-4 mr-2" /> Logout </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="outline" onClick={() => router.push("/login")}>Login</Button>
            <Button onClick={() => router.push("/register")}>Sign Up</Button>
          </>
        )}
      </div>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>
      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg flex flex-col p-6 gap-6 animate-in slide-in-from-right-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-primary">Menu</span>
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                ×
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 px-2 rounded hover:bg-gray-100 font-medium transition-colors duration-150 ${
                    isActive(link.href) ? "text-primary underline underline-offset-4" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar>
                      {userData.photoURL ? (
                        <AvatarImage src={userData.photoURL} alt={userData.name || userData.email || "User"} />
                      ) : (
                        <AvatarFallback>
                          {userData.name
                            ? userData.name.split(" ").map((n) => n[0]).join("")
                            : userData.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{userData.name || "User"}</div>
                      <div className="text-xs text-gray-500">{userData.email}</div>
                    </div>
                  </div>
                  <Button variant="ghost" className="justify-start" onClick={() => { router.push("/dashboard/profile"); setMobileOpen(false); }}>
                    <UserIcon className="w-4 h-4 mr-2" /> Profile
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </Button>
                  <Button variant="ghost" className="justify-start text-destructive" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { router.push("/login"); setMobileOpen(false); }}>Login</Button>
                  <Button onClick={() => { router.push("/register"); setMobileOpen(false); }}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
