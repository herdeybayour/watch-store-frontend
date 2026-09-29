import { Link } from "react-router-dom";
import { STORE_CONFIG as S } from "../config/store";
import { useSettings } from "../context/SettingsContext";
export default function Footer() {
  const { whatsappNumber, email, instagramUrl, facebookUrl, tiktokUrl } = useSettings();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.2em]">{S.name}</p>
          <p className="mt-3 max-w-xs text-sm text-muted">{S.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <p className="mb-1 font-medium text-ink">Explore</p>
          <Link to="/shop" className="hover:text-gold">Shop</Link><Link to="/about" className="hover:text-gold">About</Link>
          <Link to="/contact" className="hover:text-gold">Contact</Link><Link to="/cart" className="hover:text-gold">Cart</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <p className="mb-1 font-medium text-ink">Contact</p>
          {whatsappNumber && <a href={`https://wa.me/${whatsappNumber}`} className="hover:text-gold">WhatsApp: {S.phone}</a>}
          {email && <a href={`mailto:${email}`} className="hover:text-gold">{email}</a>}<span>{S.address}</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted">
          <p className="mb-1 font-medium text-ink">Follow</p>
          {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a>}
          {tiktokUrl && <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">TikTok</a>}
          {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Facebook</a>}
          {!instagramUrl && !tiktokUrl && !facebookUrl && <span className="text-xs text-muted">No social links yet.</span>}
        </div>
      </div>
      <p className="border-t border-line py-5 text-center text-xs text-muted">© {new Date().getFullYear()} {S.name}. All rights reserved.</p>
    </footer>
  );
}
