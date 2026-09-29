import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../services/api";
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [token, setT] = useState(getToken());
  const [email, setEmail] = useState(() => localStorage.getItem("watch-admin-email") || "");
  useEffect(() => { const f = () => setT(null); window.addEventListener("admin-logout", f); return () => window.removeEventListener("admin-logout", f); }, []);
  const login = async (e, p) => { const r = await api.login(e, p); setToken(r.token); localStorage.setItem("watch-admin-email", r.email); setT(r.token); setEmail(r.email); };
  const logout = () => { setToken(null); setT(null); };
  return <Ctx.Provider value={{ token, email, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
