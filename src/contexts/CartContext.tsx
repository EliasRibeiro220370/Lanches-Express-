import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Coupon } from '../types';
import { VALID_COUPONS } from '../data/products';
import { useStore } from './StoreContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { store } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('lanches_express_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('lanches_express_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lanches_express_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('lanches_express_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('lanches_express_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (newItem: CartItem) => {
    setItems(prevItems => {
      // Check if an identical item exists (same product, same options, same obs)
      const existingIndex = prevItems.findIndex(item =>
        item.product.id === newItem.product.id &&
        item.selectedDoneness === newItem.selectedDoneness &&
        item.selectedBread === newItem.selectedBread &&
        item.observation === newItem.observation &&
        JSON.stringify(item.selectedCustomizations) === JSON.stringify(newItem.selectedCustomizations)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty
        };
        return updated;
      }

      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && subtotal < appliedCoupon.minOrderValue) {
      return 0;
    }
    if (appliedCoupon.discountType === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    } else {
      return Math.min(appliedCoupon.value, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (store.freeDeliveryThreshold && subtotal >= store.freeDeliveryThreshold) {
      return 0;
    }
    return store.deliveryFee;
  }, [subtotal, store.deliveryFee, store.freeDeliveryThreshold]);

  const total = useMemo(() => {
    const calculated = subtotal - discountAmount + deliveryFee;
    return Math.max(0, calculated);
  }, [subtotal, discountAmount, deliveryFee]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS.find(c => c.code === cleanCode);

    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }

    if (found.minOrderValue && subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Este cupom requer pedido mínimo de R$ ${found.minOrderValue.toFixed(2).replace('.', ',')}.`
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      subtotal,
      discountAmount,
      deliveryFee,
      total,
      totalItemsCount,
      isCartOpen,
      setIsCartOpen
    }}>
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
