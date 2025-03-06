import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, withRepeat, withTiming, interpolateColor, useAnimatedStyle } from "react-native-reanimated";

const colors = [
  ["#FFC1CC", "#D8BFD8"], // Розово-фиолетовый
  ["#D8BFD8", "#ADD8E6"], // Сиренево-голубой
  ["#ADD8E6", "#FFC1CC"], // Голубой-розовый
];

export default function GradientBackground({ children }: { children: React.ReactNode }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(2, { duration: 8000 }), -1, true);
  }, []);

  const animatedGradient = useAnimatedStyle(() => {
    const color1 = interpolateColor(progress.value, [0, 1, 2], [colors[0][0], colors[1][0], colors[2][0]]);
    const color2 = interpolateColor(progress.value, [0, 1, 2], [colors[0][1], colors[1][1], colors[2][1]]);
    return { backgroundColor: color1 };
  });

  return (
    <Animated.View style={[styles.gradientBackground, animatedGradient]}>
      <LinearGradient colors={["#FFC1CC", "#D8BFD8"]} style={styles.gradient}>
        {children}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
