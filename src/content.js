// Static marketing content. Edit this file to rebrand copy for a new client.
// Prices, services, hours and contact details live in store.js so the admin can change them.

export const CATEGORIES = ["Haircut & Styling", "Hair Colouring", "Hair Treatments", "Bridal & Occasion", "Men's Grooming"];

export const IMAGES = {
  hero: {
    src: "/assets/hero-hair.webp",
    alt: "Long glossy brunette hair seen from behind in a warmly lit salon",
    position: "center",
  },
  salon: {
    src: "/assets/salon-interior.webp",
    alt: "Contemporary salon interior with illuminated styling mirrors",
    position: "center",
  },
  reception: {
    src: "/assets/salon-reception.webp",
    alt: "Elegant salon reception with bright styling stations and polished floors",
    position: "center",
  },
  cards: [
    { src: "/assets/service-cut.webp", alt: "Hairstylist cutting a client's hair in a salon", position: "center" },
    { src: "/assets/service-colour.webp", alt: "Close-up of a stylist applying hair colour and highlights", position: "center" },
    { src: "/assets/service-treatment.webp", alt: "Client relaxing at a salon hair-washing station", position: "center" },
    { src: "/assets/service-bridal.webp", alt: "Stylist arranging a blonde bridal updo", position: "center" },
    { src: "/assets/service-mens.webp", alt: "Barber carefully cutting a client's hair", position: "center" },
  ],
  plans: [
    { src: "/assets/plan-care.webp", alt: "Stylist combing and caring for brunette hair", position: "center" },
    { src: "/assets/service-bridal.webp", alt: "Elegant bridal hair styling detail", position: "center" },
    { src: "/assets/salon-reception.webp", alt: "Bright, welcoming salon interior", position: "center" },
  ],
  gallery: [
    {
      before: { src: "/assets/hero-hair.webp", alt: "Illustrative stock photo of long dark brunette hair" },
      after: { src: "/assets/gallery-blonde.webp", alt: "Illustrative stock photo of long blonde waves" },
    },
    {
      before: { src: "/assets/gallery-keratin-before.webp", alt: "Illustrative stock photo of softly waved brunette hair" },
      after: { src: "/assets/gallery-keratin-after.webp", alt: "Illustrative stock photo of smooth, glossy brunette hair" },
    },
    {
      before: { src: "/assets/gallery-copper-before.webp", alt: "Illustrative stock photo of long brunette waves" },
      after: { src: "/assets/gallery-copper-after.webp", alt: "Illustrative stock photo of sleek copper-red hair" },
    },
    {
      before: { src: "/assets/service-colour.webp", alt: "Illustrative stock photo of a hair-colour service in progress" },
      after: { src: "/assets/gallery-ash-after.webp", alt: "Illustrative stock photo of softly waved blonde hair" },
    },
  ],
};

// The five highlight cards under "Our services". `cat` is the price-menu tab they open.
export const CARDS = [
  { t: "Haircut & Styling", d: "Trendy cuts and flawless finishes for a stunning look.", icon: "scissors", cat: 0 },
  { t: "Hair Colouring", d: "Vibrant colour, highlights and balayage by experts.", icon: "brush", cat: 1 },
  { t: "Hair Treatments", d: "Nourishing treatments for healthy, shiny hair.", icon: "bottle", cat: 2 },
  { t: "Bridal & Occasion", d: "Perfect styles for every occasion and event.", icon: "dryer", cat: 3 },
  { t: "Men's Grooming", d: "Haircuts, beard and grooming crafted for men.", icon: "razor", cat: 4 },
];

export const STATS = [
  { icon: "crown", to: 12, suffix: "+", label: "Years of\nexperience" },
  { icon: "user", to: 8, suffix: "K+", label: "Happy\nguests" },
  { icon: "scissors", to: 15, suffix: "+", label: "Professional\nstylists" },
  { icon: "award", to: 100, suffix: "%", label: "Premium quality\nproducts" },
];

