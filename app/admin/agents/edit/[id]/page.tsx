"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  // Add other relevant agent properties
}

const mockAgents: Record<string, Agent> = {
  "1": {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+233 50 XXX XXXX",
    bio: "Experienced real estate agent specializing in residential properties.",
  },
  "2": {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+233 24 XXX XXXX",
    bio: "Dedicated to finding the perfect commercial spaces for businesses.",
  },
  "3": {
    id: "3",
    name: "Kwame Nkrumah",
    email: "kwame.n@example.com",
    phone: "+233 55 XXX XXXX",
    bio: "Expert in land acquisition and property development.",
  },
};

export default function EditAgentPage() {
  const params = useParams();
  const id = params?.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAgent = async () => {
      // Simulate fetching data based on the ID
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockAgentData = mockAgents[id];

      if (mockAgentData) {
        setAgent(mockAgentData);
        setName(mockAgentData.name);
        setEmail(mockAgentData.email);
        setPhone(mockAgentData.phone);
        setBio(mockAgentData.bio);
      } else {
        console.error("Agent not found with ID:", id);
        // Optionally set an error state to display a message
      }
    };

    if (id) {
      fetchAgent();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess(false);

    const updatedAgentData = {
      name,
      email,
      phone,
      bio,
    };

    try {
      // Simulate successful update
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Updated agent data:", updatedAgentData);
      setUpdateSuccess(true);
      // Optionally redirect to the agents list page
      router.push("/admin/agents");
    } catch (error: any) {
      console.error("Error updating agent:", error);
      setUpdateError("Failed to update agent. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!agent) {
    return <div>Loading agent details...</div>; // Or display an error message
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Agent</h1>
      {updateSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Agent updated successfully.</span>
        </div>
      )}
      {updateError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{updateError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>
        <Button
          type="submit"
          disabled={isUpdating}
          className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isUpdating ? "Updating..." : "Update Agent"}
        </Button>
      </form>
    </div>
  );
}
