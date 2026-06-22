// settings/site থেকে থিম + শপ ইনফো লোড করে CSS ভ্যারিয়েবল বসিয়ে দেয়।
// প্রতিটা কাস্টমার-ফেসিং পেজে loadThemeAndSettings() কল করতে হবে।

import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const FONT_MAP = {
  minimal: { family: "system-ui, -apple-system, sans-serif", url: null },
  "modern-sans": { family: "'Poppins', sans-serif", url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" },
  "classic-serif": { family: "'Playfair Display', serif", url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" },
  "bold-display": { family: "'Montserrat', sans-serif", url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&display=swap" }
};

let cachedSettings = null;

export async function loadThemeAndSettings() {
  if (cachedSettings) return cachedSettings;

  let settings = {};
  try {
    const snap = await getDoc(doc(db, "settings", "site"));
    if (snap.exists()) settings = snap.data();
  } catch (e) {
    // সেটিংস না পেলেও সাইট ডিফল্ট স্টাইলে চলবে, ক্রাশ করবে না
  }

  const theme = settings.theme || {
    primaryColor: "#1a1d29", accentColor: "#6b7280",
    fontPair: "minimal", buttonShape: "sharp", homepageLayout: "grid"
  };
  const font = FONT_MAP[theme.fontPair] || FONT_MAP.minimal;

  if (font.url) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = font.url;
    document.head.appendChild(link);
  }

  document.documentElement.style.setProperty("--primary-color", theme.primaryColor);
  document.documentElement.style.setProperty("--accent-color", theme.accentColor);
  document.documentElement.style.setProperty("--site-font", font.family);
  document.documentElement.style.setProperty("--btn-radius", theme.buttonShape === "sharp" ? "4px" : "24px");

  settings.theme = theme;
  cachedSettings = settings;
  return settings;
}