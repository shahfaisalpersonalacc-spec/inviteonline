import {
  LayoutTemplate, Quote, Users, Landmark, Ticket, Hourglass, CalendarDays, Clock, Feather, BookOpen, MapPin,
  Image as ImageIcon, Video, Shirt, Gift, ListChecks, MailOpen, CircleHelp, Phone, ScrollText, PenLine,
} from "lucide-react";

// Metadata + starting data for each section type. `data` shapes are the contract
// shared by the editor forms (components/editor/SectionForms.js) and the renderer.
export const SECTION_META = {
  hero: { label: "Cover / Hero", Icon: LayoutTemplate, data: () => ({ title: "You're Invited", subtitle: "", tagline: "", date: "", image: "", layout: "arch", foil: true }) },
  quote: { label: "Verse / Quote", Icon: Quote, data: () => ({ arabic: "", text: "", source: "" }) },
  hosts: { label: "Couple / Hosts", Icon: Users, data: () => ({ heading: "The Happy Couple", people: [{ name: "", role: "", photo: "", bio: "" }] }) },
  families: { label: "Families", Icon: Landmark, data: () => ({ heading: "With the blessings of", groups: [{ title: "", names: "" }] }) },
  scratch: { label: "Scratch to Reveal", Icon: Ticket, data: () => ({ heading: "Save the date", text: "Scratch the gold foil to reveal the date", date: "" }) },
  countdown: { label: "Countdown", Icon: Hourglass, data: () => ({ heading: "Counting down", target: "" }) },
  event: { label: "Event Details", Icon: CalendarDays, data: () => ({ heading: "Event Details", items: [{ name: "Main Event", date: "", time: "", venue: "", address: "" }] }) },
  schedule: { label: "Programme", Icon: Clock, data: () => ({ heading: "Programme", items: [{ time: "", title: "", description: "" }] }) },
  timeline: { label: "Love Story Timeline", Icon: Feather, data: () => ({ heading: "Our Story", items: [{ date: "", title: "", text: "", image: "" }] }) },
  story: { label: "Story (text)", Icon: BookOpen, data: () => ({ heading: "Our Story", text: "", image: "" }) },
  venue: { label: "Venue & Map", Icon: MapPin, data: () => ({ heading: "Venue", name: "", address: "", mapQuery: "", image: "" }) },
  gallery: { label: "Photo Gallery", Icon: ImageIcon, data: () => ({ heading: "Gallery", images: [], layout: "grid" }) },
  video: { label: "Video", Icon: Video, data: () => ({ heading: "Watch", url: "" }) },
  dresscode: { label: "Dress Code", Icon: Shirt, data: () => ({ heading: "Dress Code", text: "", colors: [] }) },
  gifts: { label: "Gifts", Icon: Gift, data: () => ({ heading: "Gifts", text: "", accounts: [{ label: "", title: "", number: "", note: "" }] }) },
  rsvp: { label: "RSVP Form", Icon: ListChecks, data: () => ({ heading: "Will you join us?", text: "", deadline: "", maxGuests: 5, askPhone: true }) },
  wishes: { label: "Guestbook / Wishes", Icon: MailOpen, data: () => ({ heading: "Send your wishes", text: "" }) },
  faq: { label: "FAQ", Icon: CircleHelp, data: () => ({ heading: "Good to know", items: [{ q: "", a: "" }] }) },
  contact: { label: "Contact", Icon: Phone, data: () => ({ heading: "Contact", people: [{ name: "", phone: "", whatsapp: true }] }) },
  note: { label: "Text / Note", Icon: ScrollText, data: () => ({ heading: "", text: "" }) },
  closing: { label: "Closing / Thank you", Icon: PenLine, data: () => ({ text: "", signature: "" }) },
};

export const SECTION_TYPES = Object.keys(SECTION_META);

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
