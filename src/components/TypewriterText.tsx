"use client";

import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.032 } },
};

const character = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export function TypewriterText({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="whitespace-pre-wrap"
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        {Array.from(text, (char, index) => (
          <motion.span key={`${index}-${char}`} variants={character}>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </>
  );
}