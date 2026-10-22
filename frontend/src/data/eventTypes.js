export const EVENT_TYPES = [
  { id: "wedding", label: "Wedding", emoji: "💍", theme: "blush", hint: "Mehndi, Barat & Walima in one page" },
  { id: "nikah", label: "Nikah", emoji: "🕌", theme: "emerald", hint: "Elegant Islamic styling" },
  { id: "walima", label: "Walima", emoji: "🍽️", theme: "royal", hint: "Reception dinner" },
  { id: "mehndi", label: "Mehndi / Dholki", emoji: "🪘", theme: "marigold", hint: "Colourful & festive" },
  { id: "engagement", label: "Engagement", emoji: "💞", theme: "rose-gold", hint: "Ring ceremony / mangni" },
  { id: "birthday", label: "Birthday", emoji: "🎂", theme: "candy", hint: "Kids or adults" },
  { id: "baby-shower", label: "Baby Shower", emoji: "🍼", theme: "sky", hint: "Aqiqah, gender reveal" },
  { id: "anniversary", label: "Anniversary", emoji: "🥂", theme: "champagne", hint: "Celebrate years together" },
  { id: "party", label: "Party", emoji: "🎉", theme: "midnight", hint: "Any get-together" },
  { id: "graduation", label: "Graduation", emoji: "🎓", theme: "midnight", hint: "Celebrate the milestone" },
  { id: "corporate", label: "Corporate Event", emoji: "🏢", theme: "slate", hint: "Launches, galas, seminars" },
  { id: "other", label: "Something else", emoji: "✨", theme: "blush", hint: "Start from a blank invite" },
];

export const eventTypeLabel = (id) => EVENT_TYPES.find((e) => e.id === id)?.label || "Event";
export const eventTypeEmoji = (id) => EVENT_TYPES.find((e) => e.id === id)?.emoji || "✨";
