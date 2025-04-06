
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BadgePercent, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const PointsForm: React.FC = () => {
  const [pointsToUse, setPointsToUse] = useState<string>('');
  const { points, applyPoints, resetPoints, pointsDiscount } = useShop();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPoints = parseInt(pointsToUse, 10);
    if (!isNaN(numPoints) && numPoints > 0) {
      applyPoints(numPoints);
      setPointsToUse('');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-2">Use Reward Points</h3>
      {points.pointsToUse > 0 ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
          <div className="flex items-center">
            <BadgePercent className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm">
              <span className="font-medium">{points.pointsToUse} points</span> - THB {pointsDiscount.toFixed(2)} discount applied
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
            max={points.available.toString()}
          />
          <Button type="submit" disabled={!pointsToUse.trim() || parseInt(pointsToUse, 10) <= 0}>Apply</Button>
        </form>
      )}
      <p className="text-xs text-gray-500 mt-2">
        You have {points.available} points available. Each point is worth THB {points.conversionRate.toFixed(2)}.
      </p>
    </div>
  );
};

export default PointsForm;
