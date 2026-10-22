// Metadata + starting data for each section type. `data` shapes are the contract
// shared by the editor forms (components/editor/SectionForms.js) and the renderer.
export const SECTION_META = {
  hero: { label: "Cover / Hero", icon: "🌸", data: () => ({ title: "You're Invited", subtitle: "", tagline: "", date: "", image: "", layout: "center" }) },
  hosts: { label: "Couple / Hosts", icon: "👫", data: () => ({ heading: "The Happy Couple", people: [{ name: "", role: "", photo: "", bio: "" }] }) },
  story: { label: "Our Story", icon: "📖", data: () => ({ heading: "Our Story", text: "", image: "" }) },
  event: { label: "Event Details", icon: "📅", data: () => ({ heading: "Event Details", items: [{ name: "Main Event", date: "", time: "", venue: "", address: "" }] }) },
  countdown: { label: "Countdown", icon: "⏳", data: () => ({ heading: "Counting down", target: "" }) },
  schedule: { label: "Programme / Timeline", icon: "🕒", data: () => ({ heading: "Programme", items: [{ time: "", title: "", description: "" }] }) },
  venue: { label: "Venue & Map", icon: "📍", data: () => ({ heading: "Venue", name: "", address: "", mapQuery: "", image: "" }) },
  gallery: { label: "Photo Gallery", icon: "🖼️", data: () => ({ heading: "Gallery", images: [], layout: "grid" }) },
  video: { label: "Video", icon: "🎬", data: () => ({ heading: "Watch", url: "" }) },
  dresscode: { label: "Dress Code", icon: "👗", data: () => ({ heading: "Dress Code", text: "", colors: [] }) },
  rsvp: { label: "RSVP Form", icon: "✅", data: () => ({ heading: "Will you join us?", text: "", deadline: "", maxGuests: 5, askPhone: true }) },
  wishes: { label: "Guestbook / Wishes", icon: "💌", data: () => ({ heading: "Send your wishes", text: "" }) },
  contact: { label: "Contact", icon: "📞", data: () => ({ heading: "Contact", people: [{ name: "", phone: "", whatsapp: true }] }) },
  note: { label: "Text / Note", icon: "📝", data: () => ({ heading: "", text: "" }) },
};

export const SECTION_TYPES = Object.keys(SECTION_META);

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
