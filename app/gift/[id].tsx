import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

export default function GiftDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Приводим `id` к строке (если массив, берём первый элемент)
  const giftId = Array.isArray(id) ? id[0] : id;

  const [gift, setGift] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (giftId) {
      fetchGiftDetails();
    }
  }, [giftId]);

  const fetchGiftDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Gift/${giftId}`);
      setGift(response.data);
    } catch (error) {
      console.warn("Error fetching gift details:", error);
      Alert.alert("Error", "Failed to fetch gift details.");
    } finally {
      setLoading(false);
    }
  };

  const deleteGift = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "You need to be logged in to delete a gift.");
        return;
      }

      console.log("Token found:", token);
      console.log("Deleting gift with ID:", giftId);

      // Отправляем DELETE-запрос
      const response = await api.delete(`/Gift/${giftId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response:", response.status);

      if (response.status === 200 || response.status === 204) {
        Alert.alert("Success", "Gift deleted successfully!");
        router.replace("/wishlist"); // Возвращаемся к списку
      } else {
        Alert.alert("Error", `Failed to delete gift. Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error deleting gift:", error);
      Alert.alert("Error", "Failed to delete gift. See console for details.");
    }
  };

  const handleDeleteGift = () => {
    Alert.alert("Delete Gift", "Are you sure you want to delete this gift?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteGift(), // 🔥 Вызываем `deleteGift` без async/await внутри Alert
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6a0dad" />
      ) : gift ? (
        <>
          <Image source={{ uri: gift.imageUrl }} style={styles.image} resizeMode="cover" />
          <Text style={styles.title}>{gift.name}</Text>
          <Text style={styles.price}>${gift.price}</Text>
          <Text style={styles.category}>Category: {gift.category}</Text>

          {/* Кнопки */}
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() =>
              router.push({ pathname: "/gift/edit/[id]", params: { id: giftId } })
            }
          >
            <Text style={styles.buttonText}>✏️ Edit Gift</Text>
          </TouchableOpacity>

          {/* Удаление */}
          <Button title="🗑️ Delete Gift" color="red" onPress={handleDeleteGift} />
        </>
      ) : (
        <Text style={styles.errorText}>Gift not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#fff" },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", textAlign: "center" },
  price: { fontSize: 24, fontWeight: "bold", color: "#6a0dad", marginTop: 5 },
  category: { fontSize: 18, color: "#666", marginTop: 5 },
  button: { padding: 15, borderRadius: 10, marginTop: 15, width: "90%", alignItems: "center" },
  editButton: { backgroundColor: "#FFD700" },
  deleteButton: { backgroundColor: "#FF4D4D" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  errorText: { fontSize: 18, color: "#999", marginTop: 20 },
});
