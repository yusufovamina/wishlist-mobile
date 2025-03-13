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
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function EditGiftScreen() {
  const { id } = useLocalSearchParams(); // Получаем ID из URL
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const giftId = Array.isArray(id) ? id[0] : id;

  // Анимация контейнера формы
  const containerOpacity = useSharedValue(0);
  const containerTranslateY = useSharedValue(20);

  useEffect(() => {
    fetchGiftDetails();
    // Анимируем появление формы: плавное увеличение прозрачности и сдвиг вверх
    containerOpacity.value = withTiming(1, { duration: 800 });
    containerTranslateY.value = withTiming(0, { duration: 800 });
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: containerOpacity.value,
      transform: [{ translateY: containerTranslateY.value }],
    };
  });

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

      await api.put(`/Gift/${giftId}`, formData);
      Alert.alert("Success", "Gift updated successfully!");
      router.replace({ pathname: "/gift/[id]", params: { id: giftId } });
    } catch (error) {
      console.error("Error updating gift:", error);
      Alert.alert("Error", "Failed to update gift. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <ImageBackground source={require("../../assets/background.jpg")} style={styles.background}>
    
      {loading ? (
        <ActivityIndicator size="large" color="#6a0dad" />
      ) : (
        <Animated.View style={[styles.formContainer, animatedContainerStyle]}>
          <Text style={styles.title}>Edit Gift</Text>

          <TextInput
            style={styles.input}
            placeholder="Gift Name"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#ccc"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <TextInput
            style={styles.input}
            placeholder="Category"
            placeholderTextColor="#ccc"
            value={category}
            onChangeText={setCategory}
          />

       
          {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

          <TouchableOpacity onPress={handleUpdateGift} disabled={loading} style={styles.buttonContainer}>
            <LinearGradient
              colors={["#6a0dad", "#9B59B6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
    margin: 70,
    width: "90%",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "white",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
  },
  imagePicker: {
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  imagePickerText: { fontSize: 16, color: "white" },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 15,
  },
  updateButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
