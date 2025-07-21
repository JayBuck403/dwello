"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Bell, Eye, User, Settings } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

const savedProperties = [
  {
    id: 201,
    title: "Modern Apartment in Osu",
    location: "Osu, Accra",
    price: "GH₵ 1,200,000",
    imageUrl: "/sample-thumb-3.avif",
  },
  {
    id: 202,
    title: "Family House in East Legon",
    location: "East Legon, Accra",
    price: "GH₵ 3,500,000",
    imageUrl: "/sample-thumb-4.avif",
  },
  {
    id: 203,
    title: "Luxury Penthouse in Airport",
    location: "Airport, Accra",
    price: "GH₵ 8,000,000",
    imageUrl: "/sample-thumb-5.avif",
  },
];

const savedSearches = [
  {
    id: 301,
    name: "3 Bedroom Houses in Spintex",
    criteria: "3 Bedrooms, Houses, Spintex",
    frequency: "Daily",
  },
  {
    id: 302,
    name: "Apartments for Rent in Labone (GH₵ 1,500 - GH₵ 3,000)",
    criteria: "Apartments, For Rent, Labone, Price: 1500-3000",
    frequency: "Weekly",
  },
];

const recentlyViewed = [
  {
    id: 401,
    title: "Commercial Space in Cantonments",
    location: "Cantonments, Accra",
    imageUrl: "/sample-house.avif",
  },
  {
    id: 402,
    title: "Land for Sale in Tema",
    location: "Tema, Accra",
    imageUrl: "/nearby-1.avif",
  },
];

interface Agent {
  id: string;
  name: string;
  email: string;
  profile_picture: string;
}

export default function DashboardPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(
          `https://dwello-backend-express.onrender.com/api/agents/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch agent data");
        const data = await res.json();
        console.log("Agent Data:", data);
        setAgent(data);
      } catch (error) {
        console.error("Failed to fetch agent data", error);
        setAgent(null);
      }
    }

    fetchAgent();
  }, []);

  // If agent is null, show a message and a button to register as an agent
  if (agent === null) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Card className="p-8 max-w-md text-center">
            <CardTitle className="mb-4">Become an Agent</CardTitle>
            <p className="mb-6 text-gray-700">
              You have not registered as an agent yet. Register now to access agent features and manage your listings.
            </p>
            <Button onClick={() => router.push('/agents/registration')}>
              Register as Agent
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <Card className="rounded-lg">
                <CardContent className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={agent?.profile_picture || "/user-placeholder.avif"}
                      alt={agent?.name || "User"}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {agent?.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">{agent?.email}</p>
                  <nav className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => router.push("/dashboard/profile")}
                    >
                      <User className="w-4 h-4" /> Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => router.push("/dashboard/saved")}
                    >
                      <Bookmark className="w-4 h-4" /> Saved Properties
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => router.push("/dashboard/alerts")}
                    >
                      <Bell className="w-4 h-4" /> Alerts
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => router.push("/dashboard/activity")}
                    >
                      <Eye className="w-4 h-4" /> Recently Viewed
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => router.push("/dashboard/settings")}
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="md:col-span-3 space-y-6">
              {/* Overview */}
              <Card className="rounded-lg py-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <OverviewStat
                    title="Saved Properties"
                    count={savedProperties.length}
                    link="/dashboard/saved"
                  />
                  <OverviewStat
                    title="Saved Alerts"
                    count={savedSearches.length}
                    link="/dashboard/alerts"
                  />
                  <OverviewStat
                    title="Recently Viewed"
                    count={recentlyViewed.length}
                    link="/dashboard/history"
                  />
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="rounded-lg py-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Your Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedProperties.slice(0, 3).map((property) => (
                    <ActivityItem key={property.id} property={property} />
                  ))}
                  {recentlyViewed.slice(0, 2).map((property) => (
                    <ActivityItem
                      key={property.id}
                      property={property}
                      viewed
                    />
                  ))}
                  <Link
                    href="/dashboard/activity"
                    className="block mt-4 text-sm text-primary hover:underline"
                  >
                    View All Activity
                  </Link>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Reusable components for brevity and cleanliness
function OverviewStat({
  title,
  count,
  link,
}: {
  title: string;
  count: number;
  link: string;
}) {
  return (
    <div className="p-4 bg-white shadow-sm rounded-md">
      <div className="font-semibold text-gray-700">{title}</div>
      <div className="text-2xl font-bold text-primary">{count}</div>
      <Link
        href={link}
        className="text-sm text-primary hover:underline mt-1 block"
      >
        View All
      </Link>
    </div>
  );
}

function ActivityItem({
  property,
  viewed = false,
}: {
  property: any;
  viewed?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 p-3 bg-white shadow-sm rounded-md">
      <div className="relative w-20 h-16 overflow-hidden rounded-md">
        <Image
          src={property.imageUrl || "/placeholder-property.avif"}
          alt={property.title}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <Link
          href={`/property/${property.id}`}
          className="font-semibold hover:underline"
        >
          {viewed ? `Viewed: ${property.title}` : property.title}
        </Link>
        <p className="text-sm text-gray-600">{property.location}</p>
        {!viewed && <p className="text-sm text-primary">{property.price ? formatCurrency(property.price, property.currency) : ''}</p>}
      </div>
    </div>
  );
}
