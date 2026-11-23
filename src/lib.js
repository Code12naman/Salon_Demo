export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const inr = (n) => "₹" + new Intl.NumberFormat("en-IN").format(Math.round(n || 0));

export const fmtH = (h) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const ap = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return h12 + (mm ? ":" + String(mm).padStart(2, "0") : "") + " " + ap;
};

export const fmtDur = (m) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return ((h ? h + " h " : "") + (r ? r + " min" : "")).trim() || "0 min";
};

export const dkey = (d) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

export const parseKey = (k) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const nextDays = (n, from = new Date()) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    return d;
  });

export const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const smoothTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const fullDate = (key) =>
  parseKey(key).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
