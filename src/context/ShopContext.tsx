import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, Coupon, Points, AppliedCoupons } from '../types/shop';
import { coupons } from '../data/coupons';
import { specialCampaign } from '../data/specialCampaigns';

// Types
interface ShopContextType {
  // Cart operations
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  
  // Coupon operations
  appliedCoupons: AppliedCoupons;
  applyCoupon: (code: string) => boolean;
  removeCoupon: (type: 'coupon' | 'category') => void;
  
  // Points operations
  points: Points;
  applyPoints: (pointsToUse: number) => void;
  resetPoints: () => void;
  
  // Price calculations
  subtotal: number;
  regularDiscount: number;
  categoryDiscount: number;
  pointsDiscount: number;
  seasonalDiscount: number;
  total: number;
  
  // Availability checks
  canUsePoints: boolean;
  canUseCategoryCoupon: boolean;
  availableCategoryCoupons: Coupon[];
}

// Create context
const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Custom hooks for specific functionality
const useCartOperations = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  return { cart, addToCart, removeFromCart, updateQuantity };
};

const useCouponOperations = (points: Points, appliedCoupons: AppliedCoupons, setAppliedCoupons: React.Dispatch<React.SetStateAction<AppliedCoupons>>) => {
  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(coupon => coupon.code === code);
    if (!coupon) return false;

    // Check if coupon is already applied
    if (
      (coupon.type === 'category' && appliedCoupons.onTop?.code === code) ||
      ((coupon.type === 'percentage' || coupon.type === 'fixed') && appliedCoupons.coupon?.code === code)
    ) {
      return false;
    }

    // Apply coupon based on type
    if (coupon.type === 'category') {
      if (points.pointsToUse > 0) return false;
      setAppliedCoupons(prev => ({ ...prev, onTop: coupon }));
    } else {
      setAppliedCoupons(prev => ({ ...prev, coupon }));
    }
    
    return true;
  };

  const removeCoupon = (type: 'coupon' | 'category') => {
    setAppliedCoupons(prev => ({
      ...prev,
      [type]: null
    }));
  };

  return { applyCoupon, removeCoupon };
};

const usePointsOperations = (subtotal: number, setAppliedCoupons: React.Dispatch<React.SetStateAction<AppliedCoupons>>) => {
  const [points, setPoints] = useState<Points>({
    available: 500,
    pointsToUse: 0
  });

  const applyPoints = (pointsToUse: number) => {
    if (pointsToUse > points.available) return;
    
    const maxPointsDiscount = subtotal * 0.2;
    const limitedPoints = Math.min(pointsToUse, Math.floor(maxPointsDiscount));
    
    setPoints(prev => ({
      ...prev,
      pointsToUse: limitedPoints
    }));
  };

  const resetPoints = () => {
    setPoints(prev => ({
      ...prev,
      pointsToUse: 0
    }));
  };

  return { points, applyPoints, resetPoints };
};

const usePriceCalculations = (
  cart: CartItem[],
  appliedCoupons: AppliedCoupons,
  points: Points
) => {
  // Calculate subtotal
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // Calculate category discount
  const categoryDiscount = useMemo(() => {
    if (!appliedCoupons.onTop) return 0;

    const categoryItems = cart.filter(item => 
      item.product.category.toLowerCase() === appliedCoupons.onTop?.category.toLowerCase()
    );

    const categorySubtotal = categoryItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return categorySubtotal * (appliedCoupons.onTop.value / 100);
  }, [cart, appliedCoupons.onTop]);

  // Calculate regular discount
  const regularDiscount = useMemo(() => {
    if (!appliedCoupons.coupon) return 0;

    if (appliedCoupons.coupon.type === 'percentage') {
      return subtotal * (appliedCoupons.coupon.value / 100);
    }
    
    return appliedCoupons.coupon.value;
  }, [subtotal, appliedCoupons.coupon]);

  // Calculate seasonal discount
  const seasonalDiscount = useMemo(() => {
    if (!specialCampaign.active) return 0;
    const multiples = Math.floor(subtotal / specialCampaign.every);
    return multiples * specialCampaign.discount;
  }, [subtotal]);

  const pointsDiscount = points.pointsToUse;
  const totalDiscount = regularDiscount + categoryDiscount + pointsDiscount + seasonalDiscount;
  const total = Math.max(subtotal - totalDiscount, 0);

  return {
    subtotal,
    regularDiscount,
    categoryDiscount,
    pointsDiscount,
    seasonalDiscount,
    total
  };
};

// Main provider component
export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCartOperations();
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupons>({
    coupon: null,
    onTop: null
  });
  const { points, applyPoints, resetPoints } = usePointsOperations(0, setAppliedCoupons);
  const { applyCoupon, removeCoupon } = useCouponOperations(points, appliedCoupons, setAppliedCoupons);
  const priceCalculations = usePriceCalculations(cart, appliedCoupons, points);

  // Availability checks
  const canUsePoints = appliedCoupons.onTop === null;
  const canUseCategoryCoupon = points.pointsToUse === 0;

  // Available category coupons
  const availableCategoryCoupons = useMemo(() => {
    const categoryCoupons = coupons.filter(coupon => coupon.type === 'category');
    const cartCategories = [...new Set(cart.map(item => item.product.category.toLowerCase()))];
    return categoryCoupons.filter(coupon => 
      cartCategories.includes(coupon.category.toLowerCase())
    );
  }, [cart]);

  const value = {
    // Cart operations
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    
    // Coupon operations
    appliedCoupons,
    applyCoupon,
    removeCoupon,
    
    // Points operations
    points,
    applyPoints,
    resetPoints,
    
    // Price calculations
    ...priceCalculations,
    
    // Availability checks
    canUsePoints,
    canUseCategoryCoupon,
    availableCategoryCoupons
  };

  return (
    <ShopContext.Provider value={value}>
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