import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Disc3, Music2 } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

export function MediaDeck({
  media,
  onMediaAction,
  theme,
  onSoundPop,
}) {
  const isPlaying = media?.isPlaying;

  return (
    <LiquidGlassCard theme={theme} className="w-full">
      <div className="flex items-center gap-4">
        {/* Animated Spinning Vinyl */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 4,
              ease: 'linear',
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-950 border border-white/20 shadow-xl flex items-center justify-center p-1.5"
          >
            {/* Vinyl grooves */}
            <div className="w-full h-full rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-inner">
                <Disc3 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Glowing pulse indicator */}
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-pink-500" />
            </span>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-white/50 mb-0.5">
            <Music2 className="w-3 h-3 text-purple-400" />
            <span className="uppercase tracking-wider font-semibold">Musique PC</span>
          </div>
          <h4 className="text-sm font-bold text-white truncate">
            {media?.title || 'Aucun morceau en cours'}
          </h4>
          <p className="text-xs text-white/60 truncate">
            {media?.artist || 'Lecteur multimédia prêt'}
          </p>

          {/* Mini Waveform Equalizer */}
          <div className="flex items-end gap-1 h-3 mt-1.5 opacity-70">
            {[20, 50, 90, 40, 75, 100, 60, 30, 80, 45].map((h, i) => (
              <motion.span
                key={i}
                animate={{
                  height: isPlaying ? [`${h * 0.25}%`, `${h}%`, `${h * 0.25}%`] : '20%',
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 4) * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              onMediaAction('prev');
              if (onSoundPop) onSoundPop();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => {
              onMediaAction('play_pause');
              if (onSoundPop) onSoundPop();
            }}
            className="w-12 h-12 rounded-full bg-white text-black hover:bg-neutral-100 shadow-lg flex items-center justify-center transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              onMediaAction('next');
              if (onSoundPop) onSoundPop();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </LiquidGlassCard>
  );
}
