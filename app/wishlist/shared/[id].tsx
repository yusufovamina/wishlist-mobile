import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
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
        router.replace("/wishlist"); // Если это его вишлист, отправляем его в обычный экран
      }
    } catch (error) {
      console.error("Error checking wishlist owner:", error);
    }
  };

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await api.get<Gift[]>(`/Gift/wishlist`);
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
      
          <ImageBackground source={require("../../assets/background.jpg")} style={styles.background}>
          
      <Text style={styles.title}>Friend's Wishlist</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1E90FF" />
      ) : gifts.length === 0 ? (
        <Text style={styles.emptyText}>No gifts yet.</Text>
      ) : (
        <FlatList
          data={gifts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
      </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
 
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  giftItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  giftImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#7f8c8d",
    fontSize: 12,
  },
  giftTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  giftText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: "#1abc9c",
    fontWeight: "600",
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 14,
    color: "#95a5a6",
  },
  reserveButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  reservedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D35400",
  },
});

