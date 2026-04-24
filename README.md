# Life RPG

Deployable React version of the Life RPG app.

## What works on mobile

- The app runs in a normal mobile browser.
- Progress is saved with `localStorage` on that phone/browser.
- Your data stays on the device unless browser storage is cleared.
- AI quest generation works after you set `ANTHROPIC_API_KEY` in deployment.

## Local run

```bash
npm install
npm run dev
```

## Deploy on Vercel

1. Upload this folder to GitHub.
2. Import the repo into Vercel.
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy.

The app uses:

- `src/App.jsx` for the full client app
- `api/anthropic.js` as the secure server-side proxy for Anthropic

## Notes

- Mobile browsers support `localStorage`, so yes, the app has local memory on phone.
- That local memory is browser-specific, not cross-device sync.
- If you later want cloud sync, we can add Supabase or Firebase.
