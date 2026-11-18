/**
 * SAMORE // PROTOCOL CORE ENGINE (ENHANCED)
 * Target: Shrikant More (@Samore141025)
 * Features:
 * - Bulletproof Bootstrap Lifecyle
 * - Matrix Rain Background Engine
 * - Autonomous GitHub Contribution Snake Simulator (Real Game Logic)
 * - Web Audio FX Synthesizer
 * - Tab Controller & Interactive HUD
 */

// Universal DOM Bootstrap Helper
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

// 1. Web Audio FX Synthesizer
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, type = 'sine', duration = 0.06, gain = 0.08) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(gain, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playClick() {
    this.playBeep(900, 'triangle', 0.03, 0.06);
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.1, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playGlitch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.04);
      osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.08, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playBeep(f, 'sine', 0.1, 0.1), idx * 70);
    });
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.15, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudio();

// 2. Matrix Digital Rain Canvas Engine
class MatrixRainEngine {
  constructor() {
    this.canvas = document.getElementById('matrix-canvas');
    this.ctx = null;
    this.active = true;
    this.fontSize = 15;
    this.columns = 0;
    this.drops = [];
    this.characters = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF<>*#+=-';
  }

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = Array.from({ length: this.columns }, () => Math.floor(Math.random() * -50));
  }

  loop() {
    if (!this.active || !this.ctx) {
      requestAnimationFrame(() => this.loop());
      return;
    }

    this.ctx.fillStyle = 'rgba(7, 10, 18, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Glow head character white/cyan
      this.ctx.fillStyle = '#cffffa';
      this.ctx.fillText(text, x, y);

      // Trailing characters green
      this.ctx.fillStyle = '#00ff41';
      this.ctx.fillText(text, x, y - this.fontSize);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    requestAnimationFrame(() => this.loop());
  }

  toggle() {
    this.active = !this.active;
    if (!this.active && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.active;
  }
}

// 3. Autonomous Contribution Snake Simulation Engine
// Spells "SAMORE", snake actively pathfinds, eats blocks, and letters regenerate infinitely!
class AutonomousContributionSnake {
  constructor() {
    this.canvas = document.getElementById('liveSnakeCanvas');
    this.ctx = null;
    this.cols = 53;
    this.rows = 7;
    this.cellSize = 14;
    this.gap = 4;
    this.grid = []; // 2D array of {x, y, active, isSamore}
    this.snake = [
      { x: 5, y: 3 },
      { x: 4, y: 3 },
      { x: 3, y: 3 }
    ];
    this.dir = { x: 1, y: 0 };
    this.manualMode = false;
    this.score = 0;
    this.eatenCount = 0;
    this.totalSamoreBlocks = 0;
    this.speed = 85; // ms
    this.intervalId = null;
  }

  init() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.cols * (this.cellSize + this.gap) + 20;
    this.canvas.height = this.rows * (this.cellSize + this.gap) + 20;

