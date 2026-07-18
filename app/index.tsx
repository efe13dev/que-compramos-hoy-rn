import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  INITIAL_STORES,
  SUPERMARKET_STORES,
  OTHER_STORES,
} from '../src/constants/stores';
import { useShoppingContext } from '../src/context/ShoppingContext';
import { StoreCard } from '../src/components/StoreCard';
import { COLORS, RADIUS } from '../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { data } = useShoppingContext();
  const [cartModalVisible, setCartModalVisible] = useState(false);

  const totalPending = INITIAL_STORES.reduce((acc, s) => {
    const products = data[s.id] ?? [];
    return acc + products.filter((p) => !p.bought).length;
  }, 0);

  const pendingByStore = INITIAL_STORES.map((store) => ({
    store,
    items: (data[store.id] ?? [])
      .filter((p) => !p.bought)
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })),
  })).filter((g) => g.items.length > 0);

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#0a0118', '#130a2e', '#0d0a3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Lista de Compras</Text>
              <Text style={styles.subtitle}>
                {totalPending > 0
                  ? `${totalPending} producto${totalPending !== 1 ? 's' : ''} pendiente${totalPending !== 1 ? 's' : ''}`
                  : 'Todo al día ✓'}
              </Text>
            </View>
            <Pressable style={styles.cartIcon} onPress={() => setCartModalVisible(true)}>
              <Text style={styles.cartEmoji}>🛒</Text>
              {totalPending > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalPending > 99 ? '99+' : totalPending}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Decoración */}
          <View style={styles.decorLine} />

          {/* Supermercados */}
          <Text style={styles.sectionLabel}>Supermercados</Text>

          {SUPERMARKET_STORES.map((store, index) => {
            const products = data[store.id] ?? [];
            const pending = products.filter((p) => !p.bought).length;
            const bought = products.filter((p) => p.bought).length;
            return (
              <StoreCard
                key={store.id}
                store={store}
                pending={pending}
                bought={bought}
                index={index}
                onPress={() => router.push(`/store/${store.id}`)}
              />
            );
          })}

          {/* Otros */}
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionLabel}>Otros</Text>

          {OTHER_STORES.map((store, index) => {
            const products = data[store.id] ?? [];
            const pending = products.filter((p) => !p.bought).length;
            const bought = products.filter((p) => p.bought).length;
            return (
              <StoreCard
                key={store.id}
                store={store}
                pending={pending}
                bought={bought}
                index={index + SUPERMARKET_STORES.length}
                compact
                onPress={() => router.push(`/store/${store.id}`)}
              />
            );
          })}

        </ScrollView>
      </SafeAreaView>

      {/* Modal: todos los productos pendientes */}
      <Modal
        visible={cartModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCartModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCartModalVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Para comprar</Text>
            {pendingByStore.length === 0 ? (
              <View style={styles.emptyModal}>
                <Text style={styles.emptyModalEmoji}>✅</Text>
                <Text style={styles.emptyModalText}>¡No queda nada por comprar!</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {pendingByStore.map(({ store, items }) => (
                  <View key={store.id} style={styles.storeGroup}>
                    <View style={styles.storeGroupHeader}>
                      <Text style={styles.storeGroupEmoji}>{store.emoji}</Text>
                      <Text style={[styles.storeGroupName, { color: store.accentColor }]}>
                        {store.name}
                      </Text>
                      <View style={[styles.storeGroupBadge, { backgroundColor: store.accentColor + '30', borderColor: store.accentColor + '60' }]}>
                        <Text style={[styles.storeGroupCount, { color: store.accentColor }]}>{items.length}</Text>
                      </View>
                    </View>
                    {items.map((item) => (
                      <View key={item.id} style={styles.pendingItem}>
                        <View style={[styles.pendingDot, { backgroundColor: store.accentColor }]} />
                        <Text style={styles.pendingItemName}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                ))}
                <View style={{ height: 32 }} />
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  cartIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(79,158,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(79,158,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartEmoji: {
    fontSize: 26,
  },
  decorLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 24,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  // Badge sobre el carrito
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#130a2e',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    height: '62%',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },

  // Estado vacío dentro del modal
  emptyModal: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyModalEmoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyModalText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
  },

  // Grupos por tienda
  storeGroup: {
    marginBottom: 20,
  },
  storeGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  storeGroupEmoji: {
    fontSize: 18,
  },
  storeGroupName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  storeGroupBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  storeGroupCount: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Items pendientes
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingLeft: 4,
  },
  pendingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pendingItemName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    flex: 1,
  },
});
