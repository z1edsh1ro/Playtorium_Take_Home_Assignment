import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, CartItem, Coupon, Points, AppliedCoupons } from '../types/shop';
import { coupons } from '../data/coupons';
import { seasonalCampaign } from '../data/campaigns';
import { toast } from 'sonner';

interface ShopContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  appliedCoupons: AppliedCoupons;
  applyCoupon: (code: string) => boolean;
  removeCoupon: (type: 'regular' | 'category') => void;
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
    regular: null,
    category: null
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
    if (!coupon) {
      toast.error('Invalid coupon code');
      return false;
    }

    // Check if the coupon is already applied
    if (
      (coupon.type === 'category' && appliedCoupons.category?.code === code) ||
      ((coupon.type === 'percentage' || coupon.type === 'fixed') && appliedCoupons.regular?.code === code)
    ) {
      toast.error('This coupon is already applied');
      return false;
    }

    // Apply the coupon based on its type
    if (coupon.type === 'category') {
      // If points are being used, prevent applying category coupon
      if (points.pointsToUse > 0) {
        toast.error('Category coupons cannot be used with reward points');
        return false;
      }
      
      // If there's already a category coupon, remove it first
      if (appliedCoupons.category) {
        toast.info(`Replacing ${appliedCoupons.category.code} with ${code}`);
      }
      
      setAppliedCoupons(prev => ({
        ...prev,
        category: coupon
      }));
      
      toast.success(`Applied category coupon: ${code} (${coupon.value}% off ${coupon.category} items)`);
    } else {
      // If there's already a regular coupon, remove it first
      if (appliedCoupons.regular) {
        toast.info(`Replacing ${appliedCoupons.regular.code} with ${code}`);
      }
      
      setAppliedCoupons(prev => ({
        ...prev,
        regular: coupon
      }));
      
      const discountText = coupon.type === 'percentage' 
        ? `${coupon.value}% off` 
        : `THB ${coupon.value} off`;
      
      toast.success(`Applied coupon: ${code} (${discountText})`);
    }
    
    return true;
  };

  const removeCoupon = (type: 'regular' | 'category') => {
    setAppliedCoupons(prev => ({
      ...prev,
      [type]: null
    }));
    
    toast.info(`Removed ${type} coupon`);
  };

  const applyPoints = (pointsToUse: number) => {
    // If a category coupon is applied, remove it first
    if (appliedCoupons.category) {
      setAppliedCoupons(prev => ({
        ...prev,
        category: null
      }));
      toast.info('Category coupon has been removed as it cannot be used with reward points');
    }
    
    if (pointsToUse > points.available) {
      toast.error(`You only have ${points.available} points available`);
      return;
    }
    
    // Calculate the maximum points that can be used (20% of subtotal)
    const maxPointsDiscount = subtotal * 0.2;
    
    // If points to use would exceed 20% of subtotal, limit it
    if (pointsToUse > maxPointsDiscount) {
      const limitedPoints = Math.floor(maxPointsDiscount);
      toast.info(`Points limited to ${limitedPoints} (20% of total price)`);
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
    
    toast.success(`Applied ${points.pointsToUse} points to your order`);
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

  // Calculate category-based discount
  const calculateCategoryDiscount = () => {
    if (!appliedCoupons.category) {
      return 0;
    }

    // Find items in the cart that match the category
    const categoryItems = cart.filter(item => 
      item.product.category.toLowerCase() === appliedCoupons.category?.category.toLowerCase()
    );

    // Debug log for category discount calculation
    console.log('Category discount calculation:', {
      appliedCategory: appliedCoupons.category.category,
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
    const discount = categorySubtotal * (appliedCoupons.category.value / 100);
    
    console.log('Category discount result:', {
      categorySubtotal,
      discountPercentage: appliedCoupons.category.value,
      calculatedDiscount: discount
    });

    return discount;
  };

  // Calculate regular discount (percentage or fixed)
  const calculateRegularDiscount = () => {
    if (!appliedCoupons.regular) {
      return 0;
    }

    let discount = 0;
    
    if (appliedCoupons.regular.type === 'percentage') {
      // For percentage discounts, apply to the entire subtotal
      discount = subtotal * (appliedCoupons.regular.value / 100);
    } else if (appliedCoupons.regular.type === 'fixed') {
      // For fixed discounts, use the exact value
      discount = appliedCoupons.regular.value;
    }
    
    console.log('Regular discount calculation:', {
      couponType: appliedCoupons.regular.type,
      couponValue: appliedCoupons.regular.value,
      subtotal,
      calculatedDiscount: discount
    });
    
    return discount;
  };

  // Calculate seasonal campaign discount
  const calculateSeasonalDiscount = () => {
    if (!seasonalCampaign.active) {
      return 0;
    }

    // Calculate how many multiples of the threshold are in the subtotal
    const multiples = Math.floor(subtotal / seasonalCampaign.threshold);
    
    // Calculate the total discount based on multiples
    const discount = multiples * seasonalCampaign.discount;
    
    console.log('Seasonal discount calculation:', {
      subtotal,
      threshold: seasonalCampaign.threshold,
      multiples,
      discountPerMultiple: seasonalCampaign.discount,
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
  const canUsePoints = appliedCoupons.category === null;
  
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
