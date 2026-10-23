import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  Music,
  Timer,
  LayoutGrid,
  Settings,
  Sparkles,
  Wifi,
  Cable,
  Palette,
} from 'lucide-react';
import { useSocket } from './hooks/useSocket';
import { useSound } from './hooks/useSound';
import { DynamicIsland } from './components/DynamicIsland';
import { VolumeSlider } from './components/VolumeSlider';
import { MediaDeck } from './components/MediaDeck';
import { SyncedTimer } from './components/SyncedTimer';
import { ChocoGrid } from './components/ChocoGrid';
import { ConnectionModal } from './components/ConnectionModal';
import { ThemeCustomizer } from './components/ThemeCustomizer';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('chocglass_theme') || 'chocolate';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('chocglass_sound') !== 'false';
  });

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'apps', 'audio', 'timer'
  const [isConnModalOpen, setIsConnModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  const { playPop, playTick, playChime } = useSound(soundEnabled);

  const {
    connected,
    latency,
    volume,
    muted,
    pcTime,
    media,
    timerState,
    systemStats,
    connectionType,
    host,
    port,
    setVolume,
    toggleMute,
    mediaAction,
    launchApp,
    startTimer,
    pauseTimer,
    resetTimer,
    switchConnectionType,
    updateHost,
  } = useSocket();

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('chocglass_theme', newTheme);
    playPop();
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('chocglass_sound', next ? 'true' : 'false');
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between max-w-lg mx-auto relative pb-28">
      {/* Background ambient liquid lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse-slow ${
            theme === 'chocolate'
              ? 'bg-amber-700'
              : theme === 'neon'
              ? 'bg-fuchsia-600'
              : 'bg-indigo-600'
          }`}
        />
        <div
          className={`absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl opacity-25 animate-float ${
            theme === 'chocolate'
              ? 'bg-orange-800'
              : theme === 'neon'
              ? 'bg-cyan-500'
              : 'bg-purple-600'
          }`}
        />
      </div>

      {/* Dynamic Island Status Capsule */}
      <DynamicIsland
        connected={connected}
        latency={latency}
        pcTime={pcTime}
        connectionType={connectionType}
        timerState={timerState}
        systemStats={systemStats}
        onOpenConnection={() => setIsConnModalOpen(true)}
        theme={theme}
      />

      {/* Main Content Area with fluid tab filtering or unified dashboard */}
      <main className="relative z-10 px-4 pt-2 space-y-4">
        {/* Quick Filter Pill Tabs */}
        <div className="flex items-center justify-between p-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full">
          {[
            { id: 'all', label: 'Tout', icon: LayoutGrid },
            { id: 'apps', label: 'Applications', icon: Sparkles },
            { id: 'audio', label: 'Audio & Médias', icon: Volume2 },
            { id: 'timer', label: 'Minuteur', icon: Timer },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  playTick();
                }}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all select-none ${
                  active ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-white/20 border border-white/25 shadow-sm"
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Card Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {/* Audio & Media Cards */}
            {(activeTab === 'all' || activeTab === 'audio') && (
              <div className="space-y-4">
                <VolumeSlider
                  volume={volume}
                  muted={muted}
                  onVolumeChange={setVolume}
                  onToggleMute={toggleMute}
                  theme={theme}
                  onSoundTick={playTick}
                />

                <MediaDeck
                  media={media}
                  onMediaAction={mediaAction}
                  theme={theme}
                  onSoundPop={playPop}
                />
              </div>
            )}

            {/* Timers & Stopwatch Card */}
            {(activeTab === 'all' || activeTab === 'timer') && (
              <SyncedTimer
                timerState={timerState}
                onStartTimer={startTimer}
                onPauseTimer={pauseTimer}
                onResetTimer={resetTimer}
                theme={theme}
                onPlayChime={playChime}
              />
            )}

            {/* Choclift Chocolate Apps Grid */}
            {(activeTab === 'all' || activeTab === 'apps') && (
              <ChocoGrid
                onLaunchApp={launchApp}
                theme={theme}
                onSoundPop={playPop}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Glass Navigation Pill */}
      <footer className="fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40">
        <div className="flex items-center justify-around py-2.5 px-4 rounded-full bg-black/60 border border-white/20 backdrop-blur-2xl shadow-glass">
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setIsConnModalOpen(true);
              playPop();
            }}
            className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
          >
            {connectionType === 'cable' ? (
              <Cable className="w-5 h-5 text-cyan-400" />
            ) : (
              <Wifi className="w-5 h-5 text-indigo-400" />
            )}
            <span className="text-[10px] font-semibold">Connexion</span>
          </motion.button>

          <div className="w-px h-6 bg-white/15" />

          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => {
              setIsThemeModalOpen(true);
              playPop();
            }}
            className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
          >
            <Palette className="w-5 h-5 text-pink-400" />
            <span className="text-[10px] font-semibold">Thèmes</span>
          </motion.button>
        </div>
      </footer>

      {/* Modals */}
      <ConnectionModal
        isOpen={isConnModalOpen}
        onClose={() => setIsConnModalOpen(false)}
        connected={connected}
        connectionType={connectionType}
        host={host}
        port={port}
        onSwitchConnectionType={switchConnectionType}
        onUpdateHost={updateHost}
      />

      <ThemeCustomizer
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
}
