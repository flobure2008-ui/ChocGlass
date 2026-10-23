import { exec } from 'child_process';
import os from 'os';

const platform = os.platform();

export function launchApp(target) {
  if (!target) return;

  let cmd = '';
  if (platform === 'win32') {
    // Windows `start` command handles URLs, protocol URIs (e.g., spotify:, discord:), and exe paths
    cmd = `start "" "${target}"`;
  } else if (platform === 'darwin') {
    cmd = `open "${target}"`;
  } else {
    cmd = `xdg-open "${target}"`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.error(`Failed to launch app: ${target}`, err);
    }
  });
}
