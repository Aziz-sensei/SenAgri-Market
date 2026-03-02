import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from '../types';
import { useProducts } from './ProductContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  checkout: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('senagri_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const { products, updateStock } = useProducts();

  useEffect(() => {
    localStorage.setItem('senagri_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (productId: string, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) {
        return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const checkout = async () => {
    const currentSubtotal = subtotal;
    const currentItems = [...items];

    if (isSupabaseConfigured()) {
      try {
        // 1. Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([{ total: currentSubtotal + 1000, status: 'pending' }])
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = currentItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_time: product?.price || 0
          };
        });

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;

        // 3. Update stocks
        for (const item of currentItems) {
          await updateStock(item.productId, item.quantity);
        }

        clearCart();
        return true;
      } catch (err) {
        console.error('Checkout error with Supabase:', err);
        return false;
      }
    } else {
      // Mock checkout
      for (const item of currentItems) {
        await updateStock(item.productId, item.quantity);
      }
      clearCart();
      return true;
    }
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = items.reduce((acc, item) => {
    const product = products.find(p => p.id === item.productId);
    return acc + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartCount, 
      subtotal,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
