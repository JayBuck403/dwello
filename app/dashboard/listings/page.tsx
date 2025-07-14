"use client";

import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Eye, Trash } from "lucide-react";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/components/getToken";
import { formatCurrency } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  image_urls: string[];
  status: string;
  slug: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  area_unit?: string;
}

export default function ManageListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProperties() {
      try {
        const token = await getAuthToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await fetch(
          "https://dwello-backend-express.onrender.com/api/agents/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch agent data");
        const agentData = await res.json();

        // The agent data includes properties, so we can use those
        setProperties(agentData.properties || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError("Failed to load your listings");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProperties();
  }, []);

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }
      const res = await fetch(
        `https://dwello-backend-express.onrender.com/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      } else {
        alert("Failed to delete property");
      }
    } catch (err) {
      alert("Error deleting property");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading your listings...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="py-20 text-center text-red-500">{error}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-800">
              Manage Your Listings
            </h1>
            <Link href="/sell/create">
              <Button className="text-sm">+ Create New Listing</Button>
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  className="hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden bg-white h-full flex flex-col"
                >
                  <div className="relative w-full h-40 shrink-0">
                    <Image
                      src={
                        property.image_urls?.[0] || "/placeholder-property.avif"
                      }
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-primary">
                        {property.price ? formatCurrency(property.price, property.currency) : ''}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {property.bedrooms && (
                          <span>{property.bedrooms} beds</span>
                        )}
                        {property.bathrooms && (
                          <span>{property.bathrooms} baths</span>
                        )}
                        {property.area && (
                          <span>
                            {property.area} {property.area_unit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm mb-4">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          property.status === "available"
                            ? "text-green-600"
                            : property.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <Link href={`/sell/edit/${property.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/properties/${property.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center mt-10">
              You haven't listed any properties yet.{" "}
              <Link
                href="/sell/create"
                className="text-primary font-medium hover:underline"
              >
                Create a new listing
              </Link>
              .
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
