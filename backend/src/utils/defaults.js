const crypto = require('crypto');

const id = () => crypto.randomBytes(6).toString('hex');

function inDays(days, hour = 19) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const COUPLE_EVENTS = ['wedding', 'nikah', 'walima', 'mehndi', 'engagement', 'anniversary'];

const PRESETS = {
  wedding: {
    heroTitle: 'Ayesha & Ahmed',
    subtitle: 'request the honour of your presence at the celebration of their marriage',
    tagline: 'Together with their families',
    monogram: 'A&A',
    hosts: [
      { name: 'Ayesha', role: 'The Bride', photo: '', bio: 'Daughter of Mr. & Mrs. Imran Khan' },
      { name: 'Ahmed', role: 'The Groom', photo: '', bio: 'Son of Mr. & Mrs. Tariq Malik' },
    ],
    events: [
      { name: 'Mehndi', date: inDays(28, 19), time: '7:00 PM', venue: 'Family Residence', address: '' },
      { name: 'Barat', date: inDays(30, 19), time: '7:30 PM', venue: 'Royal Palm Marquee', address: '' },
      { name: 'Walima', date: inDays(31, 20), time: '8:00 PM', venue: 'Pearl Continental', address: '' },
    ],
    story: 'We met by chance and stayed by choice. Join us as we begin our forever.',
    theme: 'blush',
  },
  nikah: { heroTitle: 'Fatima & Usman', subtitle: 'Nikah Ceremony', tagline: 'In the name of Allah, the Most Gracious, the Most Merciful', monogram: 'F&U', theme: 'emerald' },
  walima: { heroTitle: 'Hina & Bilal', subtitle: 'Walima Reception', tagline: 'Please join us for dinner to celebrate our union', monogram: 'H&B', theme: 'royal' },
  mehndi: { heroTitle: 'Sana & Ali', subtitle: 'Mehndi Night', tagline: 'Dhol, dance and a whole lot of colour!', monogram: 'S&A', theme: 'marigold' },
  engagement: { heroTitle: 'Sara & Hamza', subtitle: 'are engaged!', tagline: 'Join us to celebrate the beginning of our forever', monogram: 'S&H', theme: 'rose-gold' },
  birthday: { heroTitle: "Zara's 5th Birthday", subtitle: "Let's party!", tagline: 'Cake, games and lots of fun', monogram: 'Z', theme: 'candy' },
  'baby-shower': { heroTitle: 'Baby Shower', subtitle: 'Oh baby!', tagline: 'Join us in celebrating the little one on the way', monogram: 'B', theme: 'sky' },
  anniversary: { heroTitle: '25 Years Together', subtitle: 'Mr. & Mrs. Ahmed', tagline: 'Celebrating a silver jubilee of love', monogram: '25', theme: 'champagne' },
  party: { heroTitle: "You're Invited!", subtitle: 'Party Night', tagline: 'Good music, great food and even better company', monogram: 'P', theme: 'midnight' },
  corporate: { heroTitle: 'Annual Gala 2026', subtitle: 'Acme Corporation', tagline: 'An evening of recognition and celebration', monogram: 'AG', theme: 'slate' },
  graduation: { heroTitle: 'Class of 2026', subtitle: 'Graduation Party', tagline: 'Help us celebrate this milestone', monogram: '26', theme: 'midnight' },
  other: { heroTitle: "You're Invited", subtitle: 'A special celebration', tagline: 'We would love for you to be there', monogram: '', theme: 'blush' },
};

