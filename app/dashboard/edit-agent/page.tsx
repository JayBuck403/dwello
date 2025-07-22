"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/header";
import Footer from "@/components/Footer";
import { getAuthToken } from "@/components/getToken";

const specializationOptions = [
  "Apartments",
  "Lands",
  "Commercial Properties",
  "Short Lets",
  "Luxury Homes",
  "Rentals",
  "New Developments",
];
const areaOptions = [
  "East Legon",
  "Spintex",
  "Airport Residential",
  "Labone",
  "Osu",
  "Tema",
  "Cantonments",
  "Dzorwulu",
  "Kumasi",
  "Takoradi",
  "Cape Coast",
  "Koforidua",
  "Sekondi",
];

export default function AgentProfileEditPage() {
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_call: "",
    phone_whatsapp: "",
    bio: "",
    title: "",
    experience: "",
    specializations: [] as string[],
    areasServed: [] as string[],
  });

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("Authentication required");
        const res = await fetch("/api/agents/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch agent profile");
        const data = await res.json();
        setAgent(data);
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone_call: data.phone_call || "",
          phone_whatsapp: data.phone_whatsapp || "",
          bio: data.bio || "",
          title: data.title || "",
          experience: data.experience ? String(data.experience) : "",
          specializations: data.specializations || [],
          areasServed: data.areasServed || [],
        });
        setPending(!!(data.pending_profile_edits && Object.keys(data.pending_profile_edits).length > 0));
      } catch (e: any) {
        setError(e.message || "Failed to load agent profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: "specializations" | "areasServed", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Authentication required");
      const res = await fetch("/api/agents/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          experience: form.experience ? parseInt(form.experience) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit profile edits");
      setSuccess(true);
      setPending(true);
    } catch (e: any) {
      setError(e.message || "Failed to submit profile edits");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Agent Profile</h1>
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Edit Your Agent Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {pending && (
                  <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                    Your profile edits are pending admin approval.
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-400 text-green-800 rounded">
                    Profile edits submitted for approval!
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone_call">Phone (Call)</Label>
                      <Input
                        id="phone_call"
                        value={form.phone_call}
                        onChange={(e) => handleChange("phone_call", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone_whatsapp">Phone (WhatsApp)</Label>
                      <Input
                        id="phone_whatsapp"
                        value={form.phone_whatsapp}
                        onChange={(e) => handleChange("phone_whatsapp", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={form.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min={0}
                      value={form.experience}
                      onChange={(e) => handleChange("experience", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Specializations</Label>
                    <div className="flex flex-wrap gap-2">
                      {specializationOptions.map((option) => (
                        <Button
                          key={option}
                          type="button"
                          variant={form.specializations.includes(option) ? "default" : "outline"}
                          className="text-xs"
                          onClick={() => handleMultiSelect("specializations", option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Areas Served</Label>
                    <div className="flex flex-wrap gap-2">
                      {areaOptions.map((area) => (
                        <Button
                          key={area}
                          type="button"
                          variant={form.areasServed.includes(area) ? "default" : "outline"}
                          className="text-xs"
                          onClick={() => handleMultiSelect("areasServed", area)}
                        >
                          {area}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" disabled={saving} className="w-full">
                    {saving ? "Saving..." : "Submit Edits for Approval"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 