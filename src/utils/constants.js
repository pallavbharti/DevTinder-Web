// Set VITE_API_URL in .env (local) or in your hosting dashboard (Vercel/Netlify) for production.
// Falls back to localhost so `npm run dev` keeps working without any setup.
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7777";

// Gradient pairs for generated avatars
const GRADIENTS = [
  ["#8b5cf6", "#22d3ee"],
  ["#ff4d8d", "#8b5cf6"],
  ["#22d3ee", "#2ee6a6"],
  ["#f59e0b", "#ff4d8d"],
  ["#6366f1", "#ec4899"],
];

/**
 * Builds an initials avatar as an inline SVG data-URI.
 * No network call → works offline and never shows a broken image.
 */
export const avatarFor = (firstName = "", lastName = "") => {
  const initials =
    ((firstName?.[0] || "D") + (lastName?.[0] || "")).toUpperCase();
  const seed = [...`${firstName}${lastName}`].reduce((a, c) => a + c.charCodeAt(0), 0);
  const [c1, c2] = GRADIENTS[seed % GRADIENTS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="150" fill="rgba(255,255,255,0.92)">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
