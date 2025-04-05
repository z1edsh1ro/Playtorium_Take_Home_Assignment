
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
}

export interface Points {
  available: number;
  pointsToUse: number;
  conversionRate: number; // Amount of money (in $) each point is worth
}
