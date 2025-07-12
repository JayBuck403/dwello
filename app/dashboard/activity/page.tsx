"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Eye, Clock, MapPin } from "lucide-react";
import { getAuthToken } from "@/components/getToken";
import Navbar from "@/components/header";
import Footer from "@/components/Footer";

interface Activity {
  id: string;
  action: string;
  created_at: string;
  properties: {
    id: string;
    title: string;
    location: string;
    price: number;
    currency: string;
    image_urls: string[];
    slug: string;
  };
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
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
          "https://dwello-backend-express.onrender.com/api/user/activity?limit=20",
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
        setActivities(data);
      } catch (e: any) {
        console.error("Could not fetch activity:", e);
        setError("Failed to load activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "viewed":
        return <Eye className="h-4 w-4" />;
      case "searched":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "viewed":
        return "Viewed property";
      case "searched":
        return "Searched for properties";
      default:
        return action;
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Recent Activity
            </h1>
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading activity...</p>
            </div>
          </div>
        </div>
        <Footer />
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
            Recent Activity
          </h1>
          <div className="text-center py-20 text-red-500">{error}</div>
        </div>
      </div>
      <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
    
    <div className="min-h-screen bg-gray-50 py-8">
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Recent Activity
        </h1>

        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card
                key={activity.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {getActionIcon(activity.action)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {getActionText(activity.action)}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatDate(activity.created_at)}
                        </span>
                      </div>

                      {activity.properties && (
                        <div className="mt-3 flex items-center space-x-4">
                          <div className="relative w-16 h-12 rounded overflow-hidden">
                            <Image
                              src={
                                activity.properties.image_urls?.[0] ||
                                "/placeholder-image.webp"
                              }
                              alt={activity.properties.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {activity.properties.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {activity.properties.location}
                            </p>
                            <p className="text-xs font-medium text-primary">
                              {activity.properties.currency}{" "}
                              {activity.properties.price?.toLocaleString()}
                            </p>
                          </div>
                          <Link href={`/properties/${activity.properties.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-600 mb-6">
              Your browsing activity will appear here as you explore properties.
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
