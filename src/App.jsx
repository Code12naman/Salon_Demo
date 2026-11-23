import { MotionConfig } from "framer-motion";
import Site from "./site/Site.jsx";
import Admin from "./admin/Admin.jsx";
import { useRoute } from "./hooks.js";

export default function App() {
  const route = useRoute();
  return (
    // reducedMotion="user" makes every Framer Motion animation respect the OS setting.
    <MotionConfig reducedMotion="user">{route === "admin" ? <Admin /> : <Site />}</MotionConfig>
  );
}
