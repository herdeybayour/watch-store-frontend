import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
const Ctx = createContext(null);
export function ProductsProvider({ children }) {
  const [products, setP] = useState([]), [categories, setC] = useState([]), [loading, setL] = useState(true), [error, setE] = useState("");
  const refresh = useCallback(async () => {
    // Fetch independently: with Promise.all, one endpoint failing (e.g. GET /api/products)
    // discarded a successful categories response too, leaving the category list empty
    // everywhere (Add Product dropdown, Categories page) with no visible reason.
    const [pr, cr] = await Promise.allSettled([api.products(), api.categories()]);
    if (pr.status === "fulfilled") setP(pr.value);
    if (cr.status === "fulfilled") setC(cr.value);
    const failed = [pr, cr].filter((r) => r.status === "rejected").map((r) => r.reason.message);
    setE(failed.join(" "));
    setL(false);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const getById = (id) => products.find((p) => String(p.id) === String(id));
  return <Ctx.Provider value={{ products, categories, loading, error, refresh, getById }}>{children}</Ctx.Provider>;
}
export const useProducts = () => useContext(Ctx);
