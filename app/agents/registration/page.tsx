"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getAuthToken } from "@/components/getToken";
import { generateSlug } from "@/lib/slugify";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/header";
import Footer from "@/components/Footer";


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

const AgentRegistrationPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCall, setPhoneCall] = useState("");
  const [phoneWhatsapp, setPhoneWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleValue = (
    list: string[],
    value: string,
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    );
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (
      !name ||
      !email ||
      !phoneCall ||
      !phoneWhatsapp ||
      !bio ||
      !profilePhoto
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,}$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address.");
      setLoading(false);
      return;
    }

    if (!phoneRegex.test(phoneCall) || !phoneRegex.test(phoneWhatsapp)) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      let profilePhotoUrl = "";
      const storageRef = ref(
        storage,
        `agents/${Date.now()}-${profilePhoto.name}`
      );
      await uploadBytes(storageRef, profilePhoto);
      profilePhotoUrl = await getDownloadURL(storageRef);

      const user = auth.currentUser;
      const firebaseUid = user ? user.uid : null;

      if (!firebaseUid) {
        setError("Failed to retrieve Firebase UID.");
        setLoading(false);
        return;
      }

      const slug = generateSlug(name);

      const agentData = {
        name,
        email,
        slug: slug,
        phone_call: phoneCall,
        phone_whatsapp: phoneWhatsapp,
        bio,
        profile_picture: profilePhotoUrl,
        firebase_uid: firebaseUid,
        title,
        experience: experience === "" ? null : experience,
        specializations: selectedSpecializations,
        areasServed: selectedAreas,
      };

      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token available.");
        return [];
      }

      console.log("Agent Data:", agentData);
      console.log("Auth Token:", token);

      const res = await fetch(
        "https://dwello-backend-express.onrender.com/api/agents/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(agentData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to register agent.");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
    
    <div className="py-10 min-h-screen bg-muted">
      
      <div className="container max-w-2xl px-4 mx-auto">
        <Card className="shadow-sm border rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center my-2">
              Agent Registration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name / Agency Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name or agency name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneCall">
                    Phone (Call) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneCall"
                    type="tel"
                    placeholder="Call number"
                    value={phoneCall}
                    onChange={(e) => setPhoneCall(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneWhatsapp">
                    Phone (WhatsApp) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneWhatsapp"
                    type="tel"
                    placeholder="WhatsApp number"
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">
                  Bio / Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself or your agency"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Property Consultant"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  placeholder="e.g. 5"
                  value={experience}
                  onChange={(e) =>
                    setExperience(
                      e.target.value === "" ? "" : parseInt(e.target.value)
                    )
                  }
                />
              </div>

              {/* Specializations Dropdown */}
              <div className="space-y-2">
                <Label>Specializations</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedSpecializations.length > 0
                        ? selectedSpecializations.join(", ")
                        : "Select Specializations"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <Command>
                      <CommandGroup>
                        {specializationOptions.map((option) => (
                          <CommandItem key={option}>
                            <div
                              className="flex items-center space-x-2"
                              onClick={e => e.stopPropagation()}
                              onMouseDown={e => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`spec-${option}`}
                                checked={selectedSpecializations.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSpecializations([...selectedSpecializations, option]);
                                  } else {
                                    setSelectedSpecializations(selectedSpecializations.filter((s) => s !== option));
                                  }
                                }}
                              />
                              <Label htmlFor={`spec-${option}`}>{option}</Label>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Areas Served Dropdown */}
              <div className="space-y-2">
                <Label>Areas Served</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedAreas.length > 0
                        ? selectedAreas.join(", ")
                        : "Select Areas"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full">
                    <Command>
                      <CommandGroup>
                        {areaOptions.map((area) => (
                          <CommandItem key={area}>
                            <div
                              className="flex items-center space-x-2"
                              onClick={e => e.stopPropagation()}
                              onMouseDown={e => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`area-${area}`}
                                checked={selectedAreas.includes(area)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedAreas([...selectedAreas, area]);
                                  } else {
                                    setSelectedAreas(selectedAreas.filter((a) => a !== area));
                                  }
                                }}
                              />
                              <Label htmlFor={`area-${area}`}>{area}</Label>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="profilePhoto">
                  Profile Photo / Logo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {profilePhoto && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(profilePhoto)}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Submit */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 inline-block align-middle mr-2"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default AgentRegistrationPage;
