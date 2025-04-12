import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  players: string;
  href: string;
  disabled?: boolean;
}

// Enhanced Game Card with hover effects
export function EnhancedGameCard({
  title,
  description,
  image,
  players,
  href,
  disabled = false,
}: GameCardProps) {
  return (
    <motion.div
      className="bg-card overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-48 w-full group">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!disabled && (
          <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <Button variant="secondary" size="sm" asChild>
              <Link to={href}>Play Now</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none">
            {players}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <Button asChild className="w-full" disabled={disabled}>
          <Link to={disabled ? "#" : href}>
            {disabled ? "Coming Soon" : "Play Now"}
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

// Update Card Component for Latest Updates section
export function UpdateCard({
  title,
  date,
  description,
}: {
  title: string;
  date: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-card p-6 rounded-lg border hover:border-primary/50 transition-colors"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <p className="text-sm text-muted-foreground mb-2 font-medium">{date}</p>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 line-clamp-3">{description}</p>
      <Button
        variant="link"
        className="p-0 h-auto flex items-center gap-1 hover:gap-2 transition-all"
      >
        Read More <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-card p-6 rounded-lg shadow-sm border border-border hover:border-primary/50 transition-all"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
