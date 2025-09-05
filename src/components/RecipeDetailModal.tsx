import { useState } from "react";
import { Clock, Users, ChefHat, ExternalLink, Heart, Share2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Recipe } from "@/data/recipes";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (recipeId: string) => void;
  isSaved?: boolean;
}

export function RecipeDetailModal({ recipe, isOpen, onClose, onSave, isSaved = false }: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">("ingredients");

  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-primary text-primary-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${recipe.title} - ${recipe.description}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{recipe.title}</DialogTitle>
              <p className="text-muted-foreground text-lg">{recipe.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className={`${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{recipe.prepTime} prep + {recipe.cookTime} cook</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recipe Image */}
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Expiring Ingredients */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Uses your expiring ingredients:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recipe.expiringIngredients.map((ingredient) => (
                    <Badge 
                      key={ingredient} 
                      variant="outline" 
                      className="bg-warning-soft text-warning border-warning/30"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Nutrition (per serving)</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: {recipe.nutrition.calories}</div>
                    <div>Protein: {recipe.nutrition.protein}</div>
                    <div>Carbs: {recipe.nutrition.carbs}</div>
                    <div>Fat: {recipe.nutrition.fat}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recipe Details */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg">
              <Button
                variant={activeTab === "ingredients" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("ingredients")}
                className="flex-1"
              >
                Ingredients
              </Button>
              <Button
                variant={activeTab === "instructions" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("instructions")}
                className="flex-1"
              >
                Instructions
              </Button>
            </div>

            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-sm">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions Tab */}
            {activeTab === "instructions" && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            onClick={() => onSave?.(recipe.id)}
            variant={isSaved ? "default" : "outline"}
            className="flex-1"
          >
            <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
            {isSaved ? "Saved" : "Save Recipe"}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(recipe.title + " recipe")}`, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Online
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
