import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { smoothTo } from "../lib.js";
import { goTo, useMedia, useScrollSpy } from "../hooks.js";
import { Icon } from "./Art.jsx";

const LINKS = [
  ["home", "Home"],
  ["about", "About us"],
  ["services", "Services"],
  ["work", "Gallery"],
  ["plans", "Pricing"],
  ["reviews", "Reviews"],
  ["contact", "Contact"],
];
const IDS = LINKS.map((l) => l[0]);

export default function Header({ settings }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const mobile = useMedia("(max-width: 1040px)");
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(IDS);
  useEffect(() => {
    if (!mobile) setOpen(false);
  }, [mobile]);
  useEffect(() => {
    if (!mobile || !open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobile, open]);
  const go = (id) => {
    setOpen(false);
    smoothTo(id);
  };
  const showNav = !mobile || open;

  return (
    <>
      <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
      <div className="ribbon">
        <div className="wrap lx-ribbon">
          <span>Demo preview &middot; sample content</span>
          <span>
            {settings.builtBy} <button type="button" onClick={() => goTo("admin")}>Open admin demo</button>
          </span>
        </div>
      </div>
      <header className="lx-head">
        <div className="wrap">
          <button className="lx-logo" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label={settings.brand + " home"}>
            <b>{settings.brand}</b>
            <small>{settings.suffix}</small>
          </button>
          <button className="lx-menu" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          <AnimatePresence initial={false}>
            {showNav && (
              <motion.nav
                key="nav"
                id="primary-navigation"
                className="lx-nav"
                aria-label="Main"
                initial={mobile ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="links">
                  {LINKS.map(([id, label]) => (
                    <button key={id} type="button" className="lnk" aria-current={active === id ? "true" : undefined} onClick={() => go(id)}>
                      {label}
                      {active === id && !mobile && <motion.i layoutId="nav-underline" className="ul" />}
                    </button>
                  ))}
                </div>
                <div className="acts">
                  <button type="button" className="lx-call" aria-label="Contact details" onClick={() => go("contact")}><Icon name="phone" size={18} /></button>
                  <button type="button" className="btn btn-primary lx-btn" onClick={() => go("book")}>Book now</button>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
