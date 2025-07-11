"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-primary">
        Dwello
      </Link>{" "}
      {/* Your brand name/logo */}
      <div className="hidden md:flex gap-6 text-sm text-gray-700">
        <Link href="/properties" className="hover:text-primary font-medium">
          Properties
        </Link>
        <Link href="/agents" className="hover:text-primary font-medium">
          Agents
        </Link>
        <Link href="/blog" className="hover:text-primary font-medium">
          Blog
        </Link>
        <Link href="/pricing" className="hover:text-primary font-medium">
          Pricing
        </Link>
        <Link href="/contact" className="hover:text-primary font-medium">
          Contact
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="outline">Login</Button>
        <Button>Sign Up</Button>
      </div>
      {/* Mobile Navigation (you might want to add a hamburger menu here) */}
      <div className="md:hidden">
        {/* Mobile menu icon */}
        <button>☰</button>
      </div>
    </nav>
  );
}
