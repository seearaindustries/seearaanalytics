import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Modal, Portal, Searchbar, Text, TouchableRipple, Divider, useTheme, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../lib/supabase';

interface RecipePickerModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelect: (recipe: string) => void;
}

export default function RecipePickerModal({ visible, onDismiss, onSelect }: RecipePickerModalProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchRecipes();
      setSearchQuery('');
    }
  }, [visible]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('raw_material_master')
        .select('Recipe');

      console.log('fetchRecipes Response - Data:', data, 'Error:', error);

      if (error) {
        console.log('Error fetching recipes:', error.message);
      } else {
        const recipeList = data
          ?.map((item: any) => item.Recipe)
          .filter((recipe): recipe is string => typeof recipe === 'string' && recipe.trim().length > 0) || [];
        
        const uniqueRecipes = [...new Set(recipeList)];
        console.log('Processed Unique Recipes:', uniqueRecipes);
        setRecipes(uniqueRecipes);
        setFilteredRecipes(uniqueRecipes);
      }
    } catch (err) {
      console.log('Exception in fetchRecipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = recipes.filter((r) =>
        r.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [recipes]);

  const handleSelect = (recipe: string) => {
    onSelect(recipe);
    onDismiss();
  };

  const renderItem = ({ item }: { item: string }) => (
    <View>
      <TouchableRipple onPress={() => handleSelect(item)} rippleColor="rgba(0, 0, 0, .05)">
        <View style={styles.item}>
          <Text variant="bodyLarge">{item}</Text>
        </View>
      </TouchableRipple>
      <Divider />
    </View>
  );

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>Select Recipe</Text>
        </View>
        <Searchbar
          placeholder="Search recipes..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : (
          <FlatList
            data={filteredRecipes}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ color: theme.colors.outline }}>No recipes found</Text>
              </View>
            }
          />
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: '700',
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    maxHeight: 400,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  loader: {
    padding: 32,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
});
