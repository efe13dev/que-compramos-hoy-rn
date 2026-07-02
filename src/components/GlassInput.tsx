import React, { forwardRef } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface GlassInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export const GlassInput = forwardRef<TextInput, GlassInputProps>(
  ({ label, containerStyle, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={COLORS.textMuted}
          selectionColor={COLORS.blue}
          cursorColor={COLORS.blue}
          {...props}
        />
      </View>
    );
  }
);

GlassInput.displayName = 'GlassInput';

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '400',
  },
});
