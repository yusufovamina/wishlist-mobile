import React from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import FeatureCarousel from "./FeatureCarousel";
import GradientBackground from "./GradientBackground";

export default function HomeScreen() {
  const router = useRouter();

  return (

    <SafeAreaView style={styles.container}>
    <GradientBackground>
      <Text style={styles.title}>Welcome to Wishlist App!</Text>
      <FeatureCarousel />
        

    </GradientBackground>
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a0dad",
    marginBottom: 20,
  },
});
