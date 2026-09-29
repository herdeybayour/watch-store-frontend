// Single place for brand + contact settings.
export const STORE_CONFIG = {
  name: "MAISON TEMPO",
  tagline: "Timeless style. Made for you.",
  // WhatsApp number, email, and social links are no longer set here — the admin
  // manages them from Admin Dashboard > Settings, and they're stored in the
  // backend. See SettingsContext (src/context/SettingsContext.jsx).
  phone: "+234 XXX XXX XXXX",
  address: "Lagos, Nigeria",
  currency: "₦",
  logoImage: "", // e.g. "/logo.png" (put file in /public). Leave empty for text logo.
};
// Shop filter tabs. "All" and "New Arrivals" are automatic.
export const CATEGORIES = ["Men", "Women", "Luxury", "Casual"];
