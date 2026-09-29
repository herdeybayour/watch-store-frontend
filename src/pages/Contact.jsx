import usePageMeta from "../hooks/usePageMeta";
import { STORE_CONFIG as S } from "../config/store";
import { openGeneralChat } from "../utils/whatsapp";
import { useSettings } from "../context/SettingsContext";
export default function Contact() {
  const { storeName, whatsappNumber, email } = useSettings();
  usePageMeta("Contact", `Contact ${storeName} on WhatsApp.`);
  return (
    <div className="wrap max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-4xl font-semibold sm:text-6xl">Contact us</h1>
      <p className="mt-6 text-muted">The fastest way to reach us is WhatsApp. Ask about a watch, delivery or availability.</p>
      <button onClick={() => openGeneralChat(whatsappNumber)} disabled={!whatsappNumber} className="btn btn-primary mt-8">Chat on WhatsApp</button>
      <dl className="mt-12 divide-y divide-line border-y border-line text-sm">
        <div className="flex justify-between py-4"><dt className="text-muted">Phone</dt><dd>{S.phone}</dd></div>
        <div className="flex justify-between py-4"><dt className="text-muted">Email</dt><dd>{email ? <a href={`mailto:${email}`} className="hover:text-gold">{email}</a> : <span className="text-muted">—</span>}</dd></div>
        <div className="flex justify-between py-4"><dt className="text-muted">Location</dt><dd>{S.address}</dd></div>
      </dl>
    </div>
  );
}
