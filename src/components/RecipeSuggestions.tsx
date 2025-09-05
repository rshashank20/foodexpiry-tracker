import { useState, useEffect } from "react";
import { Clock, Users, ChefHat, ExternalLink, Search, Filter, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { GetInventoryWithMetadata } from "@/firebaseUtils";
import { recipes, findRecipesForIngredients, Recipe } from "@/data/recipes";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";

export function RecipeSuggestions() {
  const { currentUser } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user's inventory
  useEffect(() => {
    const loadInventory = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const items = await GetInventoryWithMetadata(currentUser.uid);
        setInventory(items);
        
        // Find recipes based on expiring ingredients (items expiring within 3 days)
        const expiringItems = items
          .filter(item => item.daysLeft <= 3 && item.daysLeft >= 0)
          .map(item => item.item_name);
        
        const suggestedRecipes = findRecipesForIngredients(expiringItems);
        setFilteredRecipes(suggestedRecipes.length > 0 ? suggestedRecipes : recipes.slice(0, 4));
      } catch (error) {
        console.error('Error loading inventory:', error);
        setFilteredRecipes(recipes.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [currentUser]);

  // Filter recipes based on search and difficulty
  useEffect(() => {
    let filtered = recipes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by difficulty
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(recipe => recipe.difficulty === difficultyFilter);
    }

    setFilteredRecipes(filtered);
  }, [searchQuery, difficultyFilter]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-primary text-primary-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const handleSaveRecipe = (recipeId: string) => {
    setSavedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const expiringItems = inventory.filter(item => item.daysLeft <= 3 && item.daysLeft >= 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-fresh text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <ChefHat className="w-6 h-6" />
            <h2 className="text-xl font-bold">Smart Recipe Suggestions</h2>
          </div>
          <p className="text-white/90">
            {expiringItems.length > 0 
              ? `Recipes using your ${expiringItems.length} expiring ingredients to reduce waste`
              : "Discover delicious recipes to make with your ingredients"
            }
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Items Alert */}
      {expiringItems.length > 0 && (
        <Card className="border-warning/30 bg-warning-soft">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-warning" />
              <span className="font-medium text-warning">
                You have {expiringItems.length} items expiring soon!
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {expiringItems.map((item) => (
                <Badge key={item.id} variant="outline" className="text-warning border-warning/30">
                  {item.item_name} ({item.daysLeft} days left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe, index) => (
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
                        {savedRecipes.includes(recipe.id) && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-smooth"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
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
                      <span>{recipe.prepTime} + {recipe.cookTime}</span>
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
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      View Recipe
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSaveRecipe(recipe.id)}
                    >
                      <Star className={`w-4 h-4 mr-1 ${savedRecipes.includes(recipe.id) ? 'fill-current text-yellow-500' : ''}`} />
                      {savedRecipes.includes(recipe.id) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredRecipes.length === 0 && (
        <Card className="border-dashed border-2 border-muted-foreground/30">
          <CardContent className="p-6 text-center">
            <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-2">No recipes found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setDifficultyFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Call to Action */}
      {!loading && filteredRecipes.length > 0 && (
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
      )}

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onSave={handleSaveRecipe}
        isSaved={selectedRecipe ? savedRecipes.includes(selectedRecipe.id) : false}
      />
    </div>
  );
}