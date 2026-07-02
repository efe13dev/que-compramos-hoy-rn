import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  ShoppingProvider,
  useShoppingContext,
} from '../src/context/ShoppingContext';

function AppShell() {
  const { isLoaded } = useShoppingContext();

  // ponytail: gate simple; hasta hidratar AsyncStorage no montamos rutas,
  // evita race condition (escritura pisada por LOAD_DATA) y parpadeo vacío.
  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0a0118' },
      }}
    />
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
