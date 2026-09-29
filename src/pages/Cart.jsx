import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { createWhatsAppCartOrder } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";

export default function Cart() {
  usePageMeta("Cart", "Review your watches and order on WhatsApp.");
  const { lines, total, setQty, remove, clear } = useCart();
  const { whatsappNumber } = useSettings();

  if (!lines.length) return (
    <div className="wrap py-24 text-center">
      <h1 className="font-display text-4xl">Your cart is empty</h1>
      <p className="mt-3 text-muted">Add a watch to order it on WhatsApp.</p>
      <Link to="/shop" className="btn btn-primary mt-8">Shop watches</Link>
    </div>
  );

  return (
    <div className="wrap py-10 sm:py-14">
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-y border-line">
          {lines.map(({ product: p, qty }) => (
            <li key={p.id} className="flex gap-4 py-5">
              <Link to={`/product/${p.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-line">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div><p className="font-display text-xl">{p.name}</p><p className="text-sm text-muted">{formatPrice(p.price)}</p></div>
                  <p className="font-medium">{formatPrice(p.price * qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button className="h-8 w-8" onClick={() => setQty(p.id, qty - 1)} aria-label={`Decrease ${p.name}`}>−</button>
                    <span className="w-6 text-center text-sm">{qty}</span>
                    <button className="h-8 w-8" onClick={() => setQty(p.id, qty + 1)} aria-label={`Increase ${p.name}`}>+</button>
                  </div>
                  <button className="text-sm text-muted hover:text-gold" onClick={() => remove(p.id)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatPrice(total)}</span></div>
          <div className="mt-3 flex justify-between border-t border-line pt-3 text-lg"><span>Total</span><span>{formatPrice(total)}</span></div>
          <p className="mt-2 text-xs text-muted">Delivery is confirmed with you on WhatsApp.</p>
          <button className="btn btn-primary mt-6 w-full" disabled={!whatsappNumber} onClick={() => createWhatsAppCartOrder(whatsappNumber, lines)}>Order all on WhatsApp</button>
          <Link to="/shop" className="btn btn-outline mt-3 w-full">Continue shopping</Link>
          <button onClick={clear} className="mt-4 w-full text-xs text-muted hover:text-gold">Clear cart</button>
        </aside>
      </div>
    </div>
  );
}
