import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import usePageMeta from "../hooks/usePageMeta";
import { useProducts } from "../context/ProductsContext";

const SORTS = { featured: "Featured", low: "Price: Low to High", high: "Price: High to Low", newest: "Newest" };

export default function Shop() {
  usePageMeta("Shop All Watches", "Browse and order watches on WhatsApp.");
  const { products, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";
  const set = (k, v) => { const n = new URLSearchParams(params); v && v !== "All" && v !== "featured" ? n.set(k, v) : n.delete(k); setParams(n, { replace: true }); };

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (category === "All" || (category === "New Arrivals" ? p.newArrival : p.category === category)) &&
      p.name.toLowerCase().includes(q.toLowerCase().trim()));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    else if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    else if (sort === "newest") r = [...r].sort((a, b) => Number(!!b.newArrival) - Number(!!a.newArrival) || b.id - a.id);
    else r = [...r].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return r;
  }, [products, q, category, sort]);

  return (
    <div className="wrap py-10 sm:py-14">
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Shop all watches</h1>
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar value={q} onChange={(v) => set("q", v)} />
        <select value={sort} onChange={(e) => set("sort", e.target.value)} aria-label="Sort watches" className="rounded-full border border-line bg-surface px-4 py-3 text-sm">
          {Object.entries(SORTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      </div>
      <div className="mt-4"><CategoryFilter value={category} onChange={(v) => set("category", v)} /></div>
      <p className="mb-5 mt-6 text-sm text-muted">{list.length} watch{list.length === 1 ? "" : "es"}</p>
      {loading ? <p className="py-16 text-center text-muted">Loading watches…</p> : error ? <p className="py-16 text-center text-muted">We couldn't load the watches. Please refresh in a moment.</p> : <ProductGrid products={list} />}
    </div>
  );
}
