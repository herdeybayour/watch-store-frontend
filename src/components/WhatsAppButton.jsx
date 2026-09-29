import { openGeneralChat } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";
export default function WhatsAppButton() {
  const { whatsappNumber } = useSettings();
  if (!whatsappNumber) return null;
  return (
    <button onClick={() => openGeneralChat(whatsappNumber)} aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.1 13.8c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.300 2.400 1.500.3.1.500.1.700-.1l.9-1.100c.2-.3.400-.2.700-.1l1.800.9c.3.1.5.2.500.3.100.1.100.7-.1 1.300z" />
      </svg>
    </button>
  );
}
