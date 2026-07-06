import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Line, Path } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface MiiSplashProps {
  onFinish: () => void;
}

// Paleta del personaje
const SKIN = '#ffd9b3';
const HAIR = '#181820';
const TSHIRT = COLORS.pink;
const DENIM = '#4d7cc7';
const DRESS = '#8b5cf6';
const CART = '#cbd5e1';

const CHAR_W = 300;
const CHAR_H = 240;

/** Rueda del carrito con radios (para que se note el giro) */
function Wheel() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26">
      <Circle cx={13} cy={13} r={11} stroke={CART} strokeWidth={3} fill="rgba(255,255,255,0.08)" />
      <Line x1={13} y1={3} x2={13} y2={23} stroke={CART} strokeWidth={2} />
      <Line x1={3} y1={13} x2={23} y2={13} stroke={CART} strokeWidth={2} />
      <Circle cx={13} cy={13} r={2.5} fill={CART} />
    </Svg>
  );
}

/** Chica estilo Mii (pelo rizado negro) empujando el carrito — partes estáticas */
function GirlWithCart() {
  return (
    <Svg width={CHAR_W} height={CHAR_H} viewBox={`0 0 ${CHAR_W} ${CHAR_H}`}>
      {/* Rizos traseros (detrás de la cabeza) */}
      <Circle cx={58} cy={52} r={16} fill={HAIR} />
      <Circle cx={70} cy={34} r={17} fill={HAIR} />
      <Circle cx={95} cy={26} r={18} fill={HAIR} />
      <Circle cx={120} cy={34} r={17} fill={HAIR} />
      <Circle cx={132} cy={52} r={16} fill={HAIR} />
      <Circle cx={54} cy={72} r={13} fill={HAIR} />
      <Circle cx={136} cy={72} r={13} fill={HAIR} />
      <Circle cx={58} cy={90} r={11} fill={HAIR} />
      <Circle cx={134} cy={90} r={11} fill={HAIR} />

      {/* Cabeza (Mii: grande y redonda) */}
      <Circle cx={95} cy={64} r={39} fill={SKIN} />

      {/* Flequillo rizado (delante) */}
      <Circle cx={72} cy={38} r={12} fill={HAIR} />
      <Circle cx={95} cy={32} r={13} fill={HAIR} />
      <Circle cx={118} cy={38} r={12} fill={HAIR} />

      {/* Cejas de agobio */}
      <Path d="M76 54 L90 58" stroke={HAIR} strokeWidth={3.5} strokeLinecap="round" />
      <Path d="M114 54 L100 58" stroke={HAIR} strokeWidth={3.5} strokeLinecap="round" />

      {/* Ojos Mii (óvalos verticales) */}
      <Ellipse cx={83} cy={68} rx={4} ry={6.5} fill={HAIR} />
      <Ellipse cx={107} cy={68} rx={4} ry={6.5} fill={HAIR} />

      {/* Mejillas */}
      <Circle cx={72} cy={80} r={5} fill="rgba(236, 72, 153, 0.35)" />
      <Circle cx={118} cy={80} r={5} fill="rgba(236, 72, 153, 0.35)" />

      {/* Boca abierta de ir con la lengua fuera */}
      <Ellipse cx={95} cy={89} rx={7} ry={5.5} fill="#7c2d3a" />
      <Ellipse cx={95} cy={91.5} rx={4} ry={2.5} fill="#f472b6" />

      {/* Vestido (morado, acampanado) */}
      <Path
        d="M95 100 C 112 106 120 148 124 164 L 66 164 C 70 148 78 106 95 100 Z"
        fill={DRESS}
      />

      {/* Brazos estirados hacia el carrito */}
      <Path d="M106 116 Q 140 114 168 124" stroke={SKIN} strokeWidth={9} strokeLinecap="round" fill="none" />
      <Path d="M104 128 Q 138 130 166 136" stroke={SKIN} strokeWidth={9} strokeLinecap="round" fill="none" />

      {/* Carrito: asa */}
      <Path d="M160 108 L184 116" stroke={CART} strokeWidth={5} strokeLinecap="round" />
      <Circle cx={160} cy={108} r={4} fill={CART} />

      {/* Carrito: cesta (trapecio con rejilla) */}
      <Path
        d="M182 116 L272 116 L262 170 L190 170 Z"
        fill="rgba(255,255,255,0.10)"
        stroke={CART}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Line x1={205} y1={118} x2={208} y2={168} stroke={CART} strokeWidth={1.5} opacity={0.5} />
      <Line x1={227} y1={118} x2={227} y2={168} stroke={CART} strokeWidth={1.5} opacity={0.5} />
      <Line x1={249} y1={118} x2={246} y2={168} stroke={CART} strokeWidth={1.5} opacity={0.5} />
      <Line x1={186} y1={135} x2={266} y2={135} stroke={CART} strokeWidth={1.5} opacity={0.5} />
      <Line x1={184} y1={152} x2={264} y2={152} stroke={CART} strokeWidth={1.5} opacity={0.5} />

      {/* Carrito: patas hacia las ruedas */}
      <Line x1={192} y1={170} x2={198} y2={188} stroke={CART} strokeWidth={4} strokeLinecap="round" />
      <Line x1={260} y1={170} x2={252} y2={188} stroke={CART} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

export function MiiSplash({ onFinish }: MiiSplashProps) {
  const { width } = useWindowDimensions();
  const finishedRef = useRef(false);

  const x = useSharedValue(-CHAR_W - 60);
  const bob = useSharedValue(0);
  const legAngle = useSharedValue(0);
  const wheelRot = useSharedValue(0);
  const sweat = useSharedValue(0);
  const itemBounce = useSharedValue(0);
  const bubbleScale = useSharedValue(0);
  const titleProgress = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  useEffect(() => {
    const midX = width / 2 - CHAR_W / 2;

    // Recorrido: entra corriendo, frena en medio (pánico), y sale disparada
    x.value = withSequence(
      withTiming(midX, { duration: 1300, easing: Easing.out(Easing.cubic) }),
      withDelay(900, withTiming(width + 160, { duration: 850, easing: Easing.in(Easing.quad) }))
    );

    // Bocadillo "¡¡Que cierran!!" durante la pausa
    bubbleScale.value = withSequence(
      withDelay(850, withSpring(1, { damping: 18, stiffness: 180 })),
      withDelay(1100, withTiming(0, { duration: 140 }))
    );

    // Trote: rebote del cuerpo, piernas y ruedas en bucle
    bob.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 110, easing: Easing.in(Easing.quad) })
      ),
      -1,
      false
    );
    legAngle.value = withRepeat(
      withSequence(
        withTiming(30, { duration: 105 }),
        withTiming(-30, { duration: 105 })
      ),
      -1,
      false
    );
    wheelRot.value = withRepeat(withTiming(360, { duration: 420, easing: Easing.linear }), -1, false);
    sweat.value = withRepeat(withTiming(1, { duration: 480, easing: Easing.out(Easing.quad) }), -1, false);
    itemBounce.value = withRepeat(
      withSequence(withTiming(1, { duration: 230 }), withTiming(0, { duration: 230 })),
      -1,
      false
    );

    // Título y despedida
    titleProgress.value = withDelay(3250, withTiming(1, { duration: 550 }));
    overlayOpacity.value = withDelay(
      4600,
      withTiming(0, { duration: 450 }, (done) => {
        if (done) runOnJS(finish)();
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  const handleSkip = () => {
    overlayOpacity.value = withTiming(0, { duration: 250 }, (done) => {
      if (done) runOnJS(finish)();
    });
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));

  const charStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: bob.value },
      { rotate: '4deg' }, // inclinada hacia delante: va con prisa
    ],
  }));

  const legLeftStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -17 },
      { rotate: `${legAngle.value}deg` },
      { translateY: 17 },
    ],
  }));
  const legRightStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -17 },
      { rotate: `${-legAngle.value}deg` },
      { translateY: 17 },
    ],
  }));

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRot.value}deg` }],
  }));

  const sweatStyle = useAnimatedStyle(() => ({
    opacity: 1 - sweat.value,
    transform: [
      { translateX: -sweat.value * 26 },
      { translateY: -sweat.value * 20 },
    ],
  }));
  const sweatStyle2 = useAnimatedStyle(() => ({
    opacity: 1 - sweat.value,
    transform: [
      { translateX: -sweat.value * 18 },
      { translateY: sweat.value * 12 },
    ],
  }));

  const item1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: -5 * itemBounce.value }, { rotate: '-18deg' }],
  }));
  const item2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: -7 * (1 - itemBounce.value) }],
  }));
  const item3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: -4 * itemBounce.value }, { rotate: '10deg' }],
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: bubbleScale.value,
    transform: [{ scale: bubbleScale.value }],
  }));

  const speedLineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(itemBounce.value, [0, 1], [0.15, 0.5]),
    transform: [{ translateX: -10 - 14 * itemBounce.value }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: interpolate(bob.value, [-7, 0], [0.9, 1]) }],
    opacity: interpolate(bob.value, [-7, 0], [0.25, 0.4]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [{ scale: interpolate(titleProgress.value, [0, 1], [0.85, 1]) }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.container, overlayStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleSkip}>
        <LinearGradient
          colors={[COLORS.bgDark, COLORS.bgMid, COLORS.bgAccent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Título (aparece cuando ella ya ha cruzado) */}
        <View style={styles.titleContainer} pointerEvents="none">
          <Animated.View style={titleStyle}>
            <Text style={styles.title}>¿Qué compramos hoy?</Text>
          </Animated.View>
        </View>

        {/* Escenario del personaje */}
        <View style={styles.stage} pointerEvents="none">
          <Animated.View style={[styles.character, charStyle]}>
            {/* Líneas de velocidad */}
            <Animated.View style={speedLineStyle}>
              <View style={[styles.speedLine, { top: 60, left: -58, width: 46 }]} />
              <View style={[styles.speedLine, { top: 105, left: -44, width: 32 }]} />
              <View style={[styles.speedLine, { top: 150, left: -62, width: 50 }]} />
            </Animated.View>

            {/* Sombra en el suelo */}
            <Animated.View style={[styles.groundShadow, shadowStyle]} />

            {/* Cuerpo + carrito (SVG estático) */}
            <GirlWithCart />

            {/* Piernas corriendo */}
            <Animated.View style={[styles.leg, { left: 79 }, legLeftStyle]}>
              <View style={styles.shoe} />
            </Animated.View>
            <Animated.View style={[styles.leg, { left: 99 }, legRightStyle]}>
              <View style={styles.shoe} />
            </Animated.View>

            {/* Ruedas girando */}
            <Animated.View style={[styles.wheel, { left: 185 }, wheelStyle]}>
              <Wheel />
            </Animated.View>
            <Animated.View style={[styles.wheel, { left: 239 }, wheelStyle]}>
              <Wheel />
            </Animated.View>

            {/* Compra botando dentro del carrito */}
            <Animated.Text style={[styles.item, { left: 188, top: 86 }, item1Style]}>🥖</Animated.Text>
            <Animated.Text style={[styles.item, { left: 214, top: 92 }, item2Style]}>🍎</Animated.Text>
            <Animated.Text style={[styles.item, { left: 236, top: 88 }, item3Style]}>🥛</Animated.Text>

            {/* Gotas de sudor */}
            <Animated.View style={[styles.sweat, { left: 48, top: 34 }, sweatStyle]} />
            <Animated.View style={[styles.sweatSmall, { left: 42, top: 62 }, sweatStyle2]} />

            {/* Bocadillo */}
            <Animated.View style={[styles.bubble, bubbleStyle]}>
              <Text style={styles.bubbleText}>¡Mierda, no traje la lista!</Text>
              <View style={styles.bubbleTail} />
            </Animated.View>
          </Animated.View>
        </View>

        <Text style={styles.skipHint}>toca para saltar</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
  },
  stage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  speedLine: {
    position: 'absolute',
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
  },
  character: {
    width: CHAR_W,
    height: CHAR_H,
    marginTop: 60,
  },
  leg: {
    position: 'absolute',
    top: 158,
    width: 11,
    height: 34,
    borderRadius: 6,
    backgroundColor: SKIN,
  },
  shoe: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 17,
    height: 9,
    borderRadius: 5,
    backgroundColor: HAIR,
  },
  wheel: {
    position: 'absolute',
    top: 182,
    width: 26,
    height: 26,
  },
  item: {
    position: 'absolute',
    fontSize: 24,
  },
  sweat: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.cyan,
  },
  sweatSmall: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
    opacity: 0.8,
  },
  groundShadow: {
    position: 'absolute',
    top: 212,
    left: 50,
    width: 210,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  bubble: {
    position: 'absolute',
    top: -26,
    left: 34,
    backgroundColor: '#f0f0ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleText: {
    color: '#1a0a3d',
    fontWeight: '800',
    fontSize: 15,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    left: 26,
    width: 14,
    height: 14,
    backgroundColor: '#f0f0ff',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    marginTop: 220,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  skipHint: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
  },
});
