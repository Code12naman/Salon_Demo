import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQS, IMAGES, PLANS, REVIEWS, TEAM } from "../content.js";
import { inr, smoothTo } from "../lib.js";
import { Photo } from "./Art.jsx";
import Reveal from "./Reveal.jsx";

export function Team() {
  return (
    <section className="sec" id="team">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">The team</span>
          <h2>Four people, one standard.</h2>
        </Reveal>
        <div className="team">
          {TEAM.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <motion.article className="member" whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <div className="avatar" style={{ background: `linear-gradient(135deg, hsl(${t.hue} 55% 42%), hsl(${(t.hue + 40) % 360} 60% 30%))` }}>
                  {t.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <h3>{t.name}</h3>
                <div className="role">{t.role} &middot; {t.exp}</div>
                <p>{t.spec}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Plans() {
  return (
    <section className="sec alt" id="plans">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Plans</span>
          <h2>Look after it all year.</h2>
          <p className="lede">Prepaid plans for regulars, families and brides. Pay at the studio.</p>
        </Reveal>
        <div className="pk">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} style={{ display: "flex" }}>
              <motion.article className={"plan" + (p.hot ? " hot" : "")} style={{ flex: 1 }} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <Photo className="plan-photo" src={IMAGES.plans[i].src} alt={IMAGES.plans[i].alt} position={IMAGES.plans[i].position} />
                <h3>{p.name}</h3>
                <div className="price">{inr(p.price)} <small>{p.per}</small></div>
                <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
                <button type="button" className="btn btn-primary" onClick={() => smoothTo("book")}>Ask about this plan</button>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  const tags = ["All", ...new Set(REVIEWS.map((r) => r.tag))];
  const [cur, setCur] = useState("All");
  const list = REVIEWS.filter((r) => cur === "All" || r.tag === cur);
  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <div className="rv-top">
          <Reveal className="sec-head" style={{ margin: 0 }}>
            <span className="eyebrow">Kind words</span>
            <h2>What guests say</h2>
            <p className="fine">Sample testimonials for this demo. Replace with the client&rsquo;s real reviews before launch.</p>
          </Reveal>
          <div>
            <div className="score">4.9 <span className="stars" style={{ fontSize: "1.1rem" }}>&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>
            <span className="fine">Sample rating</span>
          </div>
        </div>
        <div className="tabs">
          {tags.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={t === cur} onClick={() => setCur(t)}>{t}</button>
          ))}
        </div>
        <motion.div className="rv-grid" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((r) => (
              <motion.article key={r.name} layout className="rv" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }}>
                <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p>{r.text}</p>
                <footer><b>{r.name}</b> &middot; {r.svc}</footer>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Good to know</span>
          <h2>Questions we hear often</h2>
        </Reveal>
        <div className="faq">
          {FAQS.map(([q, a], i) => {
            const on = open === i;
            return (
              <div className="qa" key={q}>
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
                  <span>{q}</span>
                  <motion.span className="pm" animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.2 }}>+</motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div className="ans" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}>
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
