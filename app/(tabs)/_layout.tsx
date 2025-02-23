import { Tabs } from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="wishlist" 
        options={{ title: 'Wishlist', tabBarIcon: ({ color }) => <Ionicons name="gift" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}
