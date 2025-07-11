import { cn } from "@/lib/utils"; // Utility function from Shadcn UI
import { Inter } from "next/font/google";
import "./globals.css";
import { AppContent } from "@/components/AppContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Real Estate Listing",
  description: "A real estate listing page built with Next.js and Shadcn UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-100")}>
        <AppContent>{children}</AppContent>
      </body>
    </html>
  );
}
