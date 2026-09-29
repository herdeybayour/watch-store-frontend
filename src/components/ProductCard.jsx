import { Link } from "react-router-dom";
import { formatPrice, discountPercent } from "../utils/format";
import { createWhatsAppOrder } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";

export default function ProductCard({ product: p }) {
  const { whatsappNumber } = useSettings();
  const off = discountPercent(p);
  const inStock = p.inStock !== false;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:border-gold/60">
      <Link to={`/product/${p.id}`} className="relative block aspect-square overflow-hidden bg-bg" aria-label={`View ${p.name}`}>
        <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-bg">-{off}%</span>}
        {!inStock && <span className="absolute right-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs text-muted">Out of stock</span>}
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-xs text-muted">{p.category}</p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight sm:text-xl">{p.name}</h3>
        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-medium">{formatPrice(p.price)}</span>
          {p.oldPrice > p.price && <span className="text-xs text-muted line-through">{formatPrice(p.oldPrice)}</span>}
        </p>
        <p className={`mt-1 text-xs ${inStock ? "text-emerald-400" : "text-muted"}`}>{inStock ? "In stock" : "Out of stock"}</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link to={`/product/${p.id}`} className="btn btn-outline !py-2.5">View details</Link>
          <button className="btn btn-primary !py-2.5" disabled={!inStock || !whatsappNumber} onClick={() => createWhatsAppOrder(whatsappNumber, p, 1)}>Order on WhatsApp</button>
        </div>
      </div>
    </article>
  );
}
