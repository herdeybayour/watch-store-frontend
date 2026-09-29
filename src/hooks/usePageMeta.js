import { useEffect } from "react";
import { STORE_CONFIG } from "../config/store";
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${STORE_CONFIG.name}` : STORE_CONFIG.name;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, [title, description]);
}
