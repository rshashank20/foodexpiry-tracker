import { useState } from "react";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { InventoryDashboard } from "@/components/InventoryDashboard";
import { RecipeSuggestions } from "@/components/RecipeSuggestions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock notification count based on expiring items
  const notificationCount = 3;

  const renderActiveTab = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryDashboard searchQuery={searchQuery} />;
      case "recipes":
        return <RecipeSuggestions />;
      case "upload":
        return <UploadSection />;
      default:
        return <InventoryDashboard searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notificationCount={notificationCount}
      />
      
      <main className="container mx-auto px-4 py-6">
        <div className="animate-slide-up">
          {renderActiveTab()}
        </div>
      </main>
      
      {/* Cross-device sync indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-elevated text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground">Synced across devices</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;