import { useCallback } from 'react';
import { useShoppingContext } from '../context/ShoppingContext';
import { INITIAL_STORES } from '../constants/stores';

export function useShoppingList(storeId: string) {
  const ctx = useShoppingContext();
  const products = ctx.getStoreProducts(storeId);
  const store = INITIAL_STORES.find((s) => s.id === storeId);

  const pending = products.filter((p) => !p.bought).length;
  const bought = products.filter((p) => p.bought).length;

  const addProduct = useCallback(
    (name: string) => ctx.addProduct(storeId, name),
    [ctx.addProduct, storeId]
  );
  const editProduct = useCallback(
    (productId: string, name: string) => ctx.editProduct(storeId, productId, name),
    [ctx.editProduct, storeId]
  );
  const deleteProduct = useCallback(
    (productId: string) => ctx.deleteProduct(storeId, productId),
    [ctx.deleteProduct, storeId]
  );
  const toggleProduct = useCallback(
    (productId: string) => ctx.toggleProduct(storeId, productId),
    [ctx.toggleProduct, storeId]
  );
  const clearBought = useCallback(
    () => ctx.clearBought(storeId),
    [ctx.clearBought, storeId]
  );
  const clearList = useCallback(
    () => ctx.clearList(storeId),
    [ctx.clearList, storeId]
  );

  return {
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
    resetAll: ctx.resetAll,
  };
}
