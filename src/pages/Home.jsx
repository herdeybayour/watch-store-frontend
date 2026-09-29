import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import usePageMeta from "../hooks/usePageMeta";
import { STORE_CONFIG as S } from "../config/store";
import { useProducts } from "../context/ProductsContext";
import { openGeneralChat } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";

// Replace these demo reviews with real ones.
const REVIEWS = [
  { name: "Chidi O.", text: "Ordered on WhatsApp and got a reply in minutes. The watch looks even better in person." },
  { name: "Amaka E.", text: "Bought one as a gift. Delivery was quick and the packaging felt premium." },
  { name: "Tunde A.", text: "Great quality for the price. Support answered every question I had." },
];
const WHY = [
  ["Quality watches", "Every piece is checked before it ships."],
  ["Fast delivery", "Quick dispatch to your address."],
  ["Easy WhatsApp ordering", "Tap order and send. No accounts, no forms."],
  ["Customer support", "Talk to a real person before and after you buy."],
];

const Head = ({ title, to }) => (
  <div className="mb-8 flex items-end justify-between gap-4">
    <h2 className="h2">{title}</h2>
    {to && <Link to={to} className="shrink-0 text-sm text-muted hover:text-gold">View all</Link>}
  </div>
);

export default function Home() {
  const { whatsappNumber } = useSettings();
  usePageMeta("", `${S.name}: premium watches. Order easily on WhatsApp.`);
  const { products: all, categories } = useProducts();
  const featured = all.filter((p) => p.featured).slice(0, 4);
  const fresh = all.filter((p) => p.newArrival).slice(0, 4);
  const hero = featured[0] || all[0];

  return (
    <>
      <section className="border-b border-line">
        <div className="wrap grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-7xl">Timeless style.<br />Made for you.</h1>
            <p className="mt-6 max-w-md text-muted">Carefully chosen watches for every wrist. Pick yours, tap order, and we finish the rest on WhatsApp.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary">Shop watches</Link>
              <button onClick={() => openGeneralChat(whatsappNumber)} disabled={!whatsappNumber} className="btn btn-outline">Order on WhatsApp</button>
            </div>
          </div>
          {hero && (
            <Link to={`/product/${hero.id}`} className="block aspect-square overflow-hidden rounded-3xl border border-line" aria-label={`View ${hero.name}`}>
              <img src={hero.image} alt={hero.name} className="h-full w-full object-cover" />
            </Link>
          )}
        </div>
      </section>

      <section className="section wrap">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(([t, d]) => (
            <div key={t} className="border-t border-gold/60 pt-4"><h3 className="font-display text-xl font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="section wrap !pt-0">
        <Head title="Featured watches" to="/shop" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="section wrap !pt-0">
        <Head title="New arrivals" to="/shop?category=New Arrivals" />
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{fresh.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="section wrap !pt-0">
        <Head title="Shop by category" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[...categories.map((c) => c.name), "New Arrivals"].map((c) => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} className="rounded-2xl border border-line bg-surface px-4 py-8 text-center font-display text-2xl transition hover:border-gold hover:text-gold">{c}</Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="section wrap max-w-3xl text-center">
          <h2 className="h2">About {S.name}</h2>
          <p className="mt-6 text-muted">We sell watches that look refined without the luxury markup. Every piece is picked for finish, comfort and value, and every order is handled personally.</p>
          <Link to="/about" className="btn btn-outline mt-8">Our story</Link>
        </div>
      </section>

      <section className="section wrap">
        <Head title="What customers say" />
        <div className="grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl border border-line bg-surface p-6">
              <blockquote className="text-sm leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm text-gold">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section wrap pt-0 text-center">
        <h2 className="h2">Find your perfect watch</h2>
        <Link to="/shop" className="btn btn-primary mt-8">Shop collection</Link>
      </section>
    </>
  );
}
