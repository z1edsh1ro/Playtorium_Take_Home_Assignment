import React from 'react';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import CouponForm from '../components/CouponForm';
import OnTopCouponForm from '../components/OnTopCouponForm';
import PointsForm from '../components/PointsForm';
import { useShop } from '../context/ShopContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { specialCampaign } from '../data/specialCampaigns';

const CartPage: React.FC = () => {
  const { 
    cart, 
    subtotal, 
    couponDiscount, 
    onTopDiscount, 
    pointsDiscount, 
    seasonalDiscount, 
    total 
  } = useShop();

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
                
                <CouponForm />
                
                <OnTopCouponForm />
                
                <PointsForm />
                
                {specialCampaign.active && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex items-center">
                    <Gift className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      Special Campaign: Discount: {specialCampaign.discount} THB at every {specialCampaign.every} THB!
                    </span>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{subtotal.toFixed(2)} THB</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Coupon Discount</span>
                      <span>-{couponDiscount.toFixed(2)} THB</span>
                    </div>
                  )}
                  {onTopDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>On Top Coupon Discount</span>
                      <span>-{onTopDiscount.toFixed(2)} THB</span>
                    </div>
                  )}
                  {pointsDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Points Discount</span>
                      <span>-{pointsDiscount.toFixed(2)} THB</span>
                    </div>
                  )}
                  {seasonalDiscount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Special Campaign Discount</span>
                      <span>-{seasonalDiscount.toFixed(2)} THB</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{total.toFixed(2)} THB</span>
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
