import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IMAGES, LOOKS } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Work() {
  const [cur, setCur] = useState(0);
  const [pos, setPos] = useState(50);
  const look = LOOKS[cur];
  const images = IMAGES.gallery[cur];

  return (
    <section className="sec alt" id="work">
      <div className="wrap work-grid">
        <Reveal>
          <div className="cmp" style={{ "--pos": pos + "%" }}>
            <AnimatePresence initial={false}>
              <motion.div key={"b" + cur} className="layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <img src={images.before.src} alt={images.before.alt} loading="lazy" decoding="async" />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence initial={false}>
              <motion.div key={"a" + cur} className="layer after" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <img src={images.after.src} alt={images.after.alt} loading="lazy" decoding="async" />
              </motion.div>
            </AnimatePresence>
            <span className="tag l">Before</span>
            <span className="tag r">After</span>
            <div className="bar" />
            <div className="knob" aria-hidden="true">&#8596;</div>
            <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Drag to compare before and after" />
          </div>
          <p className="fine" style={{ marginTop: 14 }}>Illustrative stock photos for the demo. Replace with the salon&rsquo;s own transformation photos before launch.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <span className="eyebrow">Our work</span>
          <h2 style={{ margin: "12px 0 14px" }}>Drag. Compare. Decide.</h2>
          <div className="looks" role="group" aria-label="Choose a look">
            {LOOKS.map((l, i) => (
              <motion.button key={l.n} type="button" className="chip" aria-pressed={i === cur} onClick={() => { setCur(i); setPos(50); }} whileTap={{ scale: 0.95 }}>
                {l.n}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={cur} className="look-note" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {look.note}
            </motion.p>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
