import * as vscode from 'vscode';

let interval: ReturnType<typeof setInterval> | undefined;
let statusBarTimer: vscode.StatusBarItem;
let statusBarStart: vscode.StatusBarItem;
let statusBarStop: vscode.StatusBarItem;
let statusBarConfig: vscode.StatusBarItem;
let totalSecs = 0;
let isRunning = false;
let isBreak = false;

export function activate(ctx: vscode.ExtensionContext) {
  // Status bar: tombol start
  statusBarStart = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 103);
  statusBarStart.text = '$(play)';
  statusBarStart.tooltip = 'Pomodoro: Mulai';
  statusBarStart.command = 'pomodoro.start';
  statusBarStart.show();

  // Status bar: tampilan timer
  statusBarTimer = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 102);
  statusBarTimer.text = '🍅 25:00';
  statusBarTimer.tooltip = 'Pomodoro Timer';
  statusBarTimer.command = 'pomodoro.start';
  statusBarTimer.show();

  // Status bar: tombol stop
  statusBarStop = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
  statusBarStop.text = '$(debug-stop)';
  statusBarStop.tooltip = 'Pomodoro: Stop';
  statusBarStop.command = 'pomodoro.stop';
  statusBarStop.show();

  // Status bar: tombol config
  statusBarConfig = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarConfig.text = '$(gear)';
  statusBarConfig.tooltip = 'Pomodoro: Kustomisasi';
  statusBarConfig.command = 'pomodoro.config';
  statusBarConfig.show();

  ctx.subscriptions.push(
    vscode.commands.registerCommand('pomodoro.start', startTimer),
    vscode.commands.registerCommand('pomodoro.stop', () => stopTimer(ctx)),
    vscode.commands.registerCommand('pomodoro.reset', resetTimer),
    vscode.commands.registerCommand('pomodoro.config', openConfig),
    statusBarStart,
    statusBarTimer,
    statusBarStop,
    statusBarConfig
  );

  updateStatusBar();
}

function getCfg() {
  return vscode.workspace.getConfiguration('pomodoro');
}

function startTimer() {
  if (isRunning) return;
  const cfg = getCfg();
  const mins = isBreak
    ? cfg.get<number>('breakMinutes', 5)
    : cfg.get<number>('workMinutes', 25);

  totalSecs = mins * 60;
  isRunning = true;
  updateStatusBar();

  interval = setInterval(() => {
    if (totalSecs <= 0) {
      clearInterval(interval);
      isRunning = false;
      const nextIsBreak = !isBreak;
      isBreak = nextIsBreak;
      showDonePanel(nextIsBreak);
      updateStatusBar();
      return;
    }
    totalSecs--;
    updateStatusBar();
  }, 1000);
}

function stopTimer(ctx: vscode.ExtensionContext) {
  if (!isRunning && totalSecs === 0) return;
  clearInterval(interval);
  isRunning = false;
  showStopWarningPanel(ctx);
  resetTimer();
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  isBreak = false;
  const cfg = getCfg();
  totalSecs = cfg.get<number>('workMinutes', 25) * 60;
  updateStatusBar();
}

function openConfig() {
  vscode.commands.executeCommand('workbench.action.openSettings', 'pomodoro');
}

