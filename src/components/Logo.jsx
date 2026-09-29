import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../config/store";
import { useSettings } from "../context/SettingsContext";
export default function Logo() {
  const { storeName } = useSettings();
  return (
    <Link to="/" aria-label={`${storeName} home`} className="flex items-center gap-2">
      {STORE_CONFIG.logoImage
        ? <img src={STORE_CONFIG.logoImage} alt={storeName} className="h-8 w-auto" />
        : <span className="font-display text-2xl font-bold uppercase tracking-[0.2em]">{storeName}</span>}
    </Link>
  );
}
