import ProductCard from "./ProductCard";
export default function ProductGrid({ products }) {
  if (!products.length) return <p className="py-16 text-center text-muted">No watches match your search. Try another name or category.</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
