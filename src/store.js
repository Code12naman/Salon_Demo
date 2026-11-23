// Tiny reactive store backed by localStorage. The client site and the admin
// dashboard both read and write the same state, so a booking made on the site
// shows up in admin straight away.
//
// To go live, replace the bodies of the exported actions with API calls
// (fetch to your backend) and keep the same function names. The UI does not change.
import { useSyncExternalStore } from "react";
import { dkey, nextDays } from "./lib.js";

const KEY = "doree-demo-v1";

const SERVICES = [
  { id: "h1", cat: 0, name: "Haircut & blow-dry", desc: "Consultation, wash, precision cut and finish.", min: 45, price: 600 },
  { id: "h2", cat: 0, name: "Signature layered cut", desc: "Face-framing layers shaped to your hair type.", min: 60, price: 900 },
  { id: "h3", cat: 0, name: "Blow-dry & curls", desc: "Bouncy curls or a glossy straight finish.", min: 40, price: 700 },
  { id: "h4", cat: 0, name: "Fringe & trim", desc: "Quick tidy between full cuts.", min: 20, price: 250 },
  { id: "c1", cat: 1, name: "Global colour", desc: "Single-shade colour, root to tip.", min: 120, price: 3500, from: true },
  { id: "c2", cat: 1, name: "Balayage", desc: "Hand-painted lift with toner and gloss.", min: 180, price: 6500, from: true },
  { id: "c3", cat: 1, name: "Highlights", desc: "Foil highlights for brightness and depth.", min: 150, price: 4500, from: true },
  { id: "c4", cat: 1, name: "Root touch-up", desc: "Grey cover and regrowth refresh.", min: 60, price: 1500 },
  { id: "c5", cat: 1, name: "Gloss & toner", desc: "Shine boost and shade correction.", min: 45, price: 1800 },
  { id: "t1", cat: 2, name: "Keratin smoothing", desc: "Frizz control that lasts for months.", min: 150, price: 5500, from: true },
  { id: "t2", cat: 2, name: "Nanoplastia", desc: "Deep smoothing for damaged, coloured hair.", min: 180, price: 8000, from: true },
  { id: "t3", cat: 2, name: "Hair spa", desc: "Scalp massage, mask and steam.", min: 60, price: 1200 },
  { id: "t4", cat: 2, name: "Scalp detox", desc: "Clarifying treatment for a calm, clean scalp.", min: 50, price: 1800 },
  { id: "t5", cat: 2, name: "Bond repair treatment", desc: "Rebuilds strength after colour or heat.", min: 60, price: 2500 },
  { id: "b1", cat: 3, name: "Party makeup", desc: "Long-wear makeup with lashes.", min: 60, price: 3500 },
  { id: "b2", cat: 3, name: "HD bridal makeup", desc: "Trial-backed bridal look with hair styling.", min: 150, price: 18000, from: true },
  { id: "b3", cat: 3, name: "Engagement & reception", desc: "Camera-ready makeup and draping.", min: 120, price: 9000, from: true },
  { id: "b4", cat: 3, name: "Occasion hair styling", desc: "Curls, buns, braids and updos.", min: 45, price: 1200 },
  { id: "m1", cat: 4, name: "Men's haircut", desc: "Precision cut with a clean finish.", min: 40, price: 350 },
  { id: "m2", cat: 4, name: "Beard shaping", desc: "Line-up, trim and hot towel.", min: 25, price: 250 },
  { id: "m3", cat: 4, name: "Cut & beard", desc: "Full haircut with beard styling.", min: 55, price: 500 },
  { id: "m4", cat: 4, name: "Head massage", desc: "Relaxing oil massage for scalp and neck.", min: 20, price: 400 },
  { id: "m5", cat: 4, name: "Men's colour", desc: "Natural-looking grey blending.", min: 50, price: 1200 },
].map((s) => ({ active: true, ...s }));

const SETTINGS = {
  brand: "Dorée",
  suffix: "Hair Salon",
  tagline:
    "Personalised cuts, colour and care in a calm, private studio. Honest consultations, clean tools and a stylist who stays with you from start to finish.",
  phone: "+91 98000 00000",
  whatsapp: "919800000000",
  address: "12, Sample Street, Vijay Nagar, Indore, Madhya Pradesh 452010",
  mapQuery: "Vijay Nagar, Indore",
  builtBy: "Website design by Your Name. Let's talk!",
  pin: "1234",
  // Sunday..Saturday. null means closed.
  hours: [{ o: 10, c: 20 }, { o: 10, c: 21 }, { o: 10, c: 21 }, { o: 10, c: 21 }, { o: 10, c: 21 }, { o: 10, c: 21 }, { o: 10, c: 21 }],
};

function code(brand, n) {
  return brand.slice(0, 3).toUpperCase() + "-" + n;
}

