/**
 * Represents a product in the shopping system
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
}

/**
 * Available product categories
 */
export type ProductCategory = 'electronics' | 'clothing' | 'accessories';

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Types of discounts available in the system
 */
export type DiscountType = 'percentage' | 'fixed' | 'onTop';

/**
 * Represents a discount coupon
 */
export interface Coupon {
  code: string;
  type: DiscountType;
  amount: number;
  category: ProductCategory;
  description?: string;
}

/**
 * Represents user's points
 */
export interface Points {
  available: number;
  pointsToUse: number;
}

/**
 * Represents a special campaign
 */
export interface SpecialCampaign {
  active: boolean;
  every: number;
  discount: number;
}

/**
 * Represents applied coupons in the cart
 */
export interface AppliedCoupons {
  coupon: Coupon | null;
  onTop: Coupon | null;
}