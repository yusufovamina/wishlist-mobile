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
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { BlurView } from "expo-blur"; // Import from expo-blur instead

export default function GiftDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

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

      const response = await api.delete(`/Gift/${giftId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 204) {
        Alert.alert("Success", "Gift deleted successfully!");
        router.replace("/wishlist");
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
        onPress: () => deleteGift(),
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")} // Your background image
      style={styles.container}
    >
        {loading ? (
          <ActivityIndicator size="large" color="#6a0dad" />
        ) : gift ? (
          <>
            <Image
              source={{ uri: gift.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.title}>{gift.name}</Text>
            <Text style={styles.price}>${gift.price}</Text>
            <Text style={styles.category}>Category: {gift.category}</Text>

            <TouchableOpacity
  style={[styles.button, styles.editButton]}
  onPress={() =>
    router.push({ pathname: "/gift/edit/[id]", params: { id: giftId } })
  }
>
  <Text style={styles.buttonText}>✏️ Edit Gift</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.button, styles.deleteButton]} // Use a different style for delete if needed
  onPress={handleDeleteGift}
>
  <Text style={styles.buttonText}>🗑️ Delete Gift</Text>
</TouchableOpacity>

          </>
        ) : (
          <Text style={styles.errorText}>Gift not found.</Text>
        )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFD700", // Yellow for Edit
  },
  deleteButton: {
    backgroundColor: "#FF6347", // Red for Delete
  },
  glassContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a0dad",
    marginTop: 5,
  },
  category: {
    fontSize: 18,
    color: "#ffffff",
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: "90%",
    alignItems: "center",
  },
 
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
});
