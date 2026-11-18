/**
 * SAMORE // 8-GAME DYNAMIC CYBER ARCADE SUITE (ENHANCED)
 * Target: Shrikant More (@Samore141025)
 * Games:
 * 1. Cyber Snake (Matrix Commits Edition)
 * 2. Terminal Breach (Hex Password Cracker)
 * 3. Matrix Rain Runner (Dodge the Glitch)
 * 4. Memory Core Matrix (Cyber Simon Says)
 * 5. DDoS Defense (Packet Blaster)
 * 6. Cipher Decode (Speed Cryptanalysis)
 * 7. Cyber Invaders (Retro AI Defense)
 * 8. Binary Pong (Neon Firewall Pong)
 */

function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

class CyberArcade {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.currentGame = null;
    this.loopId = null;
    this.score = 0;
    this.cleanupHandler = null;
    this.inputBridge = null; // Bridge to pass virtual d-pad input to active game
  }

  init() {
    this.canvas = document.getElementById('activeGameCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
    this.bindEvents();
    this.bindVirtualControls();
  }

  bindEvents() {
    document.querySelectorAll('.launch-game-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const gameId = btn.getAttribute('data-game');
        this.launchGame(gameId);
      });
    });

    const closeBtn = document.getElementById('closeArenaBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.stopCurrentGame();
        const arena = document.getElementById('game-arena');
        if (arena) arena.classList.remove('active');
        window.cyberAudio.playClick();
      });
    }

    const restartBtn = document.getElementById('restartGameBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (this.currentGame) {
          this.launchGame(this.currentGame);
          window.cyberAudio.playClick();
        }
      });
    }
  }

  bindVirtualControls() {
    document.querySelectorAll('.v-btn').forEach(btn => {
      const sendKey = (isDown) => {
        const key = btn.getAttribute('data-key');
        if (!key) return;

        // Dispatch synthetic keyboard events so all games respond to touch/click
        const ev = new KeyboardEvent(isDown ? 'keydown' : 'keyup', {
          code: key,
          key: key,
          bubbles: true
        });
        window.dispatchEvent(ev);
        if (isDown) window.cyberAudio.playClick();
      };

      btn.addEventListener('mousedown', (e) => { e.preventDefault(); sendKey(true); });
      btn.addEventListener('mouseup', (e) => { e.preventDefault(); sendKey(false); });
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); sendKey(true); });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); sendKey(false); });
    });
  }

  stopCurrentGame() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      clearInterval(this.loopId);
      this.loopId = null;
    }
    if (this.cleanupHandler) {
      this.cleanupHandler();
      this.cleanupHandler = null;
    }
  }

  launchGame(gameId) {
    this.stopCurrentGame();
    this.currentGame = gameId;
    this.score = 0;

    // Refresh canvas reference
    this.canvas = document.getElementById('activeGameCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 720;
      this.canvas.height = 420;
    }

    const arena = document.getElementById('game-arena');
    if (arena) {
      arena.classList.add('active');
      arena.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const titleEl = document.getElementById('arenaGameTitle');
    const scoreEl = document.getElementById('arenaScore');
    if (scoreEl) scoreEl.innerText = '0';

    window.cyberAudio.playSuccess();

    switch (gameId) {
      case 'snake':
        if (titleEl) titleEl.innerText = 'CYBER SNAKE // MATRIX COMMITS EDITION';
        this.runSnake();
        break;
      case 'breach':
        if (titleEl) titleEl.innerText = 'TERMINAL BREACH // HEX CODE CRACKER';
        this.runBreach();
        break;
      case 'runner':
        if (titleEl) titleEl.innerText = 'MATRIX RUNNER // DODGE THE GLITCH';
        this.runRunner();
        break;
      case 'memory':
        if (titleEl) titleEl.innerText = 'MEMORY CORE // SIMON SAYS MAINFRAME';
        this.runMemory();
        break;
      case 'ddos':
        if (titleEl) titleEl.innerText = 'DDOS DEFENSE // PACKET BLASTER';
        this.runDDoS();
        break;
      case 'cipher':
        if (titleEl) titleEl.innerText = 'CIPHER DECODE // CRYPTANALYSIS SPEEDRUN';
        this.runCipher();
        break;
      case 'invaders':
        if (titleEl) titleEl.innerText = 'CYBER INVADERS // DEFEND THE CORE';
        this.runInvaders();
        break;
      case 'pong':
        if (titleEl) titleEl.innerText = 'BINARY PONG // FIREWALL BATTLE';
        this.runPong();
        break;
    }
  }

  updateHUDScore(val) {
    this.score = val;
    const scoreEl = document.getElementById('arenaScore');
    if (scoreEl) scoreEl.innerText = this.score;
  }

  /* ===================================================================
     GAME 1: CYBER SNAKE (MATRIX COMMITS EDITION)
     =================================================================== */
  runSnake() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const gridSize = 20;
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    let dx = 1;
    let dy = 0;
    let food = { x: 20, y: 10 };
    let gameOver = false;
    let speed = 90;

    const spawnFood = () => {
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
      };
    };

    const keyHandler = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && dy === 0) { dx = 0; dy = -1; }
      else if (['ArrowDown', 'KeyS'].includes(e.code) && dy === 0) { dx = 0; dy = 1; }
      else if (['ArrowLeft', 'KeyA'].includes(e.code) && dx === 0) { dx = -1; dy = 0; }
      else if (['ArrowRight', 'KeyD'].includes(e.code) && dx === 0) { dx = 1; dy = 0; }
    };
    window.addEventListener('keydown', keyHandler);
    this.cleanupHandler = () => window.removeEventListener('keydown', keyHandler);

    const gameInterval = setInterval(() => {
      if (gameOver) return;

      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Wall Wrap
      if (head.x < 0) head.x = canvas.width / gridSize - 1;
      if (head.x >= canvas.width / gridSize) head.x = 0;
      if (head.y < 0) head.y = canvas.height / gridSize - 1;
      if (head.y >= canvas.height / gridSize) head.y = 0;

      // Self Collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          gameOver = true;
          window.cyberAudio.playExplosion();
          ctx.fillStyle = '#ff0055';
          ctx.font = '24px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('SYSTEM BREACH: GAME OVER', canvas.width / 2, canvas.height / 2);
          ctx.font = '14px monospace';
          ctx.fillStyle = '#fff';
          ctx.fillText('Press [RESTART] or choose another protocol', canvas.width / 2, canvas.height / 2 + 35);
          return;
        }
      }

      snake.unshift(head);

      // Check Food
      if (head.x === food.x && head.y === food.y) {
        this.updateHUDScore(this.score + 10);
        window.cyberAudio.playBeep(900, 'sine', 0.05);
        spawnFood();
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Render Food (GitHub Commit Node)
      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff41';
      ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

      // Render Snake
      snake.forEach((part, idx) => {
        ctx.fillStyle = idx === 0 ? '#00f0ff' : '#26a641';
        ctx.shadowBlur = idx === 0 ? 10 : 3;
        ctx.shadowColor = idx === 0 ? '#00f0ff' : '#00ff41';
        ctx.fillRect(part.x * gridSize + 2, part.y * gridSize + 2, gridSize - 4, gridSize - 4);
      });
      ctx.shadowBlur = 0;

    }, speed);

    this.loopId = gameInterval;
  }

  /* ===================================================================
     GAME 2: TERMINAL BREACH (HEX CODE CRACKER)
     =================================================================== */
  runBreach() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    
    const target = Array.from({ length: 4 }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
    let attempts = [];
    let currentInput = '';
    let maxAttempts = 6;
    let won = false;

    const render = () => {
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '18px Orbitron';
      ctx.fillText('SECURITY MAINFRAME // DECRYPT 4-DIGIT HEX KEY', 30, 40);

      ctx.fillStyle = '#c5d1de';
      ctx.font = '14px "Share Tech Mono"';
      ctx.fillText(`ATTEMPTS REMAINING: ${maxAttempts - attempts.length} | VALID CHARS: 0-9, A-F`, 30, 68);

      let startY = 105;
      attempts.forEach((item, idx) => {
        ctx.fillStyle = item.won ? '#00ff41' : '#ffffff';
        ctx.font = '20px monospace';
        ctx.fillText(`LOG [${idx + 1}]: ${item.guess} -> ${item.feedback}`, 30, startY + idx * 32);
      });

      if (!won && attempts.length < maxAttempts) {
        ctx.fillStyle = '#00ff41';
        ctx.font = '22px monospace';
        ctx.fillText(`ENTER KEY > ${currentInput}_`, 30, startY + attempts.length * 32);
      }

      if (won) {
        ctx.fillStyle = '#00ff41';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('ACCESS GRANTED! TARGET ROOT UNLOCKED', canvas.width / 2, 360);
      } else if (attempts.length >= maxAttempts) {
        ctx.fillStyle = '#ff0055';
        ctx.font = '24px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(`ACCESS DENIED! THE KEY WAS: ${target}`, canvas.width / 2, 360);
      }
      ctx.textAlign = 'left';
    };

    const keyHandler = (e) => {
      if (won || attempts.length >= maxAttempts) return;

      const key = e.key.toUpperCase();
      if (hexChars.includes(key) && currentInput.length < 4) {
        currentInput += key;
        window.cyberAudio.playClick();
        render();
      } else if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        render();
      } else if ((e.key === 'Enter' || e.code === 'Space') && currentInput.length === 4) {
        let correctPlace = 0;
        let correctChar = 0;
        let tempTarget = target.split('');
        let tempGuess = currentInput.split('');

        tempGuess.forEach((char, i) => {
          if (char === tempTarget[i]) {
            correctPlace++;
            tempTarget[i] = null;
            tempGuess[i] = '#';
          }
        });

        tempGuess.forEach((char) => {
          if (char !== '#' && tempTarget.includes(char)) {
            correctChar++;
            tempTarget[tempTarget.indexOf(char)] = null;
          }
        });

        const feedback = `${correctPlace} LOCKED (Exact), ${correctChar} SHADOW (Misplaced)`;
        const isMatch = currentInput === target;
        attempts.push({ guess: currentInput, feedback, won: isMatch });

        if (isMatch) {
          won = true;
          this.updateHUDScore(this.score + 100);
          window.cyberAudio.playSuccess();
        } else {
          window.cyberAudio.playGlitch();
        }

        currentInput = '';
        render();
      }
    };

    window.addEventListener('keydown', keyHandler);
    this.cleanupHandler = () => window.removeEventListener('keydown', keyHandler);
    render();
  }

  /* ===================================================================
     GAME 3: MATRIX RAIN RUNNER (DODGE THE GLITCH)
     =================================================================== */
  runRunner() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    let player = { x: canvas.width / 2, y: canvas.height - 40, size: 24, speed: 8 };
    let obstacles = [];
    let keys = {};
    let score = 0;
    let gameOver = false;

    const keydown = (e) => keys[e.code] = true;
    const keyup = (e) => keys[e.code] = false;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    this.cleanupHandler = () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };

    let spawnTimer = 0;
    const loop = () => {
      if (gameOver) return;

      if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > player.size) player.x -= player.speed;
      if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width - player.size) player.x += player.speed;

      spawnTimer++;
      if (spawnTimer % 18 === 0) {
        obstacles.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          size: Math.random() * 20 + 16,
          speed: Math.random() * 3 + 4,
          char: ['0', '1', '!', 'X', 'ERR', '0x7F'][Math.floor(Math.random() * 6)]
        });
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obs.speed;

        const dist = Math.hypot(player.x - obs.x, player.y - obs.y);
        if (dist < player.size + obs.size / 2) {
          gameOver = true;
          window.cyberAudio.playExplosion();
          ctx.fillStyle = '#ff0055';
          ctx.font = '26px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('PACKET COLLISION // CONNECTION SEVERED', canvas.width / 2, canvas.height / 2);
          return;
        }

        if (obs.y > canvas.height + 30) {
          obstacles.splice(i, 1);
          score += 5;
          this.updateHUDScore(score);
        }
      }

      ctx.fillStyle = 'rgba(5, 8, 16, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      obstacles.forEach(obs => {
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';
        ctx.font = `bold ${obs.size}px monospace`;
        ctx.fillText(obs.char, obs.x, obs.y);
      });

      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(player.x, player.y - player.size);
      ctx.lineTo(player.x - player.size, player.y + player.size);
      ctx.lineTo(player.x + player.size, player.y + player.size);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      this.loopId = requestAnimationFrame(loop);
    };

    loop();
  }

  /* ===================================================================
     GAME 4: MEMORY CORE MATRIX (SIMON SAYS HACKER)
     =================================================================== */
  runMemory() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const quadrants = [
      { id: 0, x: 180, y: 70, w: 160, h: 120, color: '#00ff41', name: 'ALPHA' },
      { id: 1, x: 380, y: 70, w: 160, h: 120, color: '#00f0ff', name: 'BETA' },
      { id: 2, x: 180, y: 220, w: 160, h: 120, color: '#ffbd2e', name: 'GAMMA' },
      { id: 3, x: 380, y: 220, w: 160, h: 120, color: '#ff0055', name: 'DELTA' }
    ];

    let sequence = [];
    let playerSeq = [];
    let isShowing = false;
    let round = 1;

    const drawGrid = (highlightId = -1) => {
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '16px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`FIREWALL DEFENSE LEVEL: ${round} // ${isShowing ? 'WATCH SEQUENCE' : 'ENTER PATTERN'}`, canvas.width / 2, 40);

      quadrants.forEach(q => {
        ctx.fillStyle = highlightId === q.id ? '#ffffff' : q.color;
        ctx.globalAlpha = highlightId === q.id ? 1 : 0.45;
        ctx.shadowBlur = highlightId === q.id ? 22 : 0;
        ctx.shadowColor = q.color;
        ctx.fillRect(q.x, q.y, q.w, q.h);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Orbitron';
        ctx.fillText(q.name, q.x + q.w / 2, q.y + q.h / 2 + 5);
      });
    };

    const playSequence = () => {
      isShowing = true;
      playerSeq = [];
      sequence.push(Math.floor(Math.random() * 4));

      let step = 0;
      const interval = setInterval(() => {
        if (step >= sequence.length) {
          clearInterval(interval);
          isShowing = false;
          drawGrid();
          return;
        }

        const currentId = sequence[step];
        drawGrid(currentId);
        window.cyberAudio.playBeep(400 + currentId * 160, 'sine', 0.2);

        setTimeout(() => drawGrid(), 300);
        step++;
      }, 600);
    };

    const clickHandler = (e) => {
      if (isShowing) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

      quadrants.forEach(q => {
        if (mouseX >= q.x && mouseX <= q.x + q.w && mouseY >= q.y && mouseY <= q.y + q.h) {
          drawGrid(q.id);
          window.cyberAudio.playBeep(400 + q.id * 160, 'sine', 0.15);
          setTimeout(() => drawGrid(), 200);

          playerSeq.push(q.id);
          const currentStep = playerSeq.length - 1;

          if (playerSeq[currentStep] !== sequence[currentStep]) {
            window.cyberAudio.playExplosion();
            ctx.fillStyle = '#ff0055';
            ctx.font = '24px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('PATTERN DESYNC! FIREWALL LOCKED', canvas.width / 2, 380);
            return;
          }

          if (playerSeq.length === sequence.length) {
            this.updateHUDScore(round * 25);
            window.cyberAudio.playSuccess();
            round++;
            setTimeout(playSequence, 800);
          }
        }
      });
    };

    canvas.addEventListener('click', clickHandler);
    this.cleanupHandler = () => canvas.removeEventListener('click', clickHandler);

    drawGrid();
    setTimeout(playSequence, 500);
  }

  /* ===================================================================
     GAME 5: DDOS DEFENSE (PACKET BLASTER)
     =================================================================== */
  runDDoS() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    let turretX = canvas.width / 2;
    let bullets = [];
    let packets = [];
    let score = 0;
    let baseHealth = 100;
    let keys = {};

    const keydown = (e) => {
      keys[e.code] = true;
      if (e.code === 'Space') {
        bullets.push({ x: turretX, y: canvas.height - 40, vy: -10 });
        window.cyberAudio.playLaser();
      }
    };
    const keyup = (e) => keys[e.code] = false;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    this.cleanupHandler = () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };

    let tick = 0;
    const loop = () => {
      if (baseHealth <= 0) {
        ctx.fillStyle = '#ff0055';
        ctx.font = '26px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('SERVER OVERWHELMED: PACKET OVERLOAD', canvas.width / 2, canvas.height / 2);
        return;
      }

      tick++;
      if (keys['ArrowLeft'] || keys['KeyA']) turretX = Math.max(30, turretX - 7);
      if (keys['ArrowRight'] || keys['KeyD']) turretX = Math.min(canvas.width - 30, turretX + 7);

      if (tick % 24 === 0) {
        packets.push({
          x: Math.random() * (canvas.width - 60) + 30,
          y: -10,
          vy: Math.random() * 2 + 2,
          radius: 14,
          label: ['SYN', 'ACK', 'UDP', 'RST'][Math.floor(Math.random() * 4)]
        });
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y += bullets[i].vy;
        if (bullets[i].y < 0) bullets.splice(i, 1);
      }

      for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
        const p = packets[pIdx];
        p.y += p.vy;

        for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
          const b = bullets[bIdx];
          const dist = Math.hypot(p.x - b.x, p.y - b.y);
          if (dist < p.radius + 6) {
            packets.splice(pIdx, 1);
            bullets.splice(bIdx, 1);
            score += 15;
            this.updateHUDScore(score);
            window.cyberAudio.playBeep(1200, 'square', 0.05);
            break;
          }
        }

        if (p && p.y > canvas.height - 30) {
          packets.splice(pIdx, 1);
          baseHealth -= 15;
          window.cyberAudio.playGlitch();
        }
      }

      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = baseHealth > 40 ? '#00ff41' : '#ff0055';
      ctx.font = 'bold 15px Orbitron';
      ctx.fillText(`MAINFRAME HEALTH: ${baseHealth}%`, 25, 30);

      ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.fillRect(0, canvas.height - 15, canvas.width, 15);

      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0ff';
      bullets.forEach(b => ctx.fillRect(b.x - 2, b.y - 10, 4, 12));

      packets.forEach(p => {
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff0055';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.x, p.y + 3);
      });
      ctx.textAlign = 'left';

      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff41';
      ctx.beginPath();
      ctx.arc(turretX, canvas.height - 25, 18, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(turretX - 3, canvas.height - 45, 6, 20);
      ctx.shadowBlur = 0;

      this.loopId = requestAnimationFrame(loop);
    };

    loop();
  }

  /* ===================================================================
     GAME 6: CIPHER DECODE (CRYPTANALYSIS SPEEDRUN)
     =================================================================== */
  runCipher() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const ciphers = [
      { cipher: "MSOREA", answer: "SAMORE" },
      { cipher: "TNEOSRLFOW", answer: "TENSORFLOW" },
      { cipher: "IKLA UNILX", answer: "KALI LINUX" },
      { cipher: "HGSOU", answer: "SHUGO" },
      { cipher: "PNOEHIFTS", answer: "OPENSHIFT" },
      { cipher: "IKSRHANT MORE", answer: "SHRIKANT MORE" }
    ];

    let cipherIdx = 0;
    let currentInput = "";
    let score = 0;
    let timeLeft = 30;

    const render = () => {
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      ctx.font = '18px Orbitron';
      ctx.fillText(`CIPHER SPEEDRUN // TIME REMAINING: ${timeLeft}s`, 30, 40);

      ctx.fillStyle = '#c5d1de';
      ctx.font = '15px "Share Tech Mono"';
      ctx.fillText(`DECRYPT THE SCRAMBLED CYBER TOKEN:`, 30, 80);

      ctx.fillStyle = '#00ff41';
      ctx.font = 'bold 36px Orbitron';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff41';
      ctx.fillText(`[ ${ciphers[cipherIdx].cipher} ]`, 30, 140);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px monospace';
      ctx.fillText(`DECRYPTED INPUT > ${currentInput}_`, 30, 210);

      ctx.fillStyle = '#c5d1de';
      ctx.font = '13px monospace';
      ctx.fillText(`(Type answer on keyboard / D-pad, then press ENTER)`, 30, 260);

      if (timeLeft <= 0) {
        ctx.fillStyle = '#ff0055';
        ctx.font = '24px Orbitron';
        ctx.fillText(`TIMES UP! FINAL SCORE: ${score}`, 30, 320);
      }
    };

    const timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) clearInterval(timerInterval);
      render();
    }, 1000);

    const keyHandler = (e) => {
      if (timeLeft <= 0) return;

      if (e.key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
        render();
      } else if (e.key === 'Enter') {
        if (currentInput.toUpperCase().trim() === ciphers[cipherIdx].answer.replace(/\s+/g, '')) {
          score += 50;
          this.updateHUDScore(score);
          window.cyberAudio.playSuccess();
          cipherIdx = (cipherIdx + 1) % ciphers.length;
          currentInput = "";
        } else {
          window.cyberAudio.playGlitch();
          currentInput = "";
        }
        render();
      } else if (e.key.length === 1 && /[a-zA-Z0-9 ]/.test(e.key)) {
        currentInput += e.key.toUpperCase();
        window.cyberAudio.playClick();
        render();
      }
    };

    window.addEventListener('keydown', keyHandler);
    this.cleanupHandler = () => {
      clearInterval(timerInterval);
      window.removeEventListener('keydown', keyHandler);
    };

    render();
  }

  /* ===================================================================
     GAME 7: CYBER INVADERS (RETRO AI DEFENSE)
     =================================================================== */
  runInvaders() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    let playerX = canvas.width / 2;
    let bullets = [];
    let invaders = [];
    let invaderDir = 1;
    let score = 0;
    let keys = {};

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        invaders.push({
          x: 80 + c * 70,
          y: 60 + r * 45,
          alive: true
        });
      }
    }

    const keydown = (e) => {
      keys[e.code] = true;
      if (e.code === 'Space') {
        bullets.push({ x: playerX, y: canvas.height - 40, vy: -9 });
        window.cyberAudio.playLaser();
      }
    };
    const keyup = (e) => keys[e.code] = false;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    this.cleanupHandler = () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };

    let tick = 0;
    const loop = () => {
      tick++;

      if (keys['ArrowLeft'] || keys['KeyA']) playerX = Math.max(30, playerX - 7);
      if (keys['ArrowRight'] || keys['KeyD']) playerX = Math.min(canvas.width - 30, playerX + 7);

      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y += bullets[i].vy;
        if (bullets[i].y < 0) bullets.splice(i, 1);
      }

      if (tick % 28 === 0) {
        let touchEdge = false;
        invaders.forEach(inv => {
          if (!inv.alive) return;
          inv.x += invaderDir * 15;
          if (inv.x > canvas.width - 50 || inv.x < 50) touchEdge = true;
        });

        if (touchEdge) {
          invaderDir *= -1;
          invaders.forEach(inv => inv.y += 14);
        }
      }

      bullets.forEach((b, bIdx) => {
        invaders.forEach(inv => {
          if (inv.alive && Math.hypot(b.x - inv.x, b.y - inv.y) < 22) {
            inv.alive = false;
            bullets.splice(bIdx, 1);
            score += 25;
            this.updateHUDScore(score);
            window.cyberAudio.playBeep(1000, 'square', 0.08);
          }
        });
      });

      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      invaders.forEach(inv => {
        if (!inv.alive) return;
        ctx.fillStyle = '#00ff41';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00ff41';
        ctx.fillRect(inv.x - 14, inv.y - 10, 28, 20);
        ctx.fillStyle = '#000';
        ctx.fillRect(inv.x - 8, inv.y - 5, 4, 4);
        ctx.fillRect(inv.x + 4, inv.y - 5, 4, 4);
      });
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#00f0ff';
      bullets.forEach(b => ctx.fillRect(b.x - 2, b.y - 8, 4, 10));

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(playerX - 18, canvas.height - 25, 36, 15);
      ctx.fillRect(playerX - 4, canvas.height - 35, 8, 10);

      this.loopId = requestAnimationFrame(loop);
    };

    loop();
  }

  /* ===================================================================
     GAME 8: BINARY PONG (NEON FIREWALL PONG)
     =================================================================== */
  runPong() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    let playerY = canvas.height / 2 - 40;
    let aiY = canvas.height / 2 - 40;
    let paddleH = 80;
    let paddleW = 12;
    let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 5, vy: 3, r: 8 };
    let score = 0;
    let keys = {};

    const keydown = (e) => keys[e.code] = true;
    const keyup = (e) => keys[e.code] = false;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    this.cleanupHandler = () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };

    const loop = () => {
      if (keys['ArrowUp'] || keys['KeyW']) playerY = Math.max(0, playerY - 7);
      if (keys['ArrowDown'] || keys['KeyS']) playerY = Math.min(canvas.height - paddleH, playerY + 7);

      const aiCenter = aiY + paddleH / 2;
      if (aiCenter < ball.y - 10) aiY += 4.5;
      else if (aiCenter > ball.y + 10) aiY -= 4.5;

      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y < ball.r || ball.y > canvas.height - ball.r) {
        ball.vy *= -1;
        window.cyberAudio.playBeep(500, 'sine', 0.03);
      }

      if (ball.x - ball.r < 30 + paddleW && ball.y > playerY && ball.y < playerY + paddleH) {
        ball.vx = Math.abs(ball.vx) * 1.05;
        score += 10;
        this.updateHUDScore(score);
        window.cyberAudio.playBeep(800, 'triangle', 0.04);
      }

      if (ball.x + ball.r > canvas.width - 30 - paddleW && ball.y > aiY && ball.y < aiY + paddleH) {
        ball.vx = -Math.abs(ball.vx) * 1.05;
        window.cyberAudio.playBeep(700, 'triangle', 0.04);
      }

      if (ball.x < 0 || ball.x > canvas.width) {
        ball = { x: canvas.width / 2, y: canvas.height / 2, vx: ball.x < 0 ? 5 : -5, vy: 3, r: 8 };
        window.cyberAudio.playGlitch();
      }

      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#00ff41';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff41';
      ctx.fillRect(30, playerY, paddleW, paddleH);

      ctx.fillStyle = '#ff0055';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ff0055';
      ctx.fillRect(canvas.width - 30 - paddleW, aiY, paddleW, paddleH);

      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00f0ff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      this.loopId = requestAnimationFrame(loop);
    };

    loop();
  }
}

window.cyberArcade = new CyberArcade();
onReady(() => {
  window.cyberArcade.init();
});
