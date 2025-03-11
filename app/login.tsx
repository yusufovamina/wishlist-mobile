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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../services/api";
import axios from "axios";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/Auth/login", {
        username,
        passwordHash: password,
        role: "user",
      });

      console.log("🔍 Login API Response:", response.data);
      const token = response.data.Token || response.data.token;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", response.data.userId);
      await AsyncStorage.setItem("username", response.data.username);
      console.log("✅ User ID stored:", response.data.userId);

      Alert.alert("Success", "Logged in successfully!");
      router.push("/(tabs)/wishlist");
    } catch (err) {
      let errorMessage = "An unexpected error occurred.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }

      console.error("❌ Login failed:", errorMessage);
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/register")}>
            <Text style={styles.registerText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Затемнение фона для лучшей читаемости текста
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Полупрозрачный эффект
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
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
  registerButton: {
    marginTop: 15,
    alignItems: "center",
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
