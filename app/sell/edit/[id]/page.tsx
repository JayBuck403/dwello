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
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Footer from "@/components/Footer";
import { Trash } from "lucide-react";
import { auth } from "@/lib/firebase";

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

interface Property {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  region: string;
  location: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  area_unit: string;
  description: string;
  image_urls: string[];
  is_featured: boolean;
  status: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

interface Amenity {
  id: string;
  name: string;
  category: string;
}

export default function EditListingPage() {
  const { id } = useParams();
  const router = useRouter();

  // Form state
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

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
  const [description, setDescription] = useState("");

  // Fetch property data and amenities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch property data
        const propertyResponse = await fetch(
          `https://dwello-backend-express.onrender.com/api/properties/${id}`
        );

        if (!propertyResponse.ok) {
          throw new Error("Failed to fetch property data");
        }

        const propertyData = await propertyResponse.json();
        setProperty(propertyData);

        // Set form fields
        setTitle(propertyData.title);
        setPropertyType(propertyData.property_type);
        setListingType(propertyData.listing_type);
        setRegion(propertyData.region);
        setLocation(propertyData.location);
        setPrice(propertyData.price.toString());
        setCurrency(propertyData.currency);
        setBedrooms(propertyData.bedrooms.toString());
        setBathrooms(propertyData.bathrooms.toString());
        setArea(propertyData.area);
        setAreaUnit(propertyData.area_unit);
        setDescription(propertyData.description);

        // Set selected amenities based on property_amenities
        if (propertyData.property_amenities) {
          const selectedAmenityIds = propertyData.property_amenities.map(
            (pa: any) => pa.amenity_id
          );
          setSelectedAmenities(selectedAmenityIds);
        }

        // Fetch amenities
        const amenitiesResponse = await fetch(
          "https://dwello-backend-express.onrender.com/api/amenities"
        );
        if (amenitiesResponse.ok) {
          const amenitiesData = await amenitiesResponse.json();
          setAmenities(amenitiesData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load property data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAmenityChange = (amenityName: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  const handleNewImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewImages([...newImages, ...Array.from(event.target.files)]);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setRemovedImages([...removedImages, imageUrl]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !title ||
        !propertyType ||
        !listingType ||
        !region ||
        !location ||
        !price
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("property_type", propertyType);
      formData.append("listing_type", listingType);
      formData.append("region", region);
      formData.append("location", location);
      formData.append("price", price);
      formData.append("currency", currency);
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);
      formData.append("area", area);
      formData.append("area_unit", areaUnit);
      formData.append("description", description);

      // Add selected amenities
      selectedAmenities.forEach((amenity) => {
        formData.append("amenities", amenity);
      });

      // Add new images
      newImages.forEach((image) => {
        formData.append("images", image);
      });

      // Add removed images info
      if (removedImages.length > 0) {
        formData.append("removed_images", JSON.stringify(removedImages));
      }

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/properties/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update property");
      }

      // Redirect to dashboard
      router.push("/dashboard/listings");
    } catch (err) {
      console.error("Error updating property:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update property"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-lg">Loading property data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !property) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <Button
              onClick={() => router.push("/dashboard/listings")}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Edit Property
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
                      required
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
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                          <SelectItem value="GH₵">GH₵</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="areaUnit">Unit</Label>
                      <Select value={areaUnit} onValueChange={setAreaUnit}>
                        <SelectTrigger className="w-full">
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                          onCheckedChange={() =>
                            handleAmenityChange(amenity.id)
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
                  <Label htmlFor="newImages" className="block mb-2">
                    Add New Images
                  </Label>
                  <Input
                    id="newImages"
                    type="file"
                    multiple
                    onChange={handleNewImageChange}
                    accept="image/*"
                  />
                  {newImages.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {newImages.map((image, index) => (
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

                {property &&
                  property.image_urls &&
                  property.image_urls.length > 0 && (
                    <div>
                      <Label className="block mb-2">Existing Images</Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {property.image_urls
                          .filter((image) => !removedImages.includes(image))
                          .map((image, index) => (
                            <div
                              key={index}
                              className="relative w-24 h-20 overflow-hidden rounded-md"
                            >
                              <img
                                src={image}
                                alt={`Existing Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-1 right-1 shadow-md h-6 w-6"
                                onClick={() => handleRemoveImage(image)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex gap-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Updating..." : "Update Property"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/listings")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
