"use client";

import { motion } from "framer-motion";

export default function AnimatedBlogWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="container mx-auto px-4 lg:flex lg:gap-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
