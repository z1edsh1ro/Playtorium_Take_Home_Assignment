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
  type: 'percentage' | 'fixed' | 'onTop';
  value: number;
  category?: string;
  description?: string;
}

export interface Points {
  available: number;
  pointsToUse: number;
}

export interface SpecialCampaign {
  active: boolean;
  every: number;
  discount: number;
}

export interface AppliedCoupons {
  coupon: Coupon | null;
  onTop: Coupon | null;
}
