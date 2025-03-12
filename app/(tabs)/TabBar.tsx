import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
        }));

        let label = '';
        let iconName = '';
        if (route.name === 'ReservedGiftsPage') {
          label = 'Reserved Gifts';
          iconName = 'gift'; // Иконка подарка
        } else if (route.name === 'wishlist') {
          label = 'Your Wishlist';
          iconName = 'heart'; // Иконка сердца
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            <Animated.View style={[styles.button, animatedStyle]}>
              <Icon name={iconName} size={20} color={isFocused ? '#fff' : '#ddd'} style={styles.icon} />
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
    height: 80,
    backgroundColor: '#73018a',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#73018a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: '#73018a',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    marginBottom: 5,
  },
  label: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
