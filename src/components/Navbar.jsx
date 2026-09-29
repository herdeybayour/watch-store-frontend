import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";

const links = [["/", "Home"], ["/shop", "Shop"], ["/about", "About"], ["/contact", "Contact"]];
const linkCls = ({ isActive }) => `text-sm transition hover:text-gold ${isActive ? "text-gold" : "text-ink"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { count } = useCart();
  const nav = useNavigate();
  const search = (e) => { e.preventDefault(); nav(`/shop?q=${encodeURIComponent(q.trim())}`); setOpen(false); };

  const CartLink = (
    <Link to="/cart" className="text-sm hover:text-gold" aria-label={`Cart, ${count} items`}>
      Cart{count > 0 && <span className="ml-1 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-bg">{count}</span>}
    </Link>
  );
  const SearchForm = (
    <form onSubmit={search} role="search">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search watches" aria-label="Search watches"
        className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm placeholder:text-muted lg:w-48" />
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-8 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} end className={linkCls}>{label}</NavLink>)}
        </div>
        <div className="hidden items-center gap-6 lg:flex">{SearchForm}{CartLink}</div>
        <div className="flex items-center gap-4 lg:hidden">
          {CartLink}
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu" className="p-2">
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 6h16M3 11h16M3 16h16" />}
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="wrap flex flex-col gap-4 border-t border-line pb-6 pt-4 lg:hidden">
          {SearchForm}
          {links.map(([to, label]) => <NavLink key={to} to={to} end onClick={() => setOpen(false)} className={linkCls}>{label}</NavLink>)}
        </div>
      )}
    </header>
  );
}
