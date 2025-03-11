import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
    {state.routes.map((route, index) => {
      // Фильтруем только нужные вкладки
      if (!(route.name === 'ReservedGiftsPage' || route.name === 'wishlist')) {
        return null;
      }
      
      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });
        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name);
        }
      };

      const scale = useSharedValue(isFocused ? 1.2 : 1);
      React.useEffect(() => {
        scale.value = withTiming(isFocused ? 1.2 : 1, { duration: 250 });
      }, [isFocused]);

      const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
      }));

      let label = '';
      if (route.name === 'ReservedGiftsPage') {
        label = 'Reserved Gifts';
      } else if (route.name === 'wishlist') {
        label = 'Your Wishlist';
      }

      return (
        <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
          <Animated.View style={[styles.button, animatedStyle]}>
            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {label}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      );
    })}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    padding: 10,
  },
  label: {
    fontSize: 14,
    color: '#222',
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#673ab7',
  },
});
