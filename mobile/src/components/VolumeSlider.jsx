import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Volume1, Sparkles } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

export function VolumeSlider({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  theme,
  onSoundTick,
}) {
  const barRef = useRef(null);

  const handlePointer = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newVol = Math.round(pos * 100);
    onVolumeChange(newVol);
    if (onSoundTick) onSoundTick();
  };

  const presets = [0, 25, 50, 75, 100];

  return (
    <LiquidGlassCard theme={theme} className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={onToggleMute}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              muted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-white/10 text-white/90 border border-white/20 hover:bg-white/20'
            }`}
          >
            {muted ? (
              <VolumeX className="w-5 h-5" />
            ) : volume > 50 ? (
              <Volume2 className="w-5 h-5 text-indigo-400" />
            ) : (
              <Volume1 className="w-5 h-5 text-indigo-400" />
            )}
          </motion.button>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white/90">Volume Master PC</h3>
            <p className="text-[11px] text-white/50">
              {muted ? 'Audio en sourdine' : 'Contrôle direct fluide'}
            </p>
          </div>
        </div>

        {/* Dynamic percentage badge */}
        <motion.div
          key={volume}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full font-mono text-sm font-extrabold text-white tracking-wider shadow-inner"
        >
          {muted ? '0%' : `${volume}%`}
        </motion.div>
      </div>

      {/* Fluid Slider Track */}
      <div
        ref={barRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointer(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) handlePointer(e);
        }}
        className="relative w-full h-12 bg-black/40 border border-white/10 rounded-full cursor-pointer overflow-hidden p-1 select-none flex items-center shadow-inner"
      >
        {/* Fill bar */}
        <motion.div
          className={`h-full rounded-full transition-all relative ${
            muted
              ? 'bg-rose-500/40'
              : theme === 'chocolate'
              ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]'
          }`}
          style={{ width: `${muted ? 0 : volume}%` }}
        >
          {/* Thumb shine */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600/70" />
          </div>
        </motion.div>

        {/* Ambient Equalizer Waves behind slider */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-around px-8 opacity-25">
          {[40, 70, 30, 90, 60, 80, 50, 65, 85].map((h, i) => (
            <motion.div
              key={i}
              animate={{
                height: muted ? '4px' : [`${h * 0.2}%`, `${h * 0.45}%`, `${h * 0.2}%`],
              }}
              transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.3, ease: 'easeInOut' }}
              className="w-1 bg-white rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex items-center justify-between gap-1.5 mt-3.5">
        {presets.map((val) => (
          <motion.button
            key={val}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (val === 0) {
                if (!muted) onToggleMute();
              } else {
                if (muted) onToggleMute();
                onVolumeChange(val);
              }
              if (onSoundTick) onSoundTick();
            }}
            className={`flex-1 py-1.5 rounded-full text-xs font-semibold font-mono transition-all border ${
              volume === val && !muted
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/15'
            }`}
          >
            {val === 0 ? 'Mute' : `${val}%`}
          </motion.button>
        ))}
      </div>
    </LiquidGlassCard>
  );
}
