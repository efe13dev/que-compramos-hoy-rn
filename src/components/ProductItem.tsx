import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet, View, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeInDown,
  FadeOutLeft,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Product } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface ProductItemProps {
  product: Product;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ProductItem({ product, onToggle, onEdit, onDelete }: ProductItemProps) {
  const boughtProgress = useSharedValue(product.bought ? 1 : 0);
  const deleteScale = useSharedValue(1);

  useEffect(() => {
    boughtProgress.value = withTiming(product.bought ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
  }, [product.bought]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(boughtProgress.value, [0, 1], [1, 0.52]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    // El tachado se aplica condicionalmente (no animable via RN), manejamos con opacity+color
    color: boughtProgress.value > 0.5 ? COLORS.textSecondary : COLORS.textPrimary,
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(product.bought ? 1 : 0.7) }],
    opacity: boughtProgress.value,
  }));

  const deleteAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deleteScale.value }],
  }));

  const handleDeletePress = () => {
    deleteScale.value = withSpring(0.85, { damping: 10, stiffness: 400 }, () => {
      deleteScale.value = withSpring(1, { damping: 10, stiffness: 400 });
    });
    Alert.alert(
      'Eliminar producto',
      `¿Eliminar "${product.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutLeft.duration(250)}
      style={[styles.wrapper, containerStyle]}
    >
      {/* Checkbox + nombre */}
      <Pressable style={styles.row} onPress={onToggle} onLongPress={onEdit}>
        <View style={[styles.checkbox, product.bought && styles.checkboxChecked]}>
          <Animated.Text style={[styles.checkmark, checkStyle]}>✓</Animated.Text>
        </View>

        <View style={styles.nameContainer}>
          <Animated.Text
            style={[styles.name, textStyle]}
            numberOfLines={2}
          >
            {product.name}
          </Animated.Text>
          {product.bought && (
            <View style={styles.strikeContainer}>
              <Animated.View
                style={[
                  styles.strikeLine,
                  {
                    width: `${boughtProgress.value * 100}%`,
                  } as any,
                ]}
              />
            </View>
          )}
        </View>
      </Pressable>

      {/* Acciones */}
      <View style={styles.actions}>
        <Pressable style={styles.editBtn} onPress={onEdit} hitSlop={8}>
          <Text style={styles.editIcon}>✏️</Text>
        </Pressable>
        <AnimatedPressable
          style={[styles.deleteBtn, deleteAnimStyle]}
          onPress={handleDeletePress}
          hitSlop={8}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(34, 211, 238, 0.2)',
  },
  checkmark: {
    color: COLORS.cyan,
    fontSize: 14,
    fontWeight: '700',
  },
  nameContainer: {
    flex: 1,
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  strikeContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1.5,
    overflow: 'hidden',
  },
  strikeLine: {
    height: 1.5,
    backgroundColor: COLORS.textSecondary,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  editBtn: {
    padding: 6,
  },
  editIcon: {
    fontSize: 16,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
