const BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const KEY = "watch-admin-token";
export const getToken = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch {} };

async function req(path, { method = "GET", body, form } = {}) {
  const headers = {}, t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body) headers["Content-Type"] = "application/json";
  let res;
  try { res = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) }); }
  catch { throw new Error("Cannot reach the server. Check that the API is running."); }
  if (res.status === 401 && t) { setToken(null); window.dispatchEvent(new Event("admin-logout")); }
  if (!res.ok) { let m = `Request failed (${res.status})`; try { m = (await res.json()).message || m; } catch {} throw new Error(m); }
  return res.status === 204 ? null : res.json();
}

export const api = {
  login: (email, password) => req("/api/auth/login", { method: "POST", body: { email, password } }),
  products: () => req("/api/products"),
  product: (id) => req(`/api/products/${id}`),
  createProduct: (b) => req("/api/products", { method: "POST", body: b }),
  updateProduct: (id, b) => req(`/api/products/${id}`, { method: "PUT", body: b }),
  deleteProduct: (id) => req(`/api/products/${id}`, { method: "DELETE" }),
  uploadImages: (id, files) => { const f = new FormData(); files.forEach((x) => f.append("files", x)); return req(`/api/products/${id}/images`, { method: "POST", form: f }); },
  deleteImage: (id, imgId) => req(`/api/products/${id}/images/${imgId}`, { method: "DELETE" }),
  setMain: (id, imgId) => req(`/api/products/${id}/images/${imgId}/main`, { method: "PUT" }),
  getSettings: () => req("/api/settings"),
  updateSettings: (settings) => req("/api/settings", { method: "PUT", body: settings }),
  categories: () => req("/api/categories"),
  createCategory: (name) => req("/api/categories", { method: "POST", body: { name } }),
  updateCategory: (id, name) => req(`/api/categories/${id}`, { method: "PUT", body: { name } }),
  deleteCategory: (id) => req(`/api/categories/${id}`, { method: "DELETE" }),
};
