"use client";

import Navbar from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuthToken } from "@/components/getToken";
import { stat } from "fs";
import { generateSlug } from "@/lib/slugify";

interface Amenity {
  id: string;
  name: string;
}

// Dummy data for select options
const propertyTypes = ["House", "Apartment", "Commercial", "Land"];
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
const listingTypes = ["For Sale", "For Rent"];
const bedroomOptions = ["Studio", "1", "2", "3", "4+", "Other"];
const bathroomOptions = ["1", "2", "3", "4+", "Other"];
const area_units = ["sqft", "sqm"];
const landUnits = ["sqft", "acres", "sqm"];
const currencyOptions = ["GH₵", "USD"];

export default function CreateListingPage() {
  const [title, setTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<number>();
  const [currency, setCurrency] = useState("GH₵"); // Default to Ghanaian Cedi
  const [bedrooms, setBedrooms] = useState<string>("0");
  const [bathrooms, setBathrooms] = useState<string>("0");
  const [landSize, setLandSize] = useState("");
  const [landUnit, setLandUnit] = useState("sqft");
  const [area, setArea] = useState("");
  const [area_unit, setArea_Unit] = useState("sqft");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [agent, setAgent] = useState<any>(null);
  const [checkingAgent, setCheckingAgent] = useState(true);

  useEffect(() => {
    const checkAgent = async () => {
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("No auth token");
        const res = await fetch(
          "https://dwello-backend-express.onrender.com/api/agents/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Not an agent");
        const data = await res.json();
        setAgent(data);
      } catch {
        setAgent(null);
      } finally {
        setCheckingAgent(false);
      }
    };
    checkAgent();
  }, []);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await fetch(
          "https://dwello-backend-express.onrender.com/api/amenities"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched amenities:", data);
        setAmenities(data);
      } catch (error) {
        console.error("Failed to fetch amenities", error);
      }
    };

    fetchAmenities();
  }, []);

  if (checkingAgent) {
    return <div>Loading...</div>;
  }

  if (!agent) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
          <Card className="p-8 max-w-md text-center">
            <CardTitle className="mb-4">Become an Agent</CardTitle>
            <p className="mb-6 text-gray-700">
              Only registered agents can create listings. Register now to access agent features.
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

  const handleAmenityChange = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

    if (
      !title ||
      !propertyType ||
      !listingType ||
      !region ||
      !location ||
      !price
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one image.");
      setLoading(false);
      return;
    }

    try {
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
        property_type: propertyType.toLowerCase(),
        listing_type: listingType.toLowerCase().replace(" ", "_"),
        region: region,
        location: location,
        price: parseInt(price.toString()),
        currency: currency,
        bedrooms: bedrooms === "Other" ? null : parseInt(bedrooms || "0"),
        bathrooms: bathrooms === "Other" ? null : parseInt(bathrooms || "0"),
        // landSize: propertyType === "Land" ? parseFloat(landSize || "0") : null,
        area: propertyType !== "Land" ? area.toString() || "0" : null,
        // landUnit: propertyType === "Land" ? landUnit : null,
        area_unit: propertyType !== "Land" ? area_unit : null,
        description: description,
        amenities: selectedAmenities,
        image_urls: imageUrls,
        status: "pending",
        is_featured: false,
      };

      if (propertyType === "Land") {
        // listingData.landSize = parseFloat(landSize || "0");
        // listingData.landUnit = landUnit;
      } else if (area) {
        listingData.area = parseFloat(area || "0").toString();
        listingData.area_unit = area_unit;
      }

      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token available.");
        return [];
      }

      // First, get the current agent's information to get the agent_id
      const agentResponse = await fetch(
        "https://dwello-backend-express.onrender.com/api/agents/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!agentResponse.ok) {
        console.error("Failed to fetch agent data");
        setError("Failed to fetch agent data. Please try again.");
        setLoading(false);
        return;
      }

      const agentData = await agentResponse.json();
      console.log("Current agent data:", agentData);

      // Add the agent_id to the listing data
      const listingDataWithAgent = {
        ...listingData,
        agent_id: agentData.id,
      };

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/properties/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(listingDataWithAgent),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting listing:", errorData);
        setError(`Failed to submit listing: ${response.statusText}`);
      } else {
        console.log("Listing submitted successfully!");
        // Optionally redirect the user or show a success message
        router.push("/dashboard/listings");
      }
    } catch (error: any) {
      console.error("Error during submission:", error);
      setError(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Create a New Listing
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="propertyType">
                      Property Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={propertyType}
                      onValueChange={setPropertyType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="For Sale or Rent" />
                      </SelectTrigger>
                      <SelectContent>
                        {listingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
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
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-end">
                    <div className="grid gap-2">
                      <Label htmlFor="price">
                        Price <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="e.g., 1500000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="GH₵" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((curr) => (
                            <SelectItem key={curr} value={curr}>
                              {curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select
                      value={bedrooms}
                      onValueChange={(value) => setBedrooms(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
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
                    <Select
                      value={bathrooms}
                      onValueChange={(value) => setBathrooms(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
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
                  {propertyType !== "Land" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="grid gap-2">
                        <Label htmlFor="area">Area Space</Label>
                        <Input
                          id="area"
                          type="number"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          placeholder="e.g., 1200"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="area_unit">Unit</Label>
                        <Select value={area_unit} onValueChange={setArea_Unit}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {area_units.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {propertyType === "Land" && (
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
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
                          checked={selectedAmenities.includes(
                            Number(amenity.id)
                          )}
                          onCheckedChange={() =>
                            handleAmenityChange(Number(amenity.id))
                          }
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

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 inline-block align-middle mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Listing"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
