import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

// Store-wide business contact/social settings the admin controls (WhatsApp number,
// email, Instagram/Facebook/TikTok links), fetched from the backend so none of it
// is ever hardcoded in a component.
const Ctx = createContext(null);
const EMPTY = { whatsappNumber: "", email: "", instagramUrl: "", facebookUrl: "", tiktokUrl: "" };
const fromApi = (s) => ({ whatsappNumber: s.whatsAppNumber || "", email: s.email || "", instagramUrl: s.instagramUrl || "", facebookUrl: s.facebookUrl || "", tiktokUrl: s.tiktokUrl || "" });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try { setSettings(fromApi(await api.getSettings())); setError(""); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  // Called right after a successful save so every open page (in this session) uses
  // the new values immediately, without waiting for a fresh fetch.
  const applySaved = (apiResponse) => setSettings(fromApi(apiResponse));

  return <Ctx.Provider value={{ ...settings, loading, error, refresh, applySaved }}>{children}</Ctx.Provider>;
}
export const useSettings = () => useContext(Ctx);
