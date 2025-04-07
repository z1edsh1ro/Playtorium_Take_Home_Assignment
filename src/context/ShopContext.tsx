import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, Coupon, Points, AppliedCoupons } from '../types/shop';
import { coupons } from '../data/coupons';
import { specialCampaign } from '../data/specialCampaigns';
import { customerPoints } from '../data/customerPoints';


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
  removeCoupon: (type: 'coupon' | 'onTop') => void;
  
  // Points operations
  points: Points;
  maxPointsDiscount: number;
  applyPoints: (pointsToUse: number) => void;
  resetPoints: () => void;
  
  // Price calculations
  subtotal: number;
  couponDiscount: number;
  onTopDiscount: number;
  pointsDiscount: number;
  seasonalDiscount: number;
  total: number;
  
  // Availability checks
  canUsePoints: boolean;
  canUseCategoryCoupon: boolean;
  availableOnTopCoupons: Coupon[];
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

    // when coupon not find
    if (!coupon) 
      return false;

    // when both coupon type is already applied
    if (appliedCoupons.coupon !== null && appliedCoupons.onTop !== null) {
      return false;
    }

    // when coupons type is not on top
    if (coupon.type !== 'onTop') {
      setAppliedCoupons(prev => ({ ...prev, coupon }));
      return true;
    }

    // when coupons type is on top, cannot use point
    if (points.pointsToUse > 0) 
      return false;

    setAppliedCoupons(prev => ({ ...prev, onTop: coupon }));
    return true;
  };

  const removeCoupon = (type: 'coupon' | 'onTop') => {
    setAppliedCoupons(prev => ({
      ...prev,
      [type]: null
    }));
  };

  return { applyCoupon, removeCoupon };
};

const usePointsOperations = (currentPrice: number) => {
  const [points, setPoints] = useState<Points>(customerPoints);

  // Calculate maximum points based on price after regular coupon (20% rule)
  const maxPointsDiscount = Math.floor(currentPrice * 0.2);

  const applyPoints = (pointsToUse: number) => {
    // when point to use more than point available
    if (pointsToUse > points.available)
      return;

    // when point to use more than max point discount
    if (pointsToUse > maxPointsDiscount)
      return;
    
    setPoints(prev => ({
      ...prev,
      pointsToUse: pointsToUse
    }));
  };

  const resetPoints = () => {
    setPoints(prev => ({
      ...prev,
      pointsToUse: 0
    }));
  };

  return { points, maxPointsDiscount, applyPoints, resetPoints };
};

const usePriceCalculations = (
  cart: CartItem[],
  firstPriorityDiscount: number,
  appliedCoupons: AppliedCoupons,
  points: Points
) => {

  // Calculate on top discount
  const onTopDiscount = useMemo(() => {
    // when not use on top
    if (!appliedCoupons.onTop) 
      return 0;

    const categoryItems = cart.filter(item => 
      item.product.category.toLowerCase() === appliedCoupons.onTop?.category.toLowerCase()
    );

    const categorySubtotal = categoryItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return categorySubtotal * (appliedCoupons.onTop.amount / 100);
  }, [cart, appliedCoupons.onTop]);

  // Points discount (1 point = 1 THB, capped at 20% of price after coupon)
  const pointsDiscount = useMemo(() => {
    return points.pointsToUse;
  }, [points.pointsToUse]);

  // Calculate remaining amount
  const secondPriorityDiscount = firstPriorityDiscount - onTopDiscount - pointsDiscount;

  // 3. Calculate seasonal campaign discount last
  const seasonalDiscount = useMemo(() => {
    // when special campaign is not active
    if (!specialCampaign.active) 
      return 0;

    const multiples = Math.floor(secondPriorityDiscount / specialCampaign.every);
    
    return multiples * specialCampaign.discount;
  }, [secondPriorityDiscount]);

  // Calculate final total
  const total = Math.max(secondPriorityDiscount - seasonalDiscount, 0);

  return {
    onTopDiscount,
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

  // Calculate raw subtotal (before any discounts)
  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  // calculate coupon discount
  const couponDiscount = useMemo(() => {
    // when not applied coupon
    if (!appliedCoupons.coupon) 
      return 0;

    // when applied percentage coupon
    if (appliedCoupons.coupon.type === 'percentage') {
      return subtotal * (appliedCoupons.coupon.amount / 100);
    }
    
    // when applied fixed amount coupon
    return appliedCoupons.coupon.amount;
  }, [subtotal, appliedCoupons.coupon]);

  // first priority calculate remaining amount after use coupon
  const firstPriorityDiscount = subtotal - couponDiscount;

  const { points, maxPointsDiscount, applyPoints, resetPoints } = usePointsOperations(firstPriorityDiscount);
  const { applyCoupon, removeCoupon } = useCouponOperations(points, appliedCoupons, setAppliedCoupons);
  const priceCalculations = usePriceCalculations(cart, firstPriorityDiscount, appliedCoupons, points);

  // Availability checks
  const canUsePoints = appliedCoupons.onTop === null;
  const canUseCategoryCoupon = (points.pointsToUse === 0);

  // Available on top coupons
  const availableOnTopCoupons = useMemo(() => {
    const onTopCoupons = coupons.filter(coupon => coupon.type === 'onTop');

    const cartCategories = [...new Set(cart.map(item => item.product.category.toLowerCase()))];
    
    return onTopCoupons.filter(coupon => 
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
    maxPointsDiscount,
    applyPoints,
    resetPoints,
    
    // Price calculations
    subtotal,
    couponDiscount,
    ...priceCalculations,
    
    // Availability checks
    canUsePoints,
    canUseCategoryCoupon,
    availableOnTopCoupons
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