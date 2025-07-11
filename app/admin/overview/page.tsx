"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Home,
  FileText,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  DollarSign,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { auth } from "@/lib/firebase";

interface DashboardStats {
  total_users: number;
  total_agents: number;
  total_properties: number;
  total_blog_posts: number;
  active_listings: number;
  pending_approvals: number;
  total_views: number;
  total_saves: number;
  total_inquiries: number;
  monthly_revenue: number;
  user_growth: number;
  property_growth: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user_name: string;
  user_email: string;
  timestamp: string;
  status: string;
}

interface TopProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  views: number;
  saves: number;
  agent_name: string;
  image_url?: string;
}

interface TopAgent {
  id: string;
  name: string;
  email: string;
  properties_count: number;
  total_views: number;
  total_saves: number;
  profile_picture?: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_agents: 0,
    total_properties: 0,
    total_blog_posts: 0,
    active_listings: 0,
    pending_approvals: 0,
    total_views: 0,
    total_saves: 0,
    total_inquiries: 0,
    monthly_revenue: 0,
    user_growth: 0,
    property_growth: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topProperties, setTopProperties] = useState<TopProperty[]>([]);
  const [topAgents, setTopAgents] = useState<TopAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to access admin features");
        return;
      }

      const token = await user.getIdToken();

      // Fetch dashboard data from backend
      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        setRecentActivity(data.recentActivity || []);
        setTopProperties(data.topProperties || []);
        setTopAgents(data.topAgents || []);
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");

      // Fallback to mock data for demo
      setStats({
        total_users: 1247,
        total_agents: 89,
        total_properties: 456,
        total_blog_posts: 23,
        active_listings: 412,
        pending_approvals: 12,
        total_views: 15678,
        total_saves: 2341,
        total_inquiries: 567,
        monthly_revenue: 45600,
        user_growth: 12.5,
        property_growth: 8.3,
      });

      setRecentActivity([
        {
          id: "1",
          type: "property_created",
          description: "New property listed: 3 Bedroom Apartment in East Legon",
          user_name: "Theophilus Tay",
          user_email: "theophilus@dwello.com",
          timestamp: "2024-07-06T15:30:00Z",
          status: "completed",
        },
        {
          id: "2",
          type: "agent_registered",
          description: "New agent registration: Sarah Johnson",
          user_name: "Sarah Johnson",
          user_email: "sarah@dwello.com",
          timestamp: "2024-07-06T14:15:00Z",
          status: "pending",
        },
        {
          id: "3",
          type: "user_registered",
          description: "New user registration: John Doe",
          user_name: "John Doe",
          user_email: "john@example.com",
          timestamp: "2024-07-06T13:45:00Z",
          status: "completed",
        },
        {
          id: "4",
          type: "property_updated",
          description: "Property updated: Luxury Villa in Airport Residential",
          user_name: "Theophilus Tay",
          user_email: "theophilus@dwello.com",
          timestamp: "2024-07-06T12:20:00Z",
          status: "completed",
        },
        {
          id: "5",
          type: "blog_published",
          description:
            "New blog post published: 'Real Estate Market Trends 2024'",
          user_name: "Admin User",
          user_email: "admin@dwello.com",
          timestamp: "2024-07-06T11:30:00Z",
          status: "completed",
        },
      ]);

      setTopProperties([
        {
          id: "1",
          title: "Luxury Villa in Airport Residential",
          price: 850000,
          location: "Airport Residential, Accra",
          views: 234,
          saves: 45,
          agent_name: "Theophilus Tay",
          image_url:
            "https://firebasestorage.googleapis.com/v0/b/dwello-homes.firebasestorage.app/o/properties%2F1751467887753-WhatsApp%20Image%202025-03-10%20at%2010.13.56.jpeg?alt=media&token=8e8568c3-316f-4485-b5e6-80100831a683",
        },
        {
          id: "2",
          title: "3 Bedroom Apartment in East Legon",
          price: 450000,
          location: "East Legon, Accra",
          views: 189,
          saves: 32,
          agent_name: "Theophilus Tay",
        },
        {
          id: "3",
          title: "Modern Townhouse in Cantonments",
          price: 650000,
          location: "Cantonments, Accra",
          views: 156,
          saves: 28,
          agent_name: "Sarah Johnson",
        },
      ]);

      setTopAgents([
        {
          id: "1",
          name: "Theophilus Tay",
          email: "theophilus@dwello.com",
          properties_count: 15,
          total_views: 2340,
          total_saves: 456,
          profile_picture:
            "https://firebasestorage.googleapis.com/v0/b/dwello-homes.firebasestorage.app/o/agents%2F1751467887753-WhatsApp%20Image%202025-03-10%20at%2010.13.56.jpeg?alt=media&token=8e8568c3-316f-4485-b5e6-80100831a683",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@dwello.com",
          properties_count: 8,
          total_views: 1234,
          total_saves: 234,
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael@dwello.com",
          properties_count: 12,
          total_views: 1890,
          total_saves: 345,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "property_created":
      case "property_updated":
        return <Home className="h-4 w-4" />;
      case "agent_registered":
        return <Users className="h-4 w-4" />;
      case "user_registered":
        return <Users className="h-4 w-4" />;
      case "blog_published":
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        className={
          variants[status as keyof typeof variants] || variants.pending
        }
      >
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_users.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.user_growth > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              {Math.abs(stats.user_growth)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_properties.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.property_growth > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              {Math.abs(stats.property_growth)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_views.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total_saves.toLocaleString()} saves
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.monthly_revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total_inquiries} inquiries
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {activity.user_name} • {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Platform overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Active Agents</span>
              </div>
              <span className="font-semibold">{stats.total_agents}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-green-600" />
                <span className="text-sm">Active Listings</span>
              </div>
              <span className="font-semibold">{stats.active_listings}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Blog Posts</span>
              </div>
              <span className="font-semibold">{stats.total_blog_posts}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Pending Approvals</span>
              </div>
              <span className="font-semibold">{stats.pending_approvals}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-indigo-600" />
                <span className="text-sm">Total Inquiries</span>
              </div>
              <span className="font-semibold">{stats.total_inquiries}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Top Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>
              Properties with highest engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div
                  key={property.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.location}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium">
                      {property.views} views
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.saves} saves
                    </div>
                    <div className="text-xs text-blue-600">
                      {property.agent_name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>Agents with highest performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAgents.map((agent, index) => (
                <div
                  key={agent.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={agent.profile_picture} />
                      <AvatarFallback>
                        {agent.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {agent.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {agent.email}
                    </p>
                    <p className="text-sm text-blue-600">
                      {agent.properties_count} properties
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-medium">
                      {agent.total_views} views
                    </div>
                    <div className="text-xs text-gray-500">
                      {agent.total_saves} saves
                    </div>
                    <div className="text-xs text-green-600">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
