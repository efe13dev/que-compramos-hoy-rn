import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';

import { useShoppingList } from '../../src/hooks/useShoppingList';
import { ProductItem } from '../../src/components/ProductItem';
import { GlassModal } from '../../src/components/GlassModal';
import { GlassButton } from '../../src/components/GlassButton';
import { GlassCard } from '../../src/components/GlassCard';
import { COLORS, RADIUS, SHADOW } from '../../src/constants/theme';
import { Product } from '../../src/types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StoreScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    products,
    store,
    pending,
    bought,
    addProduct,
    editProduct,
    deleteProduct,
    toggleProduct,
    clearBought,
    clearList,
    resetAll,
  } = useShoppingList(id);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fabScale = useSharedValue(1);
  const fabAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleFabPressIn = () => {
    fabScale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  };
  const handleFabPressOut = () => {
    fabScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handleAdd = useCallback(
    (name: string) => {
      addProduct(name);
      setAddModalVisible(false);
    },
    [addProduct]
  );

  const handleEdit = useCallback(
    (name: string) => {
      if (!editingProduct) return;
      editProduct(editingProduct.id, name);
      setEditingProduct(null);
    },
    [editingProduct, editProduct]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductItem
        product={item}
        onToggle={toggleProduct}
        onEdit={setEditingProduct}
        onDelete={deleteProduct}
      />
    ),
    [toggleProduct, deleteProduct]
  );

  const handleResetMenu = () => {
    Alert.alert(
      'Opciones de reinicio',
      'Elige qué quieres hacer:',
      [
        {
          text: 'Limpiar comprados',
          onPress: () => {
            if (bought === 0) {
              Alert.alert('Sin productos comprados', 'No hay productos marcados como comprados.');
              return;
            }
            Alert.alert(
              'Limpiar comprados',
              `¿Eliminar los ${bought} producto${bought !== 1 ? 's' : ''} comprado${bought !== 1 ? 's' : ''}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Limpiar', style: 'destructive', onPress: clearBought },
              ]
            );
          },
        },
        {
          text: 'Vaciar lista',
          onPress: () => {
            if (products.length === 0) {
              Alert.alert('Lista vacía', 'La lista ya está vacía.');
              return;
            }
            Alert.alert(
              'Vaciar lista',
              `¿Eliminar todos los ${products.length} productos de ${store?.name}?`,
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Vaciar', style: 'destructive', onPress: clearList },
              ]
            );
          },
        },
        {
          text: 'Restablecer todo',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Restablecer todo',
              '¿Vaciar las listas de todos los supermercados?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Restablecer', style: 'destructive', onPress: resetAll },
              ]
            );
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  if (!store) {
    return (
      <View style={styles.notFound}>
        <Text style={{ color: COLORS.textPrimary }}>Supermercado no encontrado</Text>
      </View>
    );
  }

  const accentColor = store.accentColor;

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[store.gradientColors[0], store.gradientColors[1], '#0a0118']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 1]}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <SafeAreaView style={styles.safe}>
          {/* Header */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
              <Text style={styles.backIcon}>←</Text>
            </Pressable>

            <View style={styles.headerCenter}>
              <Text style={styles.storeEmoji}>{store.emoji}</Text>
              <Text style={styles.storeName}>{store.name}</Text>
            </View>

            <Pressable onPress={handleResetMenu} style={styles.menuBtn} hitSlop={12}>
              <Text style={styles.menuIcon}>⋯</Text>
            </Pressable>
          </Animated.View>

          {/* Contadores */}
          <Animated.View entering={FadeIn.delay(100).duration(300)} style={styles.counters}>
            <GlassCard style={styles.counterCard} borderColor={accentColor + '40'}>
              <Text style={[styles.counterNumber, { color: accentColor }]}>{pending}</Text>
              <Text style={styles.counterLabel}>Pendientes</Text>
            </GlassCard>
            <GlassCard style={styles.counterCard} borderColor="rgba(255,255,255,0.1)">
              <Text style={[styles.counterNumber, { color: COLORS.textSecondary }]}>{bought}</Text>
              <Text style={styles.counterLabel}>Comprados</Text>
            </GlassCard>
            <GlassCard style={styles.counterCard} borderColor="rgba(255,255,255,0.1)">
              <Text style={[styles.counterNumber, { color: COLORS.textSecondary }]}>
                {products.length}
              </Text>
              <Text style={styles.counterLabel}>Total</Text>
            </GlassCard>
          </Animated.View>

          {/* Lista de productos */}
          <FlatList
            data={products}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState accentColor={accentColor} />}
          />

          {/* FAB para añadir */}
          <AnimatedPressable
            style={[styles.fab, { backgroundColor: accentColor }, fabAnimStyle, SHADOW.button]}
            onPress={() => setAddModalVisible(true)}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
          >
            <Text style={styles.fabIcon}>+</Text>
          </AnimatedPressable>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* Modal: añadir producto */}
      <GlassModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onConfirm={handleAdd}
        title="Añadir producto"
        placeholder="Ej: Leche, Pan, Manzanas..."
        confirmLabel="Añadir"
      />

      {/* Modal: editar producto */}
      <GlassModal
        visible={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onConfirm={handleEdit}
        title="Editar producto"
        placeholder="Nombre del producto"
        initialValue={editingProduct?.name ?? ''}
        confirmLabel="Guardar"
      />
    </View>
  );
}

function EmptyState({ accentColor }: { accentColor: string }) {
  return (
    <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🛍️</Text>
      <Text style={styles.emptyTitle}>Lista vacía</Text>
      <Text style={styles.emptySubtitle}>
        Pulsa el botón{' '}
        <Text style={[styles.emptyHighlight, { color: accentColor }]}>+</Text>{' '}
        para añadir tu primer producto
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  backIcon: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  storeEmoji: {
    fontSize: 22,
  },
  storeName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  menuBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  menuIcon: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },

  // Contadores
  counters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  counterCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  counterLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // Lista
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
    marginTop: -2,
  },

  // Estado vacío
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyHighlight: {
    fontWeight: '800',
    fontSize: 18,
  },
});
