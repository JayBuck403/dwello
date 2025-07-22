"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthToken } from "@/components/getToken";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone_call: string;
  bio: string;
  // Add other relevant agent properties
}

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setUpdateError("");
      try {
        const token = await getAuthToken();
        if (!token) {
          setUpdateError("Authentication required");
          setLoading(false);
          return;
        }
        const response = await fetch(`/api/agents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch agent");
        const data = await response.json();
        setAgent(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone_call || "");
        setBio(data.bio || "");
      } catch (error) {
        setUpdateError("Failed to load agent details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAgent();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUpdating(true);
    setUpdateError("");
    setUpdateSuccess(false);
    try {
      const token = await getAuthToken();
      if (!token) {
        setUpdateError("Authentication required");
        setIsUpdating(false);
        return;
      }
      const updatedAgentData = {
        name,
        email,
        phone_call: phone,
        bio,
      };
      const response = await fetch(`/api/agents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAgentData),
      });
      if (response.ok) {
        setUpdateSuccess(true);
        setTimeout(() => router.push("/admin/agents"), 1200);
      } else {
        setUpdateError("Failed to update agent. Please try again.");
      }
    } catch (error) {
      setUpdateError("Failed to update agent. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Loading agent details...</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="py-20 text-center text-red-500">Agent not found.</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Agent</h1>
      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Agent updated successfully.</span>
        </div>
      )}
      {updateError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
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
