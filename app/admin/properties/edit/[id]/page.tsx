"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { toSentenceCase } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { Trash } from "lucide-react";

// Property types and options
const PROPERTY_TYPES = ["house", "apartment", "commercial", "land"];
const GHANA_REGIONS = [
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
  "Bono",
  "Oti",
  "Savannah",
  "North East",
  "Western North",
];
const LISTING_TYPES = ["for_sale", "for_rent"];
const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4+", "Other"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4+", "Other"];
const AREA_UNITS = ["sqft", "sqm"];

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
  property_amenities?: Array<{ property_id: string; amenity_id: string }>;
}

interface Amenity {
  id: string;
  name: string;
  category: string;
}

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();

  // Form state
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

        // Check authentication
        const user = auth.currentUser;
        if (!user) {
          setError("Please sign in to edit properties");
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        // Fetch property data
        const propertyResponse = await fetch(
          `https://dwello-backend-express.onrender.com/api/properties/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
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
    setSuccess(false);

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to update properties");
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update property");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/properties");
      }, 2000);
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
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading property data...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Button
            onClick={() => router.push("/admin/properties")}
            className="mt-4"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Property</h1>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Success!</strong> Property updated
          successfully.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="propertyType">
              Property Type <span className="text-red-500">*</span>
            </Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {toSentenceCase(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="listingType">
              Listing Type <span className="text-red-500">*</span>
            </Label>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LISTING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "for_sale" ? "For Sale" : "For Rent"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="region">
              Region <span className="text-red-500">*</span>
            </Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GHANA_REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
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
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATHROOM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="areaUnit">Unit</Label>
              <Select value={areaUnit} onValueChange={setAreaUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AREA_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
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

        {property && property.image_urls && property.image_urls.length > 0 && (
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

        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Updating..." : "Update Property"}
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
    </div>
  );
}
