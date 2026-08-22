import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Shop } from '../types';

interface CartContextType {
  items: CartItem[];
  currentShop: Shop | null;
  setCurrentShop: (shop: Shop | null) => void;
  addItem: (product: Product, quantity?: number, selected_weight?: string) => void;
  removeItem: (productId: string, selected_weight: string) => void;
  updateQuantity: (productId: string, selected_weight: string, newQuantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  getItemQuantity: (productId: string, selected_weight?: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'xyz_cart_v1';
const SHOP_STORAGE_KEY = 'xyz_cart_shop_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentShop, setCurrentShop] = useState<Shop | null>(() => {
    try {
      const saved = localStorage.getItem(SHOP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (currentShop) {
        localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(currentShop));
      } else {
        localStorage.removeItem(SHOP_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist shop:', e);
    }
  }, [currentShop]);

  const calculateUnitPrice = (product: Product, weight: string): number => {
    let multiplier = 1;
    if (weight === '500 g' && product.unit === 'kg') multiplier = 0.5;
    else if (weight === '1.5 kg' && product.unit === 'kg') multiplier = 1.5;
    else if (weight === '2 kg' && product.unit === 'kg') multiplier = 2;
    return Math.round(product.price * multiplier);
  };

  const addItem = (product: Product, quantity = 1, selected_weight?: string) => {
    const weight = selected_weight || (product.weight_options && product.weight_options.length > 0 ? product.weight_options[0] : product.unit);
    const unitPrice = calculateUnitPrice(product, weight);

    setItems(prevItems => {
      // If adding from a different shop, overwrite items with warning or clean start
      if (prevItems.length > 0 && prevItems[0].shop_id !== product.shop_id) {
        return [
          {
            product,
            quantity,
            selected_weight: weight,
            unit_price: unitPrice,
            shop_id: product.shop_id,
          }
        ];
      }

      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selected_weight === weight
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            quantity,
            selected_weight: weight,
            unit_price: unitPrice,
            shop_id: product.shop_id,
          }
        ];
      }
    });
  };

  const updateQuantity = (productId: string, selected_weight: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId, selected_weight);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selected_weight === selected_weight) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string, selected_weight: string) => {
    setItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.selected_weight === selected_weight))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: string, selected_weight?: string): number => {
    if (selected_weight) {
      const match = items.find(
        item => item.product.id === productId && item.selected_weight === selected_weight
      );
      return match ? match.quantity : 0;
    }
    // Sum for all weights of this product
    return items
      .filter(item => item.product.id === productId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
  const deliveryFee = items.length === 0 ? 0 : (subtotal >= 500 ? 0 : (currentShop?.delivery_fee || 40));
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        currentShop,
        setCurrentShop,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
