import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CATEGORIES } from "../content.js";
import { fmtDur, inr } from "../lib.js";
import Reveal from "./Reveal.jsx";

export default function Services({ services, sel, toggle, cat, setCat }) {
  const list = services.filter((s) => s.active && s.cat === cat);

  return (
    <section className="sec" id="menu">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Price menu</span>
          <h2>Pick what you need. We plan the time.</h2>
          <p className="lede">Add services and they carry straight into the booking form. Prices marked &ldquo;from&rdquo; depend on hair length and density.</p>
        </Reveal>

        <LayoutGroup id="svc-tabs">
          <div className="tabs" role="tablist" aria-label="Service categories">
            {CATEGORIES.map((c, i) => (
              <button key={c} type="button" role="tab" className="chip tab-chip" aria-selected={i === cat} onClick={() => setCat(i)}
                style={i === cat ? { background: "transparent", color: "var(--bg)", borderColor: "var(--ink)" } : undefined}>
                {i === cat && <motion.span layoutId="tab-bg" className="bg" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <motion.div className="svc-list" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((s) => {
              const on = sel.includes(s.id);
              return (
                <motion.div
                  key={s.id}
                  layout
                  className={"svc" + (on ? " sel" : "")}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28 }}
                  whileHover={{ y: -2 }}
                >
                  <h3>{s.name}</h3>
                  <p>{s.desc}</p>
                  <div className="meta">
                    <b>{s.from ? "from " : ""}{inr(s.price)}</b>
                    <span>{fmtDur(s.min)}</span>
                  </div>
                  <motion.button type="button" className="add" aria-pressed={on} onClick={() => toggle(s.id)} whileTap={{ scale: 0.94 }}>
                    {on ? "Added ✓" : "Add"}
                  </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {list.length === 0 && <p className="empty">No services in this category right now.</p>}
        </motion.div>
      </div>
    </section>
  );
}
