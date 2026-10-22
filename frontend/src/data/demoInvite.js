import { THEMES } from "./themes";

const inDays = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(19, 30, 0, 0);
  return t.toISOString();
};

// A sample invitation used for the landing-page live demos (no backend needed).
export function demoInvitation(preset = "royal", entryStyle) {
  const { label, ...theme } = THEMES[preset] || THEMES.royal;
  const date = inDays(45);
  return {
    slug: "demo",
    title: "Ayesha & Ahmed",
    theme: { ...theme, preset, bgType: "pattern", bgValue: "floral", envelope: true, monogram: "A&A", ...(entryStyle ? { entryStyle } : {}) },
    stickers: [],
    sections: [
      { id: "h", type: "hero", enabled: true, data: { title: "Ayesha & Ahmed", subtitle: "request the honour of your presence at the celebration of their marriage", tagline: "Together with their families", date, layout: "classic", foil: true } },
      { id: "q", type: "quote", enabled: true, data: { arabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا", text: "And We created you in pairs.", source: "Surah An-Naba 78:8" } },
      { id: "s", type: "scratch", enabled: true, data: { heading: "Save the date", text: "Scratch the gold foil to reveal the date", date } },
      { id: "c", type: "countdown", enabled: true, data: { heading: "Counting down", target: date } },
      {
        id: "e",
        type: "event",
        enabled: true,
        data: {
          heading: "Celebrations",
          items: [
            { name: "Mehndi", date: inDays(43), time: "7:00 PM onwards", venue: "Family Residence", address: "DHA Phase 6, Lahore" },
            { name: "Barat", date, time: "7:30 PM", venue: "Royal Palm Marquee", address: "Canal Road, Lahore" },
          ],
        },
      },
      {
        id: "t",
        type: "timeline",
        enabled: true,
        data: {
          heading: "Our Story",
          items: [
            { date: "2021", title: "First hello", text: "A chance meeting at a friend's dinner." },
            { date: "2024", title: "The proposal", text: "A question, a ring and a very happy yes." },
          ],
        },
      },
      { id: "r", type: "rsvp", enabled: true, data: { heading: "Will you join us?", text: "Kindly respond by the date below.", deadline: inDays(30), maxGuests: 4, askPhone: true } },
      { id: "z", type: "closing", enabled: true, data: { text: "Your presence is the greatest gift.", signature: "Ayesha & Ahmed" } },
    ],
  };
}
