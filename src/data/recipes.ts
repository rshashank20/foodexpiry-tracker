export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  prepTime: string;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  instructions: string[];
  expiringIngredients: string[];
  image: string;
  tags: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Greek Yogurt Spinach Smoothie",
    description: "A healthy and refreshing smoothie perfect for breakfast using your expiring yogurt and spinach.",
    cookTime: "5 min",
    prepTime: "5 min",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["Greek Yogurt", "Fresh Spinach", "Banana", "Honey", "Water", "Ice"],
    instructions: [
      "Wash the spinach thoroughly and pat dry",
      "Peel and slice the banana",
      "Add all ingredients to a blender",
      "Blend on high speed for 30-45 seconds until smooth",
      "Add more water if needed for desired consistency",
      "Pour into glasses and serve immediately"
    ],
    expiringIngredients: ["Greek Yogurt", "Fresh Spinach"],
    image: "/assets/recipe-smoothie.jpg",
    tags: ["breakfast", "smoothie", "healthy", "quick"],
    nutrition: {
      calories: 180,
      protein: "12g",
      carbs: "28g",
      fat: "2g"
    }
  },
  {
    id: "2",
    title: "Fresh Spinach & Tomato Pasta",
    description: "Quick and delicious pasta dish featuring fresh spinach and cherry tomatoes.",
    cookTime: "20 min",
    prepTime: "10 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["Fresh Spinach", "Cherry Tomatoes", "Pasta", "Garlic", "Olive Oil", "Parmesan Cheese", "Salt", "Black Pepper"],
    instructions: [
      "Bring a large pot of salted water to boil and cook pasta according to package directions",
      "While pasta cooks, heat olive oil in a large skillet over medium heat",
      "Add minced garlic and cook for 1 minute until fragrant",
      "Add cherry tomatoes and cook for 3-4 minutes until they start to burst",
      "Add spinach and cook until wilted, about 2-3 minutes",
      "Drain pasta and add to the skillet with the vegetables",
      "Toss everything together and season with salt and pepper",
      "Serve with grated Parmesan cheese"
    ],
    expiringIngredients: ["Fresh Spinach", "Cherry Tomatoes"],
    image: "/assets/recipe-pasta.jpg",
    tags: ["dinner", "pasta", "vegetarian", "quick"],
    nutrition: {
      calories: 320,
      protein: "14g",
      carbs: "45g",
      fat: "8g"
    }
  },
  {
    id: "3",
    title: "Sourdough French Toast",
    description: "Transform your aging sourdough bread into a delightful breakfast treat.",
    cookTime: "15 min",
    prepTime: "10 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["Sourdough Bread", "Eggs", "Milk", "Cinnamon", "Vanilla", "Butter", "Maple Syrup"],
    instructions: [
      "Slice the sourdough bread into 1-inch thick slices",
      "In a shallow bowl, whisk together eggs, milk, cinnamon, and vanilla",
      "Heat a large skillet or griddle over medium heat and add butter",
      "Dip each bread slice into the egg mixture, coating both sides",
      "Cook on the skillet for 3-4 minutes per side until golden brown",
      "Serve immediately with maple syrup and fresh berries if available"
    ],
    expiringIngredients: ["Sourdough Bread"],
    image: "/assets/recipe-french-toast.jpg",
    tags: ["breakfast", "sweet", "bread", "comfort food"],
    nutrition: {
      calories: 280,
      protein: "12g",
      carbs: "35g",
      fat: "10g"
    }
  },
  {
    id: "4",
    title: "Yogurt Parfait Bowl",
    description: "Layer Greek yogurt with fresh fruits for a protein-rich snack or breakfast.",
    cookTime: "5 min",
    prepTime: "5 min",
    servings: 1,
    difficulty: "Easy",
    ingredients: ["Greek Yogurt", "Granola", "Berries", "Honey", "Chia Seeds"],
    instructions: [
      "Wash and prepare your berries (strawberries, blueberries, raspberries)",
      "In a bowl or glass, layer half of the Greek yogurt",
      "Add a layer of granola",
      "Add half of the berries",
      "Repeat the layers with remaining yogurt, granola, and berries",
      "Drizzle with honey and sprinkle chia seeds on top",
      "Serve immediately or refrigerate for up to 2 hours"
    ],
    expiringIngredients: ["Greek Yogurt"],
    image: "/assets/recipe-parfait.jpg",
    tags: ["breakfast", "snack", "healthy", "layered"],
    nutrition: {
      calories: 220,
      protein: "18g",
      carbs: "32g",
      fat: "4g"
    }
  },
  {
    id: "5",
    title: "Banana Bread",
    description: "Use up those overripe bananas in this classic, moist banana bread.",
    cookTime: "60 min",
    prepTime: "15 min",
    servings: 8,
    difficulty: "Easy",
    ingredients: ["Ripe Bananas", "All-Purpose Flour", "Sugar", "Eggs", "Butter", "Baking Soda", "Salt", "Vanilla"],
    instructions: [
      "Preheat oven to 350°F (175°C) and grease a 9x5 inch loaf pan",
      "Mash the ripe bananas in a large bowl",
      "Mix in melted butter, sugar, eggs, and vanilla",
      "In a separate bowl, whisk together flour, baking soda, and salt",
      "Gradually add dry ingredients to wet ingredients, mixing until just combined",
      "Pour batter into prepared loaf pan",
      "Bake for 50-60 minutes until a toothpick inserted comes out clean",
      "Cool in pan for 10 minutes, then transfer to wire rack"
    ],
    expiringIngredients: ["Ripe Bananas"],
    image: "/assets/recipe-banana-bread.jpg",
    tags: ["baking", "dessert", "breakfast", "sweet"],
    nutrition: {
      calories: 250,
      protein: "4g",
      carbs: "42g",
      fat: "8g"
    }
  },
  {
    id: "6",
    title: "Stir-Fried Vegetables",
    description: "Quick and colorful stir-fry using your expiring vegetables.",
    cookTime: "15 min",
    prepTime: "10 min",
    servings: 4,
    difficulty: "Easy",
    ingredients: ["Mixed Vegetables", "Garlic", "Ginger", "Soy Sauce", "Sesame Oil", "Vegetable Oil", "Green Onions"],
    instructions: [
      "Cut all vegetables into bite-sized pieces",
      "Heat vegetable oil in a large wok or skillet over high heat",
      "Add minced garlic and ginger, stir for 30 seconds",
      "Add harder vegetables first (carrots, broccoli) and stir-fry for 3-4 minutes",
      "Add softer vegetables (bell peppers, mushrooms) and cook for 2-3 minutes",
      "Add soy sauce and sesame oil, toss everything together",
      "Garnish with chopped green onions and serve immediately"
    ],
    expiringIngredients: ["Mixed Vegetables"],
    image: "/assets/recipe-stir-fry.jpg",
    tags: ["dinner", "vegetarian", "quick", "healthy"],
    nutrition: {
      calories: 120,
      protein: "4g",
      carbs: "18g",
      fat: "4g"
    }
  },
  {
    id: "7",
    title: "Creamy Mushroom Soup",
    description: "Rich and comforting soup using your expiring mushrooms.",
    cookTime: "30 min",
    prepTime: "15 min",
    servings: 4,
    difficulty: "Medium",
    ingredients: ["Mushrooms", "Onion", "Garlic", "Heavy Cream", "Vegetable Broth", "Butter", "Thyme", "Salt", "Pepper"],
    instructions: [
      "Clean and slice the mushrooms",
      "Sauté chopped onion in butter until translucent",
      "Add minced garlic and mushrooms, cook until mushrooms release their liquid",
      "Add thyme, salt, and pepper",
      "Pour in vegetable broth and bring to a boil",
      "Reduce heat and simmer for 15 minutes",
      "Remove from heat and blend until smooth",
      "Return to heat, add cream, and warm through",
      "Adjust seasoning and serve hot"
    ],
    expiringIngredients: ["Mushrooms"],
    image: "/assets/recipe-mushroom-soup.jpg",
    tags: ["soup", "comfort food", "vegetarian", "creamy"],
    nutrition: {
      calories: 180,
      protein: "6g",
      carbs: "12g",
      fat: "14g"
    }
  },
  {
    id: "8",
    title: "Avocado Toast with Egg",
    description: "Simple and satisfying breakfast using your expiring avocado.",
    cookTime: "10 min",
    prepTime: "5 min",
    servings: 2,
    difficulty: "Easy",
    ingredients: ["Avocado", "Bread", "Eggs", "Lemon", "Salt", "Black Pepper", "Red Pepper Flakes"],
    instructions: [
      "Toast the bread slices until golden",
      "Mash the avocado with lemon juice, salt, and pepper",
      "Fry or poach the eggs to your preference",
      "Spread the mashed avocado on the toast",
      "Top with the cooked egg",
      "Season with red pepper flakes and additional salt if needed",
      "Serve immediately"
    ],
    expiringIngredients: ["Avocado"],
    image: "/assets/recipe-avocado-toast.jpg",
    tags: ["breakfast", "healthy", "quick", "protein"],
    nutrition: {
      calories: 320,
      protein: "14g",
      carbs: "28g",
      fat: "18g"
    }
  }
];

// Helper function to find recipes based on expiring ingredients
export const findRecipesForIngredients = (expiringIngredients: string[]): Recipe[] => {
  return recipes.filter(recipe => 
    recipe.expiringIngredients.some(ingredient => 
      expiringIngredients.some(expiring => 
        expiring.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(expiring.toLowerCase())
      )
    )
  );
};

// Helper function to get all unique ingredients from recipes
export const getAllRecipeIngredients = (): string[] => {
  const ingredients = new Set<string>();
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => ingredients.add(ingredient));
  });
  return Array.from(ingredients);
};
