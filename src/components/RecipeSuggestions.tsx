import { Clock, Users, ChefHat, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import smoothieImage from "@/assets/recipe-smoothie.jpg";
import pastaImage from "@/assets/recipe-pasta.jpg";
import frenchToastImage from "@/assets/recipe-french-toast.jpg";
import parfaitImage from "@/assets/recipe-parfait.jpg";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  expiringIngredients: string[];
  image: string;
}

export function RecipeSuggestions() {
  // Mock recipe data using soon-to-expire ingredients
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      title: "Greek Yogurt Spinach Smoothie",
      description: "A healthy and refreshing smoothie perfect for breakfast using your expiring yogurt and spinach.",
      cookTime: "5 min",
      servings: 2,
      difficulty: "Easy",
      ingredients: ["Greek Yogurt", "Fresh Spinach", "Banana", "Honey", "Water"],
      expiringIngredients: ["Greek Yogurt", "Fresh Spinach"],
      image: smoothieImage
    },
    {
      id: "2", 
      title: "Fresh Spinach & Tomato Pasta",
      description: "Quick and delicious pasta dish featuring fresh spinach and cherry tomatoes.",
      cookTime: "20 min",
      servings: 4,
      difficulty: "Easy",
      ingredients: ["Fresh Spinach", "Cherry Tomatoes", "Pasta", "Garlic", "Olive Oil"],
      expiringIngredients: ["Fresh Spinach", "Cherry Tomatoes"],
      image: pastaImage
    },
    {
      id: "3",
      title: "Sourdough French Toast",
      description: "Transform your aging sourdough bread into a delightful breakfast treat.",
      cookTime: "15 min",
      servings: 4,
      difficulty: "Easy",
      ingredients: ["Sourdough Bread", "Eggs", "Milk", "Cinnamon", "Vanilla"],
      expiringIngredients: ["Sourdough Bread"],
      image: frenchToastImage
    },
    {
      id: "4",
      title: "Yogurt Parfait Bowl",
      description: "Layer Greek yogurt with fresh fruits for a protein-rich snack or breakfast.",
      cookTime: "5 min",
      servings: 1,
      difficulty: "Easy",
      ingredients: ["Greek Yogurt", "Granola", "Berries", "Honey"],
      expiringIngredients: ["Greek Yogurt"],
      image: parfaitImage
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-primary text-primary-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-fresh text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <ChefHat className="w-6 h-6" />
            <h2 className="text-xl font-bold">Smart Recipe Suggestions</h2>
          </div>
          <p className="text-white/90">
            AI-powered recipes using your soon-to-expire ingredients to reduce waste
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockRecipes.map((recipe, index) => (
          <Card 
            key={recipe.id} 
            className="group hover:shadow-medium transition-smooth cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-soft">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-smooth">
                      {recipe.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-smooth">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                {recipe.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Uses expiring ingredients:</h4>
                <div className="flex flex-wrap gap-1">
                  {recipe.expiringIngredients.map((ingredient) => (
                    <Badge 
                      key={ingredient} 
                      variant="outline" 
                      className="text-xs bg-warning-soft text-warning border-warning/30"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    View Recipe
                  </Button>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-dashed border-2 border-muted-foreground/30">
        <CardContent className="p-6 text-center">
          <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium mb-2">Need More Recipe Ideas?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add more items to your inventory to get personalized recipe suggestions
          </p>
          <Button variant="outline" size="sm">
            Browse All Recipes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}