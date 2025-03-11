import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from "react-native";
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
  reservedByUsername?: string; // Добавлено имя пользователя
}

export default function SharedWishlistScreen() {
  const { id: wishlistId } = useLocalSearchParams();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetchGifts();
  }, []);


  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await api.get<Gift[]>(`/Gift/shared/${wishlistId}`);
      setGifts(response.data);
    } catch (error) {
      console.warn("Error fetching gifts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveGift = async (giftId: string) => {
    try {
      const response = await api.post(`/Gift/${giftId}/reserve`);
      const updatedGifts = gifts.map((gift) =>
        gift.id === giftId
          ? { ...gift, reserved: true, reservedByUsername: response.data.reservedBy }
          : gift
      );
      setGifts(updatedGifts);
      Alert.alert("Success", "Gift reserved!");
    } catch (error) {
      console.error("Error reserving gift:", error);
      Alert.alert("Error", "Failed to reserve gift.");
    }
  };

  const handleCancelReservation = async (giftId: string) => {
    try {
      // ✅ Исправленный маршрут для отмены резерва
      await api.post(`/Gift/${giftId}/cancel-reserve`);
      const updatedGifts = gifts.map((gift) =>
        gift.id === giftId
          ? { ...gift, reserved: false, reservedByUsername: undefined }
          : gift
      );
      setGifts(updatedGifts);
      Alert.alert("Success", "Reservation cancelled!");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      Alert.alert("Error", "Failed to cancel reservation.");
    }
  };

  if (isOwner) {
    return null;
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

                {/* Если подарок зарезервирован — показываем имя и блокируем кнопку */}
                {item.reserved ? (
                  <Text style={styles.reservedText}>
                    Reserved by {item.reservedByUsername}
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={styles.reserveButton}
                    onPress={() => handleReserveGift(item.id)}
                    disabled={item.reserved} // Блокируем кнопку при резерве
                  >
                    <Text style={styles.buttonText}>Reserve</Text>
                  </TouchableOpacity>
                )}
              </View>
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
    opacity: 1,
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
    marginTop: 5,
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
});
