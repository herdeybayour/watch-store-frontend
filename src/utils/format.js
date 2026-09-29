import { STORE_CONFIG } from "../config/store";
export const formatPrice = (n) => `${STORE_CONFIG.currency}${Number(n).toLocaleString("en-NG")}`;
export const discountPercent = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
