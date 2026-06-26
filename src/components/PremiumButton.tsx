import React from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

export const PremiumButton = ({ children, onClick, className, type = "button" }: PremiumButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={type}
      className={cn(
        "premium-gradient text-black px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl studio-shadow transition-shadow hover:shadow-2xl flex items-center justify-center gap-2",
        className
      )}
    >
      {children}
    </motion.button>
  );
};
