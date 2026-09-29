import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { useSettings } from "../context/SettingsContext";
import { formatPrice } from "../utils/format";
import { STORE_CONFIG } from "../config/store";

const input = "w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm";
const Title = ({ children, action }) => <div className="mb-6 flex items-center justify-between gap-3"><h1 className="font-display text-3xl font-semibold">{children}</h1>{action}</div>;
const Err = ({ children }) => children ? <p role="alert" className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300">{children}</p> : null;
const Badge = ({ on, children }) => <span className={`rounded-full px-2 py-0.5 text-xs ${on ? "bg-gold/20 text-gold" : "bg-line/50 text-muted"}`}>{children}</span>;

export function Login() {
  const { token, login } = useAuth(); const nav = useNavigate();
  const [e, setE] = useState(""), [p, setP] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  if (token) return <Navigate to="/admin" replace />;
  const submit = async (ev) => { ev.preventDefault(); setBusy(true); setErr(""); try { await login(e, p); nav("/admin"); } catch (x) { setErr(x.message); } finally { setBusy(false); } };
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
        <h1 className="font-display text-3xl font-semibold">Admin login</h1><p className="mb-6 mt-1 text-sm text-muted">{STORE_CONFIG.name}</p>
        <Err>{err}</Err>
        <label className="text-sm">Email<input type="email" required autoComplete="username" value={e} onChange={(x) => setE(x.target.value)} className={`${input} mb-4 mt-1`} /></label>
        <label className="text-sm">Password<input type="password" required autoComplete="current-password" value={p} onChange={(x) => setP(x.target.value)} className={`${input} mt-1`} /></label>
        <button className="btn btn-primary mt-6 w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

export function Dashboard() {
  const { products, loading, error } = useProducts();
  const stats = [["Total products", products.length], ["In stock", products.filter((p) => p.inStock).length], ["Out of stock", products.filter((p) => !p.inStock).length], ["Featured", products.filter((p) => p.featured).length], ["New arrivals", products.filter((p) => p.newArrival).length]];
  return (
    <>
      <Title action={<Link to="/admin/products/new" className="btn btn-primary">Add product</Link>}>Dashboard</Title>
      <Err>{error}</Err>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map(([l, v]) => <div key={l} className="rounded-xl border border-line bg-surface p-4"><p className="text-xs text-muted">{l}</p><p className="mt-1 text-3xl font-semibold">{loading ? "…" : v}</p></div>)}
      </div>
      <h2 className="mb-3 mt-10 font-display text-2xl">Recent products</h2>
      <ul className="divide-y divide-line rounded-xl border border-line">
        {products.slice(0, 5).map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <Link to={`/admin/products/edit/${p.id}`} className="flex-1 truncate hover:text-gold">{p.name}</Link><span className="text-sm text-muted">{formatPrice(p.price)}</span>
          </li>
        ))}
        {!products.length && !loading && <li className="p-4 text-sm text-muted">No products yet.</li>}
      </ul>
    </>
  );
}

export function ProductsAdmin() {
  const { products, refresh, loading } = useProducts();
  const [del, setDel] = useState(null), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const confirm = async () => { setBusy(true); try { await api.deleteProduct(del.id); await refresh(); setDel(null); } catch (e) { setErr(e.message); setDel(null); } finally { setBusy(false); } };
  return (
    <>
      <Title action={<Link to="/admin/products/new" className="btn btn-primary">Add product</Link>}>Products</Title>
      <Err>{err}</Err>
      {loading && <p className="text-muted">Loading…</p>}
      <ul className="divide-y divide-line rounded-xl border border-line">
        {products.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
            <img src={p.image} alt={p.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="min-w-[10rem] flex-1"><p className="font-medium">{p.name}</p><p className="text-sm text-muted">{formatPrice(p.price)} · {p.category}</p></div>
            <div className="flex flex-wrap gap-1"><Badge on={p.inStock}>{p.inStock ? "In stock" : "Out of stock"}</Badge><Badge on={p.featured}>Featured</Badge><Badge on={p.newArrival}>New</Badge></div>
            <div className="flex gap-2 text-sm">
              <Link to={`/product/${p.id}`} className="btn btn-outline !px-3 !py-1.5">View</Link>
              <Link to={`/admin/products/edit/${p.id}`} className="btn btn-outline !px-3 !py-1.5">Edit</Link>
              <button onClick={() => setDel(p)} className="btn btn-outline !px-3 !py-1.5 !text-red-300">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {del && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
            <p className="font-medium">Are you sure you want to delete this product?</p>
            <p className="mt-2 text-sm text-muted">{del.name} and its images will be removed permanently.</p>
            <div className="mt-6 flex gap-3"><button className="btn btn-outline flex-1" onClick={() => setDel(null)}>Cancel</button><button className="btn btn-primary flex-1 !bg-red-500 !text-white" disabled={busy} onClick={confirm}>{busy ? "Deleting…" : "Delete"}</button></div>
          </div>
        </div>
      )}
    </>
  );
}

const TEXT = [["brand", "Brand"], ["color", "Color"], ["movement", "Movement"], ["strapMaterial", "Strap material"], ["caseMaterial", "Case material"], ["waterResistance", "Water resistance"], ["warranty", "Warranty"]];
const EMPTY = { name: "", price: "", oldPrice: "", description: "", categoryId: "", featured: false, newArrival: false, inStock: true, ...Object.fromEntries(TEXT.map(([k]) => [k, ""])) };

// Must live at module level. Defined inside ProductForm it was a new component type on every render,
// so React unmounted and remounted the <input> on each keystroke and focus was lost.
const Field = ({ label, value, onChange, type = "text", ...r }) => (
  <label className="block text-sm">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`${input} mt-1`} {...r} /></label>
);