    this.initGrid();
    this.startLoop();
    this.bindControls();
  }

  // Letter matrix definitions for S-A-M-O-R-E
  initGrid() {
    this.grid = [];
    this.totalSamoreBlocks = 0;

    // SAMORE letter coordinate map
    const samoreMap = new Set();
    const addBlock = (c, r) => samoreMap.add(`${c},${r}`);

    // S (cols 4..8)
    [4,5,6,7,8].forEach(c => { addBlock(c, 0); addBlock(c, 3); addBlock(c, 6); });
    addBlock(4, 1); addBlock(4, 2);
    addBlock(8, 4); addBlock(8, 5);

    // A (cols 12..16)
    [13,14,15].forEach(c => addBlock(c, 0));
    [12,16].forEach(c => { addBlock(c, 1); addBlock(c, 2); addBlock(c, 4); addBlock(c, 5); addBlock(c, 6); });
    [12,13,14,15,16].forEach(c => addBlock(c, 3));

    // M (cols 20..24)
    [20,24].forEach(c => { for (let r = 0; r <= 6; r++) addBlock(c, r); });
    addBlock(21, 1); addBlock(22, 2); addBlock(23, 1);

    // O (cols 28..32)
    [29,30,31].forEach(c => { addBlock(c, 0); addBlock(c, 6); });
    [28,32].forEach(c => { for (let r = 1; r <= 5; r++) addBlock(c, r); });

    // R (cols 36..40)
    for (let r = 0; r <= 6; r++) addBlock(36, r);
    [37,38,39].forEach(c => { addBlock(c, 0); addBlock(c, 3); });
    addBlock(40, 1); addBlock(40, 2);
    addBlock(38, 4); addBlock(39, 5); addBlock(40, 6);

    // E (cols 44..48)
    for (let r = 0; r <= 6; r++) addBlock(44, r);
    [45,46,47,48].forEach(c => { addBlock(c, 0); addBlock(c, 3); addBlock(c, 6); });

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const isSamore = samoreMap.has(`${c},${r}`);
        if (isSamore) this.totalSamoreBlocks++;
        this.grid.push({
          c, r,
          isSamore,
          active: isSamore
        });
      }
    }
  }

  regenerateSamore() {
    window.cyberAudio.playSuccess();
    this.grid.forEach(cell => {
      if (cell.isSamore) cell.active = true;
    });
  }

  findTarget() {
    const head = this.snake[0];
    let nearest = null;
    let minDist = Infinity;

    this.grid.forEach(cell => {
      if (cell.isSamore && cell.active) {
        const dist = Math.abs(cell.c - head.x) + Math.abs(cell.r - head.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = cell;
        }
      }
    });

    return nearest;
  }

  aiDecideDirection() {
    const head = this.snake[0];
    const target = this.findTarget();

    if (!target) {
      // All blocks eaten, regenerate!
      this.regenerateSamore();
      return;
    }

    const possibleMoves = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 }
    ];

    // Filter out 180-degree reverse turns
    const validMoves = possibleMoves.filter(m => !(m.x === -this.dir.x && m.y === -this.dir.y));

    // Sort by proximity to target
    validMoves.sort((a, b) => {
      const nextA = { x: (head.x + a.x + this.cols) % this.cols, y: (head.y + a.y + this.rows) % this.rows };
      const nextB = { x: (head.x + b.x + this.cols) % this.cols, y: (head.y + b.y + this.rows) % this.rows };

      const distA = Math.hypot(nextA.x - target.c, nextA.y - target.r);
      const distB = Math.hypot(nextB.x - target.c, nextB.y - target.r);
      return distA - distB;
    });

    if (validMoves.length > 0) {
      this.dir = validMoves[0];
    }
  }

  step() {
    if (!this.manualMode) {
      this.aiDecideDirection();
    }

    const head = this.snake[0];
    const nextHead = {
      x: (head.x + this.dir.x + this.cols) % this.cols,
      y: (head.y + this.dir.y + this.rows) % this.rows
    };

    // Check if food eaten
    const eatenCell = this.grid.find(cell => cell.c === nextHead.x && cell.r === nextHead.y && cell.active);
    this.snake.unshift(nextHead);

    if (eatenCell) {
      eatenCell.active = false;
      this.score += 10;
      this.eatenCount++;
      window.cyberAudio.playBeep(850, 'triangle', 0.03, 0.04);

      const scoreEl = document.getElementById('liveSnakeScore');
      if (scoreEl) scoreEl.innerText = this.score;

      // Keep growing snake
      if (this.snake.length > 25) {
        this.snake.pop();
      }
    } else {
      this.snake.pop();
    }

    this.render();
  }

  render() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.fillStyle = '#050914';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Heatmap Cells
    const offsetX = 10;
    const offsetY = 10;

    this.grid.forEach(cell => {
      const px = offsetX + cell.c * (this.cellSize + this.gap);
      const py = offsetY + cell.r * (this.cellSize + this.gap);

      if (cell.isSamore && cell.active) {
        ctx.fillStyle = '#39d353';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00ff41';
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
      } else {
        ctx.fillStyle = cell.isSamore ? '#0d1829' : '#0f172a';
        ctx.shadowBlur = 0;
        ctx.fillRect(px, py, this.cellSize, this.cellSize);
      }
    });

    // Draw Snake
    this.snake.forEach((part, idx) => {
      const px = offsetX + part.x * (this.cellSize + this.gap);
      const py = offsetY + part.y * (this.cellSize + this.gap);

      ctx.fillStyle = idx === 0 ? '#00f0ff' : '#26a641';
      ctx.shadowBlur = idx === 0 ? 8 : 3;
      ctx.shadowColor = idx === 0 ? '#00f0ff' : '#00ff41';
      ctx.fillRect(px, py, this.cellSize, this.cellSize);
    });

    ctx.shadowBlur = 0;
  }

  startLoop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.step(), this.speed);
  }

  bindControls() {
    const controlBtn = document.getElementById('snakeModeToggleBtn');
    if (controlBtn) {
      controlBtn.addEventListener('click', () => {
        this.manualMode = !this.manualMode;
        controlBtn.innerText = this.manualMode ? "🎮 MODE: MANUAL" : "🤖 MODE: AI AUTO";
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.manualMode) return;
      if (['ArrowUp', 'KeyW'].includes(e.code) && this.dir.y === 0) this.dir = { x: 0, y: -1 };
      else if (['ArrowDown', 'KeyS'].includes(e.code) && this.dir.y === 0) this.dir = { x: 0, y: 1 };
      else if (['ArrowLeft', 'KeyA'].includes(e.code) && this.dir.x === 0) this.dir = { x: -1, y: 0 };
      else if (['ArrowRight', 'KeyD'].includes(e.code) && this.dir.x === 0) this.dir = { x: 1, y: 0 };
    });
  }
}

