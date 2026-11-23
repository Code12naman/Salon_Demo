# Dorée Hair Salon: luxury salon website + admin

Black-and-gold salon website with booking and an admin dashboard. React 18, Framer Motion, Vite.

```bash
npm install
npm run dev           # development
npm run build         # deployable site in dist/
npm run build:single  # one self-contained HTML file for sharing a demo
```

Admin: add `#admin` to the address (or use the links in the top bar and footer). Demo PIN: `1234`.

## Rebrand for a client
- **Colours and fonts:** tokens at the top of `src/styles.css`, font link in `index.html`
- **Photos:** local Pexels WebP assets live in `public/assets`; their photo pages and license notes are listed in `public/assets/credits.txt`. Update the image paths and alt text in `IMAGES` in `src/content.js`. Stock gallery images are illustrative and should be replaced with the salon's own results before launch.
- **Brand, phone, address, hours, services, prices:** `src/store.js` (or edit live in the admin, then use Reset to restore defaults)
- **Cards, stats, team, plans, reviews, FAQ, partner brands:** `src/content.js`
- Remove the demo ribbon in `src/site/Header.jsx` before launch

## Going live
Data lives in the visitor's browser in this demo. Swap the actions in `src/store.js` for API calls (bookings, services, settings), add a real admin login (the PIN is visible in the page), send WhatsApp or email alerts for new bookings, and check slot clashes on the server.
