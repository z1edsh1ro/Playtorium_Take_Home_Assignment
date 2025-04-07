import React from 'react';
import { Tag, X, Percent, DollarSign } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { coupons } from '../data/coupons';

const CouponForm: React.FC = () => {
  const { 
    applyCoupon, 
    appliedCoupons, 
    removeCoupon
  } = useShop();

  const percentageCoupons = coupons.filter(coupon => coupon.type === 'percentage');
  const fixedCoupons = coupons.filter(coupon => coupon.type === 'fixed');

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-3">Coupons</h3>
      
      <div className="space-y-2 mb-4">
        {appliedCoupons.coupon && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center">
              <Tag className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm">
                <span className="text-sm font-medium">{appliedCoupons.coupon.code}</span> - {
                  appliedCoupons.coupon.description || (
                    appliedCoupons.coupon.type === 'fixed' 
                      ? `save ${appliedCoupons.coupon.amount} THB` 
                      : `save ${appliedCoupons.coupon.amount}%`
                  )
                }
              </span>
            </div>
            <button 
              onClick={() => removeCoupon('coupon')} 
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {!appliedCoupons.coupon && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Percentage Discounts</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {percentageCoupons.map((coupon) => (
                <button
                  key={coupon.code}
                  onClick={() => applyCoupon(coupon.code)}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{coupon.code}</div>
                      <div className="text-sm text-gray-500">{coupon.description || `save ${coupon.amount}%`}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Fixed Amount Discounts */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Fixed Amount Discounts</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fixedCoupons.map((coupon) => (
                <button
                  key={coupon.code}
                  onClick={() => applyCoupon(coupon.code)}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <div className="text-sm font-medium">{coupon.code}</div>
                      <div className="text-sm text-gray-500">{coupon.description || `save ${coupon.amount} THB`}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponForm;
