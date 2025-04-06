import React from 'react';
import { Button } from '@/components/ui/button';
import { Tag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { coupons } from '../data/coupons';

const CouponForm: React.FC = () => {
  const { applyCoupon, appliedCoupon, removeCoupon } = useShop();

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-3">Available Coupons</h3>
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded p-3">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm">
              <span className="font-medium">{appliedCoupon.code}</span> - {appliedCoupon.discountPercentage}% discount applied
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {coupons.map((coupon) => (
            <button
              key={coupon.code}
              onClick={() => applyCoupon(coupon.code)}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center">
                <Tag className="h-4 w-4 text-red-600 mr-2" />
                <div>
                  <div className="font-medium">{coupon.code}</div>
                  <div className="text-sm text-gray-500">{coupon.discountPercentage}% off</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponForm;
