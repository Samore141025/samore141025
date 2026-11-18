/**
 * SAMORE // PROTOCOL CORE ENGINE
 * Target: Shrikant More (@Samore141025)
 * Features: Sound FX Synth, Cursor Tracker, Glitch Text Morph, Tab Controller
 */

// 1. Web Audio FX Synthesizer (Zero External Dependencies)
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBeep(freq = 600, type = 'sine', duration = 0.06, gain = 0.1) {
    if (this.muted) return;
    this.init();
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
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playBeep(900, 'triangle', 0.03, 0.08);
  }

  playLaser() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.12, this.ctx.currentTime);
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
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(450, this.ctx.currentTime + 0.04);
      osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.1, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    try {
      const notes = [440, 554, 659, 880];
      notes.forEach((f, idx) => {
        setTimeout(() => this.playBeep(f, 'sine', 0.1, 0.12), idx * 70);
      });
    } catch (e) {}
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.2, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudio();

// 2. Custom Cyber Cursor Engine
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('custom-cursor');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }
  });

  // Hover triggers
  const interactiveSelector = 'button, a, input, .game-card, .legend-card, .prompt-chip, .tab-btn';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.classList.add('active');
      window.cyberAudio.playBeep(1200, 'sine', 0.02, 0.03);
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.classList.remove('active');
    });
    el.addEventListener('click', () => {
      window.cyberAudio.playClick();
    });
  });

  // 3. Glitch Text Morph Engine: SHRIKANT MORE <-> SAMORE
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
      const original = morphElement.innerText;
      const maxLen = Math.max(original.length, targetText.length);
      
      const interval = setInterval(() => {
        morphElement.innerText = targetText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return targetText[index];
            }
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

    setTimeout(runMorphCycle, 2500);
  }

  // 4. Tab Navigation Controller
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const contentEl = document.getElementById(target);
      if (contentEl) contentEl.classList.add('active');
    });
  });

  // 5. Sound Toggle Controller
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      window.cyberAudio.muted = !window.cyberAudio.muted;
      soundBtn.innerText = window.cyberAudio.muted ? "🔇 AUDIO: MUTED" : "🔊 AUDIO: ONLINE";
      soundBtn.style.borderColor = window.cyberAudio.muted ? "var(--text-red)" : "var(--border-neon)";
      soundBtn.style.color = window.cyberAudio.muted ? "var(--text-red)" : "var(--text-primary)";
    });
  }

  // 6. Scanlines Toggle
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

  // Initialize Audio on First User Interaction anywhere
  const initAudio = () => {
    window.cyberAudio.init();
    window.removeEventListener('click', initAudio);
    window.removeEventListener('keydown', initAudio);
  };
  window.addEventListener('click', initAudio);
  window.addEventListener('keydown', initAudio);
});
