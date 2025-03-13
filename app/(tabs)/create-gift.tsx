import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";
import { BlurView } from "expo-blur";

interface GiftFormProps {
  onGiftAdded: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const GiftForm: React.FC<GiftFormProps> = ({ onGiftAdded = () => {} }) => {
  // Ваши state и анимации остаются без изменений
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const containerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  const imageAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (image) {
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      imageAnim.setValue(0);
    }
  }, [image]);

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
      formData.append("price", price.toString());
      formData.append("category", category);

      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        formData.append("imageFile", blob, `photo_${Date.now()}.jpg`);
      }

      console.log("Sending FormData:", formData);

      await api.post("/Gift", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data, headers) => {
          delete headers["Content-Type"];
          return data;
        },
      });

      Alert.alert("Success", "Gift has been successfully added!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      onGiftAdded();
    } catch (error) {
      console.error("Error adding gift:", error);
      Alert.alert("Error", "Failed to add gift.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      <Video
        source={require("../assets/bg.mp4")} // Укажите путь к вашему видео
        style={StyleSheet.absoluteFill}
      
        shouldPlay
        isLooping
        isMuted
      />
 <BlurView intensity={50} tint="default" style={StyleSheet.absoluteFill} />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: containerAnim,
            transform: [
              {
                scale: containerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>Add a Gift</Text>

        <TextInput
          style={styles.input}
          placeholder="Gift Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Price ($)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          style={styles.input}
          placeholder="Category"
          placeholderTextColor="#999"
          value={category}
          onChangeText={setCategory}
        />

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {image ? "Change Image" : "Pick an Image"}
          </Text>
        </TouchableOpacity>

        {image && (
          <Animated.Image
            source={{ uri: image }}
            style={[styles.imagePreview, { opacity: imageAnim }]}
            resizeMode="cover"
          />
        )}

        <AnimatedTouchableOpacity
          style={[styles.createButton, { transform: [{ scale: buttonScale }] }]}
          onPress={handleCreateGift}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Gift</Text>
          )}
        </AnimatedTouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  imagePicker: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  imagePickerText: {
    fontSize: 16,
    color: "#555",
  },
  imagePreview: {
    width: 180,
    height: 180,
    borderRadius: 15,
    marginTop: 15,
  },
  createButton: {
    backgroundColor: "#6a0dad",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default GiftForm;
