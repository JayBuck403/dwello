"use client";

import Navbar from "@/components/header";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(
          "https://dwello-backend-express.onrender.com/api/agents"
        );
        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();
        setAgents(data);
      } catch (error) {
        setError("Failed to load agents");
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);
  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading agents...</p>
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
              <Card key={agent.id} className="rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-40 w-full bg-gray-200">
                  <Image
                    src={agent.profile_picture || "/placeholder-avatar.avif"}
                    alt={agent.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="p-5 text-center flex flex-col items-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 truncate w-full">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 font-medium">{agent.title}</p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-3 min-h-[48px]">{agent.bio}</p>
                  <div className="flex flex-col gap-2 w-full mb-3">
                    {currentUser ? (
                      <a
                        href={`tel:${agent.phone_call}`}
                        className="text-primary hover:underline flex items-center gap-1 text-sm justify-center border border-primary rounded-md py-1 px-2 bg-primary/5"
                      >
                        <Phone className="h-4 w-4" /> {agent.phone_call}
                      </a>
                    ) : (
                      <button
                        className="text-primary border border-primary rounded-md py-1 px-2 flex items-center gap-1 text-sm w-full justify-center hover:bg-primary/10"
                        onClick={() => router.push("/login")}
                        type="button"
                      >
                        <Phone className="h-4 w-4" /> Login to view number
                      </button>
                    )}
                  </div>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="text-primary font-semibold hover:underline text-sm mt-auto"
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
