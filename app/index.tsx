import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api'
import FeatureCarousel from './FeatureCarousel';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Wishlist App!</Text>
      <FeatureCarousel/>
      <Button title="Create your Wishlist" onPress={() => router.push('/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6a0dad' },
});
