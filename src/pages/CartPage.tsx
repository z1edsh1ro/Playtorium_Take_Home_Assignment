import React from 'react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import CouponForm from '../components/CouponForm';
import CategoryCouponForm from '../components/CategoryCouponForm';
import PointsForm from '../components/PointsForm';
import { useShop } from '../context/ShopContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { seasonalCampaign } from '../data/campaigns';

const CartPage: React.FC = () => {
  const { cart, subtotal, regularDiscount, categoryDiscount, pointsDiscount, seasonalDiscount, total } = useShop();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-red-600 hover:text-red-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
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
                
                {seasonalCampaign.active && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-4 flex items-center">
                    <Gift className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">
                      Seasonal Campaign: Get THB {seasonalCampaign.discount} off for every THB {seasonalCampaign.threshold} spent!
                    </span>
                  </div>
                )}
                
                <CouponForm />
                
                <CategoryCouponForm />
                
                <PointsForm />
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>THB {subtotal.toFixed(2)}</span>
                  </div>
                  {regularDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Regular Coupon Discount</span>
                      <span>-THB {regularDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {categoryDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Category Coupon Discount</span>
                      <span>-THB {categoryDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Points Discount</span>
                      <span>-THB {pointsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {seasonalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Seasonal Campaign Discount</span>
                      <span>-THB {seasonalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>THB {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full bg-red-600 hover:bg-red-700">
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
              <Button className="bg-red-600 hover:bg-red-700">
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
