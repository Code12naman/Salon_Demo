import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LEVELS } from "../content.js";
import { DAYS, fmtH, smoothTo } from "../lib.js";

function openStatus(hours) {
  const now = new Date();
  const d = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const today = hours[d];
  if (today && h >= today.o && h < today.c) return { on: true, text: "Open now · closes " + fmtH(today.c) };
  let nd = today && h < today.o ? d : (d + 1) % 7;
  let guard = 0;
  while (!hours[nd] && guard < 7) {
    nd = (nd + 1) % 7;
    guard++;
  }
  const nh = hours[nd];
  if (!nh) return { on: false, text: "Currently closed" };
  const when = nd === d ? "today" : nd === (d + 1) % 7 ? "tomorrow" : DAYS[nd];
  return { on: false, text: "Closed · opens " + when + " " + fmtH(nh.o) };
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } };
const rise = { hidden: { opacity: 0.2, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } } };

export default function Hero({ settings }) {
  const [cur, setCur] = useState(5);
  const status = useMemo(() => openStatus(settings.hours), [settings.hours]);
  const words = ["Your", "hair,", "finished", "properly."];

  return (
    <section className="sec hero" style={{ paddingBottom: 0 }}>
      <div className="wrap hero-grid">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={rise} className="status">
            <span className={"dot" + (status.on ? " on" : "")} />
            <span>{status.text}</span>
          </motion.span>
          <h1 aria-label="Your hair, finished properly.">
            {words.map((w, i) => (
              <motion.span key={w} variants={rise} className="w" aria-hidden="true">
                {i === 2 ? <em>{w}</em> : w}
              </motion.span>
            ))}
          </h1>
          <motion.p variants={rise} className="lede">{settings.tagline}</motion.p>
          <motion.div variants={rise} className="cta-row">
            <button type="button" className="btn btn-primary" onClick={() => smoothTo("book")}>Book a visit</button>
            <button type="button" className="btn btn-ghost" onClick={() => smoothTo("services")}>See services &amp; prices</button>
          </motion.div>
          <motion.div variants={rise} className="facts">
            <div><b>4.9</b><span>Average rating (sample)</span></div>
            <div><b>12+</b><span>Years of colour work</span></div>
            <div><b>10 AM&ndash;9 PM</b><span>Open most days</span></div>
          </motion.div>
        </motion.div>

        <motion.div
          className="ladder-card"
          initial={{ opacity: 0.2, y: 40, rotate: 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <span className="eyebrow">Find your level</span>
          <h3>Tap a shade to see what suits it</h3>
          <div className="ladder" role="group" aria-label="Hair colour levels">
            {LEVELS.map((l, i) => (
              <motion.button
                key={l[1]}
                type="button"
                aria-pressed={i === cur}
                aria-label={l[1]}
                onClick={() => setCur(i)}
                animate={{ flexGrow: i === cur ? 3.2 : 1 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                style={{ background: `linear-gradient(180deg, ${l[0]}, color-mix(in srgb, ${l[0]} 70%, #000))` }}
              >
                <span style={{ color: i < 6 ? "#fff" : "#2A1B22" }}>{i + 1}</span>
              </motion.button>
            ))}
          </div>
          <div className="lvl-out" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={cur} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <b>{LEVELS[cur][1]}</b>
                <p>{LEVELS[cur][2]}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
