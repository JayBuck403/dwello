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
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/propertyCard";
import { Badge } from "@/components/ui/badge";

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
const areaUnits = ["sqft", "sqm"];
const landUnits = ["sqft", "acres", "sqm"];

interface Amenity {
  id: number;
  name: string;
}

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
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch amenities on component mount
  useEffect(() => {
    fetchAmenities();
  }, []);

  // Optionally, fetch on initial load if there are query params
  useEffect(() => {
    if (
      propertyType ||
      region ||
      minPrice ||
      maxPrice ||
      bedrooms !== "Any" ||
      bathrooms !== "Any" ||
      minArea ||
      maxArea ||
      minLandSize ||
      maxLandSize ||
      selectedAmenityIds.length > 0
    ) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAmenities = async () => {
    try {
      setAmenitiesLoading(true);
      const response = await fetch("https://dwello-backend-express.onrender.com/api/amenities");
      if (!response.ok) throw new Error("Failed to fetch amenities");
      const data = await response.json();
      setAmenities(data);
    } catch (err) {
      console.error("Error fetching amenities:", err);
    } finally {
      setAmenitiesLoading(false);
    }
  };

  const handleAmenityChange = (amenityId: number) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSearch = async (event?: React.FormEvent, page: number = 1) => {
    if (event) event.preventDefault();
    setLoading(true);
    setError("");
    setProperties([]);
    setHasSearched(true);
    setCurrentPage(page);
    
    const params = new URLSearchParams();
    if (propertyType && propertyType !== "any") {
      params.set("type", propertyType.toLowerCase());
      params.set("property_type", propertyType.toLowerCase()); // Send both for backend compatibility
    }
    if (region && region !== "any") {
      params.set("region", region);
      params.set("location", region); // Send both for backend compatibility
    }
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms && bedrooms !== "Any") params.set("bedrooms", bedrooms.replace("+", ""));
    if (bathrooms && bathrooms !== "Any") params.set("bathrooms", bathrooms.replace("+", ""));
    if (minArea) params.set("minArea", minArea);
    if (maxArea) params.set("maxArea", maxArea);
    if (areaUnit) params.set("areaUnit", areaUnit);
    if (minLandSize) params.set("minLandSize", minLandSize);
    if (maxLandSize) params.set("maxLandSize", maxLandSize);
    if (landUnit) params.set("landUnit", landUnit);
    selectedAmenityIds.forEach((id) => params.append("amenities", id.toString()));
    params.set("page", page.toString());
    params.set("limit", pageSize.toString());
    
    // Update browser URL
    const searchUrl = `/search?${params.toString()}`;
    router.push(searchUrl, { scroll: false });
    
    try {
      const apiUrl = `https://dwello-backend-express.onrender.com/api/properties/?${params.toString()}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProperties(data.data || []);
      setTotalResults(data.meta?.total || 0);
      setTotalPages(data.meta?.totalPages || 0);
    } catch (err) {
      setError("Failed to fetch properties. Please try again.");
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(undefined, page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    handleSearch(undefined, 1);
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
    setSelectedAmenityIds([]);
    setProperties([]);
    setTotalResults(0);
    setHasSearched(false);
    setCurrentPage(1);
    setTotalPages(0);
    
    // Clear URL parameters
    router.push("/search", { scroll: false });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (propertyType && propertyType !== "any") count++;
    if (region && region !== "any") count++;
    if (minPrice || maxPrice) count++;
    if (bedrooms !== "Any") count++;
    if (bathrooms !== "Any") count++;
    if (minArea || maxArea) count++;
    if (minLandSize || maxLandSize) count++;
    if (selectedAmenityIds.length > 0) count++;
    return count;
  };

  return (
    <div>
      <Navbar />
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <Card className="shadow-md rounded-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  Advanced Search
                </CardTitle>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary">
                    {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                  </Badge>
                )}
              </div>
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
                  {amenitiesLoading ? (
                    <div className="text-sm text-gray-500">Loading amenities...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {amenities.map((amenity) => (
                        <div key={amenity.id} className="flex items-center">
                          <Checkbox
                            id={`amenity-${amenity.id}`}
                            checked={selectedAmenityIds.includes(amenity.id)}
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
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset Filters
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search Properties"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {hasSearched && (
            <div className="mb-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2">Searching properties...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">
                    Search Results
                  </h2>
                  <div className="text-gray-600">
                    {totalResults} propert{totalResults === 1 ? 'y' : 'ies'} found
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!loading && !error && properties.length === 0 && hasSearched && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {!loading && !error && properties.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <Label htmlFor="pageSize" className="text-sm">Show:</Label>
                <Select value={pageSize.toString()} onValueChange={(value) => handlePageSizeChange(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Results Info */}
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalResults)} of {totalResults} results
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
