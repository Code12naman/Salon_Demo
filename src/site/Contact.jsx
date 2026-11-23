import { useRef } from "react";
import { IMAGES } from "../content.js";
import { DAYS, fmtH } from "../lib.js";
import { Photo } from "./Art.jsx";
import Reveal from "./Reveal.jsx";

export default function Contact({ settings, notify }) {
  const phoneRef = useRef(null);
  const today = new Date().getDay();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(settings.phone);
      notify("Number copied");
    } catch (e) {
      // Some embedded views block clipboard access: select the text instead.
      const r = document.createRange();
      r.selectNodeContents(phoneRef.current);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      notify("Number selected. Copy it now.");
    }
  };

  return (
    <section className="sec alt" id="contact">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Visit</span>
          <h2>Find us.</h2>
        </Reveal>
        <div className="contact-grid">
          <Reveal className="card">
            <h3 style={{ marginBottom: 10 }}>Address</h3>
            <p className="lede" style={{ fontSize: "1rem" }}>{settings.address}</p>
            <div className="row">
              <a className="btn btn-ghost" target="_blank" rel="noopener" href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(settings.mapQuery)}>Open in Google Maps</a>
            </div>
            <h3 style={{ margin: "28px 0 6px" }}>Call or message</h3>
            <p ref={phoneRef} style={{ fontSize: "1.3rem", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{settings.phone}</p>
            <div className="row">
              <button type="button" className="btn btn-ghost" onClick={copy}>Copy number</button>
              <a className="btn btn-primary" target="_blank" rel="noopener" href={"https://wa.me/" + settings.whatsapp + "?text=" + encodeURIComponent("Hi " + settings.brand + ", I would like to book an appointment.")}>WhatsApp us</a>
            </div>
          </Reveal>
          <Reveal className="card" delay={0.1}>
            <h3 style={{ marginBottom: 10 }}>Opening hours</h3>
            <table className="hours">
              <tbody>
                {DAYS.map((n, i) => {
                  const x = settings.hours[i];
                  return (
                    <tr key={n} className={i === today ? "today" : ""}>
                      <td>{n}</td>
                      <td>{x ? fmtH(x.o) + " – " + fmtH(x.c) : "Closed"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Photo className="map" src={IMAGES.reception.src} alt={IMAGES.reception.alt} position={IMAGES.reception.position}>
              <span className="chip">{settings.mapQuery}</span>
            </Photo>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
