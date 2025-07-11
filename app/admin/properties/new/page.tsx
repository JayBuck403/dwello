"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "@/lib/firebase";
import { generateSlug } from "@/lib/slugify";

interface Amenity {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}

// Property types and options
const propertyTypes = ["house", "apartment", "commercial", "land"];
const regionsGhana = [
  "Greater Accra",
  "Ashanti",
  "Eastern",
  "Western",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono East",
  "Ahafo",
  "Oti",
  "Savannah",
  "North East",
  "Bono",
  "Western North",
];
const listingTypes = ["for_sale", "for_rent"];
const bedroomOptions = ["Studio", "1", "2", "3", "4+", "Other"];
const bathroomOptions = ["1", "2", "3", "4+", "Other"];
const areaUnits = ["sqft", "sqm"];
const landUnits = ["sqft", "acres", "sqm"];
const currencyOptions = ["GH₵", "USD", "EUR"];

export default function CreateNewPropertyPage() {
  const router = useRouter();

  // Form state
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("house");
  const [listingType, setListingType] = useState("for_sale");
  const [region, setRegion] = useState("Greater Accra");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("GH₵");
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [landSize, setLandSize] = useState("");
  const [landUnit, setLandUnit] = useState("sqft");
  const [description, setDescription] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");

  // Fetch amenities and agents
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const user = auth.currentUser;
        if (!user) {
          setError("Please sign in to create properties");
          return;
        }

        const token = await user.getIdToken();

        // Fetch amenities
        const amenitiesResponse = await fetch(
          "https://dwello-backend-express.onrender.com/api/amenities"
        );
        if (amenitiesResponse.ok) {
          const amenitiesData = await amenitiesResponse.json();
          setAmenities(amenitiesData);
        }

        // Fetch agents
        const agentsResponse = await fetch(
          "https://dwello-backend-express.onrender.com/api/agents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setAgents(agentsData);
          // Set the first agent as default if available
          if (agentsData.length > 0) {
            setSelectedAgentId(agentsData[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load amenities and agents");
      }
    };

    fetchData();
  }, []);

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to create properties");
        return;
      }

      const token = await user.getIdToken();

      // Validate required fields
      if (
        !title ||
        !propertyType ||
        !listingType ||
        !region ||
        !location ||
        !price ||
        !selectedAgentId
      ) {
        setError(
          "Please fill in all required fields including agent assignment."
        );
        return;
      }

      if (images.length === 0) {
        setError("Please upload at least one image.");
        return;
      }

      // 1. Upload images to Firebase
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(
            storage,
            `properties/${Date.now()}-${image.name}`
          );
          await uploadBytes(storageRef, image);
          const downloadURL = await getDownloadURL(storageRef);
          return downloadURL;
        })
      );

      const slug = generateSlug(title);

      // 2. Prepare the data to send to the backend
      const listingData = {
        title: title,
        slug: slug,
        property_type: propertyType,
        listing_type: listingType,
        region: region,
        location: location,
        price: parseInt(price),
        currency: currency,
        bedrooms: bedrooms === "Other" ? null : parseInt(bedrooms),
        bathrooms: bathrooms === "Other" ? null : parseInt(bathrooms),
        area: propertyType !== "land" ? area : null,
        area_unit: propertyType !== "land" ? areaUnit : null,
        land_size: propertyType === "land" ? landSize : null,
        land_unit: propertyType === "land" ? landUnit : null,
        description: description,
        amenities: selectedAmenities,
        image_urls: imageUrls,
        status: "available",
        is_featured: false,
        agent_id: selectedAgentId,
      };

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/properties",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(listingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create property");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("Error creating property:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create property"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Create New Property</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Success!</strong> Property created
          successfully.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      <Card className="shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Spacious 3-Bedroom House in Accra"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="propertyType">
                  Property Type <span className="text-red-500">*</span>
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="listingType">
                  Listing Type <span className="text-red-500">*</span>
                </Label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === "for_sale" ? "For Sale" : "For Rent"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">
                  Region <span className="text-red-500">*</span>
                </Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regionsGhana.map((reg) => (
                      <SelectItem key={reg} value={reg}>
                        {reg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Street Name, Neighborhood"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((curr) => (
                        <SelectItem key={curr} value={curr}>
                          {curr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 1500000"
                    required
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="agent">
                  Assign Agent <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedAgentId}
                  onValueChange={setSelectedAgentId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select value={bathrooms} onValueChange={setBathrooms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bathroomOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {propertyType !== "land" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="areaUnit">Unit</Label>
                    <Select value={areaUnit} onValueChange={setAreaUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {areaUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {propertyType === "land" && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="landSize">Land Size</Label>
                    <Input
                      id="landSize"
                      type="number"
                      value={landSize}
                      onChange={(e) => setLandSize(e.target.value)}
                      placeholder="e.g., 10"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="landUnit">Unit</Label>
                    <Select value={landUnit} onValueChange={setLandUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {landUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the property"
                rows={5}
              />
            </div>

            <div>
              <Label className="block mb-2">Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center">
                    <Checkbox
                      id={`amenity-${amenity.id}`}
                      checked={selectedAmenities.includes(amenity.id)}
                      onCheckedChange={() => handleAmenityChange(amenity.id)}
                    />
                    <Label
                      htmlFor={`amenity-${amenity.id}`}
                      className="ml-2 text-sm"
                    >
                      {amenity.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="images" className="block mb-2">
                Property Images <span className="text-red-500">*</span>
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
              {images.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-20 overflow-hidden rounded-md"
                    >
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        {image.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Property"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/properties")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
