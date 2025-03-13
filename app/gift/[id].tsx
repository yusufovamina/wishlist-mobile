import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { BlurView } from "expo-blur";
import Animated, { FadeIn } from "react-native-reanimated";

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
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#6a0dad" />
      ) : gift ? (
        <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
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
            <Text style={styles.buttonText}>Edit Gift</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteGift}
          >
            <Text style={styles.buttonText}>Delete Gift</Text>
          </TouchableOpacity>

          {/* Кнопка "Back to Wishlist" */}
          <TouchableOpacity
            style={ styles.backButton}
            onPress={() => router.replace("/wishlist")}
          >
            <Text style={styles.backButtonText}>Back to Wishlist</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Text style={styles.errorText}>Gift not found.</Text>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "white",
    marginTop: 5,
  },
  category: {
    fontSize: 18,
    color: "white",
    marginTop: 5,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: "85%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#6a0dad",
  },
  deleteButton: {
    backgroundColor: "#E63946",
  },
  backButton: {
    padding: 10,
    marginTop: 10,
    width: "85%",
    alignItems: "center",
    backgroundColor: `rgba(0,0,0,0)`,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    
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
