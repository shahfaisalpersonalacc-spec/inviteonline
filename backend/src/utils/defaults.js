const crypto = require('crypto');

const id = () => crypto.randomBytes(6).toString('hex');

function inDays(days, hour = 19) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const PRESETS = {
  wedding: {
    heroTitle: 'Ayesha & Ahmed',
    subtitle: 'are getting married',
    tagline: 'Together with their families, request the honour of your presence',
    hosts: [
      { name: 'Ayesha', role: 'The Bride', photo: '', bio: 'Daughter of Mr. & Mrs. Khan' },
      { name: 'Ahmed', role: 'The Groom', photo: '', bio: 'Son of Mr. & Mrs. Malik' },
    ],
    events: [
      { name: 'Mehndi', date: inDays(28, 19), time: '7:00 PM', venue: 'Family Residence', address: '' },
      { name: 'Barat', date: inDays(30, 19), time: '7:30 PM', venue: 'Royal Palm Marquee', address: '' },
      { name: 'Walima', date: inDays(31, 20), time: '8:00 PM', venue: 'Pearl Continental', address: '' },
    ],
    story: 'We met by chance and stayed by choice. Join us as we begin our forever.',
    theme: 'blush',
  },
  nikah: { heroTitle: 'Nikah Ceremony', subtitle: 'Fatima & Usman', tagline: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ', theme: 'emerald' },
  walima: { heroTitle: 'Walima Reception', subtitle: 'Hina & Bilal', tagline: 'Please join us for dinner to celebrate our union', theme: 'royal' },
  mehndi: { heroTitle: 'Mehndi Night', subtitle: 'Sana & Ali', tagline: 'Dhol, dance and a whole lot of colour!', theme: 'marigold' },
  engagement: { heroTitle: 'Sara & Hamza', subtitle: 'are engaged!', tagline: 'Join us to celebrate the beginning of our forever', theme: 'rose-gold' },
  birthday: { heroTitle: "Zara's 5th Birthday", subtitle: "Let's party!", tagline: 'Cake, games and lots of fun', theme: 'candy' },
  'baby-shower': { heroTitle: 'Baby Shower', subtitle: 'Oh baby!', tagline: 'Join us in celebrating the little one on the way', theme: 'sky' },
  anniversary: { heroTitle: '25 Years Together', subtitle: 'Mr. & Mrs. Ahmed', tagline: 'Celebrating a silver jubilee of love', theme: 'champagne' },
  party: { heroTitle: "You're Invited!", subtitle: 'Party Night', tagline: 'Good music, great food and even better company', theme: 'midnight' },
  corporate: { heroTitle: 'Annual Gala 2026', subtitle: 'Acme Corporation', tagline: 'An evening of recognition and celebration', theme: 'slate' },
  graduation: { heroTitle: 'Class of 2026', subtitle: 'Graduation Party', tagline: 'Help us celebrate this milestone', theme: 'midnight' },
  other: { heroTitle: "You're Invited", subtitle: 'A special celebration', tagline: 'We would love for you to be there', theme: 'blush' },
};

// Builds the starting sections for a new invitation. Shape of each section's `data`
// is the contract the frontend editor and renderer rely on.
function buildDefaultSections(eventType = 'wedding') {
  const p = { ...PRESETS.other, ...(PRESETS[eventType] || {}) };
  const date = (p.events && p.events[0]?.date) || inDays(30);
  const isCouple = ['wedding', 'nikah', 'walima', 'mehndi', 'engagement', 'anniversary'].includes(eventType);

  const sections = [
    { type: 'hero', data: { title: p.heroTitle, subtitle: p.subtitle, tagline: p.tagline, date, image: '', layout: 'center' } },
    isCouple && {
      type: 'hosts',
      data: { heading: eventType === 'anniversary' ? 'The Couple' : 'The Happy Couple', people: p.hosts || [
        { name: 'Bride', role: 'The Bride', photo: '', bio: '' },
        { name: 'Groom', role: 'The Groom', photo: '', bio: '' },
      ] },
    },
    isCouple && { type: 'story', data: { heading: 'Our Story', text: p.story || 'Every love story is beautiful, but ours is our favourite.', image: '' } },
    { type: 'countdown', data: { heading: 'Counting down to the big day', target: date } },
    {
      type: 'event',
      data: {
        heading: 'Event Details',
        items: p.events || [{ name: p.heroTitle, date, time: '7:00 PM', venue: 'Venue name', address: 'Full address' }],
      },
    },
    {
      type: 'schedule',
      data: {
        heading: 'Programme',
        items: [
          { time: '7:00 PM', title: 'Guests arrive', description: 'Welcome drinks' },
          { time: '8:00 PM', title: 'Main ceremony', description: '' },
          { time: '9:30 PM', title: 'Dinner', description: '' },
        ],
      },
    },
    { type: 'venue', data: { heading: 'Venue', name: 'Venue name', address: 'Street, City', mapQuery: '', image: '' } },
    { type: 'gallery', data: { heading: 'Gallery', images: [], layout: 'grid' } },
    { type: 'video', enabled: false, data: { heading: 'Watch', url: '' } },
    { type: 'dresscode', enabled: false, data: { heading: 'Dress Code', text: 'Traditional / Formal', colors: ['#be185d', '#f9a8d4', '#fde68a'] } },
    { type: 'rsvp', data: { heading: 'Will you join us?', text: 'Kindly let us know by the date below.', deadline: inDays(20), maxGuests: 5, askPhone: true } },
    { type: 'wishes', data: { heading: 'Send your wishes', text: 'Leave a message for us' } },
    { type: 'contact', data: { heading: 'Contact', people: [{ name: 'Family contact', phone: '', whatsapp: true }] } },
    { type: 'note', data: { heading: 'With love', text: 'Your presence is the greatest gift. We look forward to celebrating with you!' } },
  ].filter(Boolean);

  return {
    themePreset: p.theme,
    sections: sections.map((s) => ({ id: id(), enabled: s.enabled ?? true, type: s.type, data: s.data })),
  };
}

// Mirrors the frontend theme presets so new invitations start fully styled.
const THEMES = {
  blush: { primary: '#be185d', secondary: '#f9a8d4', background: '#fff7fb', surface: '#ffffff', text: '#3f3f46', fontHeading: 'Great Vibes', fontBody: 'Poppins', animation: 'petals' },
  emerald: { primary: '#047857', secondary: '#d4af37', background: '#f0fdf4', surface: '#ffffff', text: '#1f2937', fontHeading: 'Amiri', fontBody: 'Lora', animation: 'stars' },
  royal: { primary: '#4c1d95', secondary: '#d4af37', background: '#faf5ff', surface: '#ffffff', text: '#27272a', fontHeading: 'Cinzel', fontBody: 'Lora', animation: 'stars' },
  marigold: { primary: '#c2410c', secondary: '#facc15', background: '#fffbeb', surface: '#ffffff', text: '#3f2a14', fontHeading: 'Pacifico', fontBody: 'Poppins', animation: 'petals' },
  'rose-gold': { primary: '#b76e79', secondary: '#e8c4a0', background: '#fdf6f0', surface: '#ffffff', text: '#4a3a3a', fontHeading: 'Playfair Display', fontBody: 'Lora', animation: 'hearts' },
  candy: { primary: '#db2777', secondary: '#38bdf8', background: '#fdf4ff', surface: '#ffffff', text: '#312e81', fontHeading: 'Pacifico', fontBody: 'Quicksand', animation: 'confetti' },
  sky: { primary: '#0284c7', secondary: '#fbcfe8', background: '#f0f9ff', surface: '#ffffff', text: '#1e3a5f', fontHeading: 'Dancing Script', fontBody: 'Quicksand', animation: 'hearts' },
  champagne: { primary: '#a16207', secondary: '#e7d3a8', background: '#fefaf2', surface: '#ffffff', text: '#3b3025', fontHeading: 'Playfair Display', fontBody: 'Lora', animation: 'stars' },
  midnight: { primary: '#facc15', secondary: '#a78bfa', background: '#0f172a', surface: '#1e293b', text: '#e2e8f0', fontHeading: 'Cinzel', fontBody: 'Poppins', animation: 'confetti' },
  slate: { primary: '#1d4ed8', secondary: '#94a3b8', background: '#f8fafc', surface: '#ffffff', text: '#0f172a', fontHeading: 'Playfair Display', fontBody: 'Inter', animation: 'none' },
  sage: { primary: '#4d7c0f', secondary: '#d9c8a9', background: '#f7f9f2', surface: '#ffffff', text: '#2f3a22', fontHeading: 'Parisienne', fontBody: 'Cormorant Garamond', animation: 'petals' },
  ruby: { primary: '#9f1239', secondary: '#f59e0b', background: '#fff1f2', surface: '#ffffff', text: '#3f1d24', fontHeading: 'Alex Brush', fontBody: 'Montserrat', animation: 'petals' },
};

function themeFor(preset) {
  return { preset, bgType: 'color', bgValue: '', envelope: true, ...(THEMES[preset] || THEMES.blush) };
}

module.exports = { buildDefaultSections, themeFor, newId: id };
