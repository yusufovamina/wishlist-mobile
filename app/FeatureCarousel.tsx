import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Image, 
  ImageSourcePropType 
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Feature {
  id: number;
  text: string;
  image: ImageSourcePropType;
}

const features: Feature[] = [
  { id: 1, text: "Create your wishlist easily.", image: require("./assets/gift.jpg") },
  { id: 2, text: "Share your wishlist with friends & family.", image: require("./assets/friends.jpg") },
  { id: 3, text: "Reserve gifts in friends' wishlist.", image: require("./assets/gifts.jpg") },
];

export default function FeatureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const renderItem = ({ item }: { item: Feature }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={width * 0.9} 
        height={320}  
        autoPlay
        autoPlayInterval={3000}
        data={features}
        scrollAnimationDuration={1200}
        onSnapToItem={(index: React.SetStateAction<number>) => setActiveIndex(index)}
        renderItem={renderItem}
      />

      <View style={styles.pagination}>
        {features.map((_, index) => (
          <View 
            key={index} 
            style={[styles.dot, activeIndex === index && styles.activeDot]} 
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/login")}>
        <Text style={styles.buttonText}>Create Your Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  slide: {
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Frosted glass effect
    borderRadius: 20, // Increased radius for more modern look
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    height: 320, // Increased height for a larger card
    elevation: 10, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0,
    shadowRadius: 0,
    backdropFilter: "blur(15px)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border for glass effect
    overflow: "hidden", // To ensure rounded corners work as expected
  },
  image: {
    width: 220,  // Fixed width for all images
    height: 220,  // Fixed height for all images
    resizeMode: "cover", // Ensures images cover the container while maintaining aspect ratio
    marginBottom: 15,
    borderRadius: 15, // Rounded corners for the image
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.4)", // Subtle text shadow for readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "white",
    width: 12,
    height: 12,
  },
  button: {
    marginTop: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent button
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)", // Glass border effect
    backdropFilter: "blur(10px)",
    shadowColor: "rgba(255, 255, 255, 0.5)", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
