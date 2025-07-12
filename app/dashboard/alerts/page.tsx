"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Bell, Plus, Edit, Trash, Search } from "lucide-react";
import { getAuthToken } from "@/components/getToken";
import Footer from "@/components/Footer";
import Navbar from "@/components/header";

interface Alert {
  id: string;
  name: string;
  criteria: any;
  frequency: string;
  is_active: boolean;
  created_at: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    frequency: "daily",
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/user/alerts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAlerts(data);
    } catch (e: any) {
      console.error("Could not fetch alerts:", e);
      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const criteria = {
        location: formData.location || undefined,
        minPrice: formData.minPrice ? parseInt(formData.minPrice) : undefined,
        maxPrice: formData.maxPrice ? parseInt(formData.maxPrice) : undefined,
        propertyType: formData.propertyType || undefined,
      };

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/user/alerts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            criteria,
            frequency: formData.frequency,
          }),
        }
      );

      if (response.ok) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          location: "",
          minPrice: "",
          maxPrice: "",
          propertyType: "",
          frequency: "daily",
        });
        fetchAlerts();
        alert("Alert created successfully");
      } else {
        alert("Failed to create alert");
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      alert("Error creating alert");
    }
  };

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/user/alerts/${alertId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: !isActive }),
        }
      );

      if (response.ok) {
        setAlerts(
          alerts.map((alert) =>
            alert.id === alertId ? { ...alert, is_active: !isActive } : alert
          )
        );
      } else {
        alert("Failed to update alert");
      }
    } catch (error) {
      console.error("Error updating alert:", error);
      alert("Error updating alert");
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      const token = await getAuthToken();
      if (!token) {
        alert("Authentication required");
        return;
      }

      const response = await fetch(
        `https://dwello-backend-express.onrender.com/api/user/alerts/${alertId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setAlerts(alerts.filter((alert) => alert.id !== alertId));
        alert("Alert deleted successfully");
      } else {
        alert("Failed to delete alert");
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
      alert("Error deleting alert");
    }
  };

  const formatCriteria = (criteria: any) => {
    const parts = [];
    if (criteria.location) parts.push(criteria.location);
    if (criteria.minPrice || criteria.maxPrice) {
      const priceRange = [];
      if (criteria.minPrice) priceRange.push(`From ${criteria.minPrice}`);
      if (criteria.maxPrice) priceRange.push(`Up to ${criteria.maxPrice}`);
      parts.push(priceRange.join(" "));
    }
    if (criteria.propertyType) parts.push(criteria.propertyType);
    return parts.join(", ") || "Any property";
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Property Alerts
            </h1>
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-lg">Loading alerts...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Property Alerts
          </h1>
          <div className="text-center py-20 text-red-500">{error}</div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="py-12 bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Saved Searches & Alerts
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Manage your saved search criteria and notification preferences.
            </p>
          </div>

          {showCreateForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAlert} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Alert Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., Houses in East Legon"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g., East Legon, Accra"
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, propertyType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="minPrice">Min Price</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        value={formData.minPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, minPrice: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice">Max Price</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        value={formData.maxPrice}
                        onChange={(e) =>
                          setFormData({ ...formData, maxPrice: e.target.value })
                        }
                        placeholder="1000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(value) =>
                          setFormData({ ...formData, frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">Create Alert</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {alerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">
                          {alert.name}
                        </h3>
                      </div>
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={() =>
                          handleToggleAlert(alert.id, alert.is_active)
                        }
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Criteria:</span>{" "}
                        {formatCriteria(alert.criteria)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Frequency:</span>{" "}
                        {alert.frequency}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAlert(alert)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No alerts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create property alerts to get notified when new properties match
                your criteria.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
