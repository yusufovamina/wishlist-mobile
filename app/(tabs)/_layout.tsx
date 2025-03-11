import { Tabs } from "expo-router";
import CustomTabBar from "./TabBar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      // Передаем наш кастомный таб-бар
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="ReservedGifts" options={{ tabBarLabel: 'Reserved Gifts' }} />
      <Tabs.Screen name="wishlist" options={{ tabBarLabel: 'Your Wishlist' }} />
    </Tabs>
  );
}
