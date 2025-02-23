import { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  wishlistId: string;
}

export default function WishlistScreen() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await api.get<Gift[]>('/Gift/wishlist');
      setGifts(response.data);
    } catch (error) {
      console.warn('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 My Wishlist</Text>

      <Button title="Refresh List" onPress={fetchGifts} disabled={loading} />

      {loading ? (
        <ActivityIndicator size="large" color="#6a0dad" />
      ) : gifts.length === 0 ? (
        <Text style={styles.emptyText}>No gifts yet.</Text>
      ) : (
        <FlatList
          data={gifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.giftItem}>
              <Text style={styles.giftText}>{item.name} - ${item.price}</Text>
              <Text style={styles.categoryText}>Category: {item.category}</Text>
            </View>
          )}
        />
      )}

      {/* Кнопка для перехода на страницу создания подарка */}
      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/create-gift')}>
        <Text style={styles.buttonText}>+ Create Gift</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#6a0dad' },
  emptyText: { fontSize: 18, color: '#999', marginTop: 20 },
  giftItem: { padding: 15, marginVertical: 5, borderRadius: 10, backgroundColor: '#f4f4f4' },
  giftText: { fontSize: 18, fontWeight: '500' },
  categoryText: { fontSize: 16, color: '#666' },
  createButton: {
    backgroundColor: '#6a0dad',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
