"use client";

import Navbar from "@/components/header";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

interface Agent {
  id: string;
  name: string;
  title: string;
  profile_picture: string;
  phone_call: string;
  email: string;
  bio: string;
  properties: any[];
  slug: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(
          "https://dwello-backend-express.onrender.com/api/agents"
        );
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        console.log("Agents data:", data);
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="py-20 text-center">Loading agents...</div>
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
      <section className="py-8 bg-gray-50 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-primary mb-8">
            Meet Our Agents
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="rounded-xl overflow-hidden">
                <div className="relative h-25">
                  <Image
                    src={agent.profile_picture || "/placeholder-avatar.avif"}
                    alt={agent.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{agent.title}</p>
                  <div className="flex justify-center gap-3 mb-2">
                    <Link
                      href={`tel:${agent.phone_call}`}
                      className="text-primary hover:underline flex items-center gap-1 text-sm"
                    >
                      <Phone className="h-4 w-4" /> {agent.phone_call}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                    {agent.bio}
                  </p>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="text-primary font-semibold hover:underline text-sm"
                  >
                    View Profile ({agent.properties?.length || 0} Listings)
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
