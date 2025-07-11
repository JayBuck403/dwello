"use client";

import Navbar from "@/components/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/propertyCard";
import Footer from "@/components/Footer";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getAuthToken } from "@/components/getToken"; // Adjust the import path as necessary

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  image_url: string;
  // Add other fields as necessary
}

// Dummy data for filter options (can remain as is for UI)
const locations = ["Any", "Accra", "Kumasi", "Tema"];
const propertyTypes = ["Any", "House", "Apartment", "Land", "Commercial"];
const bedroomsOptions = ["Any", "1+", "2+", "3+", "4+"];
const bathroomsOptions = ["Any", "1+", "2+", "3+"];

// Function to fetch properties from the Express API
async function fetchPropertiesFromAPI(
  filters: URLSearchParams
): Promise<Property[]> {
  const apiUrl = `https://dwello-backend-express.onrender.com/api/properties/?${filters.toString()}`;
  console.log("Fetching properties from API with URL:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched properties data:", data);
    return data.data;
  } catch (error) {
    console.error("Error fetching properties from API:", error);
    throw error; // Re-throw the error to be caught by the component
  }
}

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || "any"
  );
  const [typeFilter, setTypeFilter] = useState(
    searchParams.get("type") || "any"
  );
  const [bedroomsFilter, setBedroomsFilter] = useState(
    searchParams.get("bedrooms") || "any"
  );
  const [bathroomsFilter, setBathroomsFilter] = useState(
    searchParams.get("bathrooms") || "any"
  );
  const [minPriceFilter, setMinPriceFilter] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPriceFilter, setMaxPriceFilter] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [minAreaFilter, setMinAreaFilter] = useState(
    searchParams.get("minArea") || ""
  );
  const [maxAreaFilter, setMaxAreaFilter] = useState(
    searchParams.get("maxArea") || ""
  );

  useEffect(() => {
    setLoading(true);
    setError(null);

    const filters = new URLSearchParams(searchParams.toString());
    fetchPropertiesFromAPI(filters)
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
        setLoading(false);
      });
  }, [searchParams]);

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case "location":
        setLocationFilter(value);
        break;
      case "type":
        setTypeFilter(value);
        break;
      case "bedrooms":
        setBedroomsFilter(value);
        break;
      case "bathrooms":
        setBathroomsFilter(value);
        break;
      case "minPrice":
        setMinPriceFilter(value);
        break;
      case "maxPrice":
        setMaxPriceFilter(value);
        break;
      case "minArea":
        setMinAreaFilter(value);
        break;
      case "maxArea":
        setMaxAreaFilter(value);
        break;
      default:
        break;
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (locationFilter !== "any") params.set("location", locationFilter);
    if (typeFilter !== "any") params.set("type", typeFilter);
    if (bedroomsFilter !== "any")
      params.set("bedrooms", bedroomsFilter.replace("+", "")); // Send raw value to API
    if (bathroomsFilter !== "any")
      params.set("bathrooms", bathroomsFilter.replace("+", "")); // Send raw value to API
    if (minPriceFilter) params.set("price_min", minPriceFilter); // Adjust API parameter name if needed
    if (maxPriceFilter) params.set("price_max", maxPriceFilter); // Adjust API parameter name if needed
    if (minAreaFilter) params.set("area_min", minAreaFilter); // Adjust API parameter name if needed
    if (maxAreaFilter) params.set("area_max", maxAreaFilter); // Adjust API parameter name if needed

    router.push(`/properties?${params.toString()}`);
  };

  if (loading) {
    return <div className="py-20 text-center">Loading properties...</div>;
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <section className="py-8 bg-gray-50 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-8 text-center">
            Available Properties
          </h1>

          {/* Professional Filtering Options with Shadcn UI */}
          <div className="bg-white p-6 rounded-md mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Filter Properties
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Dropdown */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <Select
                  value={locationFilter}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {locations.find(
                      (loc) => loc.toLowerCase() === locationFilter
                    ) || "Any"}
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label
                  htmlFor="propertyType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Property Type
                </label>
                <Select
                  value={typeFilter}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-full">
                    {propertyTypes.find(
                      (type) => type.toLowerCase() === typeFilter
                    ) || "Any"}
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms Dropdown */}
              <div>
                <label
                  htmlFor="bedrooms"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bedrooms
                </label>
                <Select
                  value={bedroomsFilter}
                  onValueChange={(value) =>
                    handleFilterChange("bedrooms", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {bedroomsOptions.find(
                      (bed) => bed.replace("+", "") === bedroomsFilter
                    ) || "Any"}
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomsOptions.map((bedroom) => (
                      <SelectItem
                        key={bedroom}
                        value={bedroom.replace("+", "")}
                      >
                        {bedroom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms Dropdown */}
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </label>
                <Select
                  value={bathroomsFilter}
                  onValueChange={(value) =>
                    handleFilterChange("bathrooms", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    {bathroomsOptions.find(
                      (bath) => bath.replace("+", "") === bathroomsFilter
                    ) || "Any"}
                  </SelectTrigger>
                  <SelectContent>
                    {bathroomsOptions.map((bathroom) => (
                      <SelectItem
                        key={bathroom}
                        value={bathroom.replace("+", "")}
                      >
                        {bathroom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label
                  htmlFor="minPrice"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price Range (GH₵)
                </label>
                <div className="mt-1 flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Min
                  </span>
                  <Input
                    type="number"
                    placeholder="Min Price"
                    className="flex-1 focus-visible:ring-primary focus-visible:border-primary rounded-none rounded-r-md"
                    value={minPriceFilter}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                  <span className="inline-flex items-center px-3 border-r-0 border-l-0 border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Max
                  </span>
                  <Input
                    type="number"
                    placeholder="Max Price"
                    className="flex-1 focus-visible:ring-primary focus-visible:border-primary rounded-none rounded-r-md"
                    value={maxPriceFilter}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Area Range */}
              <div className="md:col-span-2">
                <label
                  htmlFor="minArea"
                  className="block text-sm font-medium text-gray-700"
                >
                  Area (sq m)
                </label>
                <div className="mt-1 flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Min
                  </span>
                  <Input
                    type="number"
                    placeholder="Min Area"
                    className="flex-1 focus-visible:ring-primary focus-visible:border-primary rounded-none rounded-r-md"
                    value={minAreaFilter}
                    onChange={(e) =>
                      handleFilterChange("minArea", e.target.value)
                    }
                  />
                  <span className="inline-flex items-center px-3 border-r-0 border-l-0 border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    Max
                  </span>
                  <Input
                    type="number"
                    placeholder="Max Area"
                    className="flex-1 focus-visible:ring-primary focus-visible:border-primary rounded-none rounded-r-md"
                    value={maxAreaFilter}
                    onChange={(e) =>
                      handleFilterChange("maxArea", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Filter Button */}
              <div className="lg:col-span-4 flex justify-end">
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
