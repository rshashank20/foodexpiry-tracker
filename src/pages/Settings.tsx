import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { SettingsTest } from "@/components/SettingsTest";
import { downloadPDF, ExportData } from "@/utils/pdfExport";
import { 
  Bell, 
  User, 
  Shield, 
  Download, 
  Trash2, 
  Palette, 
  Clock, 
  Smartphone,
  Mail,
  Key,
  Database,
  Eye,
  EyeOff
} from "lucide-react";

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const { clearAllNotifications, notifications } = useNotifications();
  const { 
    notificationSettings, 
    displaySettings, 
    privacySettings, 
    accountSettings,
    updateNotificationSettings,
    updateDisplaySettings,
    updatePrivacySettings,
    updateAccountSettings
  } = useSettings();
  const { toast } = useToast();
  
  const [inventoryCount, setInventoryCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  // Load real data counts
  useEffect(() => {
    const loadDataCounts = async () => {
      if (!currentUser) return;
      
      try {
        const { GetInventoryWithMetadata } = await import('@/firebaseUtils');
        const inventoryData = await GetInventoryWithMetadata(currentUser.uid);
        setInventoryCount(inventoryData.length);
        setNotificationCount(notifications.length);
      } catch (error) {
        console.error('Error loading data counts:', error);
      }
    };
    
    loadDataCounts();
  }, [currentUser, notifications]);

  const handleNotificationChange = (key: string, value: any) => {
    updateNotificationSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDisplayChange = (key: string, value: any) => {
    updateDisplaySettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: "Your display preferences have been saved.",
    });
  };

  const handlePrivacyChange = (key: string, value: any) => {
    updatePrivacySettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleAccountChange = (key: string, value: any) => {
    updateAccountSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: "Your account information has been updated.",
    });
  };

  const handleExportData = async () => {
    if (!currentUser) return;
    
    try {
      // Get user's inventory data
      const { GetInventoryWithMetadata } = await import('@/firebaseUtils');
      const inventoryData = await GetInventoryWithMetadata(currentUser.uid);
      
      // Get user's settings
      const notificationSettings = localStorage.getItem(`notificationSettings_${currentUser.uid}`);
      const displaySettings = localStorage.getItem(`displaySettings_${currentUser.uid}`);
      const privacySettings = localStorage.getItem(`privacySettings_${currentUser.uid}`);
      const accountSettings = localStorage.getItem(`accountSettings_${currentUser.uid}`);
      
      // Create export data
      const exportData: ExportData = {
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          exportDate: new Date().toISOString()
        },
        inventory: inventoryData,
        settings: {
          notifications: notificationSettings ? JSON.parse(notificationSettings) : null,
          display: displaySettings ? JSON.parse(displaySettings) : null,
          privacy: privacySettings ? JSON.parse(privacySettings) : null,
          account: accountSettings ? JSON.parse(accountSettings) : null
        }
      };
      
      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `fresh-track-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your data has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportPDF = async () => {
    if (!currentUser) return;
    
    try {
      // Get user's inventory data
      const { GetInventoryWithMetadata } = await import('@/firebaseUtils');
      const inventoryData = await GetInventoryWithMetadata(currentUser.uid);
      
      // Get user's settings
      const notificationSettings = localStorage.getItem(`notificationSettings_${currentUser.uid}`);
      const displaySettings = localStorage.getItem(`displaySettings_${currentUser.uid}`);
      const privacySettings = localStorage.getItem(`privacySettings_${currentUser.uid}`);
      const accountSettings = localStorage.getItem(`accountSettings_${currentUser.uid}`);
      
      // Create export data
      const exportData: ExportData = {
        user: {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          exportDate: new Date().toISOString()
        },
        inventory: inventoryData,
        settings: {
          notifications: notificationSettings ? JSON.parse(notificationSettings) : null,
          display: displaySettings ? JSON.parse(displaySettings) : null,
          privacy: privacySettings ? JSON.parse(privacySettings) : null,
          account: accountSettings ? JSON.parse(accountSettings) : null
        }
      };
      
      // Generate and download PDF
      downloadPDF(exportData);
      
      toast({
        title: "PDF Export Complete",
        description: "Your inventory report has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "PDF Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Account deletion requires confirmation. Please contact support.",
      variant: "destructive"
    });
  };

  const handleClearAllData = async () => {
    if (!currentUser) return;
    
    try {
      // Clear notifications
      clearAllNotifications();
      
      // Clear inventory data from Firebase
      const { deleteItem } = await import('@/firebaseUtils');
      const { GetInventory } = await import('@/firebaseUtils');
      
      const items = await GetInventory(currentUser.uid);
      for (const item of items) {
        await deleteItem(item.id, currentUser.uid);
      }
      
      // Clear localStorage data
      localStorage.removeItem(`notifications_${currentUser.uid}`);
      localStorage.removeItem(`notificationSettings_${currentUser.uid}`);
      localStorage.removeItem(`displaySettings_${currentUser.uid}`);
      localStorage.removeItem(`privacySettings_${currentUser.uid}`);
      localStorage.removeItem(`accountSettings_${currentUser.uid}`);
      
      toast({
        title: "Data Cleared",
        description: "All your data has been cleared successfully.",
      });
    } catch (error) {
      console.error('Clear data error:', error);
      toast({
        title: "Clear Failed",
        description: "Failed to clear some data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences, notifications, and account settings.
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Display</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Data</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Test</span>
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive and when.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="expiring-alerts">Expiring Item Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when items are about to expire
                    </p>
                  </div>
                  <Switch
                    id="expiring-alerts"
                    checked={notificationSettings.expiringAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("expiringAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="expired-alerts">Expired Item Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when items have expired
                    </p>
                  </div>
                  <Switch
                    id="expired-alerts"
                    checked={notificationSettings.expiredAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("expiredAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="recipe-suggestions">Recipe Suggestions</Label>
                    <p className="text-sm text-muted-foreground">
                      Get recipe recommendations for expiring items
                    </p>
                  </div>
                  <Switch
                    id="recipe-suggestions"
                    checked={notificationSettings.recipeSuggestions}
                    onCheckedChange={(checked) => handleNotificationChange("recipeSuggestions", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Timing Settings</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="reminder-days">Days Before Expiry to Alert</Label>
                  <Select
                    value={notificationSettings.reminderDays.toString()}
                    onValueChange={(value) => handleNotificationChange("reminderDays", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="quiet-hours">Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable notifications during specific hours
                    </p>
                  </div>
                  <Switch
                    id="quiet-hours"
                    checked={notificationSettings.quietHours}
                    onCheckedChange={(checked) => handleNotificationChange("quietHours", checked)}
                  />
                </div>

                {notificationSettings.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <Input
                        id="quiet-start"
                        type="time"
                        value={notificationSettings.quietStart}
                        onChange={(e) => handleNotificationChange("quietStart", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-end">End Time</Label>
                      <Input
                        id="quiet-end"
                        type="time"
                        value={notificationSettings.quietEnd}
                        onChange={(e) => handleNotificationChange("quietEnd", e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                Manage your account details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={accountSettings.displayName}
                    onChange={(e) => handleAccountChange("displayName", e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => handleAccountChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={accountSettings.phone}
                    onChange={(e) => handleAccountChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={accountSettings.timezone}
                    onValueChange={(value) => handleAccountChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Account Actions</h4>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Sign Out</p>
                    <p className="text-sm text-muted-foreground">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow anonymous usage data to improve the app
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={privacySettings.dataSharing}
                    onCheckedChange={(checked) => handlePrivacyChange("dataSharing", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help us understand how you use the app
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={privacySettings.analytics}
                    onCheckedChange={(checked) => handlePrivacyChange("analytics", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="crash-reporting">Crash Reporting</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send crash reports to help fix bugs
                    </p>
                  </div>
                  <Switch
                    id="crash-reporting"
                    checked={privacySettings.crashReporting}
                    onCheckedChange={(checked) => handlePrivacyChange("crashReporting", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-tracking">Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow location-based features (if available)
                    </p>
                  </div>
                  <Switch
                    id="location-tracking"
                    checked={privacySettings.locationTracking}
                    onCheckedChange={(checked) => handlePrivacyChange("locationTracking", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Profile Visibility</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Display & Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize how the app looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={displaySettings.theme}
                    onValueChange={(value) => handleDisplayChange("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={displaySettings.language}
                    onValueChange={(value) => handleDisplayChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={displaySettings.dateFormat}
                    onValueChange={(value) => handleDisplayChange("dateFormat", value)}
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

                <div className="space-y-2">
                  <Label htmlFor="time-format">Time Format</Label>
                  <Select
                    value={displaySettings.timeFormat}
                    onValueChange={(value) => handleDisplayChange("timeFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">View Options</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show more items in less space
                    </p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={displaySettings.compactView}
                    onCheckedChange={(checked) => handleDisplayChange("compactView", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-images">Show Item Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Display food item images in the inventory
                    </p>
                  </div>
                  <Switch
                    id="show-images"
                    checked={displaySettings.showImages}
                    onCheckedChange={(checked) => handleDisplayChange("showImages", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="items-per-page">Items Per Page</Label>
                  <Select
                    value={displaySettings.itemsPerPage.toString()}
                    onValueChange={(value) => handleDisplayChange("itemsPerPage", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="20">20 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                      <SelectItem value="100">100 items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>
                Manage your data, export information, and control storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Export Data (JSON)</p>
                    <p className="text-sm text-muted-foreground">
                      Download all your inventory and recipe data as JSON
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Export Report (PDF)</p>
                    <p className="text-sm text-muted-foreground">
                      Download a formatted inventory report as PDF
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Clear All Data</p>
                    <p className="text-sm text-muted-foreground">
                      Remove all your inventory items and notifications
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleClearAllData}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-destructive rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-destructive">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Storage Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Total Items</span>
                    </div>
                    <p className="text-2xl font-bold">{inventoryCount}</p>
                    <p className="text-xs text-muted-foreground">in your inventory</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bell className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium">Notifications</span>
                    </div>
                    <p className="text-2xl font-bold">{notificationCount}</p>
                    <p className="text-xs text-muted-foreground">active alerts</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-6">
          <SettingsTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
