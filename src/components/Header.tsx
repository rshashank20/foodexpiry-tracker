import { Leaf, Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  notificationCount: number;
}

export function Header({ activeTab, onTabChange, searchValue, onSearchChange, notificationCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-subtle border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
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
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs flex items-center justify-center p-0"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
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
    </header>
  );
}