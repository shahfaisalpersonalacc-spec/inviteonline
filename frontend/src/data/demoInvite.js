import { THEMES } from "./themes";

const inDays = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(19, 30, 0, 0);
  return t.toISOString();
};

// A sample invitation used for the landing-page live demos (no backend needed), shown in dark mode.
export function demoInvitation(preset = "royal", entryStyle) {
  const { label, ...theme } = THEMES[preset] || THEMES.royal;
  const date = inDays(45);
  return {
    slug: "demo",
    title: "Ayesha & Ahmed",
    theme: { ...theme, preset, mode: "dark", bgType: "color", bgValue: "", envelope: true, monogram: "A&A", ...(entryStyle ? { entryStyle } : {}) },
    stickers: [],
    sections: [
      { id: "h", type: "hero", enabled: true, data: { title: "Ayesha & Ahmed", subtitle: "request the honour of your presence at the celebration of their marriage", tagline: "Together with their families", date, layout: "arch", foil: true } },
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

// Sample content for previewing a design template (picker cards and the template gallery).
const SAMPLE = {
  wedding: { title: "Elena & Roman", subtitle: "are getting married", tagline: "Together with their families", monogram: "E&R" },
  walima: { title: "Hina & Bilal", subtitle: "Walima Reception", tagline: "Please join us for dinner", monogram: "H&B" },
  engagement: { title: "Sara & Hamza", subtitle: "are engaged!", tagline: "Join us to celebrate", monogram: "S&H" },
  anniversary: { title: "25 Years", subtitle: "Mr. & Mrs. Ahmed", tagline: "A silver jubilee of love", monogram: "25" },
  nikah: { title: "Fatima & Usman", subtitle: "Nikah Ceremony", tagline: "In the name of Allah, the Most Gracious, the Most Merciful", monogram: "F&U" },
  mehndi: { title: "Sana & Ali", subtitle: "Mehndi Night", tagline: "Dhol, dance and a whole lot of colour", monogram: "S&A" },
  birthday: { title: "Zara turns 5", subtitle: "Let's party!", tagline: "Cake, games and lots of fun", monogram: "Z" },
  "baby-shower": { title: "Oh Baby!", subtitle: "A baby shower for Ayesha", tagline: "Join us in celebrating the little one on the way", monogram: "B" },
  party: { title: "Party Night", subtitle: "You're invited", tagline: "Good music and great company", monogram: "P" },
  graduation: { title: "Class of 2026", subtitle: "Graduation party", tagline: "Help us celebrate the milestone", monogram: "26" },
  corporate: { title: "Annual Gala", subtitle: "Acme Corporation", tagline: "An evening of recognition", monogram: "AG" },
  other: { title: "You're Invited", subtitle: "A special celebration", tagline: "We would love for you to be there", monogram: "♥" },
};

const EVENT_NAME = {"wedding":"The Wedding", "walima":"Walima Dinner", "engagement":"Engagement Party", "anniversary":"Anniversary Dinner", "nikah":"Nikah Ceremony", "mehndi":"Mehndi Night", "birthday":"Birthday Party", "baby-shower":"Baby Shower", "party":"The Party", "graduation":"Graduation Party", "corporate":"Gala Dinner", "other":"The Celebration"};

export function templateDemo(template, eventType, { photo = "", animation } = {}) {
  const ev = eventType && SAMPLE[eventType] ? eventType : template.events[0];
  const sample = SAMPLE[ev];
  const date = inDays(45);
  return {
    slug: "demo",
    title: sample.title,
    eventType: ev,
    theme: { ...template.theme, template: template.id, mode: "light", envelope: false, monogram: sample.monogram, ...(animation ? { animation } : {}) },
    stickers: [],
    sections: [
      { id: "h", type: "hero", enabled: true, data: { title: sample.title, subtitle: sample.subtitle, tagline: sample.tagline, date, image: photo, layout: template.heroLayout, foil: !!template.design.foil } },
      { id: "q", type: "quote", enabled: true, data: { text: "Two hearts, one story — and a day we would love to share with you." } },
      { id: "c", type: "countdown", enabled: true, data: { heading: "Counting down", target: date } },
      {
        id: "e",
        type: "event",
        enabled: true,
        data: {
          heading: "The celebration",
          items: [{ name: EVENT_NAME[ev] || "The Celebration", date, time: "7:30 PM", venue: "The Garden Hall", address: "12 Rose Avenue" }],
        },
      },
      {
        id: "s",
        type: "schedule",
        enabled: true,
        data: {
          heading: "Order of the day",
          items: [
            { time: "7:00 PM", title: "Guests arrive", text: "Welcome drinks" },
            { time: "7:30 PM", title: "Ceremony", text: "" },
            { time: "8:30 PM", title: "Dinner", text: "" },
          ],
        },
      },
      { id: "r", type: "rsvp", enabled: true, data: { heading: "Will you join us?", text: "Kindly reply by the date below.", deadline: inDays(30), maxGuests: 4 } },
      { id: "z", type: "closing", enabled: true, data: { text: "Your presence is the greatest gift.", signature: sample.title } },
    ],
  };
}
