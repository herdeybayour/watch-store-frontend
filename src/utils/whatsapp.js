import { formatPrice } from "./format";

// Strip spaces, "+", hyphens and brackets so the wa.me URL always gets digits only.
// The backend already stores a cleaned number, but we clean again here too: it's cheap,
// and it protects against a stale/cached number that predates that validation.
const clean = (number) => (number || "").replace(/[\s+\-()]/g, "");

const open = (number, text) => {
  const n = clean(number);
  if (!n) return; // callers disable the button until a number is loaded, this is just a safety net
  window.open(`https://wa.me/${n}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
};

export const createWhatsAppOrder = (number, product, quantity = 1) =>
  open(number, `Hello, I would like to order this watch.\n\nWatch: ${product.name}\nPrice: ${formatPrice(product.price)}\nQuantity: ${quantity}\nProduct ID: ${product.id}\n\nPlease let me know if it is available. Thank you.`);

export const createWhatsAppCartOrder = (number, lines) => {
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const list = lines.map((l, i) => `${i + 1}. ${l.product.name}\nPrice: ${formatPrice(l.product.price)}\nQuantity: ${l.qty}`).join("\n\n");
  open(number, `Hello, I would like to place an order for the following watches:\n\n${list}\n\nTotal: ${formatPrice(total)}\n\nPlease confirm availability and delivery details.\nThank you.`);
};

export const openGeneralChat = (number) => open(number, "Hello, I'm interested in buying a watch from your store.");
