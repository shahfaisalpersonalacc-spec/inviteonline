// Built-in background music (public/music). Soft instrumentals composed for InviteOnline: classics
// whose melodies are public domain, and originals. Free to use on any invitation.
// `occasions` are event type ids (data/eventTypes.js); the first listed suits it best.
export const MUSIC = [
  { id: "canon-in-d", title: "Canon in D", by: "Pachelbel", mood: "Harp & strings", occasions: ["wedding", "engagement", "nikah", "walima"] },
  { id: "bridal-chorus", title: "Bridal Chorus", by: "Wagner", mood: "Music box & harp", occasions: ["wedding"] },
  { id: "ode-to-joy", title: "Ode to Joy", by: "Beethoven", mood: "Piano & strings", occasions: ["wedding", "anniversary", "graduation", "corporate"] },
  { id: "gymnopedie", title: "Gymnopédie No. 1", by: "Satie", mood: "Gentle piano", occasions: ["wedding", "anniversary", "engagement"] },
  { id: "golden-hour", title: "Golden Hour", by: "Original", mood: "Romantic piano", occasions: ["wedding", "engagement", "anniversary"] },
  { id: "eternal-vows", title: "Eternal Vows", by: "Original", mood: "Strings, harp & flute", occasions: ["wedding", "nikah", "walima"] },
  { id: "noor", title: "Noor", by: "Original", mood: "Oud in maqam Hijaz", occasions: ["nikah", "walima", "wedding"] },
  { id: "sakoon", title: "Sakoon", by: "Original", mood: "Calm ney & harp", occasions: ["nikah", "walima"] },
  { id: "barakah", title: "Barakah", by: "Original", mood: "Harp & strings", occasions: ["nikah", "walima", "anniversary"] },
  { id: "mehndi-rang", title: "Mehndi Rang", by: "Original", mood: "Raag Yaman with tabla", occasions: ["mehndi"] },
  { id: "dholki-nights", title: "Dholki Nights", by: "Original", mood: "Festive dhol & marimba", occasions: ["mehndi", "party"] },
  { id: "fur-elise", title: "Für Elise", by: "Beethoven", mood: "Music box", occasions: ["engagement", "anniversary", "birthday"] },
  { id: "forever-yours", title: "Forever Yours", by: "Original", mood: "Piano waltz", occasions: ["engagement", "anniversary", "wedding"] },
  { id: "silver-years", title: "Silver Years", by: "Original", mood: "Harp & strings", occasions: ["anniversary", "engagement"] },
  { id: "happy-birthday", title: "Happy Birthday", by: "Traditional", mood: "Music box & marimba", occasions: ["birthday"] },
  { id: "celebrate", title: "Celebrate", by: "Original", mood: "Bright piano & beat", occasions: ["party", "birthday", "corporate"] },
  { id: "confetti", title: "Confetti", by: "Original", mood: "Playful marimba", occasions: ["birthday", "party", "baby-shower"] },
  { id: "twinkle", title: "Twinkle, Twinkle", by: "Traditional", mood: "Music box & harp", occasions: ["baby-shower", "birthday"] },
  { id: "brahms-lullaby", title: "Brahms' Lullaby", by: "Brahms", mood: "Lullaby harp", occasions: ["baby-shower"] },
  { id: "milestone", title: "Milestone", by: "Original", mood: "Thoughtful piano", occasions: ["graduation", "corporate", "other"] },
  { id: "first-light", title: "First Light", by: "Original", mood: "Warm piano & harp", occasions: ["party", "corporate", "birthday", "other"] },
].map((t) => ({ ...t, src: `/music/${t.id}.mp3` }));

// Tracks for an event type, best fit first; then the rest.
export function musicFor(eventType) {
  const fits = MUSIC.filter((t) => t.occasions.includes(eventType)).sort((a, b) => a.occasions.indexOf(eventType) - b.occasions.indexOf(eventType));
  return { suggested: fits, others: MUSIC.filter((t) => !fits.includes(t)) };
}

// The track a new invitation starts with.
export const defaultMusicFor = (eventType) => musicFor(eventType).suggested[0] || MUSIC.find((t) => t.id === "milestone");

export const musicTrack = (url) => MUSIC.find((t) => t.src === url) || null;
