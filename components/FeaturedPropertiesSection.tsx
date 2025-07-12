"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square } from "lucide-react";
import PropertyCard from "./propertyCard";
import { useState, useEffect } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  area_unit: string | null;
  image_urls: string[];
  slug: string;
  is_featured: boolean;
}

export default function FeaturedPropertiesSection() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProperties() {
      try {
        const res = await fetch("http://localhost:8000/api/properties?is_featured=true&limit=4");
        if (!res.ok) throw new Error("Failed to fetch featured properties");
        const data = await res.json();
        console.log("Featured properties:", data);
        setFeaturedProperties(data.data || []);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
        // Fallback to empty array if API fails
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading featured properties...</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">
          Featured Properties
        </h2>
        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            No featured properties available at the moment.
          </div>
        )}
        <div className="mt-8 text-center">
          <Link
            href="/properties"
            className="text-primary font-semibold hover:underline"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
