import { Coupon } from "../types/shop";

export const coupons: Coupon[] = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10,
    description: "10% off your entire order"
  },
  {
    code: "SAVE20",
    type: "percentage",
    value: 20,
    description: "20% off your entire order"
  },
  {
    code: "FIXED50",
    type: "fixed",
    value: 50,
    description: "50 THB off your entire order"
  },
  {
    code: "FIXED100",
    type: "fixed",
    value: 100,
    description: "100 THB off your entire order"
  },
  {
    code: "FOOD20",
    type: "category",
    value: 20,
    category: "food",
    description: "20% off all food items"
  },
  {
    code: "ELECTRONICS15",
    type: "category",
    value: 15,
    category: "electronics",
    description: "15% off all electronics"
  },
  {
    code: "CLOTHING25",
    type: "category",
    value: 25,
    category: "clothing",
    description: "25% off all clothing items"
  },
  {
    code: "ACCESSORIES10",
    type: "category",
    value: 10,
    category: "accessories",
    description: "10% off all accessories"
  }
];