import { useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
export default function usePageMeta(title, description) {
  const { storeName } = useSettings();
  // Title depends on the store name (which can load/change after the page mounts).
  useEffect(() => {
    document.title = title ? `${title} | ${storeName}` : storeName;
  }, [title, storeName]);
  useEffect(() => {
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    window.scrollTo(0, 0);
  }, [title, description]);
}
