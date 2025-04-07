import React from 'react';
import { Tag as CategoryTag, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { coupons } from '../data/coupons';

const OnTopCouponForm: React.FC = () => {
  const { 
    applyCoupon, 
    appliedCoupons, 
    removeCoupon, 
    canUseCategoryCoupon,
    availableOnTopCoupons
  } = useShop();

  const categoryCoupons = coupons.filter(coupon => coupon.type === 'onTop');
  
  // Get the codes of available category coupons
  const availableCategoryCodes = availableOnTopCoupons.map(coupon => coupon.code);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-3">On Top Coupons</h3>
      
      {appliedCoupons.onTop && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3 mb-4">
          <div className="flex items-center">
            <CategoryTag className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm">
              <span className="text-sm font-medium">{appliedCoupons.onTop.code}</span> - {
                appliedCoupons.onTop.description || `${appliedCoupons.onTop.amount}% off ${appliedCoupons.onTop.category} items`
              }
            </span>
          </div>
          <button 
            onClick={() => removeCoupon('onTop')} 
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {!canUseCategoryCoupon && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-yellow-700">
              Category coupons cannot be used with reward points
            </span>
          </div>
        </div>
      )}
      
      {!appliedCoupons.onTop && canUseCategoryCoupon && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryCoupons.map((coupon) => {
            const isAvailable = availableCategoryCodes.includes(coupon.code);
            
            return (
              <button
                key={coupon.code}
                onClick={() => isAvailable && applyCoupon(coupon.code)}
                className={`flex items-center justify-between p-3 bg-white border rounded-lg transition-colors ${
                  isAvailable 
                    ? 'border-gray-200 hover:border-green-300 hover:bg-green-50' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                disabled={!isAvailable}
              >
                <div className="flex items-center">
                  <CategoryTag className="h-4 w-4 text-green-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium">{coupon.code}</div>
                    <div className="text-sm text-gray-900">({coupon.category})</div>
                    <div className="text-sm text-gray-500">
                      {coupon.description}
                      {!isAvailable && (
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Info className="h-3 w-3 mr-1" />
                            cannot use
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OnTopCouponForm; 