// 4. Main App Controller Initialization
onReady(() => {
  // Initialize Audio on first interaction
  const initAudio = () => {
    window.cyberAudio.init();
    window.removeEventListener('click', initAudio);
    window.removeEventListener('keydown', initAudio);
  };
  window.addEventListener('click', initAudio);
  window.addEventListener('keydown', initAudio);

  // Initialize Matrix Rain
  const matrixEngine = new MatrixRainEngine();
  matrixEngine.init();

  const matrixToggleBtn = document.getElementById('matrixToggleBtn');
  if (matrixToggleBtn) {
    matrixToggleBtn.addEventListener('click', () => {
      const isOn = matrixEngine.toggle();
      matrixToggleBtn.innerText = isOn ? "🌧️ MATRIX: ON" : "🌧️ MATRIX: OFF";
    });
  }

  // Initialize Autonomous Snake Simulator
  const snakeSim = new AutonomousContributionSnake();
  snakeSim.init();

  // Custom Cursor
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('button, a, input, .game-card, .legend-card, .prompt-chip, .tab-btn, .v-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
  }

  // Morphing Name Glitch Effect: SHRIKANT MORE <-> SAMORE
  const morphElement = document.getElementById('morphingName');
  if (morphElement) {
    const states = [
      "SHRIKANT MORE",
      "S A M O R E",
      "[ S.A.M.O.R.E. ]",
      "SHRIKANT MORE"
    ];
    const glyphs = "!<>-_\\/[]{}—=+*^?#________010101";
    let stateIdx = 0;

    function scrambleText(targetText, callback) {
      let iteration = 0;
      const interval = setInterval(() => {
        morphElement.innerText = targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) return targetText[index];
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("");

        if (iteration >= targetText.length) {
          clearInterval(interval);
          morphElement.innerText = targetText;
          if (callback) callback();
        }
        iteration += 1 / 2;
      }, 35);
    }

    function runMorphCycle() {
      stateIdx = (stateIdx + 1) % states.length;
      scrambleText(states[stateIdx], () => {
        window.cyberAudio.playGlitch();
        setTimeout(runMorphCycle, 3200);
      });
    }

    setTimeout(runMorphCycle, 2000);
  }

  // Tab Navigation Controller
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const contentEl = document.getElementById(target);
      if (contentEl) {
        contentEl.classList.add('active');
        window.cyberAudio.playClick();
      }
    });
  });

  // Sound Toggle Controller
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      window.cyberAudio.muted = !window.cyberAudio.muted;
      soundBtn.innerText = window.cyberAudio.muted ? "🔇 AUDIO: MUTED" : "🔊 AUDIO: ONLINE";
      soundBtn.style.borderColor = window.cyberAudio.muted ? "var(--text-red)" : "var(--border-neon)";
      soundBtn.style.color = window.cyberAudio.muted ? "var(--text-red)" : "var(--text-primary)";
    });
  }

  // Scanlines Toggle
  const scanlineBtn = document.getElementById('scanlineToggleBtn');
  const scanlineOverlay = document.querySelector('.scanlines');
  if (scanlineBtn && scanlineOverlay) {
    let scanlinesActive = true;
    scanlineBtn.addEventListener('click', () => {
      scanlinesActive = !scanlinesActive;
      scanlineOverlay.style.display = scanlinesActive ? 'block' : 'none';
      scanlineBtn.innerText = scanlinesActive ? "⚡ CRT: ON" : "⚡ CRT: OFF";
    });
  }
});
