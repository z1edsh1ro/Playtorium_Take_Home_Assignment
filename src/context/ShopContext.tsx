import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, Coupon, Points, AppliedCoupons } from '../types/shop';
import { coupons } from '../data/coupons';
import { specialCampaign } from '../data/specialCampaigns';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  appliedCoupons: AppliedCoupons;
  applyCoupon: (code: string) => boolean;
  removeCoupon: (type: 'coupon' | 'category') => void;
  points: Points;
  applyPoints: (pointsToUse: number) => void;
  resetPoints: () => void;
  subtotal: number;
  regularDiscount: number;
  categoryDiscount: number;
  pointsDiscount: number;
  seasonalDiscount: number;
  total: number;
  canUsePoints: boolean;
  canUseCategoryCoupon: boolean;
  availableCategoryCoupons: Coupon[];
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<AppliedCoupons>({
    coupon: null,
    onTop: null
  });
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
    if (!coupon) {
      return false;
    }

    // Check if the coupon is already applied
    if (
      (coupon.type === 'category' && appliedCoupons.onTop?.code === code) ||
      ((coupon.type === 'percentage' || coupon.type === 'fixed') && appliedCoupons.coupon?.code === code)
    ) {
      return false;
    }

    // Apply the coupon based on its type
    if (coupon.type === 'category') {
      // If points are being used, prevent applying category coupon
      if (points.pointsToUse > 0) {
        return false;
      }
      
      setAppliedCoupons(prev => ({
        ...prev,
        onTop: coupon
      }));
    } else {      
      setAppliedCoupons(prev => ({
        ...prev,
        coupon: coupon
      }));
      
      const discountText = coupon.type === 'percentage' 
        ? `${coupon.value}% off` 
        : `${coupon.value} off THB`;
      
    }
    
    return true;
  };

  const removeCoupon = (type: 'coupon' | 'category') => {
    setAppliedCoupons(prev => ({
      ...prev,
      [type]: null
    }));
    
  };

  const applyPoints = (pointsToUse: number) => {
    // If a category coupon is applied, remove it first
    if (appliedCoupons.onTop) {
      setAppliedCoupons(prev => ({
        ...prev,
        category: null
      }));
    }
    
    if (pointsToUse > points.available) {
      return;
    }
    
    // Calculate the maximum points that can be used (20% of subtotal)
    const maxPointsDiscount = subtotal * 0.2;
    
    // If points to use would exceed 20% of subtotal, limit it
    if (pointsToUse > maxPointsDiscount) {
      const limitedPoints = Math.floor(maxPointsDiscount);
      setPoints(prev => ({
        ...prev,
        pointsToUse: limitedPoints
      }));
    } else {
      setPoints(prev => ({
        ...prev,
        pointsToUse
      }));
    }
    
  };

  const resetPoints = () => {
    setPoints(prev => ({
      ...prev,
      pointsToUse: 0
    }));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Calculate category-based discount
  const calculateCategoryDiscount = () => {
    if (!appliedCoupons.onTop) {
      return 0;
    }

    // Find items in the cart that match the category
    const categoryItems = cart.filter(item => 
      item.product.category.toLowerCase() === appliedCoupons.onTop?.category.toLowerCase()
    );

    // Debug log for category discount calculation
    console.log('Category discount calculation:', {
      appliedCategory: appliedCoupons.onTop.category,
      categoryItems: categoryItems.map(item => ({
        name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity
      })),
      cartItems: cart.map(item => ({
        name: item.product.name,
        category: item.product.category
      }))
    });

    // Calculate subtotal for items in the category
    const categorySubtotal = categoryItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate discount based on percentage
    const discount = categorySubtotal * (appliedCoupons.onTop.value / 100);
    
    console.log('Category discount result:', {
      categorySubtotal,
      discountPercentage: appliedCoupons.onTop.value,
      calculatedDiscount: discount
    });

    return discount;
  };

  // Calculate coupon discount (percentage or fixed)
  const calculateRegularDiscount = () => {
    if (!appliedCoupons.coupon) {
      return 0;
    }

    let discount = 0;
    
    if (appliedCoupons.coupon.type === 'percentage') {
      // For percentage discounts, apply to the entire subtotal
      discount = subtotal * (appliedCoupons.coupon.value / 100);
    } else if (appliedCoupons.coupon.type === 'fixed') {
      // For fixed discounts, use the exact value
      discount = appliedCoupons.coupon.value;
    }
    
    console.log('Regular discount calculation:', {
      couponType: appliedCoupons.coupon.type,
      couponValue: appliedCoupons.coupon.value,
      subtotal,
      calculatedDiscount: discount
    });
    
    return discount;
  };

  // Calculate seasonal campaign discount
  const calculateSeasonalDiscount = () => {
    if (!specialCampaign.active) {
      return 0;
    }

    // Calculate how many multiples of the every are in the subtotal
    const multiples = Math.floor(subtotal / specialCampaign.every);
    
    // Calculate the total discount based on multiples
    const discount = multiples * specialCampaign.discount;
    
    console.log('Seasonal discount calculation:', {
      subtotal,
      every: specialCampaign.every,
      multiples,
      discountPerMultiple: specialCampaign.discount,
      calculatedDiscount: discount
    });
    
    return discount;
  };

  const regularDiscount = calculateRegularDiscount();
  const categoryDiscount = calculateCategoryDiscount();
  const pointsDiscount = points.pointsToUse;
  const seasonalDiscount = calculateSeasonalDiscount();

  // Log all discount components
  console.log('All discount components:', {
    subtotal,
    regularDiscount,
    categoryDiscount,
    pointsDiscount,
    seasonalDiscount,
    totalDiscount: regularDiscount + categoryDiscount + pointsDiscount + seasonalDiscount
  });

  // Calculate total with all discounts applied
  const totalDiscount = regularDiscount + categoryDiscount + pointsDiscount + seasonalDiscount;
  const total = Math.max(subtotal - totalDiscount, 0);
  
  // Log final total calculation
  console.log('Final total calculation:', {
    subtotal,
    totalDiscount,
    total
  });
  
  // Determine if points can be used (not when category coupon is applied)
  const canUsePoints = appliedCoupons.onTop === null;
  
  // Determine if category coupons can be used (not when points are being used)
  const canUseCategoryCoupon = points.pointsToUse === 0;
  
  // Determine which category coupons can be applied based on cart items
  const availableCategoryCoupons = useMemo(() => {
    // Get all category coupons
    const categoryCoupons = coupons.filter(coupon => coupon.type === 'category');
    
    // Get unique categories in the cart
    const cartCategories = [...new Set(cart.map(item => item.product.category.toLowerCase()))];
    
    // Filter coupons to only those that match categories in the cart
    return categoryCoupons.filter(coupon => 
      cartCategories.includes(coupon.category.toLowerCase())
    );
  }, [cart]);

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        appliedCoupons,
        applyCoupon,
        removeCoupon,
        points,
        applyPoints,
        resetPoints,
        subtotal,
        regularDiscount,
        categoryDiscount,
        pointsDiscount,
        seasonalDiscount,
        total,
        canUsePoints,
        canUseCategoryCoupon,
        availableCategoryCoupons
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