"use client";

import Navbar from "@/components/header";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

interface Properties {
  id: string;
  title: string;
  location: string;
  price: string;
  image_urls: string[];
}

interface Agent {
  id: string;
  name: string;
  title?: string;
  profile_picture?: string;
  phone_call?: string;
  phone_whatsapp?: string;
  email: string;
  bio?: string;
  experience?: string;
  slug: string;
  specializations?: string[];
  areasServed?: string[];
  properties?: Properties[];
}

export default function AgentProfilePage() {
  const params = useParams();
  const agentSlug = params?.["agent-slug"] as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgent() {
      try {
        const res = await fetch(
          `https://dwello-backend-express.onrender.com/api/agents/${agentSlug}`
        );
        if (!res.ok) throw new Error("Failed to fetch agent data");
        const data = await res.json();
        console.log("Agent Data:", data);
        setAgent(data);
      } catch (error) {
        console.error("Failed to fetch agent data", error);
      } finally {
        setLoading(false);
      }
    }

    if (agentSlug) {
      fetchAgent();
    }
  }, [agentSlug]);

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading agent...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div>
        <Navbar />
        <div className="container py-10 text-center text-red-500">
          Agent not found
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="lg:grid grid-cols-3 gap-8">
          {/* Agent Information */}
          <aside className="col-span-1">
            <Card className="rounded-2xl mb-8">
              <CardContent className="p-6 text-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={agent.profile_picture || "/placeholder-avatar.avif"}
                    alt={agent.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {agent.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3 italic">
                  {agent.title}
                </p>
                <div className="space-y-2">
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      asChild
                      className="flex items-center justify-center gap-2 text-white hover:bg-green-600"
                    >
                      <a
                        href={`https://wa.me/${agent.phone_whatsapp}?text=Hello, I'd like to inquire about your listings.`} // Check if phone_whatsapp is in international format
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center gap-2"
                      >
                        <svg
                          viewBox="0 0 32 32"
                          fill="white"
                          className="h-5 w-5"
                        >
                          <path
                            d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                        WhatsApp
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="flex items-center justify-center gap-2 text-primary border-primary hover:bg-primary/10"
                    >
                      <a
                        href={`tel:${agent.phone_call}`}
                        className="w-full h-full flex items-center justify-center gap-2"
                      >
                        <Phone className="h-4 w-4" /> Call
                      </a>
                    </Button>
                  </div>
                  <p className="text-gray-700 text-sm flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> {agent.email}
                  </p>
                  {agent.experience && (
                    <p className="text-gray-700 text-sm">
                      Experience:{" "}
                      <span className="font-medium">
                        {agent.experience} years
                      </span>
                    </p>
                  )}
                </div>

                {agent.areasServed && (
                  <div className="mt-4 text-left">
                    <p className="text-gray-800 font-semibold text-sm mb-1">
                      Areas Served
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {agent.areasServed.map((area) => (
                        <li key={area}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Agent Bio + Listings */}
          <section className="col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Meet {agent.name}
              </h2>
              <p className="text-gray-700 leading-relaxed">{agent.bio}</p>

              {agent.specializations && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Specializations
                  </h3>
                  <ul className="text-gray-700 list-disc list-inside">
                    {agent.specializations.map((specialization) => (
                      <li key={specialization}>{specialization}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Listings */}
            {/* Agent's Listings */}
            {agent.properties && agent.properties.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Listings by {agent.name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agent.properties.map((property) => (
                    <Card
                      key={property.id}
                      className="rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.01]"
                    >
                      <div className="relative h-28">
                        <Image
                          src={property.image_urls[0] || "/sample-house.avif"}
                          alt={property.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
                          {property.title}
                        </h3>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                          <MapPin className="h-3 w-3" /> {property.location}
                        </p>
                        <p className="text-primary font-semibold text-sm">
                          {property.price ? formatCurrency(parseFloat(property.price), "GHS") : ''}
                        </p>
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-primary text-xs font-semibold hover:underline mt-1 block"
                        >
                          View Details
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* "View All Listings" Link - Update the href */}
                {agent.properties.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link
                      href={`/agents/${agentSlug}/listings`} // Use the agentSlug here
                      className="text-primary font-semibold hover:underline"
                    >
                      View All Listings by {agent.name}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
