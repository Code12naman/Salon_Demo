import { motion } from "framer-motion";

// Fades and lifts content in as it scrolls into view. It starts partly visible
// so the page is readable even before the animation runs.
export default function Reveal({ children, delay = 0, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0.35, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
