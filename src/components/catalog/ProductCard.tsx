import { Product } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatFCFA } from '../../utils/format';
import { ShoppingCart, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="flex flex-col h-full group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {product.isPack && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Pack Agricole
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg rotate-[-10deg]">ÉPUISÉ</span>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
          <span className="text-green-600 font-bold whitespace-nowrap">{formatFCFA(product.price)}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Package size={14} /> {product.stock} {product.unit} dispos
          </span>
          <Button 
            size="sm" 
            disabled={isOutOfStock}
            onClick={() => addToCart(product.id, 1)}
          >
            <ShoppingCart size={16} /> Ajouter
          </Button>
        </div>
      </div>
    </Card>
  );
};
