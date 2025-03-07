import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../services/api";
import { BlurView } from "expo-blur"; // Import BlurView for glassmorphism effect

export default function EditGiftScreen() {
  const { id } = useLocalSearchParams(); // 🔥 Получаем ID из URL
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const giftId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    fetchGiftDetails();
  }, []);

  const fetchGiftDetails = async () => {
    try {
      const response = await api.get(`/Gift/${id}`);
      const gift = response.data;
      setName(gift.name);
      setPrice(gift.price.toString());
      setCategory(gift.category);
      setImage(gift.imageUrl);
    } catch (error) {
      console.warn("Error fetching gift details:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "You need to allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdateGift = async () => {
    if (!name || !price || !category) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price.toString());
      formData.append("category", category);

      if (image && image.startsWith("file://")) {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("imageFile", blob, `photo_${Date.now()}.jpg`);
      }

      await api.put(`/Gift/${giftId}`, formData); // 🔥 Отправляем обновленные данные

      Alert.alert("Success", "Gift updated successfully!");
      router.replace({ pathname: "/gift/[id]", params: { id: giftId } });
      // 🔥 Возвращаемся назад
    } catch (error) {
      console.error("Error updating gift:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <ImageBackground
        source={require("../../assets/background.jpg")} 
        style={styles.background}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#6a0dad" />
        ) : (
          <BlurView intensity={80} style={styles.glassContainer}>
            <Text style={styles.title}>Edit Gift</Text>

            <TextInput
              style={styles.input}
              placeholder="Gift Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
            />

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>
                {image ? "Change Image" : "Pick an Image"}
              </Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateGift}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </BlurView>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    padding: 20,
    
    margin: 70,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#6a0dad",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  imagePickerText: { fontSize: 16, color: "#333" },
  imagePreview: { width: 150, height: 150, borderRadius: 10, marginTop: 10 },
  updateButton: {
    backgroundColor: "#6a0dad",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});