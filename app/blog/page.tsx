"use client";

import Navbar from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const blogPosts = [
  {
    id: 1,
    title: "Investing in Accra Real Estate: Trends to Watch in 2025",
    slug: "investing-in-accra-real-estate-2025",
    excerpt:
      "Discover the key trends shaping the Accra real estate market in 2025 and learn about potential investment opportunities.",
    imageUrl: "/blog-1.avif",
    date: "2025-04-20",
    author: "Kwame Asare",
  },
  {
    id: 2,
    title: "Tips for First-Time Home Buyers in Kumasi",
    slug: "first-time-home-buyers-kumasi",
    excerpt:
      "A comprehensive guide for individuals looking to purchase their first home in the vibrant city of Kumasi.",
    imageUrl: "/blog-2.avif",
    date: "2025-04-15",
    author: "Yaa Boateng",
  },
  {
    id: 3,
    title: "Renting vs. Buying Property in Ghana: Making the Right Choice",
    slug: "renting-vs-buying-property-ghana",
    excerpt:
      "An insightful comparison to help you decide whether renting or buying a property is the better option for your current situation in Ghana.",
    imageUrl: "/blog-3.avif",
    date: "2025-04-10",
    author: "Ekow Mensah",
  },
  {
    id: 4,
    title: "Renting vs. Buying Property in Ghana: Making the Right Choice",
    slug: "renting-vs-buying-property-ghana",
    excerpt:
      "An insightful comparison to help you decide whether renting or buying a property is the better option for your current situation in Ghana.",
    imageUrl: "/blog-3.avif",
    date: "2025-04-10",
    author: "Ekow Mensah",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">
            Insights & Resources
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post, index) => {
              const ref = useRef(null);
              const isInView = useInView(ref, {
                once: true,
                margin: "0px 0px -100px 0px",
              });

              return (
                <motion.div
                  key={post.id}
                  ref={ref}
                  variants={fadeInUp}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <Card className="rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 overflow-hidden flex flex-col">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex flex-col h-full"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.imageUrl || "/placeholder-blog.avif"}
                          alt={post.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <CardContent className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(post.date).toLocaleDateString("en-GH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <span className="italic">By {post.author}</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
