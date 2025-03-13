import React, { useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import FeatureCarousel from "./FeatureCarousel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { BlurView } from "expo-blur";

export default function HomeScreen() {
  const router = useRouter();

  // Анимированные значения для заголовка
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-20);

  // Анимированные значения для карусели
  const carouselOpacity = useSharedValue(0);
  const carouselTranslateY = useSharedValue(20);

  useEffect(() => {
    // Заголовок появляется плавно и сдвигается вниз
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withTiming(0, { duration: 800 });
    // Карусель появляется с задержкой, плавно сдвигаясь вверх
    carouselOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    carouselTranslateY.value = withDelay(500, withTiming(0, { duration: 800 }));
  }, []);

  const animatedTitleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const animatedCarouselStyle = useAnimatedStyle(() => ({
    opacity: carouselOpacity.value,
    transform: [{ translateY: carouselTranslateY.value }],
  }));

  return (
    <View style={styles.backgroundContainer}>
      {/* Видеофон с bg.mp4 */}
      <Video
        source={require("./assets/bg.mp4")}
        style={StyleSheet.absoluteFill}
   
        shouldPlay
        isLooping
        isMuted
      />
      {/* Блюр-слой поверх видео */}
      <BlurView intensity={50} style={StyleSheet.absoluteFill} />
      {/* Градиентный оверлей */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.container}>
        <Animated.Text style={[styles.title, animatedTitleStyle]}>
          Welcome to Wishlist App!
        </Animated.Text>
        <Animated.View style={animatedCarouselStyle}>
          <FeatureCarousel />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
});
