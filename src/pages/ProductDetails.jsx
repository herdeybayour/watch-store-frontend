import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { formatPrice, discountPercent } from "../utils/format";
import { createWhatsAppOrder } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";

const FIELDS = [["brand", "Brand"], ["color", "Color"], ["strapMaterial", "Strap"], ["caseMaterial", "Case"], ["movement", "Movement"], ["waterResistance", "Water resistance"]];

export default function ProductDetails() {
  const { id } = useParams();
  const { getById, loading } = useProducts();
  const p = getById(id);
  const { add } = useCart();
  const { whatsappNumber } = useSettings();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  usePageMeta(p?.name || "Watch not found", p?.description);

  if (loading) return <p className="wrap py-24 text-center text-muted">Loading…</p>;
  if (!p) return <div className="wrap py-24 text-center"><p>We couldn't find that watch.</p><Link to="/shop" className="btn btn-primary mt-6">Back to shop</Link></div>;

  const gallery = p.images?.length ? p.images.map((i) => i.url) : [p.image];
  const inStock = p.inStock !== false;
  const off = discountPercent(p);
  const info = FIELDS.filter(([k]) => p[k]);

  return (
    <div className="wrap grid gap-10 py-10 lg:grid-cols-2 lg:py-16">
      <div>
        <div className="aspect-square overflow-hidden rounded-3xl border border-line">
          <img src={gallery[active]} alt={p.name} className="h-full w-full object-cover" />
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {gallery.map((src, i) => (
              <button key={src + i} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}
                className={`aspect-square overflow-hidden rounded-xl border ${i === active ? "border-gold" : "border-line opacity-70 hover:opacity-100"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <Link to="/shop" className="text-sm text-muted hover:text-gold">Back to shop</Link>
        <p className="mt-4 text-sm text-muted">{p.category}</p>
        <h1 className="mt-1 font-display text-4xl font-semibold sm:text-5xl">{p.name}</h1>
        <p className="mt-4 flex flex-wrap items-baseline gap-3">
          <span className="text-2xl">{formatPrice(p.price)}</span>
          {p.oldPrice > p.price && <span className="text-muted line-through">{formatPrice(p.oldPrice)}</span>}
          {off > 0 && <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-bg">-{off}%</span>}
        </p>
        <p className={`mt-2 text-sm ${inStock ? "text-emerald-400" : "text-muted"}`}>{inStock ? "In stock" : "Out of stock"}</p>
        {p.description && <p className="mt-6 max-w-prose leading-relaxed text-muted">{p.description}</p>}

        <div className="mt-8 flex items-center gap-4">
          <span className="text-sm">Quantity</span>
          <div className="flex items-center rounded-full border border-line">
            <button className="h-10 w-10" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
            <span className="w-8 text-center" aria-live="polite">{qty}</span>
            <button className="h-10 w-10" onClick={() => setQty(qty + 1)} aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="btn btn-primary flex-1" disabled={!inStock || !whatsappNumber} onClick={() => createWhatsAppOrder(whatsappNumber, p, qty)}>Order on WhatsApp</button>
          <button className="btn btn-outline flex-1" disabled={!inStock} onClick={() => { add(p.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); }}>{added ? "Added to cart" : "Add to cart"}</button>
        </div>

        {info.length > 0 && (
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {info.map(([k, l]) => <div key={k} className="flex justify-between py-3 text-sm"><dt className="text-muted">{l}</dt><dd>{p[k]}</dd></div>)}
          </dl>
        )}
      </div>
    </div>
  );
}
