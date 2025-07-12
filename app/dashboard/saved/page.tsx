"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, Phone } from "lucide-react";
import { getAuthToken } from "@/components/getToken";
import Footer from "@/components/Footer";
import Navbar from "@/components/header";


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
  agent: {
    name: string;
    email: string;
    phone_call: string;
  };
}

export default function SavedPropertiesPage() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://dwello-backend-express.onrender.com/api/user/saved-properties",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSavedProperties(data);
      } catch (e: any) {
        console.error("Could not fetch saved properties:", e);
        setError("Failed to load saved properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleRemoveSaved = async (propertyId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/user/saved-properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSavedProperties(
          savedProperties.filter((property) => property.id !== propertyId)
        );
        alert("Property removed from saved list");
      } else {
        alert("Failed to remove property");
      }
    } catch (error) {
      console.error("Error removing saved property:", error);
      alert("Error removing property");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading saved properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Saved Properties
          </h1>
          <div className="text-center py-20 text-red-500">{error}</div>
        </div>
      </div>
      <Footer />
      </div>
    );
  }

  return (
    <div><Navbar />
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Saved Properties
        </h1>

        {savedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={property.image_urls?.[0] || "/placeholder-image.webp"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSaved(property.id)}
                      className="bg-white/80 hover:bg-white text-red-500"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-primary">
                      {property.currency} {property.price?.toLocaleString()}
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
                  <div className="flex items-center justify-between">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    {property.agent?.phone_call && (
                      <a href={`tel:${property.agent.phone_call}`}>
                        <Button size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Agent
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No saved properties yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and save your favorites to view them
              here.
            </p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </div>
  );
}
