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
  interpolateColor,
  LinearTransition,
} from 'react-native-reanimated';
import { Product } from '../types';
import { COLORS, RADIUS } from '../constants/theme';

interface ProductItemProps {
  product: Product;
  onToggle: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductItem = React.memo(function ProductItem({
  product,
  onToggle,
  onEdit,
  onDelete,
}: ProductItemProps) {
  const boughtProgress = useSharedValue(product.bought ? 1 : 0);
  const checkScale = useSharedValue(product.bought ? 1 : 0.7);
  const deleteScale = useSharedValue(1);

  useEffect(() => {
    boughtProgress.value = withTiming(product.bought ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
    // ponytail: el check se anima en el efecto, no dentro del worklet
    // (withSpring dentro de useAnimatedStyle lanza una animación por frame).
    checkScale.value = withSpring(product.bought ? 1 : 0.7, {
      damping: 12,
      stiffness: 200,
    });
  }, [product.bought, boughtProgress, checkScale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(boughtProgress.value, [0, 1], [1, 0.52]),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      boughtProgress.value,
      [0, 1],
      [COLORS.textPrimary, COLORS.textSecondary]
    ),
  }));

  const checkboxStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      boughtProgress.value,
      [0, 1],
      ['transparent', 'rgba(34, 211, 238, 0.2)']
    ),
    borderColor: interpolateColor(
      boughtProgress.value,
      [0, 1],
      ['rgba(255,255,255,0.25)', COLORS.cyan]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
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
        { text: 'Eliminar', style: 'destructive', onPress: () => onDelete(product.id) },
      ]
    );
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      exiting={FadeOutLeft.duration(250)}
      layout={LinearTransition.duration(300)}
    >
      <Animated.View style={[styles.wrapper, containerStyle]}>
        {/* Checkbox + nombre */}
        <Pressable
          style={styles.row}
          onPress={() => onToggle(product.id)}
          onLongPress={() => onEdit(product)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: product.bought }}
          accessibilityLabel={product.name}
        >
          <Animated.View style={[styles.checkbox, checkboxStyle]}>
            <Animated.Text style={[styles.checkmark, checkStyle]}>✓</Animated.Text>
          </Animated.View>

          <Animated.Text
            style={[
              styles.name,
              textStyle,
              { textDecorationLine: product.bought ? 'line-through' : 'none' },
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Animated.Text>
        </Pressable>

        {/* Acciones */}
        <View style={styles.actions}>
          <Pressable
            style={styles.editBtn}
            onPress={() => onEdit(product)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${product.name}`}
          >
            <Text style={styles.editIcon}>✏️</Text>
          </Pressable>
          <AnimatedPressable
            style={[styles.deleteBtn, deleteAnimStyle]}
            onPress={handleDeletePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${product.name}`}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </AnimatedPressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

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
  checkmark: {
    color: COLORS.cyan,
    fontSize: 14,
    fontWeight: '700',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
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
