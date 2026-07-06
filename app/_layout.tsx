import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  ShoppingProvider,
  useShoppingContext,
} from '../src/context/ShoppingContext';
import { MiiSplash } from '../src/components/MiiSplash';

function AppShell() {
  const { isLoaded } = useShoppingContext();
  const [splashDone, setSplashDone] = useState(false);

  return (
    <View style={styles.root}>
      {/* ponytail: gate simple; hasta hidratar AsyncStorage no montamos rutas,
          evita race condition (escritura pisada por LOAD_DATA) y parpadeo vacío. */}
      {isLoaded ? (
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#0a0118' },
          }}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {/* Splash animado por encima; se desmonta al terminar */}
      {!splashDone && <MiiSplash onFinish={() => setSplashDone(true)} />}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="light" />
      <ShoppingProvider>
        <AppShell />
      </ShoppingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: '#0a0118',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
