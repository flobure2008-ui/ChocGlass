import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Volume2, VolumeX, Sliders, Check } from 'lucide-react';

export function ThemeCustomizer({
  isOpen,
  onClose,
  theme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
}) {
  if (!isOpen) return null;

  const themes = [
    {
      id: 'liquid',
      name: 'Liquid Glass (VisionOS)',
      desc: 'Translucide givré, reflets nacrés',
      color: 'from-blue-500 via-indigo-400 to-purple-500',
    },
    {
      id: 'chocolate',
      name: 'Choclift Cacao (Dark Choco)',
      desc: 'Style tablette de chocolat & or chaud',
      color: 'from-amber-700 via-yellow-600 to-amber-900',
    },
    {
      id: 'neon',
      name: 'Cyberpunk Neon',
      desc: 'Violet électrique et cyan éclatant',
      color: 'from-fuchsia-600 to-cyan-500',
    },
    {
      id: 'silk',
      name: 'White Silk (Chocolat Blanc)',
      desc: 'Verre givré clair et pur',
      color: 'from-slate-100 to-slate-400',
    },
    {
      id: 'emerald',
      name: 'Aurora Emerald',
      desc: 'Vert menthe & jade cristallin',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-[36px] bg-[#12141f] border border-white/20 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Personnalisation & Design</h3>
              <p className="text-xs text-white/50">Thèmes Liquid Glass & Options</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            ✕
          </button>
        </div>

        {/* Theme List */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-white/70 block">
            Style Visuel de l'App :
          </label>
          {themes.map((t) => (
            <motion.div
              key={t.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTheme(t.id)}
              className={`cursor-pointer p-3.5 rounded-[24px] border flex items-center justify-between transition-all ${
                theme === t.id
                  ? 'bg-white/15 border-white shadow-lg'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${t.color} flex items-center justify-center shadow-md`}
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-white/50">{t.desc}</p>
                </div>
              </div>

              {theme === t.id && (
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sensory toggles */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <label className="text-xs font-semibold text-white/70 block">
            Sensations & Retours Haptiques :
          </label>

          <div
            onClick={onToggleSound}
            className="cursor-pointer p-3.5 rounded-[22px] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/40" />
              )}
              <div>
                <h4 className="text-sm font-semibold text-white">Sons & Clics Tactiles</h4>
                <p className="text-[11px] text-white/50">
                  {soundEnabled ? 'Retour audio activé' : 'Muet'}
                </p>
              </div>
            </div>

            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                soundEnabled ? 'bg-indigo-600' : 'bg-white/20'
              }`}
            >
              <motion.div
                animate={{ x: soundEnabled ? 20 : 0 }}
                className="w-5 h-5 rounded-full bg-white shadow-md"
              />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-white text-black font-bold text-sm shadow-lg hover:bg-neutral-100 transition-all"
        >
          Enregistrer & Appliquer
        </button>
      </motion.div>
    </div>
  );
}
