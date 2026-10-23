import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cable, Wifi, X, Check, Laptop, Smartphone, HelpCircle, RefreshCw } from 'lucide-react';

export function ConnectionModal({
  isOpen,
  onClose,
  connected,
  connectionType,
  host,
  port,
  onSwitchConnectionType,
  onUpdateHost,
}) {
  const [currentTab, setCurrentTab] = useState(connectionType || 'wifi');
  const [inputHost, setInputHost] = useState(host || '192.168.1.50');
  const [inputPort, setInputPort] = useState(port || 8765);

  if (!isOpen) return null;

  const handleSaveWiFi = (e) => {
    e.preventDefault();
    onSwitchConnectionType('wifi');
    onUpdateHost(inputHost.trim(), parseInt(inputPort, 10));
    onClose();
  };

  const handleSelectCable = () => {
    onSwitchConnectionType('cable');
    onUpdateHost('127.0.0.1', 8765);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-[36px] bg-[#12141f] border border-white/20 p-6 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              {currentTab === 'cable' ? (
                <Cable className="w-5 h-5 text-cyan-400" />
              ) : (
                <Wifi className="w-5 h-5 text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Connexion PC & iPhone</h3>
              <p className="text-xs text-white/50">Câble USB & Wi-Fi local</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1 bg-white/5 rounded-full border border-white/10">
          <button
            onClick={() => setCurrentTab('wifi')}
            className={`py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              currentTab === 'wifi'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" /> Réseau Wi-Fi
          </button>
          <button
            onClick={() => setCurrentTab('cable')}
            className={`py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              currentTab === 'cable'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Cable className="w-3.5 h-3.5" /> Câble USB
          </button>
        </div>

        {/* Content based on tab */}
        {currentTab === 'wifi' ? (
          <form onSubmit={handleSaveWiFi} className="space-y-4 pt-1">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Adresse IP du PC (visible sur l'app Desktop)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 192.168.1.42 ou chocglass.local"
                  value={inputHost}
                  onChange={(e) => setInputHost(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1">
                  Port du serveur (défaut : 8765)
                </label>
                <input
                  type="number"
                  required
                  value={inputPort}
                  onChange={(e) => setInputPort(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-[22px] bg-white/5 border border-white/10 text-xs text-white/70 space-y-1">
              <span className="font-bold text-indigo-300 block">💡 Astuce Wi-Fi :</span>
              <p>
                Assurez-vous que votre iPhone et votre PC sont connectés sur le même réseau Wi-Fi.
                L'adresse IP exacte s'affiche directement sur l'application PC compagnon !
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 font-bold text-sm text-white shadow-lg transition-all"
            >
              Connecter en Wi-Fi
            </button>
          </form>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-[26px] bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200/90 space-y-2">
              <span className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                <Cable className="w-4 h-4" /> Mode Câble USB Ultra-Basse Latence (1ms)
              </span>
              <p>
                Idéal pour zéro latence lors du streaming ou jeu :
              </p>
              <ol className="list-decimal list-inside space-y-1 text-white/80">
                <li>Branchez votre iPhone au PC via son câble USB/Lightning.</li>
                <li>
                  Activez le <b>Partage de connexion USB</b> sur l'iPhone OU utilisez le tunnel USB
                  inclus avec le script <code>setup-usb-tunnel.bat</code>.
                </li>
                <li>Votre iPhone communiquera directement via l'adresse <code>127.0.0.1:8765</code>.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleSelectCable}
              className="w-full py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold text-sm text-white shadow-lg transition-all"
            >
              Activer le mode Câble USB (127.0.0.1)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
