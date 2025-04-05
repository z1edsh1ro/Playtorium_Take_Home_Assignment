
import React from 'react';
import { CartItem as CartItemType } from '../types/shop';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useShop();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b last:border-0">
      <div className="h-20 w-20 bg-gray-100 rounded overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateQuantity(product.id, quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateQuantity(product.id, quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="w-24 text-right font-medium">
        ${(product.price * quantity).toFixed(2)}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-gray-400 hover:text-red-500"
        onClick={() => removeFromCart(product.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItem;
