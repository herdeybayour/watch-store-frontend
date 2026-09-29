export default function SearchBar({ value, onChange }) {
  return (
    <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search by watch name" aria-label="Search watches"
      className="w-full rounded-full border border-line bg-surface px-5 py-3 text-sm placeholder:text-muted md:max-w-sm" />
  );
}
