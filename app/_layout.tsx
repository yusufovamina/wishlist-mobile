import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // ✅ Исправленный код для обработки Deep Linking
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log("🔗 Deep link opened:", url);

      // Разбираем URL вручную
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.replace(/^\/+/, ""); // Убираем слеш в начале
      const segments = path.split("/");

      if (segments[0] === "wishlist" && segments[1]) {
        const wishlistId = segments[1];
        console.log("📌 Open Wishlist ID:", wishlistId);
        router.push({
          pathname: "/wishlist/shared/[id]", // путь
          params: { id: wishlistId }, 
        });
      }
    };

    // ✅ Новый способ подписки
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove(); // ✅ Удаляем подписку
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
