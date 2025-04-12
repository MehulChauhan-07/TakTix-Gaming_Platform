import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedPageProps {
  children: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function AnimatedPage({ children }: AnimatedPageProps) {
  // This assumes children are direct elements that need animation
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

// Animation components for individual elements
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) => {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: -20 },
    right: { x: 20 },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

// For lists
export const StaggerContainer = ({
  children,
  delayChildren = 0,
  staggerTime = 0.1,
}: {
  children: ReactNode;
  delayChildren?: number;
  staggerTime?: number;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            delayChildren,
            staggerChildren: staggerTime,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
};
