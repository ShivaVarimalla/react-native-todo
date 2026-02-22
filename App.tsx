import { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [text, setText] = useState<string>('');
  const [todos, setTodos] = useState<string[]>([]);

  const handlePress = () => {
    if (text.trim() === '') return;
    setTodos(prev => [...prev, text]);
    AsyncStorage.setItem('todo', text);
    setText('');
  };
  const handleDelete = (index: number) => {
    const temp = [...todos];
    temp.splice(index, 1);
    setTodos(temp);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos !== null) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.log('Error loading todos', error);
      }
    };
    loadTodos();
  },[]);

  useEffect(()=>{
    const saveTodos = async ()=>{
      try {
        await AsyncStorage.setItem('todos', JSON.stringify(todos))
      } catch (error) {
         console.log('Error saving todos', error);
      }
    }
    saveTodos()
  },[todos])

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter a text"
        />
        <Pressable style={styles.todoButton} onPress={handlePress}>
          <Text>Add todo</Text>
        </Pressable>
        <FlatList
          data={todos}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.todolist}>
              <Text style={styles.todoText}>{item}</Text>
              <Pressable
                style={styles.deleteText}
                onPress={() => handleDelete(index)}
              >
                <Text>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 48,
    width: 250,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  todoButton: {
    padding: 10,
    backgroundColor: 'grey',
    color: 'white',
    marginTop: 10,
    borderRadius: 10,
  },
  todolist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  todoText: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginRight: 10,
  },
  deleteText: {
    padding: 10,
    backgroundColor: '#b31212',
    borderRadius: 10,
  },
});
export default App;
