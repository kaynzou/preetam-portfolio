"use client";

import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

// Honour the visitor's "reduce motion" OS setting for every Framer animation
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-ember via-gold to-ember shadow-[0_0_10px_rgba(240,136,74,0.6)]"
    />
  );
}
