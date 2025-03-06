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
        height={280}  
        autoPlay
        autoPlayInterval={3000}
        data={features}
        scrollAnimationDuration={1200}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
      />

      <View style={styles.pagination}>
        {features.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              activeIndex === index && styles.activeDot
            ]} 
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.9,
    height: 250,
    elevation: 10, // Тень на Android
    shadowColor: "#000", // Тень на iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    width: 180,  
    height: 180, 
    resizeMode: "contain",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a0dad",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#c4c4c4",
    marginHorizontal: 5,
    opacity: 0.6,
  },
  activeDot: {
    backgroundColor: "#6a0dad",
    width: 12,
    height: 12,
    opacity: 1,
  },
  button: {
    marginTop: 25,
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    elevation: 5, // Тень на Android
    shadowColor: "#6a0dad", // Тень на iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