// Builds the starting sections for a new invitation. Shape of each section's `data`
// is the contract the frontend editor and renderer rely on.
// Shown by default, in this order: cover, verse, scratch card, countdown, blessings, programme,
// venue, RSVP, wishes, then contact and the thank-you at the very end. Everything else starts switched off.
// `details` (optional, from the new-invitation steps) fills in the owner's own information.
function buildDefaultSections(eventType = 'wedding', title = '', details = {}) {
  const base = { ...PRESETS.other, ...(PRESETS[eventType] || {}) };
  // Use the owner's own names/title in place of the sample one.
  const p = title && title !== 'My Invitation' ? { ...base, heroTitle: title } : base;
  const date = details.date || (p.events && p.events[0]?.date) || inDays(30);
  const isCouple = COUPLE_EVENTS.includes(eventType);
  const isIslamic = ['wedding', 'nikah', 'walima'].includes(eventType);
  const filled = (list) => (list || []).filter((x) => Object.values(x).some((v) => String(v || '').trim()));

  const families = filled(details.families);
  const schedule = filled(details.schedule);
  const venue = details.venue || {};
  const contact = details.contact || {};

  const shown = [
    { type: 'hero', data: { title: p.heroTitle, subtitle: p.subtitle, tagline: p.tagline, date, image: '', layout: isCouple ? 'arch' : 'classic', foil: true } },
    {
      type: 'quote',
      data: isIslamic
        ? { arabic: 'وَخَلَقْنَاكُمْ أَزْوَاجًا', text: 'And We created you in pairs.', source: 'Surah An-Naba 78:8' }
        : { arabic: '', text: 'Where there is love, there is life.', source: 'Mahatma Gandhi' },
    },
    { type: 'scratch', data: { heading: 'Save the date', text: 'Scratch the gold foil to reveal the date', date } },
    { type: 'countdown', data: { heading: 'Counting down to the big day', target: date } },
    {
      type: 'families',
      data: {
        heading: 'With the blessings of',
        groups: families.length
          ? families
          : isCouple
            ? [
                { title: "Bride's family", names: 'Mr. & Mrs. Imran Khan\nGrandparents & family' },
                { title: "Groom's family", names: 'Mr. & Mrs. Tariq Malik\nGrandparents & family' },
              ]
            : [{ title: 'With love from', names: 'The family' }],
      },
    },
    {
      type: 'schedule',
      data: {
        heading: 'Programme',
        items: schedule.length
          ? schedule.map((x) => ({ time: x.time || '', title: x.title || '', description: '' }))
          : [
              { time: '7:00 PM', title: 'Guests arrive', description: 'Welcome drinks' },
              { time: '8:00 PM', title: 'Main ceremony', description: '' },
              { time: '9:30 PM', title: 'Dinner', description: '' },
            ],
      },
    },
    { type: 'venue', data: { heading: 'Venue', name: venue.name || 'Venue name', address: venue.address || (venue.mapUrl ? '' : 'Street, City'), mapUrl: venue.mapUrl || '', mapQuery: '', image: '' } },
    { type: 'rsvp', data: { heading: 'Will you join us?', text: 'Kindly let us know by the date below.', deadline: inDays(20), maxGuests: 10, askPhone: true } },
    { type: 'wishes', data: { heading: 'Send your wishes', text: 'Leave a message for us' } },
    { type: 'contact', data: { heading: 'Contact', people: [{ name: contact.name || 'Family contact', phone: contact.phone || '', whatsapp: true }] } },
    { type: 'closing', data: { text: details.closing || 'Your presence is the greatest gift. We look forward to celebrating with you!', signature: p.heroTitle } },
  ];

  // switched off: ready in the editor whenever the owner wants them
  const hidden = [
    isCouple && {
      type: 'hosts',
      data: { heading: eventType === 'anniversary' ? 'The Couple' : 'The Happy Couple', people: p.hosts || [
        { name: 'Bride', role: 'The Bride', photo: '', bio: '' },
        { name: 'Groom', role: 'The Groom', photo: '', bio: '' },
      ] },
    },
    {
      type: 'event',
      data: {
        heading: 'Event Details',
        items: p.events || [{ name: p.heroTitle, date, time: '7:00 PM', venue: venue.name || 'Venue name', address: venue.address || 'Full address' }],
      },
    },
    isCouple && {
      type: 'timeline',
      data: {
        heading: 'Our Story',
        items: [
          { date: '2021', title: 'First meeting', text: 'A chance meeting at a friend’s dinner.', image: '' },
          { date: '2024', title: 'The proposal', text: 'A question, a ring and a very happy yes.', image: '' },
          { date: '2026', title: 'Forever begins', text: 'And now we celebrate with you.', image: '' },
        ],
      },
    },
    { type: 'story', data: { heading: 'Our Story', text: p.story || 'Every love story is beautiful, but ours is our favourite.', image: '' } },
    { type: 'gallery', data: { heading: 'Gallery', images: [], layout: 'grid' } },
    { type: 'video', data: { heading: 'Watch', url: '' } },
    { type: 'dresscode', data: { heading: 'Dress Code', text: 'Traditional / Formal', colors: ['#7a2430', '#c9a24a', '#f3e9dc'] } },
    {
      type: 'gifts',
      data: {
        heading: 'Gifts',
        text: 'Your presence is our gift. Should you wish to bless us, details are below.',
        accounts: [{ label: 'Bank transfer', title: 'Account title', number: 'PK00 XXXX 0000 0000 0000', note: 'Bank name' }],
      },
    },
    {
      type: 'faq',
      data: {
        heading: 'Good to know',
        items: [
          { q: 'Is there parking at the venue?', a: 'Yes, free parking is available on site.' },
          { q: 'Can I bring children?', a: 'Children are most welcome.' },
        ],
      },
    },
  ].filter(Boolean);

  return {
    themePreset: p.theme,
    monogram: p.monogram,
    sections: [
      ...shown.map((s) => ({ id: id(), enabled: true, type: s.type, data: s.data })),
      ...hidden.map((s) => ({ id: id(), enabled: false, type: s.type, data: s.data })),
    ],
  };
}

