"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* First Column: Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">
            Dwello Homes
          </h4>
          <p className="text-sm mb-2">
            Your trusted partner in finding the perfect property in Ghana.
          </p>
          <p className="text-sm">Tema, Ghana</p>
          {/* Optional: Contact details */}
          <p className="text-sm mt-2">Email: info@dwello.com</p>
          <p className="text-sm">Phone: +233 592 564 030</p>
        </div>

        {/* Second Column: Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="text-sm">
            <li>
              <Link href="/properties" className="hover:text-gray-400">
                Properties
              </Link>
            </li>
            <li>
              <Link href="/agents" className="hover:text-gray-400">
                Agents
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-400">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-400">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/faqs" className="hover:text-gray-400">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Third Column: Legal & Policies */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Legal</h4>
          <ul className="text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-gray-400">
                Terms of Service
              </Link>
            </li>
            {/* Optional: Cookie Policy */}
            {/* <li><Link href="/cookie-policy" className="hover:text-gray-400">Cookie Policy</Link></li> */}
          </ul>
        </div>

        {/* Fourth Column: Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
          <div className="flex gap-4 text-gray-400">
            <Link href="#" className="hover:text-white">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-white">
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-white">
              <Instagram className="h-6 w-6" />
            </Link>
            {/* Add other social media links */}
          </div>
          <p className="text-sm mt-4">
            &copy; {currentYear} Dwello Homes. All rights reserved.
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-6 text-center text-xs text-gray-400">
        {/* Optional: Small print or additional links */}
        {/* <Link href="#" className="hover:text-gray-300 mr-4">Sitemap</Link> */}
      </div>
    </footer>
  );
}
