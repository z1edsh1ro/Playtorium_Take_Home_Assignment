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
    type: "category",
    value: 20,
    category: "food",
    description: "discount 20% food category"
  },
  {
    code: "PLAYTORIUM6",
    type: "category",
    value: 15,
    category: "electronics",
    description: "discount 15% electronics category"
  },
  {
    code: "PLAYTORIUM7",
    type: "category",
    value: 25,
    category: "clothing",
    description: "discount 25% clothing category"
  },
  {
    code: "PLAYTORIUM8",
    type: "category",
    value: 10,
    category: "accessories",
    description: "discount 10% accessories category"
  }
];