import { Coupon } from "../types/shop";

export const coupons: Coupon[] = [
  {
    code: "PLAYTORIUM1",
    type: "percentage",
    value: 10,
    description: "discount 10%"
  },
  {
    code: "PLAYTORIUM2",
    type: "percentage",
    value: 20,
    description: "discount 20%"
  },
  {
    code: "PLAYTORIUM3",
    type: "fixed",
    value: 50,
    description: "discount 50 THB"
  },
  {
    code: "PLAYTORIUM4",
    type: "fixed",
    value: 100,
    description: "discount 100 THB"
  },
  {
    code: "PLAYTORIUM5",
    type: "onTop",
    value: 20,
    category: "food",
    description: "discount 20%"
  },
  {
    code: "PLAYTORIUM6",
    type: "onTop",
    value: 15,
    category: "electronics",
    description: "discount 15%"
  },
  {
    code: "PLAYTORIUM7",
    type: "onTop",
    value: 25,
    category: "clothing",
    description: "discount 25%"
  },
  {
    code: "PLAYTORIUM8",
    type: "onTop",
    value: 10,
    category: "accessories",
    description: "discount 10%"
  }
];