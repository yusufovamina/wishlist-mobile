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
import { useRouter } from "expo-router";
import api from "../services/api";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasNumber;

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet the requirements.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/Auth/register", {
        username,
        passwordHash: password,
        role: "user",
      });

      Alert.alert("Success", "Registration successful! You can now log in.");
      router.push("/login");
    } catch (err: unknown) {
      let errorMessage = "Registration failed. Try a different username.";

      if (err && typeof err === "object" && "response" in err) {
        errorMessage = (err as any).response?.data?.message || errorMessage;
      }

      console.error("Registration error:", errorMessage);
      setError(errorMessage);
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require("../assets/background.jpg")} style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.glassContainer}>
          <Text style={styles.title}>Sign Up</Text>

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

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Password Validation Messages */}
          <View style={styles.passwordRules}>
            <Text style={[styles.rule, isLengthValid ? styles.valid : styles.invalid]}>✔ At least 8 characters</Text>
            <Text style={[styles.rule, hasUppercase ? styles.valid : styles.invalid]}>
              ✔ At least one uppercase letter
            </Text>
            <Text style={[styles.rule, hasLowercase ? styles.valid : styles.invalid]}>
              ✔ At least one lowercase letter
            </Text>
            <Text style={[styles.rule, hasNumber ? styles.valid : styles.invalid]}>✔ At least one number</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={!isPasswordValid || isLoading}
          >
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
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
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Затемнение фона
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Полупрозрачный эффект
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    backdropFilter: "blur(10px)", // Эффект размытия (работает только в Web, в React Native можно использовать `react-native-blur`)
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
  passwordRules: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
  },
  valid: {
    color: "green",
  },
  invalid: {
    color: "red",
  },
  registerButton: {
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
