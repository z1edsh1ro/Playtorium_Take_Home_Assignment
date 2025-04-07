import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BadgePercent, X, AlertCircle, Info } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const PointsForm: React.FC = () => {
  const [pointsToUse, setPointsToUse] = useState<string>('');
  
  const { 
    points,
    maxPointsDiscount,
    applyPoints, 
    resetPoints, 
    pointsDiscount, 
    isUsePoints, 
  } = useShop();
  
  // If points can't be used and points are being used, reset points
  React.useEffect(() => {
    if (!isUsePoints && points.pointsToUse > 0) {
      resetPoints();
    }
  }, [isUsePoints, points.pointsToUse, resetPoints]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent applying points if points can't be used
    if (!isUsePoints) {
      return;
    }
    
    const numPoints = parseInt(pointsToUse, 10);

    if (!isNaN(numPoints) && numPoints > 0) {
      applyPoints(numPoints);
      setPointsToUse('');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-2">Use Points</h3>
      
      {!isUsePoints && (
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-700">
              Points cannot be used with on top coupons
            </span>
          </div>
        </div>
      )}
      
      {points.pointsToUse > 0 ? (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded p-3">
          <div className="flex items-center">
            <BadgePercent className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm">
              <span className="font-medium">{points.pointsToUse} points</span> - {pointsDiscount.toFixed(2)} THB discount applied
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={resetPoints} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="number"
            value={pointsToUse}
            onChange={(e) => setPointsToUse(e.target.value)}
            placeholder="Enter points to use"
            className="flex-1"
            min="1"
            max={Math.min(points.available, maxPointsDiscount).toString()}
            disabled={!isUsePoints}
          />
          <Button 
            type="submit" 
            disabled={!pointsToUse.trim() || parseInt(pointsToUse, 10) <= 0 || !isUsePoints}
          >
            Apply
          </Button>
        </form>
      )}
      <div className="flex items-center mt-2">
        <Info className="h-3 w-3 text-gray-400 mr-1" />
        <p className="text-xs text-gray-500">
          You have {points.available} points available. Maximum points allowed: {maxPointsDiscount} (20% of total price).
        </p>
      </div>
    </div>
  );
};

export default PointsForm;
