export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed' | 'category';
  value: number;
  category?: string;
  description?: string;
}

export interface Points {
  available: number;
  pointsToUse: number;
}

export interface SeasonalCampaign {
  active: boolean;
  threshold: number;
  discount: number;
}

export interface AppliedCoupons {
  regular: Coupon | null;
  category: Coupon | null;
}
