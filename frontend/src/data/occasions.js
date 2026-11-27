// One public landing page per occasion (/invitations/<slug>): what people search for ("nikah invitation online"),
// answered first in plain words, then what to put on the card and the questions people ask.
// Everything here describes what the app really does; keep it that way when features change.

const SHARED_STEPS = [
  "Create a free account and pick the occasion.",
  "Choose a design: the doors or envelope guests open, a colour theme, light or dark.",
  "Add the names, date, families, events, venues and photos. The preview updates as you type.",
  "Copy your link and share it on WhatsApp, Instagram, SMS or email. Guests reply with one tap.",
];

export const OCCASIONS = [
  {
    slug: "wedding",
    label: "Wedding",
    title: "Online Wedding Invitation Card Maker with RSVP",
    description:
      "Make an online wedding invitation with Mehndi, Barat and Walima on one link. Palace doors that open, photos, music, maps and RSVP. Share on WhatsApp. Free to start.",
    h1: "Online wedding invitations",
    intro:
      "An online wedding invitation is a wedding card that lives on a web link instead of paper. With InviteOnline you add the couple, both families and every function (Mehndi, Barat, Nikah, Walima) to one page, share it on WhatsApp, and guests RSVP from their phone without an app.",
    include: [
      "The couple's names and the wedding date on the cover",
      "Both families, with the blessings of parents and grandparents",
      "Each function with its own date, time, venue and Google Maps link",
      "More than one wedding in the family on the same card, each couple with their own families",
      "Photos of the couple, background music and a countdown",
      "RSVP with party size, and a guestbook for wishes",
    ],
    faq: [
      {
        q: "Can I put Mehndi, Barat and Walima on one invitation?",
        a: "Yes. Add each function with its own date, time and venue. Guests see them all on one link and send one RSVP for the whole card.",
      },
      {
        q: "Two weddings are happening in our family. Can they share one card?",
        a: "Yes. Add up to three couples. Each couple keeps their own names, date and families, and every function says which couple it is for.",
      },
      {
        q: "How do I send a wedding invitation on WhatsApp?",
        a: "Copy your invitation link and paste it into WhatsApp. It opens with a preview card showing the names and date, and guests tap it to open the invitation.",
      },
      {
        q: "Can I change the venue or time after sending?",
        a: "Yes. Edits show up instantly on the same link, so nobody needs a new card.",
      },
    ],
  },
  {
    slug: "nikah",
    label: "Nikah",
    title: "Online Nikah Invitation Card with RSVP",
    description:
      "Create an elegant online nikah invitation with an Islamic-styled design, the families, venue map and RSVP. Add the Walima too and share one link on WhatsApp.",
    h1: "Online nikah invitations",
    intro:
      "An online nikah invitation is a nikah card shared as a link. InviteOnline gives it an elegant Islamic-styled design with room for a verse, both families, the nikah venue with directions and an RSVP, and you can add the Walima or Mehndi to the same card.",
    include: [
      "The bride's and groom's names and the nikah date",
      "A Quranic verse or dua at the top",
      "With the blessings of: both families",
      "The nikah time and venue, with a map and add-to-calendar",
      "The Walima or Mehndi as extra functions, if you like",
      "RSVP so you know how many guests are coming",
    ],
    faq: [
      {
        q: "Can I add the Walima to my nikah invitation?",
        a: "Yes. Add Walima, Mehndi or any other function. Each has its own date, time and venue, and guests send one RSVP for the card.",
      },
      {
        q: "Can I add a verse or dua?",
        a: "Yes. The invitation has a section for a verse or quote, which you can edit or hide.",
      },
      {
        q: "Can I keep the nikah invitation private?",
        a: "Yes. Add a password and only guests who know it can open the page. Invitation pages are never listed on search engines.",
      },
      {
        q: "Do guests need an app to open it?",
        a: "No. The invitation opens in any phone or computer browser.",
      },
    ],
  },
  {
    slug: "walima",
    label: "Walima",
    title: "Online Walima Invitation Card with RSVP",
    description:
      "Make an online walima invitation for the reception dinner: names, families, venue with map, time, and RSVP to plan the headcount. Share on WhatsApp. Free to start.",
    h1: "Online walima invitations",
    intro:
      "An online walima invitation is a link that invites guests to the walima reception. InviteOnline shows the couple, the hosting family, the dinner time and venue with directions, and collects RSVPs with party size so you can plan the headcount for catering.",
    include: [
      "The couple's names and the walima date",
      "The hosting family",
      "Reception time, venue and Google Maps directions",
      "The nikah or barat as extra functions, if you like",
      "RSVP with the number of guests in each party",
      "Optional gift details with one-tap copy",
    ],
    faq: [
      {
        q: "How do I know how many guests are coming to the walima?",
        a: "Guests RSVP with how many people are coming. You see replies live and can export the list to Excel or CSV for your caterer.",
      },
      {
        q: "Can the walima be on the same card as the nikah?",
        a: "Yes. Add both functions, each with its own date and venue, and share one link.",
      },
      {
        q: "Can I share it on WhatsApp?",
        a: "Yes. Paste the link into WhatsApp; it shows a preview card with the names and date.",
      },
    ],
  },
  {
    slug: "mehndi",
    label: "Mehndi",
    title: "Online Mehndi & Dholki Invitation Card",
    description:
      "Create a colourful online mehndi or dholki invitation with music, photos, the venue map and RSVP. Add the Barat and Walima too and share one link on WhatsApp.",
    h1: "Online mehndi and dholki invitations",
    intro:
      "An online mehndi invitation is a festive card shared as a link for the mehndi or dholki night. InviteOnline gives it bright themes, your song playing as it opens, the venue with directions and an RSVP, and you can add the Barat and Walima to the same card.",
    include: [
      "The bride's and groom's names and the mehndi date",
      "Dholki nights or other functions, each with its own date",
      "A colourful theme and your favourite song",
      "Venue, time and directions",
      "RSVP and a guestbook for wishes",
    ],
    faq: [
      {
        q: "Can I add music to my mehndi invitation?",
        a: "Yes. Pick a song and it begins when guests open the invitation.",
      },
      {
        q: "Can the mehndi, barat and walima be on one card?",
        a: "Yes. Add each as a function with its own date, time and venue.",
      },
      {
        q: "Can I print it too?",
        a: "Yes. Download a QR code for printed cards; scanning it opens your invitation.",
      },
    ],
  },
  {
    slug: "engagement",
    label: "Engagement",
    title: "Online Engagement Invitation Card with RSVP",
    description:
      "Make an online engagement or ring ceremony (mangni) invitation with the couple's photos, venue map, countdown and RSVP. Share one link on WhatsApp. Free to start.",
    h1: "Online engagement invitations",
    intro:
      "An online engagement invitation is a link that invites guests to an engagement or ring ceremony (mangni). InviteOnline shows the couple with their photos, the date with a countdown, the venue with directions, and collects RSVPs and wishes in one place.",
    include: [
      "The couple's names and photos",
      "The engagement date with a countdown",
      "Both families",
      "Venue, time and directions",
      "RSVP and a guestbook",
    ],
    faq: [
      {
        q: "Can I add our photos?",
        a: "Yes. Add a cover photo, portraits and a gallery that guests can open full screen.",
      },
      {
        q: "Can guests leave wishes?",
        a: "Yes. The guestbook lets family and friends leave messages on the invitation.",
      },
      {
        q: "Is it free?",
        a: "You can start free and make your invitation without paying.",
      },
    ],
  },
  {
    slug: "birthday",
    label: "Birthday",
    title: "Online Birthday Invitation Maker with RSVP",
    description:
      "Create an online birthday invitation for kids or adults with photos, music, a countdown, the party venue map and RSVP. Share one link on WhatsApp. Free to start.",
    h1: "Online birthday invitations",
    intro:
      "An online birthday invitation is a party invite shared as a link. InviteOnline lets you make one for a child's or an adult's birthday with fun themes, photos, music, a countdown, the party venue with directions and an RSVP, then send it on WhatsApp in minutes.",
    include: [
      "Whose birthday it is, and the age if you like",
      "Party date and time with a countdown",
      "Venue and directions",
      "Photos and a theme that suits the party",
      "RSVP with how many are coming",
    ],
    faq: [
      {
        q: "Can I make a birthday invitation for a kid's party?",
        a: "Yes. Pick a playful theme, add photos and stickers, and share the link with parents on WhatsApp.",
      },
      {
        q: "How do I know who is coming?",
        a: "Guests RSVP from the invitation. You see the replies and the headcount in your dashboard.",
      },
      {
        q: "Do guests need to sign up?",
        a: "No. Guests just open the link; only you need an account.",
      },
    ],
  },
  {
    slug: "baby-shower",
    label: "Baby shower",
    title: "Online Baby Shower & Aqiqah Invitation",
    description:
      "Make an online baby shower, aqiqah or gender reveal invitation with a soft theme, venue map, countdown and RSVP. Share one link on WhatsApp. Free to start.",
    h1: "Online baby shower invitations",
    intro:
      "An online baby shower invitation is a link that invites guests to a baby shower, aqiqah or gender reveal. InviteOnline gives it a soft theme, the date with a countdown, the venue with directions, optional gift details and an RSVP, all on one page.",
    include: [
      "The parents-to-be or the baby's name",
      "Date, time and countdown",
      "Venue and directions",
      "Gift details, if you wish",
      "RSVP and wishes",
    ],
    faq: [
      {
        q: "Can I use it for an aqiqah?",
        a: "Yes. Pick the baby shower occasion and change the wording and title to suit your aqiqah.",
      },
      {
        q: "Can I share gift details?",
        a: "Yes. Add bank or wallet details that guests can copy with one tap, or leave the section out.",
      },
    ],
  },
  {
    slug: "anniversary",
    label: "Anniversary",
    title: "Online Anniversary Invitation Card with RSVP",
    description:
      "Create an online anniversary party invitation with the couple's photos and story, the venue map and RSVP. Share one link on WhatsApp. Free to start.",
    h1: "Online anniversary invitations",
    intro:
      "An online anniversary invitation is a link that invites guests to celebrate a couple's years together. InviteOnline shows the couple's photos and a timeline of their story, the party venue with directions, and collects RSVPs and wishes from family and friends.",
    include: [
      "The couple's names and how many years they celebrate",
      "Photos and a timeline of their story",
      "Party date, time and venue",
      "RSVP and a guestbook",
    ],
    faq: [
      {
        q: "Can I add a timeline of the couple's story?",
        a: "Yes. The story section holds moments with dates, words and photos.",
      },
      {
        q: "Can children surprise their parents with it?",
        a: "Yes. Anyone can make the invitation and share it privately with a password.",
      },
    ],
  },
].map((o) => ({ ...o, steps: SHARED_STEPS }));

export const occasionBySlug = (slug) => OCCASIONS.find((o) => o.slug === slug);
