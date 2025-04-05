
import { Product, Coupon } from "../types/shop";

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 129.99,
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Smartwatch",
    price: 199.99,
    description: "Advanced smartwatch with health tracking and notifications.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Laptop Sleeve",
    price: 39.99,
    description: "Stylish and protective sleeve for laptops up to 15 inches.",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Wireless Charger",
    price: 49.99,
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Bluetooth Speaker",
    price: 89.99,
    description: "Portable waterproof speaker with rich sound and 12-hour playback.",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "USB-C Hub",
    price: 59.99,
    description: "6-in-1 USB-C hub with HDMI, USB 3.0, and card reader ports.",
    image: "/placeholder.svg"
  },
  {
    id: 7,
    name: "Wireless Mouse",
    price: 29.99,
    description: "Ergonomic wireless mouse with silent clicks and long battery life.",
    image: "/placeholder.svg"
  },
  {
    id: 8,
    name: "Keyboard",
    price: 79.99,
    description: "Mechanical keyboard with customizable RGB lighting and multimedia controls.",
    image: "/placeholder.svg"
  }
];

export const availableCoupons: Coupon[] = [
  {
    code: "SAVE10",
    discountPercentage: 10
  },
  {
    code: "SAVE20",
    discountPercentage: 20
  }
];
