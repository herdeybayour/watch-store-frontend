import { Link } from "react-router-dom";
import { STORE_CONFIG } from "../config/store";
export default function Logo() {
  return (
    <Link to="/" aria-label={`${STORE_CONFIG.name} home`} className="flex items-center gap-2">
      {STORE_CONFIG.logoImage
        ? <img src={STORE_CONFIG.logoImage} alt={STORE_CONFIG.name} className="h-8 w-auto" />
        : <span className="font-display text-2xl font-bold tracking-[0.2em]">{STORE_CONFIG.name}</span>}
    </Link>
  );
}
