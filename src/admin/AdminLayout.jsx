import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { STORE_CONFIG } from "../config/store";
const nav = [["/admin", "Dashboard", true], ["/admin/products", "Products", true], ["/admin/products/new", "Add product", true], ["/admin/categories", "Categories"], ["/admin/settings", "Settings"]];
export default function AdminLayout() {
  const { logout, email } = useAuth();
  const [open, setOpen] = useState(false);
  const cls = ({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? "bg-gold text-bg" : "text-muted hover:text-ink"}`;
  return (
    <div className="min-h-screen lg:flex">
      <header className="flex items-center justify-between border-b border-line bg-surface p-4 lg:hidden">
        <span className="font-display text-lg font-bold">{STORE_CONFIG.name} admin</span>
        <button onClick={() => setOpen(!open)} className="btn btn-outline !py-2" aria-expanded={open}>Menu</button>
      </header>
      <aside className={`${open ? "block" : "hidden"} shrink-0 border-r border-line bg-surface p-4 lg:block lg:min-h-screen lg:w-60`}>
        <p className="mb-6 hidden font-display text-lg font-bold lg:block">{STORE_CONFIG.name}<br /><span className="text-xs font-normal text-muted">Admin</span></p>
        <nav className="space-y-1" onClick={() => setOpen(false)}>
          {nav.map(([to, l, end]) => <NavLink key={to} to={to} end={to === "/admin" || to === "/admin/products"} className={cls}>{l}</NavLink>)}
          <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:text-ink">Logout</button>
        </nav>
        <p className="mt-6 truncate text-xs text-muted">{email}</p>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8"><Outlet /></main>
    </div>
  );
}
