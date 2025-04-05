
import React from 'react';
import { Product } from '../types/shop';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useShop } from '../context/ShopContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useShop();

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col h-full">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pt-4 pb-2 px-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 px-4 flex-grow">
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 px-4">
        <Button 
          onClick={() => addToCart(product)} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
