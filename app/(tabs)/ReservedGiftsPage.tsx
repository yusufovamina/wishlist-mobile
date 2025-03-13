import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ToastAndroid, 
  Alert 
} from 'react-native';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import api from '../../services/api';
import { router } from 'expo-router';

type RootStackParamList = {
  wishlist: { wishlistId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'wishlist'>;

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
      Alert.alert('Success', 'Reservation cancelled!', [{ text: 'OK' }]);
      fetchReservedGifts();
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel reservation.', [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      {/* Видеофон */}
      <Video
        source={require('../assets/bg.mp4')}
        style={StyleSheet.absoluteFill}
       
        shouldPlay
        isLooping
        isMuted
      />
      {/* Блюр-слой поверх видео */}
      <BlurView intensity={50} tint="default" style={StyleSheet.absoluteFill} />
      
      <View style={styles.overlay}>
        <Text style={styles.heading}>Gifts I Will Give </Text>
        
        {reservedGifts.length === 0 ? (
          <Text style={styles.emptyText}>You haven't reserved any gifts yet.</Text>
        ) : (
          <FlatList
            data={reservedGifts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Image 
                  source={{ uri: item.imageUrl || 'https://via.placeholder.com/100' }} 
                  style={styles.image} 
                />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.price}>${item.price}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => router.push(`/wishlist/shared/${item.wishlistId}`)}
                    >
                      <Text style={styles.buttonText}>View Wishlist</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton} 
                      onPress={() => cancelReservation(item.id)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6a0dad',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4a228a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ReservedGiftsPage;
