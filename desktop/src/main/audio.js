import { exec, spawn } from 'child_process';
import os from 'os';

const platform = os.platform();

// In-memory volume cache
let cachedVolume = 75;
let cachedMuted = false;

// Windows PowerShell Audio Script (runs inline via PowerShell)
const WIN_AUDIO_GET = `
$source = @"
using System;
using System.Runtime.InteropServices;

[Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IAudioEndpointVolume {
    int f1(); int f2(); int f3(); int f4(); int f5(); int f6();
    int GetMasterVolumeLevelScalar(out float pfLevel);
    int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, ref Guid pguidEventContext);
    int GetMute(out bool pbMute);
}
[Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IMMDevice {
    int Activate(ref Guid id, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object interfacePointer);
}
[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
public interface IMMDeviceEnumerator {
    int EnumAudioEndpoints(int dataFlow, int stateMask, out IntPtr devices);
    int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
}
[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
public class MMDeviceEnumeratorComObject { }

public class MasterAudio {
    public static string GetStatus() {
        try {
            var enumerator = (IMMDeviceEnumerator)new MMDeviceEnumeratorComObject();
            IMMDevice dev;
            enumerator.GetDefaultAudioEndpoint(0, 1, out dev);
            Guid IID_IAudioEndpointVolume = typeof(IAudioEndpointVolume).GUID;
            object epv;
            dev.Activate(ref IID_IAudioEndpointVolume, 1, IntPtr.Zero, out epv);
            var audio = (IAudioEndpointVolume)epv;
            float vol = 0;
            audio.GetMasterVolumeLevelScalar(out vol);
            bool mute = false;
            audio.GetMute(out mute);
            return Math.Round(vol * 100) + ":" + (mute ? "1" : "0");
        } catch {
            return "70:0";
        }
    }
}
"@
Add-Type -TypeDefinition $source -ErrorAction SilentlyContinue
[MasterAudio]::GetStatus()
`;

export async function getSystemVolume() {
  return new Promise((resolve) => {
    if (platform === 'win32') {
      exec(`powershell -NoProfile -Command "${WIN_AUDIO_GET.replace(/\r?\n/g, ' ')}"`, (err, stdout) => {
        if (!err && stdout) {
          const parts = stdout.trim().split(':');
          const vol = parseInt(parts[0], 10);
          const muted = parts[1] === '1';
          if (!isNaN(vol)) {
            cachedVolume = vol;
            cachedMuted = muted;
          }
        }
        resolve({ volume: cachedVolume, muted: cachedMuted });
      });
    } else if (platform === 'darwin') {
      exec('osascript -e "output volume of (get volume settings)"', (err, stdout) => {
        if (!err && stdout) {
          cachedVolume = parseInt(stdout.trim(), 10) || cachedVolume;
        }
        resolve({ volume: cachedVolume, muted: cachedMuted });
      });
    } else {
      // Linux
      exec('pactl get-sink-volume @DEFAULT_SINK@', (err, stdout) => {
        if (!err && stdout) {
          const match = stdout.match(/(\d+)%/);
          if (match) cachedVolume = parseInt(match[1], 10);
        }
        resolve({ volume: cachedVolume, muted: cachedMuted });
      });
    }
  });
}

export async function setSystemVolume(level) {
  cachedVolume = Math.max(0, Math.min(100, Math.round(level)));
  const scalar = (cachedVolume / 100).toFixed(2);

  if (platform === 'win32') {
    const cmd = `powershell -NoProfile -Command "$w=New-Object -ComObject Wscript.Shell; [AudioEndpoint]::Set(${scalar})"`;
    // Using inline C# scalar setter for instant execution
    const setScript = `
    $s = @"
    using System;
    using System.Runtime.InteropServices;
    [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioEndpointVolume {
        int f1(); int f2(); int f3(); int f4();
        int SetMasterVolumeLevelScalar(float fLevel, ref Guid pguidEventContext);
    }
    [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IMMDevice {
        int Activate(ref Guid id, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object interfacePointer);
    }
    [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IMMDeviceEnumerator {
        int EnumAudioEndpoints(int dataFlow, int stateMask, out IntPtr devices);
        int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
    }
    [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
    public class MMDeviceEnumeratorComObject { }
    public class AudioSetter {
        public static void Set(float v) {
            try {
                var enumerator = (IMMDeviceEnumerator)new MMDeviceEnumeratorComObject();
                IMMDevice dev;
                enumerator.GetDefaultAudioEndpoint(0, 1, out dev);
                Guid IID = typeof(IAudioEndpointVolume).GUID;
                object epv;
                dev.Activate(ref IID, 1, IntPtr.Zero, out epv);
                var audio = (IAudioEndpointVolume)epv;
                Guid empty = Guid.Empty;
                audio.SetMasterVolumeLevelScalar(v, ref empty);
            } catch {}
        }
    }
    "@
    Add-Type -TypeDefinition $s -ErrorAction SilentlyContinue
    [AudioSetter]::Set(${scalar})
    `;
    exec(`powershell -NoProfile -Command "${setScript.replace(/\r?\n/g, ' ')}"`);
  } else if (platform === 'darwin') {
    exec(`osascript -e "set volume output volume ${cachedVolume}"`);
  } else {
    exec(`pactl set-sink-volume @DEFAULT_SINK@ ${cachedVolume}%`);
  }
}

export async function toggleSystemMute(muteState) {
  cachedMuted = muteState !== undefined ? muteState : !cachedMuted;

  if (platform === 'win32') {
    // Send VK_VOLUME_MUTE key (0xAD = 173)
    exec(`powershell -NoProfile -Command "$w = New-Object -ComObject Wscript.Shell; $w.SendKeys([char]173)"`);
  } else if (platform === 'darwin') {
    exec(`osascript -e "set volume output muted ${cachedMuted}"`);
  } else {
    exec('pactl set-sink-mute @DEFAULT_SINK@ toggle');
  }
}
