import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Coupon, Points } from '../types/shop';
import { coupons } from '../data/coupons';
import { toast } from 'sonner';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  points: Points;
  applyPoints: (pointsToUse: number) => void;
  resetPoints: () => void;
  subtotal: number;
  discount: number;
  pointsDiscount: number;
  total: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [points, setPoints] = useState<Points>({
    available: 500, // Example: Start with 500 points
    pointsToUse: 0
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
      setAppliedCoupon(coupon);
      toast.success(`Applied coupon: ${code} (${coupon.discountPercentage}% off)`);
      return true;
    }
    toast.error('Invalid coupon code');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const applyPoints = (pointsToUse: number) => {
    if (pointsToUse > points.available) {
      toast.error(`You only have ${points.available} points available`);
      return;
    }
    
    setPoints(prev => ({
      ...prev,
      pointsToUse
    }));
    
    toast.success(`Applied ${pointsToUse} points to your order`);
  };

  const resetPoints = () => {
    setPoints(prev => ({
      ...prev,
      pointsToUse: 0
    }));
    toast.info('Removed points discount');
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discount = appliedCoupon
    ? subtotal * (appliedCoupon.discountPercentage / 100)
    : 0;

  const pointsDiscount = points.pointsToUse;

  const total = Math.max(subtotal - discount - pointsDiscount, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        points,
        applyPoints,
        resetPoints,
        subtotal,
        discount,
        pointsDiscount,
        total
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);

  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  
  return context;
};
