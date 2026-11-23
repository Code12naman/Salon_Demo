import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { CATEGORIES, TEAM } from "../content.js";
import { deleteBooking, deleteService, getState, resetDemo, saveService, saveSettings, setBookingStatus, useStore } from "../store.js";
import { DAYS, dkey, fmtDur, fmtH, fullDate, inr, nextDays } from "../lib.js";
import { goTo } from "../hooks.js";

const TABS = ["Overview", "Bookings", "Services", "Settings"];
const stylistName = (id) => (id === "any" ? "Any available" : TEAM.find((t) => t.id === id)?.name || id);

function Num({ value, money }) {
  const mv = useMotionValue(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.8, ease: "easeOut", onUpdate: (x) => setV(x) });
    return () => c.stop();
  }, [value]);
  return <>{money ? inr(v) : Math.round(v)}</>;
}

function Gate({ pin, onOk }) {
  const [val, setVal] = useState("");
  const [bad, setBad] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (val === pin) onOk();
    else {
      setBad(true);
      setVal("");
    }
  };
  return (
    <div className="gate">
      <motion.form className="card" onSubmit={submit} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="eyebrow">Admin demo</span>
        <h2 style={{ fontSize: "2rem" }}>Sign in</h2>
        <p className="hint">This is a demo login. The PIN is <b>{pin}</b>. In production this becomes a real account login on your server.</p>
        <motion.div animate={bad ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
          <label className="f" htmlFor="pin">PIN
            <input id="pin" type="password" inputMode="numeric" autoFocus value={val} onChange={(e) => { setVal(e.target.value); setBad(false); }} placeholder="Enter PIN" />
            <span className="err">{bad ? "That PIN is not right." : ""}</span>
          </label>
        </motion.div>
        <button type="submit" className="btn btn-primary">Open dashboard</button>
        <button type="button" className="btn btn-ghost" onClick={() => goTo("")}>Back to website</button>
      </motion.form>
    </div>
  );
}

