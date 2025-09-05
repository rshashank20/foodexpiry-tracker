import { useState } from "react";
import { Header } from "@/components/Header";
import { UploadSection } from "@/components/UploadSection";
import { InventoryDashboard } from "@/components/InventoryDashboard";
import { RecipeSuggestions } from "@/components/RecipeSuggestions";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchQuery, setSearchQuery] = useState("");
  
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
    <div className="min-h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="animate-slide-up">
          {renderActiveTab()}
        </div>
      </main>
      
    </div>
  );
};

export default Index;