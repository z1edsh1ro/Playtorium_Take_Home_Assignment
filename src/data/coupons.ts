import { Coupon } from "../types/cart";

export const coupons: Coupon[] = [
  {
    code: "PLAYTORIUM1",
    type: "percentage",
    amount: 10,
    description: "discount 10%"
  },
  {
    code: "PLAYTORIUM2",
    type: "percentage",
    amount: 20,
    description: "discount 20%"
  },
  {
    code: "PLAYTORIUM3",
    type: "fixed",
    amount: 50,
    description: "discount 50 THB"
  },
  {
    code: "PLAYTORIUM4",
    type: "fixed",
    amount: 100,
    description: "discount 100 THB"
  },
  {
    code: "PLAYTORIUM5",
    type: "onTop",
    amount: 20,
    category: "food",
    description: "discount 20%"
  },
  {
    code: "PLAYTORIUM6",
    type: "onTop",
    amount: 15,
    category: "electronics",
    description: "discount 15%"
  },
  {
    code: "PLAYTORIUM7",
    type: "onTop",
    amount: 25,
    category: "clothing",
    description: "discount 25%"
  },
  {
    code: "PLAYTORIUM8",
    type: "onTop",
    amount: 10,
    category: "accessories",
    description: "discount 10%"
  }
];