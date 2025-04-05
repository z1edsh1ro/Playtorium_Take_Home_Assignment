
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CouponForm: React.FC = () => {
  const [couponCode, setCouponCode] = useState('');
  const { applyCoupon, appliedCoupon, removeCoupon } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-2">Apply Coupon</h3>
      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm">
              <span className="font-medium">{appliedCoupon.code}</span> - {appliedCoupon.discountPercentage}% discount applied
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeCoupon} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1"
          />
          <Button type="submit" disabled={!couponCode.trim()}>Apply</Button>
        </form>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Try using "SAVE10" or "SAVE20" for discounts!
      </p>
    </div>
  );
};

export default CouponForm;
