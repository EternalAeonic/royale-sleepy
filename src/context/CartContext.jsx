import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('fc_cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('fc_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, selectedSize, quantity = 1) => {
    setItems(prev => {
      const key = `${product.id}-${selectedSize}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.images[0],
        selectedSize,
        quantity,
      }];
    });
  };

  const removeFromCart = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst        = Math.round(subtotal * 0.18);
  const total      = subtotal + gst;

  const buildWhatsAppMessage = (userName) => {
    if (items.length === 0) return '';
    const lines = items.map(i =>
      `• ${i.name} (${i.selectedSize}) × ${i.quantity} = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`
    );
    const greeting = userName ? `Hi, I'm *${userName}*. ` : `Hi, `;
    const msg = [
      `${greeting}I would like to place an enquiry (Royale Sleepy):`,
      '',
      ...lines,
      '',
      `Subtotal: ₹${subtotal.toLocaleString('en-IN')}`,
      `GST (18%): ₹${gst.toLocaleString('en-IN')}`,
      `Total: ₹${total.toLocaleString('en-IN')}`,
      '',
      'Please confirm availability and delivery details. Thank you!',
    ].join('\n');
    return `https://wa.me/918763600036?text=${encodeURIComponent(msg)}`;
  };

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, subtotal, gst, total, buildWhatsAppMessage,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
