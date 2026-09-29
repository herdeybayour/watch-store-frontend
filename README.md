# Watch Store frontend (React + Vite + Tailwind)

The API lives in the separate `watch-store-backend` project and must be running.

```bash
cp .env.example .env     # set VITE_API_URL to the API address (default http://localhost:5000)
npm install
npm run dev              # http://localhost:5173
```
Customer site: `/`. Admin: `/admin/login`.

- Products, categories and images are managed in the admin. No code edits needed.
- WhatsApp number, brand name, contact details: `src/config/store.js`
- Colors: `:root` block in `src/index.css`
- Production build: `npm run build` (output in `dist/`). Set `VITE_API_URL` to your live API first, and add your site address to the API's `Cors:Origins`.
