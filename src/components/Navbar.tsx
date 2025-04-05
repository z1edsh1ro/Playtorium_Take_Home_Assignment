
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { cart } = useShop();
  
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-xl font-bold text-blue-600">Shopping</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative flex items-center text-gray-600 hover:text-blue-600">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
