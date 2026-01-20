import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { Provider as PaperProvider, Appbar, TextInput, Button, List, Checkbox, Text, FAB } from 'react-native-paper';
import { supabase } from './lib/supabase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type Todo = {
  id: number;
  title: string;
  is_complete: boolean;
};

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert('Error fetching todos', error.message);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodo, is_complete: false }])
      .select();

    if (error) {
      Alert.alert('Error adding todo', error.message);
    } else {
      if (data) {
        setTodos([data[0], ...todos]);
        setNewTodo('');
      }
    }
  };

  const toggleTodo = async (id: number, is_complete: boolean) => {
    // Optimistic update
    setTodos(todos.map(t => t.id === id ? { ...t, is_complete: !is_complete } : t));

    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !is_complete })
      .eq('id', id);

    if (error) {
      Alert.alert('Error updating todo', error.message);
      fetchTodos(); // Revert on error
    }
  };

  const deleteTodo = async (id: number) => {
    // Optimistic update
    setTodos(todos.filter(t => t.id !== id));

    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Error deleting todo', error.message);
      fetchTodos(); // Revert on error
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          
          <Appbar.Header>
            <Appbar.Content title="Seeara Todos" />
          </Appbar.Header>

          <View style={styles.inputContainer}>
            <TextInput
              label="New Task"
              value={newTodo}
              onChangeText={setNewTodo}
              style={styles.input}
              mode="outlined"
              right={<TextInput.Icon icon="plus" onPress={addTodo} />}
              onSubmitEditing={addTodo}
            />
          </View>

          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                titleStyle={item.is_complete ? styles.completedText : undefined}
                left={() => (
                  <Checkbox
                    status={item.is_complete ? 'checked' : 'unchecked'}
                    onPress={() => toggleTodo(item.id, item.is_complete)}
                  />
                )}
                right={(props) => (
                  <Button {...props} onPress={() => deleteTodo(item.id)} textColor="red">
                    Delete
                  </Button>
                )}
                onPress={() => toggleTodo(item.id, item.is_complete)}
              />
            )}
            refreshing={loading}
            onRefresh={fetchTodos}
          />
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
