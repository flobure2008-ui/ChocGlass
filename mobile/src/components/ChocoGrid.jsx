import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Music,
  Gamepad2,
  Globe,
  Code2,
  Video,
  Youtube,
  Terminal,
  Folder,
  Calculator,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Tv,
} from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

const DEFAULT_APPS = [
  { id: 'discord', name: 'Discord', icon: 'discord', color: 'from-indigo-600 to-indigo-800', command: 'discord:' },
  { id: 'spotify', name: 'Spotify', icon: 'spotify', color: 'from-emerald-600 to-green-700', command: 'spotify:' },
  { id: 'steam', name: 'Steam', icon: 'steam', color: 'from-sky-700 to-blue-900', command: 'steam:' },
  { id: 'chrome', name: 'Chrome', icon: 'chrome', color: 'from-amber-600 to-rose-600', command: 'chrome' },
  { id: 'vscode', name: 'VS Code', icon: 'vscode', color: 'from-blue-600 to-cyan-700', command: 'code' },
  { id: 'obs', name: 'OBS Studio', icon: 'obs', color: 'from-slate-700 to-zinc-900', command: 'obs64' },
  { id: 'youtube', name: 'YouTube', icon: 'youtube', color: 'from-rose-600 to-red-800', command: 'https://youtube.com' },
  { id: 'terminal', name: 'Terminal PC', icon: 'terminal', color: 'from-zinc-800 to-neutral-900', command: 'wt' },
  { id: 'explorer', name: 'Explorateur', icon: 'explorer', color: 'from-amber-600 to-yellow-700', command: 'explorer' },
  { id: 'calculator', name: 'Calculatrice', icon: 'calculator', color: 'from-orange-600 to-amber-700', command: 'calc' },
];

export function ChocoGrid({
  onLaunchApp,
  theme,
  onSoundPop,
}) {
  const [apps, setApps] = useState(() => {
    const saved = localStorage.getItem('chocglass_apps');
    return saved ? JSON.parse(saved) : DEFAULT_APPS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCommand, setNewAppCommand] = useState('');
  const [newAppColor, setNewAppColor] = useState('from-purple-600 to-pink-700');
  const [editMode, setEditMode] = useState(false);

  const saveApps = (newApps) => {
    setApps(newApps);
    localStorage.setItem('chocglass_apps', JSON.stringify(newApps));
  };

  const handleAddApp = (e) => {
    e.preventDefault();
    if (!newAppName.trim() || !newAppCommand.trim()) return;
    const newApp = {
      id: 'custom_' + Date.now(),
      name: newAppName,
      icon: 'custom',
      color: newAppColor,
      command: newAppCommand,
    };
    saveApps([...apps, newApp]);
    setNewAppName('');
    setNewAppCommand('');
    setIsModalOpen(false);
  };

  const handleDeleteApp = (id) => {
    saveApps(apps.filter((a) => a.id !== id));
  };

  const renderIcon = (iconName) => {
    const props = { className: 'w-6 h-6 text-white drop-shadow' };
    switch (iconName) {
      case 'discord': return <MessageSquare {...props} />;
      case 'spotify': return <Music {...props} />;
      case 'steam': return <Gamepad2 {...props} />;
      case 'chrome': return <Globe {...props} />;
      case 'vscode': return <Code2 {...props} />;
      case 'obs': return <Video {...props} />;
      case 'youtube': return <Youtube {...props} />;
      case 'terminal': return <Terminal {...props} />;
      case 'explorer': return <Folder {...props} />;
      case 'calculator': return <Calculator {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="text-sm font-bold tracking-tight text-white/90">
            Tablette de Raccourcis PC (Choclift)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
              editMode
                ? 'bg-rose-500 text-white'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            {editMode ? 'Terminer' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Chocolate-bar grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.03, type: 'spring', stiffness: 350, damping: 25 }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => {
              if (editMode) {
                handleDeleteApp(app.id);
              } else {
                onLaunchApp(app.id, app.command);
                if (onSoundPop) onSoundPop();
              }
            }}
            className={`relative group cursor-pointer aspect-square rounded-[26px] p-3 flex flex-col items-center justify-center text-center overflow-hidden border select-none transition-all duration-200 shadow-glass ${
              theme === 'chocolate'
                ? 'bg-gradient-to-b from-[#382015] to-[#20110b] border-amber-600/30'
                : 'bg-gradient-to-b from-white/15 to-white/5 border-white/20'
            }`}
          >
            {/* Top specular glossy reflection (Choco block bevel) */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent pointer-events-none rounded-t-[26px]" />

            {/* Glowing gradient icon background pill */}
            <div
              className={`w-12 h-12 rounded-[20px] bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg mb-2 transform group-hover:scale-110 transition-transform`}
            >
              {renderIcon(app.icon)}
            </div>

            <span className="text-xs font-semibold text-white/90 truncate w-full tracking-tight">
              {app.name}
            </span>

            {/* Delete button in edit mode */}
            {editMode && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Add App Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer aspect-square rounded-[26px] p-3 flex flex-col items-center justify-center text-center border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all select-none"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-2">
            <Plus className="w-6 h-6 text-white/80" />
          </div>
          <span className="text-xs font-semibold text-white/60">Ajouter</span>
        </motion.div>
      </div>

      {/* Add Custom App Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="w-full max-w-sm rounded-[34px] bg-[#141622] border border-white/20 p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white text-center">
                Nouveau Raccourci PC
              </h3>

              <form onSubmit={handleAddApp} className="space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Nom du raccourci
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Photoshop, Blender, Twitch..."
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Chemin / Commande / URL PC
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: spotify: ou calc ou C:\app.exe"
                    value={newAppCommand}
                    onChange={(e) => setNewAppCommand(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-white/70 block mb-1">
                    Couleur de la tuile
                  </label>
                  <div className="flex gap-2 justify-center py-1">
                    {[
                      'from-purple-600 to-indigo-700',
                      'from-pink-600 to-rose-700',
                      'from-amber-600 to-orange-700',
                      'from-emerald-600 to-teal-700',
                      'from-blue-600 to-cyan-700',
                    ].map((c) => (
                      <div
                        key={c}
                        onClick={() => setNewAppColor(c)}
                        className={`w-7 h-7 rounded-full bg-gradient-to-br ${c} cursor-pointer border-2 ${
                          newAppColor === c ? 'border-white scale-110' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg transition-all"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
