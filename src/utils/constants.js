// Backend ka URL ab env se aata hai.
// Local:      .env mein kuch nahi → http://localhost:7777
// Production: Vercel pe VITE_API_URL=https://api.devtinder24.me
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:7777";
