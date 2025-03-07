import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import FeatureCarousel from "./FeatureCarousel";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={require("./assets/background.jpg")} style={styles.background} >
      <SafeAreaView style={styles.container}>
        <View style={styles.glassContainer}>
          <Text style={styles.title}>Welcome to Wishlist App!</Text>
          <FeatureCarousel />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 2,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Semi-transparent white
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
