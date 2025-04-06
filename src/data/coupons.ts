import { Coupon } from "../types/shop";

export const coupons: Coupon[] = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10,
  },
  {
    code: "SAVE20",
    type: "percentage",
    value: 20,
  },
  {
    code: "FIXED50",
    type: "fixed",
    value: 50,
  },
  {
    code: "FIXED100",
    type: "fixed",
    value: 100,
  }
];