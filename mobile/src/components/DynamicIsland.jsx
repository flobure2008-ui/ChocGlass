import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Cable, Clock, Timer, Cpu, HardDrive, ShieldCheck, ChevronDown, Activity } from 'lucide-react';

export function DynamicIsland({
  connected,
  latency,
  pcTime,
  connectionType,
  timerState,
  systemStats,
  onOpenConnection,
  theme,
}) {
  const [expanded, setExpanded] = useState(false);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="sticky top-0 z-50 pt-2 pb-2 px-4 flex justify-center">
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        onClick={() => setExpanded(!expanded)}
        className={`w-full max-w-md cursor-pointer select-none overflow-hidden ${
          expanded ? 'rounded-[36px] p-5' : 'rounded-full py-2.5 px-4'
        } ${
          theme === 'chocolate'
            ? 'bg-[#1e120c]/85 border-amber-500/25 shadow-choco-glow'
            : 'bg-black/70 border-white/20 shadow-glass'
        } backdrop-blur-2xl border transition-colors`}
      >
        {/* Collapsed Bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Connection status pill */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenConnection();
            }}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all"
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connected ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
              />
              {connected && (
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </div>
            {connectionType === 'cable' ? (
              <Cable className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="text-xs font-semibold tracking-wide uppercase">
              {connected ? (connectionType === 'cable' ? 'USB' : `${latency}ms`) : 'Hors-ligne'}
            </span>
          </div>

          {/* Active Timer mini-badge */}
          {timerState?.running && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold animate-pulse"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(timerState.remainingSeconds)}</span>
            </motion.div>
          )}

          {/* PC Live Clock */}
          <div className="flex items-center gap-1.5 text-white/90 font-mono font-bold text-sm tracking-wider">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{pcTime || '--:--:--'}</span>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/60"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Expanded Details Modal inside Dynamic Island */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-4 mt-3 border-t border-white/10 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {systemStats.hostname} ({systemStats.os})
                </span>
                <span className="font-mono text-cyan-300">
                  {connectionType === 'cable' ? 'Câble USB Direct' : 'Réseau Local Wi-Fi'}
                </span>
              </div>

              {/* Hardware stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/5 p-3 rounded-[20px] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-white/80">Processeur PC</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-purple-300">
                    {systemStats.cpu}%
                  </span>
                </div>

                <div className="bg-white/5 p-3 rounded-[20px] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white/80">Mémoire RAM</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-cyan-300">
                    {systemStats.ram}%
                  </span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={onOpenConnection}
                  className="w-full text-center py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full text-xs font-semibold shadow-lg transition-all"
                >
                  Gérer la connexion (Câble USB & Wi-Fi)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
