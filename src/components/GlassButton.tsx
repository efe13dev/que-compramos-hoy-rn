import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS } from '../constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: string;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  small?: boolean;
}

export function GlassButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  style,
  textStyle,
  disabled = false,
  small = false,
}: GlassButtonProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.94, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const bgColor =
    variant === 'primary'
      ? 'rgba(79, 158, 255, 0.2)'
      : variant === 'danger'
        ? 'rgba(248, 113, 113, 0.15)'
        : variant === 'ghost'
          ? 'transparent'
          : 'rgba(255, 255, 255, 0.08)';

  const borderColor =
    variant === 'primary'
      ? 'rgba(79, 158, 255, 0.4)'
      : variant === 'danger'
        ? 'rgba(248, 113, 113, 0.4)'
        : variant === 'ghost'
          ? 'transparent'
          : COLORS.glassBorder;

  const color =
    variant === 'primary'
      ? COLORS.blue
      : variant === 'danger'
        ? COLORS.danger
        : COLORS.textPrimary;

  return (
    <AnimatedPressable
      style={[
        styles.button,
        small && styles.small,
        { backgroundColor: bgColor, borderColor },
        animStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={[styles.label, { color }, small && styles.labelSmall, textStyle]}>
          {icon ? `${icon}  ${label}` : label}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 13,
  },
});
