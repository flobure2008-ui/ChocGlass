// PC Synced Timer & Stopwatch Manager

let timerState = {
  mode: 'timer',
  running: false,
  remainingSeconds: 300,
  totalSeconds: 300,
};

let timerInterval = null;

export function startTimer(seconds) {
  if (seconds !== undefined) {
    timerState.totalSeconds = seconds;
    timerState.remainingSeconds = seconds;
  }
  timerState.running = true;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timerState.remainingSeconds > 0) {
      timerState.remainingSeconds -= 1;
    } else {
      timerState.running = false;
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 1000);
}

export function pauseTimer() {
  timerState.running = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

export function resetTimer() {
  pauseTimer();
  timerState.remainingSeconds = timerState.totalSeconds;
}

export function getTimerState() {
  return timerState;
}
