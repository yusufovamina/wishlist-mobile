import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageSourcePropType  } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Define the type for each feature item
interface Feature {
  id: number;
  text: string;
  image: ImageSourcePropType; // You can also use ImageSourcePropType from react-native if you prefer
}

const features: Feature[] = [
  { id: 1, text: "Create your wishlist easily.", image: require('./assets/gift.jpg') },
  { id: 2, text: "Share your wishlist with friends & family.", image: require('./assets/friends.jpg') },
  { id: 3, text: "Reserve gifts in friends wishlist", image: require('./assets/gifts.jpg') },
];
export default function FeatureCarousel() {
  const carouselRef = useRef(null);
  const router = useRouter();

  // Step 3: Type the item in renderItem function to ensure TypeScript knows about its shape
  const renderItem = ({ item }: { item: Feature }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carouselRef}
        data={features}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={width * 0.8}
        autoplay
        autoplayInterval={3000}
        loop
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
        <Text style={styles.buttonText}>Create Your Wishlist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: { alignItems: 'center', marginBottom: 20 },
  slide: { backgroundColor: '#fff', borderRadius: 10, padding: 20, alignItems: 'center', justifyContent: 'center', width: width * 0.8, height: 180, elevation: 5 },
  image: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  text: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#6a0dad' },
  button: { marginTop: 20, backgroundColor: '#6a0dad', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});