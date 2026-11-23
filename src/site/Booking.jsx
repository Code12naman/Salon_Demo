import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORIES, TEAM } from "../content.js";
import { addBooking, priceOf, slotTaken } from "../store.js";
import { dkey, fmtDur, fmtH, fullDate, inr, nextDays, parseKey } from "../lib.js";
import Reveal from "./Reveal.jsx";

const STEPS = ["Services", "Time", "Details", "Review"];
const STYLISTS = [{ id: "any", name: "Any available" }, ...TEAM.map((t) => ({ id: t.id, name: t.name }))];
const slide = {
  enter: (d) => ({ opacity: 0, x: d * 36 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -36 }),
};

const digits = (s) => s.replace(/\D/g, "");

export default function Booking({ services, settings, bookings, chosen, toggle, clear, notify }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [stylist, setStylist] = useState("any");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(null);

  const { total, minutes } = useMemo(() => priceOf(services, chosen), [services, chosen]);
  const days = useMemo(() => nextDays(14), []);

  const slots = useMemo(() => {
    if (!date) return [];
    const hr = settings.hours[parseKey(date).getDay()];
    if (!hr) return [];
    const need = Math.max(minutes, 30) / 60;
    const now = new Date();
    const isToday = dkey(now) === date;
    const nowH = now.getHours() + now.getMinutes() / 60 + 0.5;
    const out = [];
    for (let t = hr.o; t <= hr.c - need + 1e-9; t += 0.5) {
      out.push({ t, off: (isToday && t < nowH) || slotTaken(bookings, date, stylist, t, minutes) });
    }
    return out;
  }, [date, stylist, minutes, bookings, settings.hours]);

  // Drop a chosen time that is no longer free (for example after adding a longer service).
  useEffect(() => {
    if (time !== null && !slots.some((s) => s.t === time && !s.off)) setTime(null);
  }, [slots, time]);

  const nameOk = name.trim().length > 1;
  const phoneOk = digits(phone).length >= 10;
  const valid = [chosen.length > 0, date !== null && time !== null, nameOk && phoneOk, true];
  const reason = [
    "Add at least one service to continue.",
    "Pick a date and a time to continue.",
    "Enter your name and a 10-digit mobile number.",
    "",
  ][step];

  const go = (n) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const next = () => {
    if (!valid[step]) {
      setTouched(true);
      return;
    }
    go(step + 1);
  };

  const confirm = () => {
    const b = addBooking({ name, phone, note, serviceIds: chosen, stylist, date, time });
    setDone(b);
    notify("Booking sent to the admin dashboard");
  };

  const reset = () => {
    setDone(null);
    setStep(0);
    setDir(1);
    setDate(null);
    setTime(null);
    setName("");
    setPhone("");
    setNote("");
    setTouched(false);
    clear();
  };

  const stylistName = STYLISTS.find((s) => s.id === stylist)?.name;
  const when = date && time !== null ? fullDate(date) + ", " + fmtH(time) : null;

  return (
    <section className="sec alt" id="book">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Book</span>
          <h2>Reserve your chair in a minute.</h2>
          <p className="lede">Four quick steps. This demo saves the booking to the admin dashboard in your browser and sends nothing to a real salon.</p>
        </Reveal>

        <div className="book-grid">
          <div className="card">
            {done ? (
              <motion.div className="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <motion.div className="tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.45 }} />
                  </svg>
                </motion.div>
                <h3>You are booked in</h3>
                <p className="lede">Thank you, {done.name}. We will see you on {fullDate(done.date)} at {fmtH(done.time)}.</p>
                <div className="code">{done.code}</div>
                <p className="hint">{done.serviceIds.length} service{done.serviceIds.length > 1 ? "s" : ""} &middot; {fmtDur(done.minutes)} &middot; about {inr(done.total)}</p>
                <div className="row" style={{ justifyContent: "center" }}>
                  <a className="btn btn-primary" target="_blank" rel="noopener" href={"https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent("Hi, booking " + done.code + " for " + fullDate(done.date) + " at " + fmtH(done.time))}>Share on WhatsApp</a>
                  <button type="button" className="btn btn-ghost" onClick={reset}>Book another</button>
                </div>
                <p className="fine">Demo only. Open the admin demo from the top bar to see this booking arrive.</p>
              </motion.div>
            ) : (
              <>
                <div className="stepper" role="list" aria-label="Booking steps">
                  {STEPS.map((s, i) => (
                    <div key={s} role="listitem" className={"st" + (i <= step ? " on" : "")} aria-current={i === step ? "step" : undefined}>
                      <i><motion.b initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.4 }} /></i>
                      <span>{i + 1}. {s}</span>
                    </div>
                  ))}
                </div>

                <div className="step-body">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                      {step === 0 && (
                        <>
                          <h3>What would you like done?</h3>
                          {CATEGORIES.map((c, ci) => (
                            <div key={c}>
                              <div className="group-label">{c}</div>
                              <div className="pick">
                                {services.filter((s) => s.active && s.cat === ci).map((s) => (
                                  <button key={s.id} type="button" className="chip" aria-pressed={chosen.includes(s.id)} onClick={() => toggle(s.id)}>
                                    {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <h3>Choose your stylist, day and time</h3>
                          <div className="pick" role="group" aria-label="Stylist">
                            {STYLISTS.map((s) => (
                              <button key={s.id} type="button" className="chip" aria-pressed={stylist === s.id} onClick={() => setStylist(s.id)}>{s.name}</button>
                            ))}
                          </div>
                          <div className="group-label">Date</div>
                          <div className="dates">
                            {days.map((d) => {
                              const k = dkey(d);
                              return (
                                <motion.button key={k} type="button" className="date" aria-pressed={date === k} disabled={!settings.hours[d.getDay()]} onClick={() => { setDate(k); setTime(null); }} whileTap={{ scale: 0.94 }}>
                                  <small>{d.toLocaleDateString("en-IN", { weekday: "short" })}</small>
                                  <b>{d.getDate()}</b>
                                  <small>{d.toLocaleDateString("en-IN", { month: "short" })}</small>
                                </motion.button>
                              );
                            })}
                          </div>
                          <div className="group-label">Time {minutes ? "(fits " + fmtDur(minutes) + ")" : ""}</div>
                          {!date && <p className="empty">Pick a date to see open times.</p>}
                          {date && slots.length === 0 && <p className="empty">No times on this day. Try another date.</p>}
                          <div className="slots">
                            {slots.map((s) => (
                              <motion.button key={s.t} type="button" className="slot" aria-pressed={time === s.t} disabled={s.off} onClick={() => setTime(s.t)} whileTap={{ scale: 0.94 }}>
                                {fmtH(s.t)}
                              </motion.button>
                            ))}
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <>
                          <h3>Your details</h3>
                          <div className="fields">
                            <label className="f" htmlFor="fName">Full name
                              <input id="fName" type="text" autoComplete="name" placeholder="Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} />
                              <span className="err">{touched && !nameOk ? "Please enter your name." : ""}</span>
                            </label>
                            <label className="f" htmlFor="fPhone">Mobile number
                              <input id="fPhone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                              <span className="err">{touched && !phoneOk ? "Enter a 10-digit mobile number." : ""}</span>
                            </label>
                            <label className="f full" htmlFor="fNote">Notes (optional)
                              <textarea id="fNote" placeholder="Reference photo, allergies, anything we should know" value={note} onChange={(e) => setNote(e.target.value)} />
                            </label>
                          </div>
                        </>
                      )}

                      {step === 3 && (
                        <>
                          <h3>Check and confirm</h3>
                          <div className="line"><span>Services</span><span>{chosen.map((id) => services.find((s) => s.id === id)?.name).join(", ")}</span></div>
                          <div className="line"><span>Stylist</span><span>{stylistName}</span></div>
                          <div className="line"><span>When</span><span>{when}</span></div>
                          <div className="line"><span>Name</span><span>{name}</span></div>
                          <div className="line"><span>Mobile</span><span>{phone}</span></div>
                          {note && <div className="line"><span>Notes</span><span>{note}</span></div>}
                          <p className="hint" style={{ marginTop: 14 }}>Pay at the studio. Final price is confirmed after your consultation.</p>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="nav-row">
                  <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => go(step - 1)}>Back</button>
                  <span className="hint" role="status">{!valid[step] && touched ? reason : ""}</span>
                  {step < 3 ? (
                    <button type="button" className="btn btn-primary" aria-disabled={!valid[step]} style={!valid[step] ? { opacity: 0.55 } : undefined} onClick={next}>Continue</button>
                  ) : (
                    <motion.button type="button" className="btn btn-primary" onClick={confirm} whileTap={{ scale: 0.96 }}>Confirm booking</motion.button>
                  )}
                </div>
              </>
            )}
          </div>

          {!done && (
            <aside className="card summary" aria-label="Booking summary">
              <h3>Your booking</h3>
              {chosen.length === 0 && !date ? (
                <p className="empty">Your choices appear here as you go.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {chosen.map((id) => {
                    const s = services.find((x) => x.id === id);
                    return s ? (
                      <motion.div key={id} className="line" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                        <span>{s.name}</span><span>{s.from ? "from " : ""}{inr(s.price)}</span>
                      </motion.div>
                    ) : null;
                  })}
                </AnimatePresence>
              )}
              {chosen.length > 0 && <div className="line"><span>Time needed</span><span>{fmtDur(minutes)}</span></div>}
              {chosen.length > 0 && <div className="line"><span>Stylist</span><span>{stylistName}</span></div>}
              {when && <div className="line"><span>When</span><span>{when}</span></div>}
              <div className="total"><span>Estimated total</span><b>{inr(total)}</b></div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