export function ProductForm() {
  const { id } = useParams(); const nav = useNavigate();
  const { categories, refresh, error: categoriesError } = useProducts();
  const [f, setF] = useState(EMPTY), [existing, setExisting] = useState([]), [removed, setRemoved] = useState([]), [pending, setPending] = useState([]);
  const [err, setErr] = useState(""), [busy, setBusy] = useState(""), [drag, setDrag] = useState(false), [ready, setReady] = useState(!id);
  useEffect(() => { if (!id) return; api.product(id).then((p) => { setF({ ...EMPTY, ...Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v ?? (typeof EMPTY[k] === "boolean" ? false : "")])) }); setExisting(p.images); setReady(true); }).catch((e) => { setErr(e.message); }); }, [id]);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const kept = existing.filter((i) => !removed.includes(i.id));

  const addFiles = (list) => {
    const errs = []; const ok = [];
    [...list].forEach((file) => {
      if (!/\.(jpe?g|png|webp)$/i.test(file.name)) errs.push(`${file.name}: only JPG, PNG or WEBP.`);
      else if (file.size > 5 * 1024 * 1024) errs.push(`${file.name}: over 5 MB.`);
      else ok.push({ file, url: URL.createObjectURL(file), main: false });
    });
    if (kept.length + pending.length + ok.length > 10) { errs.push("A watch can have at most 10 images."); } else setPending((p) => [...p, ...ok]);
    setErr(errs.join(" "));
  };
  const mainPending = (i) => { setPending((p) => p.map((x, j) => ({ ...x, main: j === i }))); };
  const mainExisting = async (imgId) => { try { await api.setMain(id, imgId); setExisting((l) => l.map((i) => ({ ...i, isMain: i.id === imgId }))); setPending((p) => p.map((x) => ({ ...x, main: false }))); } catch (e) { setErr(e.message); } };

  const save = async (e) => {
    e.preventDefault(); setErr("");
    if (!f.name.trim() || !(Number(f.price) > 0)) return setErr("Name and a price above 0 are required.");
    if (!f.categoryId) return setErr("Choose a category.");
    const payload = { ...f, price: Number(f.price), oldPrice: f.oldPrice === "" ? null : Number(f.oldPrice), categoryId: Number(f.categoryId), ...Object.fromEntries(TEXT.map(([k]) => [k, f[k] || null])), description: f.description || null };
    setBusy("Saving…");
    try {
      const p = id ? await api.updateProduct(id, payload) : await api.createProduct(payload);
      for (const rid of removed) await api.deleteImage(p.id, rid);
      if (pending.length) {
        setBusy(`Uploading ${pending.length} image${pending.length > 1 ? "s" : ""}…`);
        const before = new Set(existing.map((i) => i.id));
        const res = await api.uploadImages(p.id, pending.map((x) => x.file));
        const fresh = res.images.filter((i) => !before.has(i.id)).sort((a, b) => a.id - b.id);
        const k = pending.findIndex((x) => x.main);
        if (k >= 0 && fresh[k]) await api.setMain(p.id, fresh[k].id);
      }
      await refresh(); nav("/admin/products");
    } catch (x) { setErr(x.message); } finally { setBusy(""); }
  };
  if (!ready) return err ? <Err>{err}</Err> : <p className="text-muted">Loading…</p>;

  return (
    <form onSubmit={save} className="max-w-3xl space-y-8">
      <Title>{id ? "Edit product" : "Add product"}</Title>
      <Err>{err}</Err>
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Product name" value={f.name} onChange={(v) => set("name", v)} required /></div>
        <Field label="Price" value={f.price} onChange={(v) => set("price", v)} type="number" min="1" step="any" required />
        <Field label="Old price (optional)" value={f.oldPrice} onChange={(v) => set("oldPrice", v)} type="number" min="1" step="any" />
        <label className="block text-sm">Category<select value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={`${input} mt-1`} required><option value="">Choose…</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          {!categories.length && <p className="mt-1 text-xs text-red-300">{categoriesError ? `Couldn't load categories: ${categoriesError}` : "No categories yet — add one on the Categories page first."}</p>}
        </label>
        {TEXT.map(([k, l]) => <Field key={k} label={l} value={f[k]} onChange={(v) => set(k, v)} />)}
        <label className="block text-sm sm:col-span-2">Description<textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} className={`${input} mt-1`} /></label>
      </section>
      <section className="flex flex-wrap gap-6 text-sm">
        {[["inStock", "In stock"], ["featured", "Featured"], ["newArrival", "New arrival"]].map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-[rgb(var(--gold))]" />{l}</label>)}
      </section>
      <section>
        <h2 className="mb-2 font-medium">Images <span className="text-xs text-muted">(JPG, PNG, WEBP · max 5 MB each · up to 10)</span></h2>
        <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-8 text-center text-sm ${drag ? "border-gold bg-gold/10" : "border-line"}`}>
          <span className="btn btn-outline">Upload images</span><span className="mt-2 text-muted">or drag and drop here</span>
          <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kept.map((i) => { const isMain = i.isMain && !pending.some((x) => x.main); return (
            <li key={i.id} className="rounded-xl border border-line p-2"><img src={i.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <div className="mt-2 flex items-center justify-between text-xs">{isMain ? <Badge on>Main</Badge> : <button type="button" onClick={() => mainExisting(i.id)} className="text-gold">Make main</button>}<button type="button" onClick={() => setRemoved((r) => [...r, i.id])} className="text-red-300">Remove</button></div></li>); })}
          {pending.map((x, i) => (
            <li key={x.url} className="rounded-xl border border-gold/50 p-2"><img src={x.url} alt="" className="aspect-square w-full rounded-lg object-cover" />
              <div className="mt-2 flex items-center justify-between text-xs">{x.main || (!kept.length && i === 0 && !pending.some((y) => y.main)) ? <Badge on>Main</Badge> : <button type="button" onClick={() => mainPending(i)} className="text-gold">Make main</button>}<button type="button" onClick={() => setPending((p) => p.filter((_, j) => j !== i))} className="text-red-300">Remove</button></div></li>
          ))}
        </ul>
        {!kept.length && !pending.length && <p className="mt-3 text-sm text-muted">No images yet. Watches without images look empty on the shop.</p>}
      </section>
      <div className="flex gap-3"><button className="btn btn-primary" disabled={!!busy}>{busy || "Save product"}</button><Link to="/admin/products" className="btn btn-outline">Cancel</Link></div>
    </form>
  );
}

export function CategoriesAdmin() {
  const { categories, refresh, error: loadError } = useProducts();
  const [name, setName] = useState(""), [edit, setEdit] = useState(null), [err, setErr] = useState("");
  const run = async (fn) => { setErr(""); try { await fn(); await refresh(); } catch (e) { setErr(e.message); } };
  return (
    <>
      <Title>Categories</Title><Err>{err || loadError}</Err>
      <form onSubmit={(e) => { e.preventDefault(); run(async () => { await api.createCategory(name); setName(""); }); }} className="mb-6 flex max-w-md gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" aria-label="New category name" className={input} required /><button className="btn btn-primary">Add</button>
      </form>
      <ul className="max-w-md divide-y divide-line rounded-xl border border-line">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center gap-2 p-3">
            {edit?.id === c.id ? <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={input} autoFocus /> : <span className="flex-1">{c.name} <span className="text-xs text-muted">({c.productCount})</span></span>}
            {edit?.id === c.id
              ? <button className="text-sm text-gold" onClick={() => run(async () => { await api.updateCategory(c.id, edit.name); setEdit(null); })}>Save</button>
              : <button className="text-sm text-gold" onClick={() => setEdit({ id: c.id, name: c.name })}>Edit</button>}
            <button className="text-sm text-red-300" onClick={() => window.confirm(`Delete category "${c.name}"?`) && run(() => api.deleteCategory(c.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

const SETTINGS_FIELDS = [
  ["whatsappNumber", "WhatsApp Number", "text", "e.g. 2348012345678", 'Include the country code. Spaces, "+", hyphens and brackets are fine — they\'re removed automatically.'],
  ["email", "Email", "email", "e.g. hello@yourstore.com", "Shown on the Contact page and in the footer."],
  ["instagramUrl", "Instagram URL", "url", "https://instagram.com/yourstore", "Optional — leave blank if you don't use Instagram."],
  ["facebookUrl", "Facebook URL", "url", "https://facebook.com/yourstore", "Optional — leave blank if you don't use Facebook."],
  ["tiktokUrl", "TikTok URL", "url", "https://tiktok.com/@yourstore", "Optional — leave blank if you don't use TikTok."],
];
const SETTINGS_EMPTY = { whatsappNumber: "", email: "", instagramUrl: "", facebookUrl: "", tiktokUrl: "" };

export function SettingsAdmin() {
  const { email: adminEmail, logout } = useAuth();
  const settings = useSettings();
  const { loading, error: loadError, applySaved } = settings;
  const [form, setForm] = useState(SETTINGS_EMPTY);
  const [synced, setSynced] = useState(false);
  const [err, setErr] = useState(""), [ok, setOk] = useState(""), [busy, setBusy] = useState(false);

  // Fill the form once the real settings have loaded, without overwriting what the admin is typing.
  useEffect(() => { if (!synced && !loading) { setForm({ whatsappNumber: settings.whatsappNumber, email: settings.email, instagramUrl: settings.instagramUrl, facebookUrl: settings.facebookUrl, tiktokUrl: settings.tiktokUrl }); setSynced(true); } }, [loading, synced, settings]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault(); setErr(""); setOk(""); setBusy(true);
    try {
      const res = await api.updateSettings({ whatsAppNumber: form.whatsappNumber, email: form.email, instagramUrl: form.instagramUrl, facebookUrl: form.facebookUrl, tiktokUrl: form.tiktokUrl });
      applySaved(res); // every WhatsApp/email/social link in this session uses the new values immediately
      setForm({ whatsappNumber: res.whatsAppNumber, email: res.email, instagramUrl: res.instagramUrl, facebookUrl: res.facebookUrl, tiktokUrl: res.tiktokUrl });
      setOk("Settings saved.");
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  return (
    <>
      <Title>Settings</Title>
      <dl className="max-w-lg divide-y divide-line rounded-xl border border-line text-sm">
        {[["Signed in as", adminEmail], ["API address", import.meta.env.VITE_API_URL || "http://localhost:5000"]].map(([l, v]) => <div key={l} className="flex justify-between gap-4 p-3"><dt className="text-muted">{l}</dt><dd className="truncate">{v}</dd></div>)}
      </dl>

      <h2 className="mb-3 mt-10 font-display text-2xl">Business Contact &amp; Social Links</h2>
      <p className="mb-4 max-w-lg text-sm text-muted">These power every WhatsApp button, the contact email, and the social links in the footer across the whole site.</p>
      <form onSubmit={save} className="max-w-sm space-y-4">
        <Err>{err || loadError}</Err>
        {ok && <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{ok}</p>}
        {SETTINGS_FIELDS.map(([k, label, type, placeholder, hint]) => (
          <div key={k}>
            <label className="block text-sm">{label}
              <input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)} placeholder={placeholder} disabled={loading}
                className="mt-1 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm" required={k === "whatsappNumber" || k === "email"} />
            </label>
            <p className="mt-1 text-xs text-muted">{hint}</p>
          </div>
        ))}
        <button className="btn btn-primary" disabled={busy || loading}>{busy ? "Saving…" : "Save Changes"}</button>
      </form>

      <button onClick={logout} className="btn btn-outline mt-10">Log out</button>
    </>
  );
}
