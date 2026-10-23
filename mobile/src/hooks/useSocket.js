import { useState, useEffect, useRef, useCallback } from 'react';

export function useSocket(initialHost = '127.0.0.1', initialPort = 8765) {
  const [host, setHost] = useState(() => {
    return localStorage.getItem('chocglass_host') || (window.location.hostname || '127.0.0.1');
  });
  const [port, setPort] = useState(() => {
    return parseInt(localStorage.getItem('chocglass_port') || '8765', 10);
  });
  const [connectionType, setConnectionType] = useState(() => {
    return localStorage.getItem('chocglass_conn_type') || 'wifi'; // 'wifi' or 'cable'
  });

  const [connected, setConnected] = useState(false);
  const [latency, setLatency] = useState(0);

  // Synced PC states
  const [volume, setVolumeState] = useState(70);
  const [muted, setMuted] = useState(false);
  const [pcTime, setPcTime] = useState('--:--:--');
  const [media, setMedia] = useState({
    title: 'Starboy (feat. Daft Punk)',
    artist: 'The Weeknd',
    album: 'Starboy',
    isPlaying: false,
    duration: 230,
    position: 45,
  });
  const [timerState, setTimerState] = useState({
    mode: 'timer', // 'timer' or 'stopwatch'
    running: false,
    remainingSeconds: 300,
    totalSeconds: 300,
    stopwatchMs: 0,
  });
  const [systemStats, setSystemStats] = useState({
    cpu: 24,
    ram: 58,
    os: 'Windows 11 Pro',
    hostname: 'DESKTOP-GLASS',
  });

  const wsRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastPingTimeRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);

  // Connect function
  const connect = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // If cable mode, target 127.0.0.1 (USB Port forwarding via usbmuxd or USB tethering gateway)
    const targetHost = connectionType === 'cable' ? '127.0.0.1' : host;
    const url = `ws://${targetHost}:${port}`;

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        // Start ping loop
        lastPingTimeRef.current = Date.now();
        ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case 'pong': {
              const rtt = Date.now() - msg.timestamp;
              setLatency(rtt);
              break;
            }
            case 'state_update': {
              if (msg.volume !== undefined) setVolumeState(msg.volume);
              if (msg.muted !== undefined) setMuted(msg.muted);
              if (msg.pcTime) setPcTime(msg.pcTime);
              if (msg.media) setMedia(prev => ({ ...prev, ...msg.media }));
              if (msg.timer) setTimerState(prev => ({ ...prev, ...msg.timer }));
              if (msg.system) setSystemStats(prev => ({ ...prev, ...msg.system }));
              break;
            }
            default:
              break;
          }
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        // Schedule reconnect
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setConnected(false);
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    }
  }, [host, port, connectionType]);

  useEffect(() => {
    connect();

    // Ping interval every 2.5s
    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        lastPingTimeRef.current = Date.now();
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      }
    }, 2500);

    return () => {
      clearInterval(pingIntervalRef.current);
      clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Fallback demo simulation when not connected to real desktop companion
  useEffect(() => {
    if (connected) return;
    const interval = setInterval(() => {
      const now = new Date();
      setPcTime(now.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(interval);
  }, [connected]);

  // Send message helper
  const send = useCallback((payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  // Action methods
  const setVolume = useCallback((val) => {
    setVolumeState(val);
    send({ type: 'set_volume', value: val });
  }, [send]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      send({ type: 'toggle_mute', value: next });
      return next;
    });
  }, [send]);

  const mediaAction = useCallback((action) => {
    send({ type: 'media_action', action });
    if (action === 'play_pause') {
      setMedia(m => ({ ...m, isPlaying: !m.isPlaying }));
    }
  }, [send]);

  const launchApp = useCallback((appId, appPath) => {
    send({ type: 'launch_app', appId, appPath });
  }, [send]);

  const startTimer = useCallback((seconds) => {
    send({ type: 'timer_start', seconds });
    setTimerState(prev => ({
      ...prev,
      mode: 'timer',
      running: true,
      totalSeconds: seconds,
      remainingSeconds: seconds,
    }));
  }, [send]);

  const pauseTimer = useCallback(() => {
    send({ type: 'timer_pause' });
    setTimerState(prev => ({ ...prev, running: false }));
  }, [send]);

  const resetTimer = useCallback(() => {
    send({ type: 'timer_reset' });
    setTimerState(prev => ({ ...prev, running: false, remainingSeconds: prev.totalSeconds }));
  }, [send]);

  const switchConnectionType = (type) => {
    setConnectionType(type);
    localStorage.setItem('chocglass_conn_type', type);
    if (wsRef.current) wsRef.current.close();
  };

  const updateHost = (newHost, newPort) => {
    setHost(newHost);
    setPort(newPort);
    localStorage.setItem('chocglass_host', newHost);
    localStorage.setItem('chocglass_port', newPort.toString());
    if (wsRef.current) wsRef.current.close();
  };

  return {
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
  };
}