function priceOf(services, ids) {
  let total = 0;
  let minutes = 0;
  ids.forEach((id) => {
    const s = services.find((x) => x.id === id);
    if (s) {
      total += s.price;
      minutes += s.min;
    }
  });
  return { total, minutes };
}

function seedBookings() {
  const names = ["Riya Verma", "Sanjana Joshi", "Aman Gupta", "Pooja Mehta", "Rahul Tiwari", "Ishita Rathore", "Neha Agrawal", "Karan Malviya", "Divya Chouhan", "Harsh Patidar", "Tanvi Saxena", "Mohit Bhatia"];
  const plan = [
    [-3, ["c2"], "t2", 11, "completed"],
    [-3, ["t3"], "t1", 14, "completed"],
    [-2, ["m1"], "t3", 12, "completed"],
    [-2, ["b3"], "t4", 15, "cancelled"],
    [-1, ["h1", "c5"], "t1", 16, "completed"],
    [0, ["t1"], "t2", 11, "confirmed"],
    [0, ["m3"], "t3", 13, "confirmed"],
    [0, ["h3", "t4"], "any", 15, "pending"],
    [1, ["b2"], "t4", 10, "confirmed"],
    [1, ["t3"], "t1", 14, "pending"],
    [2, ["c1"], "t2", 12, "pending"],
    [3, ["h2", "t5"], "any", 17, "pending"],
  ];
  const days = nextDays(8, new Date(Date.now() - 3 * 864e5));
  return plan.map((p, i) => {
    const day = days[p[0] + 3];
    const { total, minutes } = priceOf(SERVICES, p[1]);
    return {
      id: "seed" + i,
      code: code("DOR", 2000 + i * 37),
      name: names[i % names.length],
      phone: "98260 0" + String(1000 + i * 13),
      note: i % 4 === 0 ? "Reference photo to be shown at the studio." : "",
      serviceIds: p[1],
      stylist: p[2],
      date: dkey(day),
      time: p[3],
      minutes,
      total,
      status: p[4],
      createdAt: Date.now() - (12 - i) * 36e5,
    };
  });
}

function makeSeed() {
  return { services: SERVICES, settings: SETTINGS, bookings: seedBookings() };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.services && parsed.settings && parsed.bookings) return parsed;
    }
  } catch (e) {
    /* storage blocked or corrupt: fall back to seed */
  }
  return null;
}

let state = load() || makeSeed();
const listeners = new Set();

function commit(next) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* storage blocked: state still lives in memory for this visit */
  }
  listeners.forEach((l) => l());
}

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

// useStore("bookings") returns that slice and re-renders when it changes.
export function useStore(key) {
  return useSyncExternalStore(subscribe, () => state[key], () => state[key]);
}

export const getState = () => state;

/* ---------------- actions ---------------- */

export function addBooking({ name, phone, note, serviceIds, stylist, date, time }) {
  const { total, minutes } = priceOf(state.services, serviceIds);
  const n = 1000 + Math.floor(Math.random() * 9000);
  const booking = {
    id: "b" + Date.now() + Math.floor(Math.random() * 99),
    code: code(state.settings.brand, n),
    name: name.trim(),
    phone: phone.trim(),
    note: (note || "").trim(),
    serviceIds,
    stylist,
    date,
    time,
    minutes,
    total,
    status: "pending",
    createdAt: Date.now(),
  };
  commit({ ...state, bookings: [booking, ...state.bookings] });
  return booking;
}

export function setBookingStatus(id, status) {
  commit({ ...state, bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)) });
}

export function deleteBooking(id) {
  commit({ ...state, bookings: state.bookings.filter((b) => b.id !== id) });
}

export function saveService(svc) {
  const exists = state.services.some((s) => s.id === svc.id);
  const services = exists
    ? state.services.map((s) => (s.id === svc.id ? { ...s, ...svc } : s))
    : [...state.services, { active: true, ...svc }];
  commit({ ...state, services });
}

export function deleteService(id) {
  commit({ ...state, services: state.services.filter((s) => s.id !== id) });
}

export function saveSettings(patch) {
  commit({ ...state, settings: { ...state.settings, ...patch } });
}

export function resetDemo() {
  commit(makeSeed());
}

/* ---------------- helpers shared by site and admin ---------------- */

export { priceOf };

// How many stylists exist (used to decide whether "any available" still has room).
export const STYLIST_COUNT = 4;

// A slot is taken when overlapping, non-cancelled bookings leave nobody free.
export function slotTaken(bookings, date, stylist, start, minutes) {
  const end = start + Math.max(minutes, 30) / 60;
  const overlapping = bookings.filter(
    (b) => b.date === date && b.status !== "cancelled" && b.time < end && b.time + b.minutes / 60 > start
  );
  if (stylist === "any") return overlapping.length >= STYLIST_COUNT;
  return overlapping.some((b) => b.stylist === stylist);
}
