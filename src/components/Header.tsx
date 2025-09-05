import { Leaf, Search, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ activeTab, onTabChange, searchValue, onSearchChange }: HeaderProps) {
  const { logout, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-subtle border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Mobile Header - Stacked Layout */}
        <div className="flex flex-col space-y-3 sm:hidden">
          {/* Top Row: Logo + Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
                <Leaf className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">FreshTrack</h1>
                <p className="text-xs text-muted-foreground">Smart Food Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <NotificationDropdown />
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} title="Settings">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search food items..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 transition-smooth h-10"
            />
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex space-x-1 w-full">
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("inventory")}
              className="flex-1 transition-smooth text-xs"
            >
              Inventory
            </Button>
            <Button
              variant={activeTab === "recipes" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("recipes")}
              className="flex-1 transition-smooth text-xs"
            >
              Recipes
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("upload")}
              className="flex-1 transition-smooth text-xs"
            >
              Upload
            </Button>
          </nav>
        </div>

        {/* Desktop Header - Original Layout */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FreshTrack</h1>
                <p className="text-sm text-muted-foreground">Smart Food Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <NotificationDropdown />
              <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} title="Settings">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
            <nav className="flex space-x-1">
              <Button
                variant={activeTab === "inventory" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("inventory")}
                className="transition-smooth"
              >
                Inventory
              </Button>
              <Button
                variant={activeTab === "recipes" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("recipes")}
                className="transition-smooth"
              >
                Recipes
              </Button>
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange("upload")}
                className="transition-smooth"
              >
                Upload
              </Button>
            </nav>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search food items..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 transition-smooth"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}