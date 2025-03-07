import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

// 📌 Типизация пропсов
interface GiftFormProps {
  onGiftAdded: () => void; // Функция, которая вызывается после успешного добавления
}

const GiftForm: React.FC<GiftFormProps> = ({ onGiftAdded = () => {} }) => {

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 📌 Запрос на разрешение доступа к галерее и выбор изображения
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
      setImage(result.assets[0].uri); // 🔥 Теперь `image` – строка (`uri`)
    }
  };

  // 📌 Функция для отправки формы
  const handleCreateGift = async () => {
    if (!name || !price || !category) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to add a gift.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("price", price.toString()); // ✅ Преобразуем число в строку
      formData.append("category", category);

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob(); // 🔥 Преобразуем `uri` в `Blob`
        
        formData.append("imageFile", blob, `photo_${Date.now()}.jpg`);
      }

      console.log("📤 Sending FormData:", formData);

      const giftResponse = await api.post("/Gift", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          delete headers["Content-Type"]; // React Native сам добавит `boundary`
          return data;
        },
      });

      Alert.alert("Success", "Gift has been successfully added!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      onGiftAdded(); // 📌 Вызываем обновление списка подарков
    } catch (error) {
      console.error("❌ Error adding gift:", error);
      Alert.alert("Error", "Failed to add gift.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("./assets/background.jpg")} // Ваш фоновый изображение
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎁 Add a Gift</Text>

        <TextInput
          style={styles.input}
          placeholder="Gift Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Price ($)"
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

        {/* Кнопка выбора изображения */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>{image ? "Change Image" : "Pick an Image"}</Text>
        </TouchableOpacity>

        {/* Показываем выбранное изображение */}
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        {/* Кнопка для создания подарка */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGift} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Gift</Text>
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%", // Занимает всю ширину
    maxWidth: 600, // Максимальная ширина (для удобства на больших экранах)
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Полупрозрачный фон для эффекта стеклянного морфизма
    borderRadius: 15, // Скругленные углы
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#6a0dad",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Полупрозрачный фон
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#333",
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
  createButton: {
    backgroundColor: "#6a0dad",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GiftForm;
