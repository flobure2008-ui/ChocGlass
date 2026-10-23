import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import os from 'os';
import { getSystemVolume, setSystemVolume, toggleSystemMute } from './audio.js';
import { handleMediaAction, getCurrentMedia } from './media.js';
import { launchApp } from './apps.js';
import { startTimer, pauseTimer, resetTimer, getTimerState } from './timer.js';

export function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // IPv4 and not internal 127.0.0.1
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({ name, address: iface.address });
      }
    }
  }
  return ips;
}

export function startCompanionServer(port = 8765) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/status', async (req, res) => {
    const audio = await getSystemVolume();
    res.json({
      status: 'ok',
      os: os.platform(),
      hostname: os.hostname(),
      volume: audio.volume,
      muted: audio.muted,
      timer: getTimerState(),
      media: getCurrentMedia(),
      ips: getLocalIPs(),
    });
  });

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // Connected clients set
  const clients = new Set();

  wss.on('connection', async (ws, req) => {
    clients.add(ws);
    console.log(`[ChocGlass] iPhone / Client connected from ${req.socket.remoteAddress}`);

    // Send immediate initial state
    const audio = await getSystemVolume();
    const now = new Date();
    ws.send(
      JSON.stringify({
        type: 'state_update',
        volume: audio.volume,
        muted: audio.muted,
        pcTime: now.toTimeString().split(' ')[0],
        timer: getTimerState(),
        media: getCurrentMedia(),
        system: {
          cpu: Math.round((os.loadavg()[0] || 0.2) * 10),
          ram: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
          os: `${os.type()} ${os.release()}`,
          hostname: os.hostname(),
        },
      })
    );

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data.toString());
        switch (msg.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: msg.timestamp }));
            break;

          case 'set_volume':
            await setSystemVolume(msg.value);
            broadcast({ type: 'state_update', volume: msg.value });
            break;

          case 'toggle_mute':
            await toggleSystemMute(msg.value);
            broadcast({ type: 'state_update', muted: msg.value });
            break;

          case 'media_action':
            handleMediaAction(msg.action);
            broadcast({ type: 'state_update', media: getCurrentMedia() });
            break;

          case 'launch_app':
            launchApp(msg.appPath || msg.appId);
            break;

          case 'timer_start':
            startTimer(msg.seconds);
            broadcast({ type: 'state_update', timer: getTimerState() });
            break;

          case 'timer_pause':
            pauseTimer();
            broadcast({ type: 'state_update', timer: getTimerState() });
            break;

          case 'timer_reset':
            resetTimer();
            broadcast({ type: 'state_update', timer: getTimerState() });
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('[ChocGlass] Error parsing message:', err);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log('[ChocGlass] Client disconnected');
    });
  });

  function broadcast(data) {
    const payload = JSON.stringify(data);
    for (const ws of clients) {
      if (ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    }
  }

  // Broadcast clock and system metrics every 1s
  setInterval(async () => {
    if (clients.size === 0) return;
    const now = new Date();
    const audio = await getSystemVolume();
    const ramPercent = Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);

    broadcast({
      type: 'state_update',
      pcTime: now.toTimeString().split(' ')[0],
      volume: audio.volume,
      muted: audio.muted,
      timer: getTimerState(),
      media: getCurrentMedia(),
      system: {
        cpu: Math.min(100, Math.max(5, Math.round((os.loadavg()[0] || 0.25) * 15))),
        ram: ramPercent,
        os: `${os.type()} ${os.release()}`,
        hostname: os.hostname(),
      },
    });
  }, 1000);

  server.listen(port, '0.0.0.0', () => {
    console.log(`[ChocGlass Server] Running on http://0.0.0.0:${port}`);
    console.log(`[ChocGlass Server] Available IPs:`, getLocalIPs().map((i) => `${i.name}: ${i.address}`).join(', '));
  });

  return { server, wss, app };
}

// Standalone execution if launched directly via node src/main/server.js
if (process.argv[1]?.endsWith('server.js')) {
  startCompanionServer(8765);
}
