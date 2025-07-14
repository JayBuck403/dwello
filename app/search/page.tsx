"use client";

import Navbar from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/Footer";

// Dummy data for select options - replace with actual data
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
const bedroomOptions = ["Any", "1+", "2+", "3+", "4+"];
const bathroomOptions = ["Any", "1+", "2+", "3+"];
const priceRanges = [
  { value: "", label: "Any" },
  { value: "0-500000", label: "Up to GH₵ 500,000" },
  { value: "500001-1000000", label: "GH₵ 500,001 - GH₵ 1,000,000" },
  { value: "1000001-2000000", label: "GH₵ 1,000,001 - GH₵ 2,000,000" },
  { value: "2000001-+", label: "GH₵ 2,000,001+" },
];
const areaUnits = ["sqft", "sqm"];
const landUnits = ["sqft", "acres", "sqm"];
const amenitiesList = [
  "Swimming Pool",
  "Air Conditioning",
  "Gated Community",
  "Security",
  "Parking",
  "Balcony",
  "Garden",
  "Furnished",
  "Pet Friendly",
  "Gym",
  "Backup Generator",
  "Water Supply",
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [propertyType, setPropertyType] = useState(
    searchParams.get("type") || ""
  );
  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [bedrooms, setBedrooms] = useState(
    searchParams.get("bedrooms") || "Any"
  );
  const [bathrooms, setBathrooms] = useState(
    searchParams.get("bathrooms") || "Any"
  );
  const [minArea, setMinArea] = useState(searchParams.get("minArea") || "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") || "");
  const [areaUnit, setAreaUnit] = useState(
    searchParams.get("areaUnit") || "sqft"
  );
  const [minLandSize, setMinLandSize] = useState(
    searchParams.get("minLandSize") || ""
  );
  const [maxLandSize, setMaxLandSize] = useState(
    searchParams.get("maxLandSize") || ""
  );
  const [landUnit, setLandUnit] = useState(
    searchParams.get("landUnit") || "sqft"
  );
  const [amenities, setAmenities] = useState<string[]>(
    searchParams.getAll("amenities") || []
  );

  const handleAmenityChange = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams();
    if (propertyType) params.set("type", propertyType);
    if (region) params.set("region", region);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms && bedrooms !== "Any") params.set("bedrooms", bedrooms);
    if (bathrooms && bathrooms !== "Any") params.set("bathrooms", bathrooms);
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (areaUnit) params.set("areaUnit", areaUnit);
    if (minLandSize) params.set("minLandSize", minLandSize);
    if (maxLandSize) params.set("maxLandSize", maxLandSize);
    if (landUnit) params.set("landUnit", landUnit);
    amenities.forEach((amenity) => params.append("amenities", amenity));

    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setPropertyType("");
    setRegion("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("Any");
    setBathrooms("Any");
    setMinArea("");
    setMaxArea("");
    setAreaUnit("sqft");
    setMinLandSize("");
    setMaxLandSize("");
    setLandUnit("sqft");
    setAmenities([]);
  };

  return (
    <div>
      <Navbar />
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Advanced Search
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSearch} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Select
                      value={propertyType}
                      onValueChange={setPropertyType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="region">Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        <SelectItem value="any">Any</SelectItem>
                        {regionsGhana.map((reg) => (
                          <SelectItem key={reg} value={reg}>
                            {reg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="priceRange">Price Range (GH₵)</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {propertyType !== "Land" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="area">Area Space</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minArea}
                          onChange={(e) => setMinArea(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxArea}
                          onChange={(e) => setMaxArea(e.target.value)}
                        />
                        <Select value={areaUnit} onValueChange={setAreaUnit}>
                          <SelectTrigger className="w-24">
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
                )}

                {propertyType === "Land" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="landSize">Land Size</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minLandSize}
                          onChange={(e) => setMinLandSize(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxLandSize}
                          onChange={(e) => setMaxLandSize(e.target.value)}
                        />
                        <Select value={landUnit} onValueChange={setLandUnit}>
                          <SelectTrigger className="w-24">
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
                  </div>
                )}

                <div>
                  <Label className="block mb-2">Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityChange(amenity)}
                        />
                        <Label
                          htmlFor={`amenity-${amenity}`}
                          className="ml-2 text-sm"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset Filters
                  </Button>
                  <Button type="submit">Search Properties</Button>
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