// Mirrors the frontend theme presets (frontend/src/data/themes.js) so new invitations start fully styled.
const THEMES = {
  blush: { primary: '#9f2f45', secondary: '#e8b4b8', background: '#fffaf7', surface: '#ffffff', text: '#3d2b2f', fontHeading: 'Great Vibes', fontBody: 'Cormorant Garamond', animation: 'petals', entryStyle: 'linen-monogram', sealColor: '#7a2430', sealIcon: 'monogram' },
  emerald: { primary: '#0f5c46', secondary: '#c9a24a', background: '#f5f8f3', surface: '#ffffff', text: '#1f2a24', fontHeading: 'Cinzel', fontBody: 'Cormorant Garamond', animation: 'stars', entryStyle: 'sage-botanical', sealColor: '#c9a24a', sealIcon: 'crest' },
  royal: { primary: '#6b1e2a', secondary: '#c9a24a', background: '#fbf6f1', surface: '#ffffff', text: '#2e1a1e', fontHeading: 'Cinzel', fontBody: 'Cormorant Garamond', animation: 'stars', entryStyle: 'burgundy-dove', sealColor: '#c9a24a', sealIcon: 'dove' },
  marigold: { primary: '#b4471a', secondary: '#f2b33d', background: '#fffaf0', surface: '#ffffff', text: '#3f2a14', fontHeading: 'Great Vibes', fontBody: 'Poppins', animation: 'petals', entryStyle: 'door-garden', sealColor: '#b4471a', sealIcon: 'rose' },
  'rose-gold': { primary: '#a8636e', secondary: '#e6c3a5', background: '#fdf7f3', surface: '#ffffff', text: '#4a3a3a', fontHeading: 'Parisienne', fontBody: 'Cormorant Garamond', animation: 'hearts', entryStyle: 'ivory-gatefold', sealColor: '#7c2b2b', sealIcon: 'heart' },
  candy: { primary: '#db2777', secondary: '#38bdf8', background: '#fdf4ff', surface: '#ffffff', text: '#312e81', fontHeading: 'Pacifico', fontBody: 'Quicksand', animation: 'confetti', entryStyle: 'door-garden', sealColor: '#db2777', sealIcon: 'heart' },
  sky: { primary: '#2f6f9a', secondary: '#f3c6d3', background: '#f4f9fc', surface: '#ffffff', text: '#1e3a5f', fontHeading: 'Dancing Script', fontBody: 'Quicksand', animation: 'hearts', entryStyle: 'linen-monogram', sealColor: '#2f6f9a', sealIcon: 'heart' },
  champagne: { primary: '#8a6a2f', secondary: '#e7d3a8', background: '#fdf9f1', surface: '#ffffff', text: '#3b3025', fontHeading: 'Playfair Display', fontBody: 'Cormorant Garamond', animation: 'stars', entryStyle: 'linen-monogram', sealColor: '#8a6a2f', sealIcon: 'monogram' },
  midnight: { primary: '#d9b25f', secondary: '#8b7cc8', background: '#11152b', surface: '#1b2140', text: '#e8e4d8', fontHeading: 'Cinzel', fontBody: 'Cormorant Garamond', animation: 'stars', entryStyle: 'midnight-gold', sealColor: '#c9a24a', sealIcon: 'crest' },
  slate: { primary: '#1c1a3d', secondary: '#e8544a', background: '#f8f7f4', surface: '#ffffff', text: '#1c1a3d', fontHeading: 'Playfair Display', fontBody: 'Plus Jakarta Sans', animation: 'none', entryStyle: 'midnight-gold', sealColor: '#e8544a', sealIcon: 'monogram' },
  sage: { primary: '#4f5d3a', secondary: '#c9b48a', background: '#f7f8f2', surface: '#ffffff', text: '#2f3a22', fontHeading: 'Parisienne', fontBody: 'Cormorant Garamond', animation: 'petals', entryStyle: 'sage-monogram', sealColor: '#b8646e', sealIcon: 'monogram' },
  ruby: { primary: '#8c1c2e', secondary: '#d9a441', background: '#fff8f5', surface: '#ffffff', text: '#3f1d24', fontHeading: 'Great Vibes', fontBody: 'Cormorant Garamond', animation: 'petals', entryStyle: 'burgundy-dove', sealColor: '#c9a24a', sealIcon: 'dove' },
};

// "Zayd & Layla" / "Ayesha weds Ahmed" -> "Z&L" / "A&A"; "Zara's Birthday" -> "Z".
function monogramFrom(title = '') {
  const parts = String(title).split(/\s*(?:&|\+|\band\b|\bweds\b|\bwith\b)\s*/i).map((s) => s.trim()).filter(Boolean);
  const initial = (s) => (s.match(/[\p{L}\p{N}]/u) || [''])[0].toUpperCase();
  return parts.length >= 2 ? `${initial(parts[0])}&${initial(parts[1])}` : initial(parts[0] || '');
}

function themeFor(preset, monogram = '') {
  return { preset, bgType: 'color', bgValue: '', envelope: true, monogram, ...(THEMES[preset] || THEMES.blush) };
}

module.exports = { buildDefaultSections, themeFor, monogramFrom, newId: id };
