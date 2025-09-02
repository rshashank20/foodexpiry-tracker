import { useMemo, useState } from "react";
import { Calendar, AlertTriangle, Package, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  category: string;
  daysLeft: number;
}

interface InventoryDashboardProps {
  searchQuery: string;
}

export function InventoryDashboard({ searchQuery }: InventoryDashboardProps) {
  const [sortBy, setSortBy] = useState("expiry");
  const [filterBy, setFilterBy] = useState("all");

  // Mock data
  const mockItems: FoodItem[] = [
    { id: "1", name: "Greek Yogurt", quantity: 2, unit: "containers", expiryDate: "2024-12-28", category: "dairy", daysLeft: 1 },
    { id: "2", name: "Fresh Spinach", quantity: 1, unit: "bag", expiryDate: "2024-12-29", category: "vegetables", daysLeft: 2 },
    { id: "3", name: "Sourdough Bread", quantity: 1, unit: "loaf", expiryDate: "2024-12-30", category: "bakery", daysLeft: 3 },
    { id: "4", name: "Organic Milk", quantity: 1, unit: "carton", expiryDate: "2025-01-02", category: "dairy", daysLeft: 6 },
    { id: "5", name: "Cherry Tomatoes", quantity: 1, unit: "package", expiryDate: "2025-01-05", category: "vegetables", daysLeft: 9 },
    { id: "6", name: "Chicken Breast", quantity: 2, unit: "lbs", expiryDate: "2025-01-08", category: "meat", daysLeft: 12 },
    { id: "7", name: "Cheddar Cheese", quantity: 1, unit: "block", expiryDate: "2025-01-15", category: "dairy", daysLeft: 19 },
    { id: "8", name: "Pasta", quantity: 3, unit: "boxes", expiryDate: "2025-06-15", category: "pantry", daysLeft: 180 },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let items = mockItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter
    if (filterBy === "expiring") {
      items = items.filter(item => item.daysLeft <= 7);
    } else if (filterBy === "expired") {
      items = items.filter(item => item.daysLeft < 0);
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === "expiry") return a.daysLeft - b.daysLeft;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });

    return items;
  }, [searchQuery, sortBy, filterBy]);

  const getExpiryBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge className="text-xs bg-destructive text-destructive-foreground">
        {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
      </Badge>;
    } else if (daysLeft <= 7) {
      return <Badge className="text-xs bg-warning text-warning-foreground">
        {daysLeft}d left
      </Badge>;
    } else {
      return <Badge variant="secondary" className="text-xs">{daysLeft}d left</Badge>;
    }
  };

  const getItemCardClass = (daysLeft: number) => {
    if (daysLeft < 0) {
      return "border-destructive bg-destructive-soft";
    } else if (daysLeft <= 3) {
      return "border-destructive/50 bg-destructive-soft/50";
    } else if (daysLeft <= 7) {
      return "border-warning/50 bg-warning-soft/50";
    }
    return "border-border";
  };

  const stats = useMemo(() => {
    const total = mockItems.length;
    const expiring = mockItems.filter(item => item.daysLeft <= 7).length;
    const expired = mockItems.filter(item => item.daysLeft < 0).length;
    
    return { total, expiring, expired };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-warning">{stats.expiring}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
              </div>
              <Calendar className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg">Food Inventory</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expiry">By Expiry</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {filteredAndSortedItems.map((item, index) => (
              <Card 
                key={item.id} 
                className={`p-4 transition-smooth hover:shadow-soft animate-slide-up ${getItemCardClass(item.daysLeft)}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      {getExpiryBadge(item.daysLeft)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Qty: {item.quantity} {item.unit}</span>
                      <span className="capitalize">{item.category}</span>
                      <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive-soft">
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {filteredAndSortedItems.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No items found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}