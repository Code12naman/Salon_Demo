import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useStore, priceOf } from "../store.js";
import { goTo } from "../hooks.js";
import { inr, smoothTo } from "../lib.js";
import Header from "./Header.jsx";
import { About, Brands, CtaBanner, Hero, ServiceCards, Stats } from "./Luxe.jsx";
import Services from "./Services.jsx";
import Work from "./Work.jsx";
import { Faq, Plans, Reviews, Team } from "./Sections.jsx";
import Booking from "./Booking.jsx";
import Contact from "./Contact.jsx";

export default function Site() {
  const services = useStore("services");
  const settings = useStore("settings");
  const bookings = useStore("bookings");

  const [sel, setSel] = useState([]);
  const [menuCat, setMenuCat] = useState(0);
  const [toast, setToast] = useState(null);
  const bookRef = useRef(null);
  const bookInView = useInView(bookRef, { amount: 0.15 });

  // Only keep services that still exist and are active (the admin can switch them off).
  const chosen = useMemo(() => sel.filter((id) => services.some((s) => s.id === id && s.active)), [sel, services]);
  const { total } = useMemo(() => priceOf(services, chosen), [services, chosen]);

  const toggle = useCallback((id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])), []);
  const clear = useCallback(() => setSel([]), []);
  const notify = useCallback((msg) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2200);
  }, []);
  const explore = useCallback((cat) => {
    setMenuCat(cat);
    smoothTo("menu");
  }, []);

  return (
    <>
      <Header settings={settings} />
      <main>
        <Hero settings={settings} />
        <Stats />
        <ServiceCards onExplore={explore} />
        <About />
        <Services services={services} sel={chosen} toggle={toggle} cat={menuCat} setCat={setMenuCat} />
        <Work />
        <Team />
        <Plans />
        <Reviews />
        <Brands />
        <CtaBanner />
        <div ref={bookRef}>
          <Booking services={services} settings={settings} bookings={bookings} chosen={chosen} toggle={toggle} clear={clear} notify={notify} />
        </div>
        <Faq />
        <Contact settings={settings} notify={notify} />
      </main>
      <footer className="site">
        <div className="wrap">
          <span>&copy; {new Date().getFullYear()} {settings.brand} {settings.suffix}</span>
          <span>Demo site &middot; all content is sample content &middot; <button type="button" onClick={() => goTo("admin")}>Admin login</button></span>
        </div>
      </footer>

      <AnimatePresence>
        {chosen.length > 0 && !bookInView && (
          <motion.div className="cartbar" initial={{ y: 90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 90, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
            <button type="button" onClick={() => smoothTo("book")}>
              <span>{chosen.length} {chosen.length === 1 ? "service" : "services"} &middot; {inr(total)}</span>
              <span className="go">Book now</span>
            </button>
          </motion.div>
        )}
        {toast && (
          <motion.div key={toast.id} className="toast" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
