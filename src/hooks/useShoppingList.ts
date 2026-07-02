import { useShoppingContext } from '../context/ShoppingContext';
import { INITIAL_STORES } from '../constants/stores';

export function useShoppingList(storeId: string) {
  const ctx = useShoppingContext();
  const products = ctx.getStoreProducts(storeId);
  const store = INITIAL_STORES.find((s) => s.id === storeId);

  const pending = products.filter((p) => !p.bought).length;
  const bought = products.filter((p) => p.bought).length;

  return {
    products,
    store,
    pending,
    bought,
    addProduct: (name: string) => ctx.addProduct(storeId, name),
    editProduct: (productId: string, name: string) =>
      ctx.editProduct(storeId, productId, name),
    deleteProduct: (productId: string) => ctx.deleteProduct(storeId, productId),
    toggleProduct: (productId: string) => ctx.toggleProduct(storeId, productId),
    clearBought: () => ctx.clearBought(storeId),
    clearList: () => ctx.clearList(storeId),
    resetAll: ctx.resetAll,
  };
}
