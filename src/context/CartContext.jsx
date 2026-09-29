import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useProducts } from "./ProductsContext";

const CartContext = createContext(null);
const KEY = "watch-cart-v1";

export function CartProvider({ children }) {
  // Stores only { id, qty } so prices always come from products.js
  const { products } = useProducts();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items, products]);

  const add = (id, qty = 1) =>
    setItems((c) => c.some((i) => i.id === id) ? c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i)) : [...c, { id, qty }]);
  const setQty = (id, qty) => setItems((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  const remove = (id) => setItems((c) => c.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const lines = useMemo(() => items.map((i) => ({ product: products.find((p) => p.id === i.id), qty: i.qty })).filter((l) => l.product), [items, products]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  return <CartContext.Provider value={{ lines, count, total, add, setQty, remove, clear }}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
