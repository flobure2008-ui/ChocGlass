import React from 'react';
import { motion } from 'framer-motion';

export function LiquidGlassCard({
  children,
  className = '',
  theme = 'liquid',
  onClick,
  hover = true,
  glow = false,
}) {
  const getThemeClass = () => {
    switch (theme) {
      case 'chocolate':
        return 'liquid-glass-chocolate';
      case 'neon':
        return 'bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-pink-950/40 border border-purple-500/30 shadow-neon-glow backdrop-blur-2xl';
      case 'silk':
        return 'bg-white/20 dark:bg-white/10 border border-white/30 backdrop-blur-3xl shadow-glass';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-cyan-950/40 border border-emerald-500/30 backdrop-blur-2xl';
      case 'liquid':
      default:
        return 'liquid-glass';
    }
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.015, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`relative rounded-[32px] p-5 overflow-hidden transition-all duration-300 ${getThemeClass()} ${
        glow ? 'shadow-glass-glow' : ''
      } ${className}`}
    >
      {/* Specular high-gloss sheen reflection */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-2xl transform rotate-45 opacity-60" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