export const ABOUT_POINTS = [
  { icon: "chat", t: "Personalised consultation" },
  { icon: "award", t: "Premium quality products" },
  { icon: "shield", t: "Hygiene & clean environment" },
  { icon: "heart", t: "Satisfaction guaranteed" },
];

// Fictional placeholder brands. Replace with the products the salon really stocks.
export const BRANDS = [
  { n: "Lumière", s: "PARIS", cls: "b1" },
  { n: "AURUM PRO", s: "", cls: "b2" },
  { n: "OLEA+", s: "", cls: "b3" },
  { n: "Schönhaar", s: "PROFESSIONAL", cls: "b4" },
  { n: "Maison Argan", s: "", cls: "b5" },
  { n: "Velluto", s: "SALON", cls: "b6" },
];

export const TEAM = [
  { id: "t1", name: "Aarav Sharma", role: "Creative director", spec: "Precision cuts and restyling. Trains the junior team.", exp: "14 yrs", hue: 38 },
  { id: "t2", name: "Meera Jain", role: "Colour specialist", spec: "Balayage, corrections and glossing.", exp: "10 yrs", hue: 26 },
  { id: "t3", name: "Kabir Solanki", role: "Grooming lead", spec: "Men's cuts, beards and scalp care.", exp: "8 yrs", hue: 44 },
  { id: "t4", name: "Naina Patel", role: "Bridal artist", spec: "HD bridal makeup and occasion styling.", exp: "9 yrs", hue: 16 },
];

export const PLANS = [
  { name: "Gloss monthly", price: 1999, per: "/ month", hot: false, items: ["1 hair spa", "1 haircut & blow-dry", "10% off add-ons"] },
  { name: "Bridal prep", price: 24999, per: "package", hot: true, items: ["Makeup trial + bridal look", "3 hair spas and 1 keratin", "Hair styling on the day", "Priority booking"] },
  { name: "Family plan", price: 3999, per: "/ month", hot: false, items: ["Up to 4 members", "4 haircuts any month", "Shared credit for 90 days"] },
];

export const REVIEWS = [
  { tag: "Colour", name: "Sample guest A", text: "Balayage came out exactly like my reference photo. Clean studio and nobody rushed me.", svc: "Balayage" },
  { tag: "Treatments", name: "Sample guest B", text: "Got a keratin treatment and my hair has been smooth for weeks. The stylist explained every step before starting.", svc: "Keratin smoothing" },
  { tag: "Bridal", name: "Sample guest C", text: "The trial saved my nerves. Makeup lasted the whole day and still looked fresh in the evening photos.", svc: "HD bridal makeup" },
  { tag: "Men's", name: "Sample guest D", text: "Best men's cut I have had in the city. Polite team and fair prices.", svc: "Cut & beard" },
  { tag: "Colour", name: "Sample guest E", text: "My grey cover looks natural and the gloss made it shine. Booking online took a minute.", svc: "Root touch-up" },
  { tag: "Treatments", name: "Sample guest F", text: "The scalp detox and hair spa left my head feeling light. Calm, private and very clean.", svc: "Scalp detox" },
];

export const FAQS = [
  ["Do I need to pay in advance?", "No. This demo shows pay-at-studio. Prepaid plans are optional."],
  ["How long does a colour or smoothing service take?", "Between two and four hours depending on length and density. The booking panel adds up the time for you."],
  ["Can I bring a reference photo?", "Yes. Share it in the notes when you book or show it at the consultation."],
  ["What is your cancellation policy?", "Please tell us 4 hours ahead so another guest can take the slot."],
  ["Do you do bridal trials?", "Yes. Trials are included in the bridal prep plan and can be booked separately."],
];

export const LOOKS = [
  { n: "Balayage", note: "Hand-painted lift that grows out softly. Toned for a clean, warm finish." },
  { n: "Keratin smoothing", note: "Frizz and flyaways replaced with a smooth, glossy fall that holds for months." },
  { n: "Copper", note: "Rich copper with depth at the roots. Gloss refresh keeps it bright." },
  { n: "Ash blonde", note: "Cool, soft blonde with bond-repair lightening and a silver toner." },
];
