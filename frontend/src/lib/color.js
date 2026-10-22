// Small colour helpers (hex in, hex out).
function rgb(hex = "#000000") {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  const n = parseInt(full, 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (arr) => "#" + arr.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

// amount < 0 darkens, > 0 lightens (towards white).
export const shade = (hex, amount) => toHex(rgb(hex).map((v) => v + (amount < 0 ? v * amount : (255 - v) * amount)));
export const mix = (a, b, t) => {
  const x = rgb(a);
  const y = rgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};
export const luminance = (hex) => {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
export const readableOn = (hex) => (luminance(hex) > 0.62 ? "#18181b" : "#ffffff");
export const alpha = (hex, a) => {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