function updateStatusBar() {
  const cfg = getCfg();
  const emoji = cfg.get<string>('emoji', '🍅');
  const workMins = cfg.get<number>('workMinutes', 25);

  if (totalSecs === 0 && !isRunning) {
    statusBarTimer.text = `${emoji} ${workMins}:00`;
    statusBarStart.text = '$(play)';
    return;
  }

  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const s = (totalSecs % 60).toString().padStart(2, '0');
  const label = isBreak ? '☕' : emoji;

  statusBarTimer.text = `${label} ${m}:${s}`;
  statusBarStart.text = isRunning ? '$(sync~spin)' : '$(play)';

  // Berkedip merah saat 1 menit tersisa
  if (totalSecs <= 60 && isRunning) {
    statusBarTimer.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else {
    statusBarTimer.backgroundColor = undefined;
  }
}

function showStopWarningPanel(ctx: vscode.ExtensionContext) {
  const cfg = getCfg();
  const emoji = cfg.get<string>('emoji', '🍅');
  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const s = (totalSecs % 60).toString().padStart(2, '0');

  const panel = vscode.window.createWebviewPanel(
    'pomodoroStop',
    '⚠️ Pomodoro Dihentikan',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getStopWarningHtml(emoji, `${m}:${s}`);

  panel.webview.onDidReceiveMessage(msg => {
    if (msg.command === 'resume') {
      panel.dispose();
      startTimer();
    } else if (msg.command === 'reset') {
      panel.dispose();
    }
  }, undefined, ctx.subscriptions);
}

function showDonePanel(isNowBreak: boolean) {
  const cfg = getCfg();
  const emoji = cfg.get<string>('emoji', '🍅');
  const breakMins = cfg.get<number>('breakMinutes', 5);

  const panel = vscode.window.createWebviewPanel(
    'pomodoroDone',
    isNowBreak ? '☕ Waktunya Istirahat!' : '🍅 Balik Kerja!',
    vscode.ViewColumn.One,
    { enableScripts: true }
  );

  panel.webview.html = getDoneHtml(emoji, isNowBreak, breakMins);

  panel.webview.onDidReceiveMessage(msg => {
    if (msg.command === 'next') {
      panel.dispose();
      startTimer();
    } else if (msg.command === 'close') {
      panel.dispose();
    }
  });
}

function getStopWarningHtml(emoji: string, timeLeft: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pomodoro Dihentikan</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #1e1e2e;
    color: #cdd6f4;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }
  .card {
    background: #313244;
    border: 1px solid #f38ba8;
    border-radius: 16px;
    padding: 3rem 2.5rem;
    text-align: center;
    max-width: 420px;
    width: 100%;
    animation: pop 0.3s ease;
  }
  @keyframes pop {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .icon { font-size: 72px; margin-bottom: 1rem; animation: shake 0.5s ease 0.2s; }
  @keyframes shake {
    0%,100% { transform: rotate(0deg); }
    25%      { transform: rotate(-10deg); }
    75%      { transform: rotate(10deg); }
  }
  h1 { font-size: 1.6rem; color: #f38ba8; margin-bottom: 0.5rem; }
  .time-left {
    font-size: 3rem;
    font-weight: 700;
    color: #fab387;
    margin: 1rem 0;
    font-variant-numeric: tabular-nums;
  }
  p { color: #a6adc8; margin-bottom: 2rem; line-height: 1.6; }
  .buttons { display: flex; gap: 12px; justify-content: center; }
  button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
  }
  button:hover { opacity: 0.85; transform: translateY(-1px); }
  button:active { transform: scale(0.97); }
  .btn-resume { background: #a6e3a1; color: #1e1e2e; }
  .btn-reset  { background: #45475a; color: #cdd6f4; }
</style>
</head>
<body>
<div class="card">
  <div class="icon">⚠️</div>
  <h1>Timer Dihentikan!</h1>
  <div class="time-left">${timeLeft}</div>
  <p>Kamu menghentikan sesi Pomodoro ${emoji} ini.<br>Sisa waktu di atas akan hangus.<br>Lanjut atau mulai dari awal?</p>
  <div class="buttons">
    <button class="btn-resume" onclick="send('resume')">▶ Lanjut</button>
    <button class="btn-reset"  onclick="send('reset')">↺ Reset</button>
  </div>
</div>
<script>
  const vscode = acquireVsCodeApi();
  function send(cmd) { vscode.postMessage({ command: cmd }); }
</script>
</body>
</html>`;
}

function getDoneHtml(emoji: string, isBreak: boolean, breakMins: number): string {
  const title    = isBreak ? 'Sesi Selesai!' : 'Istirahat Selesai!';
  const subtitle = isBreak
    ? `Mantap! Kamu udah fokus kerja keras. Istirahat ${breakMins} menit dulu ya~`
    : 'Oke, udah seger? Yuk balik fokus lagi!';
  const icon     = isBreak ? '🎉' : '💪';
  const nextLabel = isBreak ? `☕ Mulai Istirahat` : `${emoji} Balik Kerja`;
  const accentColor = isBreak ? '#a6e3a1' : '#89b4fa';

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #1e1e2e;
    color: #cdd6f4;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
  }
  .card {
    background: #313244;
    border: 1px solid ${accentColor};
    border-radius: 16px;
    padding: 3rem 2.5rem;
    text-align: center;
    max-width: 420px;
    width: 100%;
    animation: pop 0.3s ease;
  }
  @keyframes pop {
    from { transform: scale(0.9); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .icon { font-size: 80px; margin-bottom: 1rem; display: block; animation: bounce 0.6s ease 0.2s; }
  @keyframes bounce {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-12px); }
  }
  h1 { font-size: 1.8rem; color: ${accentColor}; margin-bottom: 0.75rem; }
  p  { color: #a6adc8; margin-bottom: 2rem; line-height: 1.6; }
  .buttons { display: flex; gap: 12px; justify-content: center; }
  button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s;
  }
  button:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-next  { background: ${accentColor}; color: #1e1e2e; }
  .btn-close { background: #45475a; color: #cdd6f4; }
</style>
</head>
<body>
<div class="card">
  <span class="icon">${icon}</span>
  <h1>${title}</h1>
  <p>${subtitle}</p>
  <div class="buttons">
    <button class="btn-next"  onclick="send('next')">${nextLabel}</button>
    <button class="btn-close" onclick="send('close')">Tutup</button>
  </div>
</div>
<script>
  const vscode = acquireVsCodeApi();
  function send(cmd) { vscode.postMessage({ command: cmd }); }
</script>
</body>
</html>`;
}

export function deactivate() {
  clearInterval(interval);
}