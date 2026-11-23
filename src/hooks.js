import { useEffect, useState } from "react";

export function useMedia(query) {
  const get = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false);
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

// Routes are plain hash names: "" is the website, "admin" is the dashboard.
export function useRoute() {
  const read = () => (typeof location !== "undefined" ? location.hash.replace("#", "") : "");
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

// Setting the hash fires a native hashchange event, which useRoute listens for.
export const goTo = (route) => {
  location.hash = route || "";
};

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem("aurelle-theme");
      if (t === "light" || t === "dark") return t;
    } catch (e) {
      /* ignore */
    }
    return null;
  });
  useEffect(() => {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggle = () => {
    const current = theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("aurelle-theme", next);
    } catch (e) {
      /* ignore */
    }
  };
  const effective = theme || (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return [effective, toggle];
}

// Returns the id of the section currently in the middle of the screen.
export function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}
