import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Cable,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Timer,
  Cpu,
  HardDrive,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DesktopApp() {
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [localIps, setLocalIps] = useState([
    { name: 'Wi-Fi', address: '192.168.1.50' },
    { name: 'USB Tethering', address: '172.20.10.1' },
  ]);

  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Connect to local WebSocket
    const ws = new WebSocket('ws://127.0.0.1:8765');
    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'state_update') {
          if (msg.volume !== undefined) setVolume(msg.volume);
          if (msg.muted !== undefined) setMuted(msg.muted);
          if (msg.system) setStatus((prev) => ({ ...prev, ...msg.system }));
        }
      } catch {}
    };
    ws.onclose = () => setWsConnected(false);

    // Fetch IP addresses from HTTP API
    fetch('http://127.0.0.1:8765/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.ips && data.ips.length > 0) {
          setLocalIps(data.ips);
        }
        if (data.volume !== undefined) setVolume(data.volume);
      })
      .catch(() => {});

    return () => ws.close();
  }, []);

  const primaryIp = localIps[0]?.address || '127.0.0.1';
  const qrValue = `http://${primaryIp}:5173`;

  const copyIp = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col p-6 overflow-hidden">
      {/* Top Header / Titlebar */}
      <div className="titlebar-drag flex items-center justify-between pb-5 border-b border-white/10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-800 flex items-center justify-center shadow-lg border border-amber-400/30">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              ChocGlass Companion <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">v1.0.0</span>
            </h1>
            <p className="text-xs text-white/50">Serveur Pont PC & Mac pour iPhone</p>
          </div>
        </div>

        {/* Server status pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300 font-mono">
              Serveur Actif : Port 8765
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-12 gap-5 pt-5 overflow-hidden">
        {/* Left Column: QR Code & Connection (5 cols) */}
        <div className="col-span-5 flex flex-col gap-4">
          {/* QR Code & Wi-Fi Card */}
          <div className="desktop-glass rounded-[32px] p-5 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-2 text-white/80">
              <Smartphone className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold">Connexion Flash iPhone</h2>
            </div>

            {/* QR Code */}
            <div className="p-3 bg-white rounded-[24px] shadow-2xl">
              <QRCodeSVG value={qrValue} size={150} level="M" />
            </div>

            <p className="text-xs text-white/60 max-w-xs">
              Scannez avec l'appareil photo de l'iPhone pour ouvrir l'interface compagnon instantanément.
            </p>

            {/* IP Badges */}
            <div className="w-full space-y-2 pt-1">
              <label className="text-[11px] font-semibold text-white/50 block text-left">
                Adresses IP disponibles sur ce PC :
              </label>
              {localIps.map((ip) => (
                <div
                  key={ip.address}
                  onClick={() => copyIp(ip.address)}
                  className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-2xl flex items-center justify-between text-xs transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-white/60 font-medium">{ip.name}</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                    {ip.address}
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-40" />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* USB Cable info */}
          <div className="desktop-glass rounded-[28px] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Cable className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Mode Câble USB Disponible</h4>
              <p className="text-[11px] text-white/60">
                Branchez votre iPhone et connectez-vous via <span className="font-mono text-cyan-300">127.0.0.1:8765</span> pour une latence de 1ms.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Audio & PC Dashboard Controls (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Live Audio Volume Card */}
          <div className="desktop-glass rounded-[32px] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-white/10">
                  <Volume2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Volume PC Synchronisé</h3>
                  <p className="text-xs text-white/50">Pilotable directement depuis l'iPhone</p>
                </div>
              </div>

              <span className="font-mono text-base font-extrabold text-indigo-300 bg-white/10 px-3 py-1 rounded-full">
                {muted ? '0% (Mute)' : `${volume}%`}
              </span>
            </div>

            {/* Slider visualizer */}
            <div className="w-full h-8 bg-black/40 rounded-full border border-white/10 p-1 flex items-center">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg transition-all duration-150"
                style={{ width: `${muted ? 0 : volume}%` }}
              />
            </div>
          </div>

          {/* System Hardware Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="desktop-glass rounded-[26px] p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-white/50 block">Processeur PC</span>
                <span className="font-mono text-lg font-bold text-white">
                  {status?.cpu ?? 18}%
                </span>
              </div>
            </div>

            <div className="desktop-glass rounded-[26px] p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-white/50 block">Mémoire RAM</span>
                <span className="font-mono text-lg font-bold text-white">
                  {status?.ram ?? 45}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts status */}
          <div className="desktop-glass rounded-[32px] p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">
              Raccourcis intégrés prêts pour l'iPhone
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['Discord', 'Spotify', 'Steam', 'Chrome', 'VS Code', 'OBS Studio'].map((app) => (
                <div
                  key={app}
                  className="bg-white/5 border border-white/10 rounded-2xl py-2 px-3 text-center text-xs font-semibold text-white/80"
                >
                  {app}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
