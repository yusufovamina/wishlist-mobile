import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { BlurView } from "expo-blur";  // You'll need to install expo-blur package for blur effect

const screenWidth = Dimensions.get("window").width;

interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function WishlistScreen() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGifts();
    }
  }, [userId]);

  const loadUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        console.log("✅ Загруженный userId:", storedUserId);
      } else {
        console.warn("⚠️ userId отсутствует в AsyncStorage");
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки userId:", error);
    }
  };

  const fetchGifts = async () => {
    if (!userId) {
      console.warn("❌ Ошибка: userId отсутствует.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get<Gift[]>(`/Gift/wishlist`);
      console.log("📦 Полученные подарки:", response.data);

      if (response.data.length === 0) {
        console.warn("⚠️ У пользователя пока нет подарков.");
      }

      setGifts(response.data);
    } catch (error) {
      console.error("❌ Ошибка при загрузке подарков:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareWishlist = async () => {
    if (!userId) return;

    const deepLink = `yourwishlist://wishlist/${userId}`;
    const webLink = `https://yourwishlist.vercel.app/wishlist/shared/${userId}`;

    try {
      await Share.share({
        title: "Check out my Wishlist!",
        message: `Here's my wishlist:\n📱 Mobile: ${deepLink}\n🌍 Web: ${webLink}`,
      });
    } catch (error) {
      console.error("❌ Ошибка при шаринге:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.background}
    >
      <BlurView intensity={100} style={styles.container}>
        <Text style={styles.title}>🎁 My Wishlist</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={fetchGifts} disabled={loading}>
          <Text style={styles.buttonText}>🔄 Refresh List</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#6a0dad" />
        ) : (
          <FlatList
            data={gifts}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={<Text style={styles.emptyText}>No gifts yet.</Text>}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.giftItem}
                onPress={() => router.push({ pathname: "/gift/[id]", params: { id: item.id } })}
              >
                <Image
                  source={{ uri: item.imageUrl || "https://via.placeholder.com/150" }}
                  style={styles.giftImage}
                  resizeMode="cover"
                />

                <View style={styles.giftTextContainer}>
                  <Text style={styles.giftText}>{item.name}</Text>
                  <Text style={styles.priceText}>${item.price}</Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.createButton} onPress={() => router.push("/create-gift")}>
          <Text style={styles.buttonText}>+ Create Gift</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} onPress={handleShareWishlist}>
          <Text style={styles.buttonText}>🔗 Share Wishlist</Text>
        </TouchableOpacity>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Transparent background for frosted effect
    borderRadius: 20,
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
  shareButton: {
    backgroundColor: "#4a228a",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: "90%",
    alignItems: "center",
  },
  giftItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 6,
    borderRadius: 15,
    backgroundColor: "#ffffffbb", // Slight transparent background for glass effect
    width: screenWidth * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  giftImage: {
    width: 130,
    height: 130,
    borderRadius: 12,
    marginRight: 15,
  },
  giftTextContainer: {
    flex: 1,
  },
  giftText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a0dad",
    marginTop: 5,
  },
  categoryText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: "#6a0dad",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "95%",
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: "#6a0dad",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "95%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
