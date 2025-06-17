import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

type TabBarBackgroundProps = {
  color?: string;
  style?: ViewStyle;
};

export default function TabBarBackground({ color, style }: TabBarBackgroundProps) {
  return (
    <View style={[styles.background, { backgroundColor: color }, style]}>
      <BlurView
        intensity={80}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 30; // Add some overflow for the tab bar blur effect
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100, // Extra height for the blur effect
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});
