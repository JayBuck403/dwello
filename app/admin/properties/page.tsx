"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Plus,
  Star,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { getSocket } from "@/lib/socket";

interface Property {
  id: string;
  title: string;
  slug?: string;
  description: string;
  property_type: string;
  listing_type: string;
  location: string;
  region: string;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  area_unit: string;
  featured_image_url?: string;
  image_urls?: string[];
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  agent_id?: string;
  agents?: {
    id: string;
    name: string;
    email: string;
    profile_picture?: string;
  };
  property_amenities?: Array<{
    amenities: {
      id: number;
      name: string;
    };
  }>;
}

interface PropertyStats {
  total: number;
  available: number;
  pending: number;
  sold: number;
  featured: number;
  for_sale: number;
  for_rent: number;
  average_price: number;
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<PropertyStats>({
    total: 0,
    available: 0,
    pending: 0,
    sold: 0,
    featured: 0,
    for_sale: 0,
    for_rent: 0,
    average_price: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [listingTypeFilter, setListingTypeFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    fetchProperties();
    // --- Real-time updates ---
    if (!socketRef.current) {
      socketRef.current = getSocket();
    }
    const socket = socketRef.current;
    // Property created
    socket.on("propertyCreated", (property: Property) => {
      setProperties((prev) => {
        if (prev.some((p) => p.id === property.id)) return prev;
        return [property, ...prev];
      });
    });
    // Property updated
    socket.on("propertyUpdated", (property: Property) => {
      setProperties((prev) =>
        prev.map((p) => (p.id === property.id ? { ...p, ...property } : p))
      );
    });
    // Property deleted
    socket.on("propertyDeleted", (id: string) => {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    });
    return () => {
      socket.off("propertyCreated");
      socket.off("propertyUpdated");
      socket.off("propertyDeleted");
    };
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, typeFilter, listingTypeFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to access admin features");
        return;
      }

      const token = await user.getIdToken();

      // Fetch properties from backend
      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/admin/properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data = await response.json();
      const propertiesList = data.properties || [];
      setProperties(propertiesList);

      // Calculate stats
      calculateStats(propertiesList);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (propertyList: Property[]) => {
    const stats: PropertyStats = {
      total: propertyList.length,
      available: propertyList.filter((p) => p.status === "available").length,
      pending: propertyList.filter((p) => p.status === "pending").length,
      sold: propertyList.filter((p) => p.status === "sold").length,
      featured: propertyList.filter((p) => p.is_featured).length,
      for_sale: propertyList.filter((p) => p.listing_type === "for_sale")
        .length,
      for_rent: propertyList.filter((p) => p.listing_type === "for_rent")
        .length,
      average_price:
        propertyList.length > 0
          ? Math.round(
              propertyList.reduce((sum, p) => sum + p.price, 0) /
                propertyList.length
            )
          : 0,
    };
    setStats(stats);
  };

  const filterProperties = () => {
    let filtered = properties;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.status === statusFilter
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.property_type === typeFilter
      );
    }

    // Listing type filter
    if (listingTypeFilter !== "all") {
      filtered = filtered.filter(
        (property) => property.listing_type === listingTypeFilter
      );
    }

    setFilteredProperties(filtered);
  };

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      let endpoint = "";
      if (newStatus === "approved") {
        endpoint = `https://dwello-backend-express.onrender.com/api/admin/properties/${propertyId}/approve`;
      } else if (newStatus === "rejected") {
        endpoint = `https://dwello-backend-express.onrender.com/api/admin/properties/${propertyId}/reject`;
      } else {
        // For other status changes, use the general update endpoint
        endpoint = `https://dwello-backend-express.onrender.com/api/admin/properties/${propertyId}/approve`;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state - convert 'approved' to 'available' for display
        const displayStatus =
          newStatus === "approved" ? "available" : newStatus;
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, status: displayStatus } : p
          )
        );
      }
    } catch (err) {
      console.error("Error updating property status:", err);
    }
  };

  const handleToggleFeatured = async (propertyId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/admin/properties/${propertyId}/feature`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Update local state
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, is_featured: !p.is_featured } : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling featured status:", err);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/admin/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      }
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      available: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      sold: "bg-blue-100 text-blue-800",
      rented: "bg-purple-100 text-purple-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.inactive
        }
      >
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      villa: "bg-purple-100 text-purple-800",
      apartment: "bg-blue-100 text-blue-800",
      house: "bg-green-100 text-green-800",
      townhouse: "bg-orange-100 text-orange-800",
      land: "bg-brown-100 text-brown-800",
    };
    return (
      <Badge
        className={
          variants[type as keyof typeof variants] || "bg-gray-100 text-gray-800"
        }
      >
        {type}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: currency === "GHS" ? "GHS" : "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Properties
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all property listings and approvals
          </p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.available} available, {stats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Properties
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">
              {stats.for_sale} for sale, {stats.for_rent} for rent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.average_price, "GHS")}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all properties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Properties
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.available / stats.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Property Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="listingType">Listing Type</Label>
              <Select
                value={listingTypeFilter}
                onValueChange={setListingTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setListingTypeFilter("all");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({filteredProperties.length})</CardTitle>
          <CardDescription>
            Manage property listings, approvals, and featured status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={property.featured_image_url} />
                        <AvatarFallback>
                          <Home className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{property.title}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {property.location}
                        </div>
                        <div className="text-xs text-gray-400">
                          {property.bedrooms} bed • {property.bathrooms} bath •{" "}
                          {property.area} {property.area_unit}
                        </div>
                        {property.is_featured && (
                          <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {property.agents ? (
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={property.agents.profile_picture} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {property.agents.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.agents.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No agent</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(property.price, property.currency)}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {property.listing_type}
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(property.property_type)}</TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDate(property.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/properties/${property.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/properties/edit/${property.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Property
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(property.id)}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {property.is_featured
                            ? "Remove Featured"
                            : "Mark Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {property.status === "pending" ? (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(property.id, "approved")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve Property
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(property.id, "rejected")
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject Property
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem>
                            <Select
                              value={property.status}
                              onValueChange={(value) =>
                                handleStatusChange(property.id, value)
                              }
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">
                                  Set Available
                                </SelectItem>
                                <SelectItem value="pending">
                                  Set Pending
                                </SelectItem>
                                <SelectItem value="sold">Mark Sold</SelectItem>
                                <SelectItem value="rented">
                                  Mark Rented
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
