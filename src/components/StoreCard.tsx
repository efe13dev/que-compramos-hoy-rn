import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Store } from '../types';
import { COLORS, RADIUS, SHADOW } from '../constants/theme';

interface StoreCardProps {
  store: Store;
  pending: number;
  bought: number;
  onPress: () => void;
  index: number;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function StoreCard({ store, pending, bought, onPress, index, compact = false }: StoreCardProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  };

  const total = pending + bought;
  const progress = total > 0 ? bought / total : 0;

  return (
    <Animated.View entering={FadeInUp.delay(index * 120).duration(400).springify()}>
      <Animated.View style={animStyle}>
        <AnimatedPressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.card, compact && styles.cardCompact, SHADOW.card]}
        >
          <LinearGradient
            colors={store.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Borde glassmorphism encima del gradiente */}
          <View style={[styles.border, compact && styles.borderCompact]} />

          {/* Orb decorativo */}
          {!compact && (
            <View style={[styles.orb, { backgroundColor: store.accentColor + '22' }]} />
          )}

          {/* Header */}
          <View style={[styles.header, compact && styles.headerCompact]}>
            <Text style={[styles.emoji, compact && styles.emojiCompact]}>{store.emoji}</Text>
            <View style={[styles.badge, compact && styles.badgeCompact]}>
              <Text style={[styles.badgeText, { color: store.accentColor }]}>
                {pending}
              </Text>
              <Text style={[styles.badgeLabel, compact && styles.badgeLabelCompact]}> pendientes</Text>
            </View>
          </View>

          {/* Nombre */}
          <Text style={[styles.name, compact && styles.nameCompact]}>{store.name}</Text>

          {/* Contador */}
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            {pending === 0 && total === 0
              ? 'Lista vacía'
              : pending === 0
              ? 'Todo comprado ✓'
              : `${pending} producto${pending !== 1 ? 's' : ''} para comprar`}
          </Text>

          {/* Barra de progreso */}
          {!compact && total > 0 && (
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: store.accentColor,
                  },
                ]}
              />
            </View>
          )}

          {/* Flecha */}
          <View style={[styles.arrowContainer, compact && styles.arrowContainerCompact]}>
            <Text style={[styles.arrow, compact && styles.arrowCompact, { color: store.accentColor }]}>→</Text>
          </View>
        </AnimatedPressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    minHeight: 160,
  },
  cardCompact: {
    padding: 18,
    minHeight: 88,
    borderRadius: RADIUS.lg,
  },
  border: {
    ...StyleSheet.absoluteFill,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  borderCompact: {
    borderRadius: RADIUS.lg,
  },
  orb: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerCompact: {
    marginBottom: 8,
  },
  emoji: {
    fontSize: 32,
  },
  emojiCompact: {
    fontSize: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeCompact: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  badgeLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  badgeLabelCompact: {
    fontSize: 11,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  nameCompact: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  subtitleCompact: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 0,
  },
  progressBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  arrowContainer: {
    position: 'absolute',
    right: 24,
    bottom: 24,
  },
  arrowContainerCompact: {
    right: 18,
    bottom: 18,
  },
  arrow: {
    fontSize: 22,
    fontWeight: '700',
  },
  arrowCompact: {
    fontSize: 18,
  },
});
