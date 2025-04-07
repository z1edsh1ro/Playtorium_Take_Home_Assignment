import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, Points, AppliedCoupons } from '../types/cart';
import { coupons } from '../data/coupons';
import { specialCampaign } from '../data/specialCampaigns';
import { customerPoints } from '../data/customerPoints';
import { ShopContextType } from '../types/cart';

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

const useCouponOperations = (points: Points, resetPoints: () => void, appliedCoupons: AppliedCoupons, setAppliedCoupons: React.Dispatch<React.SetStateAction<AppliedCoupons>>) => {
  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(coupon => coupon.code === code);

    // when coupon not find
    if (!coupon) 
      return false;

    // when both coupon type is already applied
    if (appliedCoupons.coupon !== null && appliedCoupons.onTop !== null) {
      return false;
    }

    // when coupons type is on top or already applied, just reset price
    if (points.pointsToUse > 0){
      resetPoints();
    }

    // when coupons type is not on top
    if (coupon.type !== 'onTop') {
      setAppliedCoupons(prev => ({ ...prev, coupon }));
      return true;
    }

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

const usePointsOperations = (subtotal: number, appliedCoupons: AppliedCoupons) => {
  const [points, setPoints] = useState<Points>(customerPoints);

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
    }, [subtotal, appliedCoupons]);
  
    const currentPrice = subtotal - couponDiscount;

  // Calculate maximum points based on price after use coupon (20% rule)
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

  return { points, couponDiscount, maxPointsDiscount, applyPoints, resetPoints };
};

const usePriceCalculations = (
  cart: CartItem[],
  subtotal: number,
  appliedCoupons: AppliedCoupons,
  points: Points
) => {

  // first priority
  const couponDiscount = useMemo(() => {
    // when not applied coupon
    if (!appliedCoupons.coupon) 
      return 0;

    // when applied percentage coupon
    if (appliedCoupons.coupon && appliedCoupons.coupon.type === 'percentage') {
      return subtotal * (appliedCoupons.coupon.amount / 100);
    }

    // when applied fixed amount coupon
    return appliedCoupons.coupon.amount
  }, [subtotal, appliedCoupons]);

  // Calculate remaining amount
  const firstPriorityDiscount = subtotal - couponDiscount;

  const onTopDiscount = useMemo(() => {
    // when not applied on top coupon
    if (!appliedCoupons.onTop)
      return 0;

    // find product is match category of on top coupon
    const categoryItems = cart.filter(item => 
      item.product.category.toLowerCase() === appliedCoupons.onTop.category.toLowerCase()
    );

    // summary of product is match category of on top coupon
    const categorySubtotal = categoryItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    
    let currentPrice = categorySubtotal;
    
    // when applied coupon and fixed type
    if (appliedCoupons.coupon && appliedCoupons.coupon.type === 'fixed') {
      const quantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      currentPrice -= (categoryItems[0].quantity * Math.floor(appliedCoupons.coupon.amount / quantity));
    }

    // when applied coupon and percentage type
    if (appliedCoupons.coupon && appliedCoupons.coupon.type === 'percentage') {
      currentPrice -= (currentPrice * (appliedCoupons.coupon.amount / 100));
    }

    return  currentPrice * (appliedCoupons.onTop.amount / 100)
  }, [cart, appliedCoupons])

  // Points discount
  const pointsDiscount = useMemo(() => {
    return points.pointsToUse;
  }, [points.pointsToUse]);

  // Calculate remaining amount
  const secondPriorityDiscount = firstPriorityDiscount - pointsDiscount - onTopDiscount;

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

  const { points, couponDiscount, maxPointsDiscount, applyPoints, resetPoints } = usePointsOperations(subtotal, appliedCoupons);

  const { applyCoupon, removeCoupon } = useCouponOperations(points, resetPoints, appliedCoupons, setAppliedCoupons);

  const isUsePoints = (appliedCoupons.onTop === null);
  const isUseOnTopCoupon = (points.pointsToUse === 0);

  const availableOnTopCoupons = useMemo(() => {
    const onTopCoupons = coupons.filter(coupon => coupon.type === 'onTop');

    const cartCategories = [...new Set(cart.map(item => item.product.category.toLowerCase()))];
    
    return onTopCoupons.filter(coupon => 
      cartCategories.includes(coupon.category.toLowerCase())
    );
  }, [cart]);

  // calculate total price
  const priceCalculations = usePriceCalculations(cart, subtotal, appliedCoupons, points);

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
    isUsePoints,
    isUseOnTopCoupon,
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