import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  TextInput,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { GlassInput } from './GlassInput';
import { GlassButton } from './GlassButton';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
}

export function GlassModal({
  visible,
  onClose,
  onConfirm,
  title,
  placeholder = 'Escribe aquí...',
  initialValue = '',
  confirmLabel = 'Añadir',
}: GlassModalProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  const backdropOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.88);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    if (visible) {
      setValue(initialValue);
      backdropOpacity.value = withTiming(1, { duration: 200 });
      cardScale.value = withSpring(1, { damping: 18, stiffness: 200 });
      cardOpacity.value = withTiming(1, { duration: 180 });
      // Focus después de la animación
      focusTimer = setTimeout(() => inputRef.current?.focus(), 250);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 180 });
      cardScale.value = withTiming(0.88, { duration: 160, easing: Easing.in(Easing.quad) });
      cardOpacity.value = withTiming(0, { duration: 160 });
    }
    return () => {
      if (focusTimer) clearTimeout(focusTimer);
    };
  }, [visible, initialValue]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  const handleConfirm = () => {
    if (!value.trim()) return;
    Keyboard.dismiss();
    onConfirm(value.trim());
    setValue('');
  };

  const handleClose = () => {
    Keyboard.dismiss();
    setValue('');
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={handleClose}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdropFill, backdropStyle]} />
      </Pressable>

      <View style={styles.centered} pointerEvents="box-none">
        <Animated.View style={[styles.card, SHADOW.card, cardStyle]}>
          <Text style={styles.title}>{title}</Text>

          <GlassInput
            ref={inputRef}
            placeholder={placeholder}
            value={value}
            onChangeText={setValue}
            returnKeyType="done"
            onSubmitEditing={handleConfirm}
            autoCapitalize="sentences"
            containerStyle={{ marginTop: 16 }}
          />

          <View style={styles.actions}>
            <GlassButton
              label="Cancelar"
              onPress={handleClose}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <GlassButton
              label={confirmLabel}
              onPress={handleConfirm}
              variant="primary"
              style={{ flex: 1 }}
              disabled={!value.trim()}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {},
  backdropFill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    // Subimos el modal cuando sale el teclado
    marginBottom: Platform.OS === 'ios' ? 0 : 0,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(20, 10, 45, 0.97)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
});
