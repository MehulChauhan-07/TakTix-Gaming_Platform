import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  threshold?: number;
  triggerOnce?: boolean;
  animation?: "fade" | "slide" | "scale";
  delay?: number;
}

export function ScrollAnimation({
  children,
  threshold = 0.1,
  triggerOnce = true,
  animation = "fade",
  delay = 0,
}: ScrollAnimationProps) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce,
  });

  const variants = {
    fade: {
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
      hidden: { opacity: 0, y: 20 },
    },
    scale: {
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay } },
      hidden: { opacity: 0, scale: 0.8 },
    },
    slide: {
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay } },
      hidden: { opacity: 0, x: -50 },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants[animation]}
    >
      {children}
    </motion.div>
  );
}
