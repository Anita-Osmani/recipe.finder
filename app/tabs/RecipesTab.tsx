import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAppContext } from '../context/AppContext'; // Importo useAppContext për të menaxhuar gjendjen globale

// Example: Replace with your Spoonacular API key
const API_KEY = '3b83836ff8734abb8b69bb4a41501121';

type Recipe = {
  id: number;
  title: string;
  image: string;
};

export default function RecipesTab() {
  const { mealPlan, setMealPlan, favorites, setFavorites } = useAppContext();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // This is a sample endpoint. Adjust parameters as needed.
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=10&apiKey=${API_KEY}`
      );
      setRecipes(response.data.results);
    } catch (error) {
      console.log('Error fetching recipes:', error);
    }
  };

  // Funksioni për të shtuar një recetë në planin e ushqimit
  const addToMealPlan = (recipe: Recipe) => {
    setMealPlan((prev) => [...prev, recipe]);
  };

  // Funksioni për të shtuar një recetë në preferenca (favorite)
  const addToFavorites = (recipe: Recipe) => {
    // Kontrollo nëse receta është tashmë në preferenca
    if (!favorites.find((fav) => fav.id === recipe.id)) {
      setFavorites((prev) => [...prev, recipe]);
    }
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <View style={styles.recipeCard}>
      <Text style={styles.recipeTitle}>{item.title}</Text>
      {/* Opsioni për të shtuar recetën në planin e ushqimit dhe në preferenca */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => addToMealPlan(item)}>
          <Text style={styles.actionText}>Add to Meal Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => addToFavorites(item)}>
          <Text style={styles.actionText}>☆ Favorite</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recipes</Text>
      <FlatList 
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipe}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  recipeCard: { padding: 12, backgroundColor: '#eee', marginBottom: 8, borderRadius: 8 },
  recipeTitle: { fontSize: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionText: { color: 'blue', marginHorizontal: 8 }
});
