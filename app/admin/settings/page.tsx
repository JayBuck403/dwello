"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Database,
  Bell,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { auth } from "@/lib/firebase";

interface SystemSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  support_phone: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_verification_required: boolean;
  max_properties_per_agent: number;
  max_images_per_property: number;
  auto_approve_agents: boolean;
  auto_approve_properties: boolean;
  notification_email: boolean;
  notification_sms: boolean;
  notification_push: boolean;
  currency: string;
  timezone: string;
  date_format: string;
  language: string;
  theme: string;
  logo_url?: string;
  favicon_url?: string;
}

interface SecuritySettings {
  password_min_length: number;
  require_special_chars: boolean;
  require_numbers: boolean;
  require_uppercase: boolean;
  session_timeout: number;
  max_login_attempts: number;
  two_factor_required: boolean;
  ip_whitelist: string[];
  allowed_domains: string[];
}

export default function AdminSettingsPage() {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    site_name: "Dwello Homes",
    site_description: "Your trusted partner in real estate",
    contact_email: "contact@dwello.com",
    support_phone: "+233247724921",
    maintenance_mode: false,
    registration_enabled: true,
    email_verification_required: true,
    max_properties_per_agent: 50,
    max_images_per_property: 20,
    auto_approve_agents: false,
    auto_approve_properties: false,
    notification_email: true,
    notification_sms: false,
    notification_push: true,
    currency: "GHS",
    timezone: "Africa/Accra",
    date_format: "MM/DD/YYYY",
    language: "en",
    theme: "light",
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    password_min_length: 8,
    require_special_chars: true,
    require_numbers: true,
    require_uppercase: true,
    session_timeout: 24,
    max_login_attempts: 5,
    two_factor_required: false,
    ip_whitelist: [],
    allowed_domains: ["dwello.com", "gmail.com"],
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setMessage({
          type: "error",
          text: "Please sign in to access admin features",
        });
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/admin/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSystemSettings(data.system || systemSettings);
        setSecuritySettings(data.security || securitySettings);
      } else {
        // Use default settings if API fails
        console.log("Using default settings");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setMessage({
        type: "info",
        text: "Using default settings - API not available",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: "error", text: "Please sign in to save settings" });
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(
        "https://dwello-backend-express.onrender.com/api/admin/settings",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system: systemSettings,
            security: securitySettings,
          }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save settings" });
      }
    } catch (err) {
      console.error("Error saving settings:", err);
      setMessage({ type: "error", text: "Error saving settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleSystemSettingChange = (key: keyof SystemSettings, value: any) => {
    setSystemSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecuritySettingChange = (
    key: keyof SecuritySettings,
    value: any
  ) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      fetchSettings();
      setMessage({ type: "info", text: "Settings reset to defaults" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : message.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : message.type === "error" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={systemSettings.site_name}
                onChange={(e) =>
                  handleSystemSettingChange("site_name", e.target.value)
                }
                placeholder="Enter site name"
              />
            </div>

            <div>
              <Label htmlFor="site_description">Site Description</Label>
              <Textarea
                id="site_description"
                value={systemSettings.site_description}
                onChange={(e) =>
                  handleSystemSettingChange("site_description", e.target.value)
                }
                placeholder="Enter site description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={systemSettings.contact_email}
                onChange={(e) =>
                  handleSystemSettingChange("contact_email", e.target.value)
                }
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <Label htmlFor="support_phone">Support Phone</Label>
              <Input
                id="support_phone"
                value={systemSettings.support_phone}
                onChange={(e) =>
                  handleSystemSettingChange("support_phone", e.target.value)
                }
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={systemSettings.currency}
                onValueChange={(value) =>
                  handleSystemSettingChange("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={systemSettings.timezone}
                onValueChange={(value) =>
                  handleSystemSettingChange("timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Accra">
                    Africa/Accra (GMT+0)
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    America/New_York (GMT-5)
                  </SelectItem>
                  <SelectItem value="Europe/London">
                    Europe/London (GMT+0)
                  </SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security policies and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password_min_length">
                Minimum Password Length
              </Label>
              <Input
                id="password_min_length"
                type="number"
                value={securitySettings.password_min_length}
                onChange={(e) =>
                  handleSecuritySettingChange(
                    "password_min_length",
                    parseInt(e.target.value)
                  )
                }
                min="6"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <Label>Password Requirements</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_special_chars"
                    checked={securitySettings.require_special_chars}
                    onCheckedChange={(checked) =>
                      handleSecuritySettingChange(
                        "require_special_chars",
                        checked
                      )
                    }
                  />
                  <Label htmlFor="require_special_chars">
                    Require special characters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_numbers"
                    checked={securitySettings.require_numbers}
                    onCheckedChange={(checked) =>
                      handleSecuritySettingChange("require_numbers", checked)
                    }
                  />
                  <Label htmlFor="require_numbers">Require numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_uppercase"
                    checked={securitySettings.require_uppercase}
                    onCheckedChange={(checked) =>
                      handleSecuritySettingChange("require_uppercase", checked)
                    }
                  />
                  <Label htmlFor="require_uppercase">
                    Require uppercase letters
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
              <Input
                id="session_timeout"
                type="number"
                value={securitySettings.session_timeout}
                onChange={(e) =>
                  handleSecuritySettingChange(
                    "session_timeout",
                    parseInt(e.target.value)
                  )
                }
                min="1"
                max="168"
              />
            </div>

            <div>
              <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
              <Input
                id="max_login_attempts"
                type="number"
                value={securitySettings.max_login_attempts}
                onChange={(e) =>
                  handleSecuritySettingChange(
                    "max_login_attempts",
                    parseInt(e.target.value)
                  )
                }
                min="3"
                max="10"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="two_factor_required"
                checked={securitySettings.two_factor_required}
                onCheckedChange={(checked) =>
                  handleSecuritySettingChange("two_factor_required", checked)
                }
              />
              <Label htmlFor="two_factor_required">
                Require two-factor authentication
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Control platform behavior and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance_mode"
                checked={systemSettings.maintenance_mode}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("maintenance_mode", checked)
                }
              />
              <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="registration_enabled"
                checked={systemSettings.registration_enabled}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("registration_enabled", checked)
                }
              />
              <Label htmlFor="registration_enabled">
                Enable User Registration
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="email_verification_required"
                checked={systemSettings.email_verification_required}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange(
                    "email_verification_required",
                    checked
                  )
                }
              />
              <Label htmlFor="email_verification_required">
                Require Email Verification
              </Label>
            </div>

            <div>
              <Label htmlFor="max_properties_per_agent">
                Max Properties per Agent
              </Label>
              <Input
                id="max_properties_per_agent"
                type="number"
                value={systemSettings.max_properties_per_agent}
                onChange={(e) =>
                  handleSystemSettingChange(
                    "max_properties_per_agent",
                    parseInt(e.target.value)
                  )
                }
                min="1"
                max="1000"
              />
            </div>

            <div>
              <Label htmlFor="max_images_per_property">
                Max Images per Property
              </Label>
              <Input
                id="max_images_per_property"
                type="number"
                value={systemSettings.max_images_per_property}
                onChange={(e) =>
                  handleSystemSettingChange(
                    "max_images_per_property",
                    parseInt(e.target.value)
                  )
                }
                min="1"
                max="50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto_approve_agents"
                checked={systemSettings.auto_approve_agents}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("auto_approve_agents", checked)
                }
              />
              <Label htmlFor="auto_approve_agents">
                Auto-approve Agent Registrations
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto_approve_properties"
                checked={systemSettings.auto_approve_properties}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("auto_approve_properties", checked)
                }
              />
              <Label htmlFor="auto_approve_properties">
                Auto-approve Property Listings
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notification_email"
                checked={systemSettings.notification_email}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("notification_email", checked)
                }
              />
              <Label htmlFor="notification_email">Email Notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notification_sms"
                checked={systemSettings.notification_sms}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("notification_sms", checked)
                }
              />
              <Label htmlFor="notification_sms">SMS Notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="notification_push"
                checked={systemSettings.notification_push}
                onCheckedChange={(checked) =>
                  handleSystemSettingChange("notification_push", checked)
                }
              />
              <Label htmlFor="notification_push">Push Notifications</Label>
            </div>

            <Separator />

            <div>
              <Label htmlFor="language">Default Language</Label>
              <Select
                value={systemSettings.language}
                onValueChange={(value) =>
                  handleSystemSettingChange("language", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme">Default Theme</Label>
              <Select
                value={systemSettings.theme}
                onValueChange={(value) =>
                  handleSystemSettingChange("theme", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date_format">Date Format</Label>
              <Select
                value={systemSettings.date_format}
                onValueChange={(value) =>
                  handleSystemSettingChange("date_format", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Status
          </CardTitle>
          <CardDescription>
            Current system information and health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <p className="text-lg font-semibold">Connected</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">API</p>
                <p className="text-lg font-semibold">Running</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage</p>
                <p className="text-lg font-semibold">Firebase</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
