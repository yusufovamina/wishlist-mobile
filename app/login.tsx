import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '../services/api';
import axios, { AxiosError } from 'axios';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
  
    try {
      const response = await api.post('/Auth/login', {
        username,
        passwordHash: password, // Backend expects "passwordHash"
        role: 'user',
      });
  
      console.log('🔍 Login API Response:', response.data);
      const token = response.data.Token || response.data.token;
  
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', response.data.userId);
      await AsyncStorage.setItem('username', response.data.username);
      console.log('✅ User ID stored:', response.data.userId);
  
      Alert.alert('Success', 'Logged in successfully!');
      router.push('/wishlist'); // Переход на страницу вишлиста
    } catch (err: unknown) { // ✅ Исправлено: явно указываем тип unknown
      
        let errorMessage = 'An unexpected error occurred.';
    
        if (axios.isAxiosError(err)) { // ✅ Проверяем, является ли ошибка AxiosError
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
    
        console.error('❌ Login failed:', errorMessage);
        setError(errorMessage);
        
        Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUsername} 
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Кнопка с анимацией загрузки */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#6a0dad' },
  input: { width: '100%', padding: 15, marginVertical: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
  error: { color: 'red', marginBottom: 10 },
  loginButton: {
    backgroundColor: '#6a0dad',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  registerButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  registerText: { color: '#6a0dad', fontSize: 16, fontWeight: 'bold' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
