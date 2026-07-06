import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppAction, Product, ShoppingData } from '../types';
import { INITIAL_STORES, STORAGE_KEY } from '../constants/stores';

// ─── Estado inicial ───────────────────────────────────────────────────────────

const buildInitialData = (): ShoppingData =>
  Object.fromEntries(INITIAL_STORES.map((s) => [s.id, []]));

const VALID_STORE_IDS = new Set(INITIAL_STORES.map((s) => s.id));

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: ShoppingData, action: AppAction): ShoppingData {
  // ponytail: ignorar acciones con storeId desconocido (evita tiendas fantasma)
  if ('storeId' in action && !VALID_STORE_IDS.has(action.storeId)) {
    return state;
  }
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;

    case 'ADD_PRODUCT':
      return {
        ...state,
        [action.storeId]: [...(state[action.storeId] ?? []), action.product],
      };

    case 'EDIT_PRODUCT':
      return {
        ...state,
        [action.storeId]: (state[action.storeId] ?? []).map((p) =>
          p.id === action.productId ? { ...p, name: action.name } : p
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        [action.storeId]: (state[action.storeId] ?? []).filter(
          (p) => p.id !== action.productId
        ),
      };

    case 'TOGGLE_PRODUCT':
      return {
        ...state,
        [action.storeId]: (state[action.storeId] ?? []).map((p) =>
          p.id === action.productId ? { ...p, bought: !p.bought } : p
        ),
      };

    case 'CLEAR_LIST':
      return { ...state, [action.storeId]: [] };

    case 'RESET_ALL':
      return buildInitialData();

    default:
      return state;
  }
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

interface ShoppingContextValue {
  data: ShoppingData;
  dispatch: React.Dispatch<AppAction>;
  addProduct: (storeId: string, name: string) => void;
  editProduct: (storeId: string, productId: string, name: string) => void;
  deleteProduct: (storeId: string, productId: string) => void;
  toggleProduct: (storeId: string, productId: string) => void;
  clearList: (storeId: string) => void;
  resetAll: () => void;
  getStoreProducts: (storeId: string) => Product[];
  isLoaded: boolean;
}

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, buildInitialData());
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Cargar datos persistidos al iniciar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed: ShoppingData = JSON.parse(raw);
          // Asegurar que todos los supermercados tienen entrada
          const normalized: ShoppingData = Object.fromEntries(
            INITIAL_STORES.map((s) => [s.id, parsed[s.id] ?? []])
          );
          dispatch({ type: 'LOAD_DATA', payload: normalized });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoaded(true));
  }, []);

  // Persistir cambios tras cada acción
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(console.error);
  }, [data, isLoaded]);

  // ── Acciones helper ────────────────────────────────────────────────────────

  const addProduct = useCallback((storeId: string, name: string) => {
    const product: Product = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      bought: false,
      createdAt: Date.now(),
    };
    dispatch({ type: 'ADD_PRODUCT', storeId, product });
  }, []);

  const editProduct = useCallback(
    (storeId: string, productId: string, name: string) =>
      dispatch({ type: 'EDIT_PRODUCT', storeId, productId, name: name.trim() }),
    []
  );

  const deleteProduct = useCallback(
    (storeId: string, productId: string) =>
      dispatch({ type: 'DELETE_PRODUCT', storeId, productId }),
    []
  );

  const toggleProduct = useCallback(
    (storeId: string, productId: string) =>
      dispatch({ type: 'TOGGLE_PRODUCT', storeId, productId }),
    []
  );

  const clearList = useCallback(
    (storeId: string) => dispatch({ type: 'CLEAR_LIST', storeId }),
    []
  );

  const resetAll = useCallback(() => dispatch({ type: 'RESET_ALL' }), []);

  const getStoreProducts = useCallback(
    (storeId: string) => data[storeId] ?? [],
    [data]
  );

  const value = useMemo<ShoppingContextValue>(
    () => ({
      data,
      dispatch,
      addProduct,
      editProduct,
      deleteProduct,
      toggleProduct,
      clearList,
      resetAll,
      getStoreProducts,
      isLoaded,
    }),
    [
      data,
      addProduct,
      editProduct,
      deleteProduct,
      toggleProduct,
      clearList,
      resetAll,
      getStoreProducts,
      isLoaded,
    ]
  );

  return (
    <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShoppingContext() {
  const ctx = useContext(ShoppingContext);
  if (!ctx) throw new Error('useShoppingContext must be used within ShoppingProvider');
  return ctx;
}
