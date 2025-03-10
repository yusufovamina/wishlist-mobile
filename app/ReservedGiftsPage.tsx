import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../services/api';

type RootStackParamList = {
  Wishlist: { wishlistId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Wishlist'>;

interface Gift {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  wishlistId: string;
}

interface Props {
  navigation: NavigationProp;
}

const ReservedGiftsPage: React.FC<Props> = ({ navigation }) => {
  const [reservedGifts, setReservedGifts] = useState<Gift[]>([]);

  useEffect(() => {
    fetchReservedGifts();
  }, []);

  const fetchReservedGifts = async () => {
    try {
        const response = await api.get('/Gift/reserved'); 
      setReservedGifts(response.data);
    } catch (error) {
      ToastAndroid.show('Could not load reserved gifts.', ToastAndroid.SHORT);
    }
  };

  const cancelReservation = async (giftId: string) => {
    try {
      await api.post(`/Gift/${giftId}/cancel-reserve`);
      ToastAndroid.show('Reservation cancelled!', ToastAndroid.SHORT);
      fetchReservedGifts(); // Обновляем список после отмены резерва
    } catch (error) {
      ToastAndroid.show('Failed to cancel reservation.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gifts I Will Give 🎁</Text>
      {reservedGifts.length === 0 ? (
        <Text style={styles.emptyText}>You haven't reserved any gifts yet.</Text>
      ) : (
        <FlatList
          data={reservedGifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/300' }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.price}>${item.price}</Text>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => navigation.navigate('Wishlist', { wishlistId: item.wishlistId })}
              >
                <Text style={styles.buttonText}>View Wishlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => cancelReservation(item.id)}>
                <Text style={styles.buttonText}>Cancel Reservation</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#4B0082',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#777',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    marginVertical: 4,
  },
  viewButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReservedGiftsPage;
