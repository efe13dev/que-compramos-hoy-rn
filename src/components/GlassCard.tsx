import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
  noPadding?: boolean;
}

export function GlassCard({
  children,
  style,
  borderColor = COLORS.glassBorder,
  noPadding = false,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.card,
        { borderColor },
        noPadding && { padding: 0 },
        SHADOW.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.glassBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
});
