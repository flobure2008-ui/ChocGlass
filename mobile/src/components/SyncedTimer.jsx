import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Clock4, BellRing } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

export function SyncedTimer({
  timerState,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  theme,
  onPlayChime,
}) {
  const [mode, setMode] = useState('timer'); // 'timer' or 'stopwatch'
  const [customMinutes, setCustomMinutes] = useState(5);

  // Local stopwatch counter
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const presets = [
    { label: '1m', secs: 60 },
    { label: '5m', secs: 300 },
    { label: '15m', secs: 900 },
    { label: '25m', secs: 1500 }, // Pomodoro
    { label: '45m', secs: 2700 },
  ];

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  // Circular progress calculation
  const total = timerState?.totalSeconds || 300;
  const remaining = timerState?.remainingSeconds ?? 300;
  const progressPercent = Math.max(0, Math.min(100, (remaining / total) * 100));
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  return (
    <LiquidGlassCard theme={theme} className="w-full">
      {/* Mode switcher tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-white/10 border border-white/15">
            <Timer className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white/90">
              {mode === 'timer' ? 'Minuteur PC Synchro' : 'Chronomètre Précision'}
            </h3>
            <p className="text-[11px] text-white/50">Alertes sonores et visuelles</p>
          </div>
        </div>

        {/* Tab pills */}
        <div className="bg-black/30 p-1 rounded-full border border-white/10 flex items-center">
          <button
            onClick={() => setMode('timer')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === 'timer'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Minuteur
          </button>
          <button
            onClick={() => setMode('stopwatch')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === 'stopwatch'
                ? 'bg-amber-500 text-black shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Chrono
          </button>
        </div>
      </div>

      {mode === 'timer' ? (
        <div className="flex flex-col items-center">
          {/* Circular progress display */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-white/10"
                strokeWidth="6"
                fill="none"
              />
              {/* Animated Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-amber-400 transition-all duration-500 ease-out"
                strokeWidth="6"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
                }}
              />
            </svg>

            {/* Inner text countdown */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-3xl font-extrabold tracking-tight text-white">
                {formatTimer(remaining)}
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300/80 mt-0.5">
                {timerState?.running ? 'En cours sur le PC' : 'En pause'}
              </span>
            </div>
          </div>

          {/* Quick presets pills */}
          <div className="flex items-center justify-center gap-1.5 w-full my-3">
            {presets.map((p) => (
              <motion.button
                key={p.label}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => onStartTimer(p.secs)}
                className="flex-1 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 transition-all text-center"
              >
                {p.label}
              </motion.button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onResetTimer}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (timerState?.running) {
                  onPauseTimer();
                } else {
                  onStartTimer(remaining || 300);
                }
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-choco-glow flex items-center gap-2"
            >
              {timerState?.running ? (
                <>
                  <Pause className="w-4 h-4 fill-black" /> Mettre en pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" /> Démarrer
                </>
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        /* Stopwatch Mode */
        <div className="flex flex-col items-center py-4">
          <div className="my-4 py-4 px-8 rounded-[28px] bg-white/5 border border-white/10">
            <span className="font-mono text-4xl font-black text-amber-300 tracking-wider">
              {formatStopwatch(stopwatchTime)}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setStopwatchRunning(false);
                setStopwatchTime(0);
              }}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/70"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setStopwatchRunning(!stopwatchRunning)}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm shadow-choco-glow flex items-center gap-2"
            >
              {stopwatchRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" /> Lancer Chrono
                </>
              )}
            </motion.button>
          </div>
        </div>
      )}
    </LiquidGlassCard>
  );
}
