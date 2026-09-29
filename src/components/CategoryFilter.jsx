import { useProducts } from "../context/ProductsContext";
export default function CategoryFilter({ value, onChange }) {
  const { categories } = useProducts();
  const tabs = ["All", ...categories.map((c) => c.name), "New Arrivals"];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categories">
      {tabs.map((c) => (
        <button key={c} role="tab" aria-selected={value === c} onClick={() => onChange(c)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${value === c ? "border-gold bg-gold text-bg" : "border-line text-muted hover:border-gold hover:text-ink"}`}>{c}</button>
      ))}
    </div>
  );
}
