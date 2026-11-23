import { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { ABOUT_POINTS, BRANDS, CARDS, IMAGES, STATS } from "../content.js";
import { DAYS, fmtH, smoothTo } from "../lib.js";
import { Icon, Photo } from "./Art.jsx";
import Reveal from "./Reveal.jsx";

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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const rise = { hidden: { opacity: 0.15, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] } } };

export function Hero({ settings }) {
  const status = useMemo(() => openStatus(settings.hours), [settings.hours]);
  return (
    <section className="lx-hero" id="home">
      <motion.div className="lx-hero-art" initial={{ opacity: 0.2, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}>
        <Photo
          src={IMAGES.hero.src}
          alt={IMAGES.hero.alt}
          position={IMAGES.hero.position}
          loading="eager"
          fetchpriority="high"
        />
      </motion.div>
      <div className="wrap">
        <motion.div className="lx-hero-copy" variants={container} initial="hidden" animate="show">
          <motion.div variants={rise} className="lx-eyebrow">Expert stylists, exceptional you</motion.div>
          <h1 className="lx-h1" aria-label="Your Hair. Your Style. Your Confidence.">
            <motion.span variants={rise} className="ln" aria-hidden="true">Your Hair.</motion.span>
            <motion.span variants={rise} className="ln" aria-hidden="true">Your Style.</motion.span>
            <motion.span variants={rise} className="ln" aria-hidden="true">Your <em>Confidence.</em></motion.span>
          </h1>
          <motion.p variants={rise} className="lx-lede">{settings.tagline}</motion.p>
          <motion.div variants={rise} className="lx-cta">
            <button type="button" className="btn btn-primary lx-btn" onClick={() => smoothTo("book")}>Book appointment <Icon name="arrow" size={16} /></button>
            <button type="button" className="btn btn-ghost lx-btn" onClick={() => smoothTo("menu")}>Our services</button>
          </motion.div>
          <motion.div variants={rise} className="lx-proof">
            <div className="faces" aria-hidden="true">
              {["P", "R", "S", "A"].map((c, i) => <span key={c} style={{ background: `linear-gradient(135deg, hsl(${30 + i * 8} 45% 42%), hsl(${20 + i * 8} 50% 24%))` }}>{c}</span>)}
            </div>
            <div>
              <div className="stars" aria-label="Rated 4.9 out of 5">&#9733;&#9733;&#9733;&#9733;&#9733; <b>4.9</b></div>
              <span className="fine">Sample rating &middot; demo content</span>
            </div>
          </motion.div>
          <motion.div variants={rise} className="lx-status">
            <span className={"dot" + (status.on ? " on" : "")} /> {status.text}
          </motion.div>
        </motion.div>
        <button type="button" className="lx-story" onClick={() => smoothTo("about")} aria-label="Meet the studio">
          <span className="ring"><Icon name="down" size={20} /></span>
          <span>Meet our<br /><b>salon story</b></span>
        </button>
      </div>
    </section>
  );
}

function Count({ to, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Stats() {
  return (
    <div className="wrap lx-stats-wrap">
      <Reveal>
        <div className="lx-stats">
          {STATS.map((s) => (
            <div className="lx-stat" key={s.label}>
              <Icon name={s.icon} size={34} stroke={1.2} className="ico" />
              <div>
                <b><Count to={s.to} suffix={s.suffix} /></b>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export function ServiceCards({ onExplore }) {
  return (
    <section className="sec" id="services">
      <div className="wrap">
        <Reveal className="lx-sec-head">
          <div>
            <span className="lx-eyebrow sm">Our services</span>
            <h2>Beauty. Care. Expertise.</h2>
          </div>
          <button type="button" className="btn btn-ghost lx-btn" onClick={() => smoothTo("menu")}>View all services <Icon name="arrow" size={16} /></button>
        </Reveal>
        <div className="lx-cards">
          {CARDS.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.07} className="lx-card-wrap">
              <motion.article className="lx-card" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                <div className="pic-wrap">
                  <Photo
                    className="pic"
                    src={IMAGES.cards[i].src}
                    alt={IMAGES.cards[i].alt}
                    position={IMAGES.cards[i].position}
                  />
                  <div className="badge"><Icon name={c.icon} size={22} /></div>
                </div>
                <div className="body">
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                  <button type="button" className="explore" onClick={() => onExplore(c.cat)}>Explore <Icon name="arrow" size={14} /></button>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="sec" id="about" style={{ paddingTop: 0 }}>
      <div className="wrap lx-about">
        <Reveal>
          <Photo className="lx-salon" src={IMAGES.salon.src} alt={IMAGES.salon.alt} position={IMAGES.salon.position} />
        </Reveal>
        <Reveal delay={0.1} className="lx-about-copy">
          <span className="lx-eyebrow sm">About us</span>
          <h2>Where Passion<br />Meets Perfection</h2>
          <p className="lx-lede">We believe every client deserves personalised care and a look that brings out their best. Our stylists combine creativity, technique and premium products to deliver excellence on every visit.</p>
          <div className="lx-points">
            {ABOUT_POINTS.map((p) => (
              <div key={p.t}><Icon name={p.icon} size={24} stroke={1.3} /><span>{p.t}</span></div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost lx-btn" onClick={() => smoothTo("team")}>Know more about us <Icon name="arrow" size={16} /></button>
        </Reveal>
      </div>
    </section>
  );
}

export function Brands() {
  return (
    <section className="lx-brands-sec">
      <div className="wrap">
        <p className="lx-brands-label">Premium brands we use &middot; sample names, replace with the salon&rsquo;s real brands</p>
        <Reveal className="lx-brands">
          {BRANDS.map((b) => (
            <div key={b.n} className={"lx-brand " + b.cls}>
              <span>{b.n}</span>
              {b.s && <small>{b.s}</small>}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="sec" style={{ paddingBlock: "clamp(32px,5vw,56px)" }}>
      <div className="wrap">
        <Reveal>
          <div className="lx-cta-banner">
            <div className="ring"><Icon name="calendar" size={38} stroke={1.2} /></div>
            <h2>Ready for<br />a new you?</h2>
            <div className="mid">
              <p>Book your appointment today and let our experts create the perfect look for you.</p>
              <button type="button" className="btn btn-primary lx-btn" onClick={() => smoothTo("book")}>Book appointment <Icon name="arrow" size={16} /></button>
            </div>
            <ul>
              <li><Icon name="check" size={20} /> Easy booking</li>
              <li><Icon name="clock" size={20} /> Flexible scheduling</li>
              <li><Icon name="user" size={20} /> Expert stylists</li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