export default function Admin({ theme, onTheme }) {
  const settings = useStore("settings");
  const [authed, setAuthed] = useState(() => {
    try {
      return sessionStorage.getItem("doree-admin") === "1";
    } catch (e) {
      return false;
    }
  });
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState(null);
  const notify = (msg) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2000);
  };

  const ok = () => {
    try {
      sessionStorage.setItem("doree-admin", "1");
    } catch (e) {
      /* ignore */
    }
    setAuthed(true);
  };
  const out = () => {
    try {
      sessionStorage.removeItem("doree-admin");
    } catch (e) {
      /* ignore */
    }
    setAuthed(false);
    goTo("");
  };

  if (!authed) return <Gate pin={settings.pin} onOk={ok} />;

  return (
    <div className="adm">
      <div className="adm-top">
        <div className="wrap">
          <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>{settings.brand} admin</strong>
          <div className="adm-tabs" role="tablist" aria-label="Admin sections">
            {TABS.map((t, i) => (
              <button key={t} type="button" role="tab" className="chip" aria-selected={tab === i} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          <div className="sp">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => goTo("")}>View site</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={out}>Sign out</button>
          </div>
        </div>
      </div>
      <main className="wrap adm-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {tab === 0 && <Overview go={setTab} />}
            {tab === 1 && <Bookings notify={notify} />}
            {tab === 2 && <ServicesAdmin notify={notify} />}
            {tab === 3 && <SettingsAdmin notify={notify} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>{toast.msg}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Overview ---------------- */

function BookingLine({ b, services, notify, compact }) {
  const names = b.serviceIds.map((id) => services.find((s) => s.id === id)?.name || "Removed service").join(", ");
  return (
    <motion.div layout className="brow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
      <div className="nm"><b>{b.name}</b><span>{b.code} &middot; {b.phone}</span></div>
      <div className="sv"><b style={{ fontWeight: 600 }}>{names}</b><span>{stylistName(b.stylist)} &middot; {fmtDur(b.minutes)} &middot; {inr(b.total)}</span></div>
      <div className="nm"><b>{fmtH(b.time)}</b><span>{fullDate(b.date)}</span></div>
      <div className="acts">
        <span className={"pill " + b.status}>{b.status}</span>
        {!compact && <RowActions b={b} notify={notify} />}
      </div>
    </motion.div>
  );
}

function RowActions({ b, notify }) {
  const [sure, setSure] = useState(false);
  const set = (status, msg) => {
    setBookingStatus(b.id, status);
    notify(msg);
  };
  return (
    <>
      {b.status === "pending" && <button type="button" className="btn btn-primary btn-sm" onClick={() => set("confirmed", "Booking confirmed")}>Confirm</button>}
      {b.status === "confirmed" && <button type="button" className="btn btn-primary btn-sm" onClick={() => set("completed", "Marked completed")}>Complete</button>}
      {(b.status === "pending" || b.status === "confirmed") && <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("cancelled", "Booking cancelled")}>Cancel</button>}
      {(b.status === "cancelled" || b.status === "completed") && <button type="button" className="btn btn-ghost btn-sm" onClick={() => set("pending", "Booking reopened")}>Reopen</button>}
      {b.status === "cancelled" && (
        <button type="button" className="btn btn-danger btn-sm" onClick={() => (sure ? (deleteBooking(b.id), notify("Booking deleted")) : setSure(true))} onBlur={() => setSure(false)}>
          {sure ? "Really delete?" : "Delete"}
        </button>
      )}
    </>
  );
}

function Overview({ go }) {
  const bookings = useStore("bookings");
  const services = useStore("services");
  const todayKey = dkey(new Date());
  const live = bookings.filter((b) => b.status !== "cancelled");

  const stats = useMemo(() => {
    const today = live.filter((b) => b.date === todayKey).length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const earned = bookings.filter((b) => b.status === "completed").reduce((a, b) => a + b.total, 0);
    const expected = live.filter((b) => b.date >= todayKey && b.status !== "completed").reduce((a, b) => a + b.total, 0);
    return { today, pending, earned, expected };
  }, [bookings]);

  const week = nextDays(7).map((d) => ({ d, k: dkey(d), n: live.filter((b) => b.date === dkey(d)).length }));
  const max = Math.max(1, ...week.map((w) => w.n));
  const schedule = live.filter((b) => b.date === todayKey).sort((a, b) => a.time - b.time);
  const needs = bookings.filter((b) => b.status === "pending").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 4);

  return (
    <>
      <h1>Good day.</h1>
      <p className="lede">Here is what is happening at the studio. Bookings made on the website appear here instantly.</p>
      <div className="stats">
        <div className="stat"><span>Today&rsquo;s bookings</span><b><Num value={stats.today} /></b></div>
        <div className="stat"><span>Waiting for confirmation</span><b><Num value={stats.pending} /></b></div>
        <div className="stat"><span>Expected revenue</span><b><Num value={stats.expected} money /></b></div>
        <div className="stat"><span>Completed revenue</span><b><Num value={stats.earned} money /></b></div>
      </div>
      <div className="adm-grid">
        <div className="card">
          <h3>Next 7 days</h3>
          <div className="bars" role="img" aria-label={"Bookings per day: " + week.map((w) => w.d.toLocaleDateString("en-IN", { weekday: "short" }) + " " + w.n).join(", ")}>
            {week.map((w, i) => (
              <div key={w.k} className={"bar-col" + (i === 0 ? " today" : "")}>
                <div className="track"><motion.div className="fill" initial={{ height: 0 }} animate={{ height: (w.n / max) * 100 + "%" }} transition={{ duration: 0.6, delay: i * 0.05 }} /></div>
                <b style={{ color: "var(--ink)" }}>{w.n}</b>
                <span>{w.d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Needs your attention</h3>
          {needs.length === 0 && <p className="empty" style={{ marginTop: 12 }}>Nothing is waiting. Nice.</p>}
          {needs.map((b) => (
            <div className="line" key={b.id}>
              <span>{b.name}<br /><span className="fine">{fullDate(b.date)}, {fmtH(b.time)}</span></span>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setBookingStatus(b.id, "confirmed")}>Confirm</button>
            </div>
          ))}
          {needs.length > 0 && <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={() => go(1)}>Open all bookings</button>}
        </div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Today&rsquo;s schedule</h3>
        {schedule.length === 0 && <p className="empty" style={{ marginTop: 12 }}>No bookings today.</p>}
        {schedule.map((b) => <BookingLine key={b.id} b={b} services={services} notify={() => {}} compact />)}
      </div>
    </>
  );
}

/* ---------------- Bookings ---------------- */

function Bookings({ notify }) {
  const bookings = useStore("bookings");
  const services = useStore("services");
  const [filter, setFilter] = useState("upcoming");
  const [q, setQ] = useState("");
  const todayKey = dkey(new Date());

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let l = bookings.filter((b) => {
      if (filter === "upcoming") return b.date >= todayKey && b.status !== "cancelled" && b.status !== "completed";
      if (filter === "all") return true;
      return b.status === filter;
    });
    if (term) l = l.filter((b) => (b.name + b.code + b.phone).toLowerCase().includes(term));
    const key = (b) => b.date + String(b.time).padStart(5, "0");
    return l.sort((a, b) => (filter === "upcoming" ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a))));
  }, [bookings, filter, q]);

  const filters = [["upcoming", "Upcoming"], ["pending", "Pending"], ["confirmed", "Confirmed"], ["completed", "Completed"], ["cancelled", "Cancelled"], ["all", "All"]];

  return (
    <>
      <h1>Bookings</h1>
      <p className="lede">Confirm, complete or cancel appointments. Changes save instantly.</p>
      <div className="toolbar">
        {filters.map(([k, label]) => (
          <button key={k} type="button" className="chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>
        ))}
        <input type="text" placeholder="Search name, phone or code" aria-label="Search bookings" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="card" style={{ padding: "4px 24px" }}>
        <AnimatePresence initial={false}>
          {list.map((b) => <BookingLine key={b.id} b={b} services={services} notify={notify} />)}
        </AnimatePresence>
        {list.length === 0 && <p className="empty" style={{ padding: "24px 0" }}>No bookings match.</p>}
      </div>
    </>
  );
}

/* ---------------- Services ---------------- */

function ServiceModal({ svc, onClose, notify }) {
  const [f, setF] = useState(() => ({ name: "", cat: 0, desc: "", price: 500, min: 45, from: false, active: true, ...svc }));
  const [err, setErr] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  useEffect(() => {
    const on = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Give the service a name.");
    if (!(Number(f.price) >= 0)) return setErr("Enter a valid price.");
    if (!(Number(f.min) >= 5)) return setErr("Duration must be at least 5 minutes.");
    saveService({ ...f, id: f.id || "x" + Date.now(), name: f.name.trim(), desc: f.desc.trim(), price: Number(f.price), min: Number(f.min), cat: Number(f.cat) });
    notify(svc.id ? "Service updated" : "Service added");
    onClose();
  };
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.form className="modal" role="dialog" aria-modal="true" aria-label={svc.id ? "Edit service" : "Add service"} onSubmit={submit} initial={{ y: 40, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 320, damping: 28 }}>
        <h3>{svc.id ? "Edit service" : "Add a service"}</h3>
        <label className="f" htmlFor="sv-name">Name<input id="sv-name" type="text" autoFocus value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
        <label className="f" htmlFor="sv-cat">Category
          <select id="sv-cat" value={f.cat} onChange={(e) => set("cat", e.target.value)}>
            {CATEGORIES.map((c, i) => <option key={c} value={i}>{c}</option>)}
          </select>
        </label>
        <label className="f" htmlFor="sv-desc">Short description<input id="sv-desc" type="text" value={f.desc} onChange={(e) => set("desc", e.target.value)} /></label>
        <div className="fields">
          <label className="f" htmlFor="sv-price">Price (INR)<input id="sv-price" type="number" min="0" value={f.price} onChange={(e) => set("price", e.target.value)} /></label>
          <label className="f" htmlFor="sv-min">Duration (minutes)<input id="sv-min" type="number" min="5" step="5" value={f.min} onChange={(e) => set("min", e.target.value)} /></label>
        </div>
        <div className="checks">
          <label><input type="checkbox" checked={!!f.from} onChange={(e) => set("from", e.target.checked)} /> Show as &ldquo;from&rdquo; price</label>
          <label><input type="checkbox" checked={!!f.active} onChange={(e) => set("active", e.target.checked)} /> Visible on website</label>
        </div>
        <span className="err" role="alert">{err}</span>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save service</button>
        </div>
      </motion.form>
    </motion.div>
  );
}

function ServicesAdmin({ notify }) {
  const services = useStore("services");
  const [edit, setEdit] = useState(null);
  const [sure, setSure] = useState(null);
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "end" }}>
        <div><h1>Services</h1><p className="lede">Changes appear on the website straight away.</p></div>
        <button type="button" className="btn btn-primary" onClick={() => setEdit({})}>Add service</button>
      </div>
      {CATEGORIES.map((c, ci) => (
        <div key={c} className="card" style={{ marginTop: 16, padding: "20px 24px" }}>
          <h3 style={{ fontSize: "1.2rem" }}>{c}</h3>
          <AnimatePresence initial={false}>
            {services.filter((s) => s.cat === ci).map((s) => (
              <motion.div layout key={s.id} className="brow" style={{ gridTemplateColumns: "1.6fr 1fr auto" }} initial={{ opacity: 0 }} animate={{ opacity: s.active ? 1 : 0.55 }} exit={{ opacity: 0, height: 0 }}>
                <div className="nm"><b>{s.name}</b><span>{s.desc}</span></div>
                <div className="nm"><b>{s.from ? "from " : ""}{inr(s.price)}</b><span>{fmtDur(s.min)}</span></div>
                <div className="acts">
                  <button type="button" className="chip" aria-pressed={s.active} onClick={() => saveService({ id: s.id, active: !s.active })}>{s.active ? "Visible" : "Hidden"}</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEdit(s)}>Edit</button>
                  <button type="button" className="btn btn-danger btn-sm" onBlur={() => setSure(null)} onClick={() => (sure === s.id ? (deleteService(s.id), notify("Service deleted"), setSure(null)) : setSure(s.id))}>
                    {sure === s.id ? "Really delete?" : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ))}
      <AnimatePresence>{edit && <ServiceModal key={edit.id || "new"} svc={edit} onClose={() => setEdit(null)} notify={notify} />}</AnimatePresence>
    </>
  );
}

/* ---------------- Settings ---------------- */

const HOUR_OPTS = Array.from({ length: 37 }, (_, i) => 6 + i * 0.5);

function SettingsAdmin({ notify }) {
  const settings = useStore("settings");
  const [f, setF] = useState(settings);
  const [sure, setSure] = useState(false);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const setDay = (i, v) => setF((x) => ({ ...x, hours: x.hours.map((h, j) => (j === i ? v : h)) }));
  const save = (e) => {
    e.preventDefault();
    saveSettings({ ...f, pin: (f.pin || "").trim() || "1234" });
    notify("Settings saved");
  };
  return (
    <>
      <h1>Settings</h1>
      <p className="lede">Studio details and opening hours shown on the website.</p>
      <form className="card" style={{ marginTop: 20 }} onSubmit={save}>
        <div className="fields">
          <label className="f" htmlFor="st-brand">Brand name<input id="st-brand" type="text" value={f.brand} onChange={(e) => set("brand", e.target.value)} /></label>
          <label className="f" htmlFor="st-suffix">Brand suffix<input id="st-suffix" type="text" value={f.suffix} onChange={(e) => set("suffix", e.target.value)} /></label>
          <label className="f full" htmlFor="st-tag">Homepage tagline<textarea id="st-tag" value={f.tagline} onChange={(e) => set("tagline", e.target.value)} /></label>
          <label className="f" htmlFor="st-phone">Phone<input id="st-phone" type="text" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
          <label className="f" htmlFor="st-wa">WhatsApp number (digits only)<input id="st-wa" type="text" value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} /></label>
          <label className="f full" htmlFor="st-addr">Address<input id="st-addr" type="text" value={f.address} onChange={(e) => set("address", e.target.value)} /></label>
          <label className="f" htmlFor="st-map">Map search text<input id="st-map" type="text" value={f.mapQuery} onChange={(e) => set("mapQuery", e.target.value)} /></label>
          <label className="f" htmlFor="st-pin">Admin PIN<input id="st-pin" type="text" inputMode="numeric" value={f.pin} onChange={(e) => set("pin", e.target.value)} /></label>
        </div>
        <h3 style={{ margin: "28px 0 8px", fontSize: "1.2rem" }}>Opening hours</h3>
        {DAYS.map((d, i) => {
          const h = f.hours[i];
          return (
            <div className="hr-row" key={d}>
              <b>{d}</b>
              <select aria-label={d + " opens"} disabled={!h} value={h ? h.o : 10} onChange={(e) => setDay(i, { ...h, o: Number(e.target.value) })}>
                {HOUR_OPTS.map((o) => <option key={o} value={o}>{fmtH(o)}</option>)}
              </select>
              <select aria-label={d + " closes"} disabled={!h} value={h ? h.c : 21} onChange={(e) => setDay(i, { ...h, c: Number(e.target.value) })}>
                {HOUR_OPTS.map((o) => <option key={o} value={o}>{fmtH(o)}</option>)}
              </select>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 600, fontSize: ".9rem" }}>
                <input type="checkbox" checked={!h} onChange={(e) => setDay(i, e.target.checked ? null : { o: 10, c: 21 })} /> Closed
              </label>
            </div>
          );
        })}
        <div className="row" style={{ marginTop: 22 }}>
          <button type="submit" className="btn btn-primary">Save settings</button>
        </div>
      </form>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: "1.2rem" }}>Demo data</h3>
        <p className="hint" style={{ margin: "6px 0 14px" }}>Restore the sample services, settings and bookings. Useful before showing the demo to a new client.</p>
        <button type="button" className="btn btn-danger" onBlur={() => setSure(false)} onClick={() => { if (sure) { resetDemo(); setF(getFresh()); setSure(false); notify("Demo data restored"); } else setSure(true); }}>
          {sure ? "Really reset everything?" : "Reset demo data"}
        </button>
      </div>
    </>
  );
}

// After a reset the store holds fresh settings; read them back for the form.
const getFresh = () => getState().settings;
