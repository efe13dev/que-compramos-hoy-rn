export interface Product {
  id: string;
  name: string;
  bought: boolean;
  createdAt: number;
}

export interface Store {
  id: string;
  name: string;
  emoji: string;
  accentColor: string;
  gradientColors: [string, string];
}

export type ShoppingData = Record<string, Product[]>;

export type AppAction =
  | { type: 'LOAD_DATA'; payload: ShoppingData }
  | { type: 'ADD_PRODUCT'; storeId: string; product: Product }
  | { type: 'EDIT_PRODUCT'; storeId: string; productId: string; name: string }
  | { type: 'DELETE_PRODUCT'; storeId: string; productId: string }
  | { type: 'TOGGLE_PRODUCT'; storeId: string; productId: string }
  | { type: 'CLEAR_BOUGHT'; storeId: string }
  | { type: 'CLEAR_LIST'; storeId: string }
  | { type: 'RESET_ALL' };
