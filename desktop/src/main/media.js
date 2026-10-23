import { exec } from 'child_process';
import os from 'os';

const platform = os.platform();

// Cached media status
let currentMedia = {
  title: 'Morceau en lecture',
  artist: 'Système PC',
  album: '',
  isPlaying: false,
};

export function handleMediaAction(action) {
  if (platform === 'win32') {
    // Windows Virtual Key codes:
    // Play/Pause: 179 (0xB3)
    // Next: 176 (0xB0)
    // Prev: 177 (0xB1)
    // Stop: 178 (0xB2)
    let charCode = 179;
    if (action === 'play_pause') charCode = 179;
    else if (action === 'next') charCode = 176;
    else if (action === 'prev') charCode = 177;
    else if (action === 'stop') charCode = 178;

    exec(`powershell -NoProfile -Command "$w = New-Object -ComObject Wscript.Shell; $w.SendKeys([char]${charCode})"`);
  } else if (platform === 'darwin') {
    if (action === 'play_pause') {
      exec(`osascript -e 'tell application "System Events" to key code 16 using {command down}'`);
    } else if (action === 'next') {
      exec(`osascript -e 'tell application "Spotify" to next track'`);
    } else if (action === 'prev') {
      exec(`osascript -e 'tell application "Spotify" to previous track'`);
    }
  } else {
    // Linux playerctl
    if (action === 'play_pause') exec('playerctl play-pause');
    else if (action === 'next') exec('playerctl next');
    else if (action === 'prev') exec('playerctl previous');
  }

  if (action === 'play_pause') {
    currentMedia.isPlaying = !currentMedia.isPlaying;
  }
}

export function getCurrentMedia() {
  return currentMedia;
}
