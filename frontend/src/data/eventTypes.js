import { Gem, Moon, UtensilsCrossed, Flower2, HeartHandshake, Cake, Baby, Wine, PartyPopper, GraduationCap, Building2, Sparkles } from "lucide-react";

export const EVENT_TYPES = [
  { id: "wedding", label: "Wedding", Icon: Gem, theme: "royal", hint: "Mehndi, Barat & Walima in one page" },
  { id: "nikah", label: "Nikah", Icon: Moon, theme: "emerald", hint: "Elegant Islamic styling" },
  { id: "walima", label: "Walima", Icon: UtensilsCrossed, theme: "ruby", hint: "Reception dinner" },
  { id: "mehndi", label: "Mehndi / Dholki", Icon: Flower2, theme: "marigold", hint: "Colourful & festive" },
  { id: "engagement", label: "Engagement", Icon: HeartHandshake, theme: "rose-gold", hint: "Ring ceremony / mangni" },
  { id: "birthday", label: "Birthday", Icon: Cake, theme: "candy", hint: "Kids or adults" },
  { id: "baby-shower", label: "Baby Shower", Icon: Baby, theme: "sky", hint: "Aqiqah, gender reveal" },
  { id: "anniversary", label: "Anniversary", Icon: Wine, theme: "champagne", hint: "Celebrate years together" },
  { id: "party", label: "Party", Icon: PartyPopper, theme: "midnight", hint: "Any get-together" },
  { id: "graduation", label: "Graduation", Icon: GraduationCap, theme: "midnight", hint: "Celebrate the milestone" },
  { id: "corporate", label: "Corporate Event", Icon: Building2, theme: "slate", hint: "Launches, galas, seminars" },
  { id: "other", label: "Something else", Icon: Sparkles, theme: "sage", hint: "Start from a blank invite" },
];

export const eventTypeLabel = (id) => EVENT_TYPES.find((e) => e.id === id)?.label || "Event";
export const eventTypeIcon = (id) => EVENT_TYPES.find((e) => e.id === id)?.Icon || Sparkles;
