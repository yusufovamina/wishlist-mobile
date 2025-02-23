import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// 📌 Явно указываем тип параметров
interface GiftFormProps {
  onGiftAdded: () => void; // Функция, которая ничего не принимает и не возвращает
}

const GiftForm: React.FC<GiftFormProps> = ({ onGiftAdded }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 📌 Выбор изображения из галереи
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'You need to allow access to your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 📌 Создание подарка
  const handleCreateGift = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in to add a gift.');
        setIsLoading(false);
        return;
      }

      const data = {
        name: name.trim(),
        price: parseFloat(price),
        category,
        imageUrl: image || '',
      };

      console.log('📤 Sending JSON:', data);

      await api.post('/api/Gift', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Success', 'Gift has been successfully added!');
      setName('');
      setPrice('');
      setCategory('');
      setImage(null);
      onGiftAdded(); // 📌 Обновляем список подарков
    } catch (error) {
      console.error('❌ Error adding gift:', error);
      Alert.alert('Error', 'Failed to add gift.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 Add a Gift</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Gift Name" 
        value={name} 
        onChangeText={setName} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Price ($)" 
        keyboardType="numeric"
        value={price} 
        onChangeText={setPrice} 
      />

      <TextInput 
        style={styles.input} 
        placeholder="Category" 
        value={category} 
        onChangeText={setCategory} 
      />

      {/* Кнопка выбора изображения */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>{image ? 'Change Image' : 'Pick an Image'}</Text>
      </TouchableOpacity>

      {/* Показываем выбранное изображение */}
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* Кнопка для создания подарка */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateGift} disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Add Gift</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#6a0dad' },
  input: { width: '100%', padding: 15, marginVertical: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  imagePickerText: { fontSize: 16, color: '#333' },
  imagePreview: { width: 150, height: 150, borderRadius: 10, marginTop: 10 },
  createButton: {
    backgroundColor: '#6a0dad',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default GiftForm;
