import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { INITIAL_STORES } from '../src/constants/stores';
import { useShoppingContext } from '../src/context/ShoppingContext';
import { StoreCard } from '../src/components/StoreCard';
import { GlassButton } from '../src/components/GlassButton';
import { COLORS } from '../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { data, resetAll } = useShoppingContext();

  const handleResetAll = () => {
    Alert.alert(
      'Restablecer todo',
      '¿Seguro que quieres vaciar las listas de todos los supermercados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: resetAll,
        },
      ]
    );
  };

  const totalPending = INITIAL_STORES.reduce((acc, s) => {
    const products = data[s.id] ?? [];
    return acc + products.filter((p) => !p.bought).length;
  }, 0);

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
            <View style={styles.cartIcon}>
              <Text style={styles.cartEmoji}>🛒</Text>
            </View>
          </View>

          {/* Decoración */}
          <View style={styles.decorLine} />

          {/* Supermercados */}
          <Text style={styles.sectionLabel}>Supermercados</Text>

          {INITIAL_STORES.map((store, index) => {
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

          {/* Botón resetear todo */}
          <GlassButton
            label="Restablecer todas las listas"
            onPress={handleResetAll}
            variant="danger"
            icon="🔄"
            style={styles.resetBtn}
          />
        </ScrollView>
      </SafeAreaView>
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
    paddingBottom: 40,
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
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  resetBtn: {
    marginTop: 8,
  },
});
