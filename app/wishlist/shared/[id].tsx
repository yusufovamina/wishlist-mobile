import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  reserved: boolean;
}

export default function SharedWishlistScreen() {
  const { id: wishlistId } = useLocalSearchParams();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkIfOwner();
    fetchGifts();
  }, []);

  const checkIfOwner = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId"); // Получаем ID пользователя из локального хранилища
      const response = await api.get(`/Wishlist/${wishlistId}/owner`); // Получаем владельца вишлиста
      const ownerId = response.data.ownerId; 

      if (userId === ownerId) {
        setIsOwner(true);
        router.replace("/wishlist"); // 🔥 Если это его вишлист, отправляем его в обычный экран
      }
    } catch (error) {
      console.error("Error checking wishlist owner:", error);
    }
  };

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await api.get<Gift[]>(`/Gift/wishlist/${wishlistId}`);
      setGifts(response.data);
    } catch (error) {
      console.warn("Error fetching gifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveGift = async (giftId: string) => {
    try {
      await api.post(`/Gift/${giftId}/reserve`);
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift.id === giftId ? { ...gift, reserved: true } : gift
        )
      );
      alert("Gift reserved!");
    } catch (error) {
      console.error("Error reserving gift:", error);
      alert("Failed to reserve gift.");
    }
  };

  if (isOwner) {
    return null; // Экран Shared Wishlist не загружается, если это владелец
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎁 Friend's Wishlist</Text>

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
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.giftImage} resizeMode="cover" />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.giftTextContainer}>
                <Text style={styles.giftText}>{item.name}</Text>
                <Text style={styles.priceText}>${item.price}</Text>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              {!item.reserved ? (
                <TouchableOpacity style={styles.reserveButton} onPress={() => handleReserveGift(item.id)}>
                  <Text style={styles.buttonText}>Reserve</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.reservedText}>Reserved</Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#6a0dad",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
  giftItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f4f4f4",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  giftImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  placeholderText: {
    color: "#777",
    fontSize: 14,
  },
  giftTextContainer: {
    flex: 1,
  },
  giftText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6a0dad",
    marginTop: 5,
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  reserveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 90,
  },
  reservedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF5733",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
