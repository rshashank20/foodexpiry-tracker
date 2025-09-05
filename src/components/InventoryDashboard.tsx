import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, AlertTriangle, Package, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetInventory, GetInventoryWithMetadata, updateItem, deleteItem } from "@/firebaseUtils";
import { formatExpiryDate } from "@/utils/dateUtils";

import { EditItemDialog } from "@/components/EditItemDialog";

interface FoodItem {
  id: string;
  item_name: string;
  quantity: string;
  expiry_date: string;
  category: string;
  daysLeft: number;
  added_at?: string;
  status?: string;
}

interface InventoryDashboardProps {
  searchQuery: string;
}

export function InventoryDashboard({ searchQuery }: InventoryDashboardProps) {
  const [sortBy, setSortBy] = useState("expiry");
  const [filterBy, setFilterBy] = useState("all");
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Load items from Firebase using GetInventory action
  const loadItems = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const firebaseItems = await GetInventoryWithMetadata(currentUser.uid);
      setItems(firebaseItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let filteredItems = items.filter(item => 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter
    if (filterBy === "expiring") {
      filteredItems = filteredItems.filter(item => item.daysLeft <= 7);
    } else if (filterBy === "expired") {
      filteredItems = filteredItems.filter(item => item.daysLeft < 0);
    }

    // Sort
    filteredItems.sort((a, b) => {
      if (sortBy === "expiry") return a.daysLeft - b.daysLeft;
      if (sortBy === "name") return a.item_name.localeCompare(b.item_name);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });

    return filteredItems;
  }, [items, searchQuery, sortBy, filterBy]);

  const getExpiryBadge = (daysLeft: number) => {
    if (daysLeft < 0) {
      return <Badge className="text-xs bg-red-100 text-red-700 border-red-200">Expired</Badge>;
    } else if (daysLeft <= 3) {
      return <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
        {daysLeft === 0 ? "Today" : `${daysLeft}d left`}
      </Badge>;
    } else if (daysLeft <= 7) {
      return <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
        {daysLeft}d left
      </Badge>;
    } else {
      return <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">{daysLeft}d left</Badge>;
    }
  };

  const getItemCardStyle = (daysLeft: number) => {
    if (daysLeft <= 3) {
      return "bg-red-50";
    } else if (daysLeft <= 7) {
      return "bg-yellow-50";
    }
    return "bg-white";
  };

  const stats = useMemo(() => {
    const total = items.length;
    const expiring = items.filter(item => item.daysLeft <= 7).length;
    const expired = items.filter(item => item.daysLeft < 0).length;
    
    return { total, expiring, expired };
  }, [items]);

  // Handle edit button click
  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle remove button click
  const handleRemoveItem = async (item: FoodItem) => {
    if (!currentUser) return;
    
    if (window.confirm(`Are you sure you want to remove "${item.item_name}" from your inventory?`)) {
      try {
        await deleteItem(item.id, currentUser.uid);
        toast({
          title: "Item Removed",
          description: `${item.item_name} has been removed from your inventory.`,
        });
        loadItems(); // Refresh the inventory
      } catch (error) {
        console.error("Error removing item:", error);
        toast({
          title: "Remove Failed",
          description: "Failed to remove the item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle edit dialog close
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-primary mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.expiring}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <CardTitle className="text-xl font-semibold text-gray-900">Food Inventory</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-200">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px] bg-white border-gray-200">
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
        
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          ) : filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {items.length === 0 
                  ? "No items in your inventory yet. Upload some images to get started!" 
                  : "No items found matching your search."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredAndSortedItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`p-6 border-b border-gray-100 last:border-b-0 transition-smooth hover:bg-gray-50 animate-slide-up ${getItemCardStyle(item.daysLeft)}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-lg">{item.item_name}</h4>
                        {getExpiryBadge(item.daysLeft)}
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span className="capitalize">{item.category}</span>
                        <span>Expires: {formatExpiryDate(item.expiry_date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary border-primary/20 hover:bg-primary/5"
                        onClick={() => handleEditItem(item)}
                      >
                        <span className="mr-1">✏️</span>
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <span className="mr-1">🗑️</span>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <EditItemDialog
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
        item={editingItem}
        onItemUpdated={loadItems}
      />
    </div>
  );
}