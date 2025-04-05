
import React from 'react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import CouponForm from '../components/CouponForm';
import PointsForm from '../components/PointsForm';
import { useShop } from '../context/ShopContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { cart, subtotal, discount, pointsDiscount, total } = useShop();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 ml-auto">Your Cart</h1>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                {cart.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <CouponForm />
                <PointsForm />
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Points Discount</span>
                      <span>-${pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
