/**
 * SAMORE // 10 CUTTING-EDGE HACKER PORTFOLIO ENGINES
 * Author: Shrikant More (@Samore141025)
 * Modules:
 * 1. ShugoThreatRadar (Interactive Cyber Threat World Map Radar)
 * 2. HackerTerminalCLI (Full Interactive Shell with Tab-complete & History)
 * 3. AiComputerVisionEngine (Satellite Optical Flow & Edge Detection Simulator)
 * 4. Aerospace3DEngine (Interactive Rotating 3D Wireframe Satellite/Defense Drone)
 * 5. OpenShiftClusterMap (Red Hat Enterprise AI & Kubernetes Topology Map)
 * 6. CtfChallengeEngine (DevTools Console CTF with Secret Flag & Fanfare)
 * 7. ResumeDossierExporter (One-Click Cyber ATS Resume PDF/Print View)
 * 8. CertVerificationModal (Holographic Cryptographic Credential Inspector)
 * 9. CyberAmbientRadio (Synthesized Web Audio Binaural Drone Stream)
 * 10. ThemeSwitcherEngine (Matrix Green, Cyber Cyan, Kali Red, Vintage Amber)
 */

function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

/* ===================================================================
   1. SHUGO THREAT RADAR (Interactive Canvas Radar)
   =================================================================== */
class ShugoThreatRadar {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.angle = 0;
    this.threats = [];
    this.animId = null;
    this.interceptedCount = 5240;
  }

  init() {
    this.canvas = document.getElementById('threatRadarCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate simulated persistent threat coordinates
    for (let i = 0; i < 9; i++) {
      this.threats.push({
        r: Math.random() * 0.75 + 0.1,
        theta: Math.random() * Math.PI * 2,
        type: ['SYN FLOOD', 'BRUTE FORCE', 'ZERO-DAY PROBE', 'UAV HIJACK ATTEMPT', 'MALICIOUS SWARM'][i % 5],
        ip: `192.168.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`,
        status: 'INTERCEPTED',
        alpha: 0
      });
    }

    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 360;
  }

  loop() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(cx, cy) - 20;

    // Fade background trail
    ctx.fillStyle = 'rgba(2, 6, 14, 0.22)';
    ctx.fillRect(0, 0, w, h);

    // Draw concentric radar rings
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
    ctx.lineWidth = 1;
    for (let r = 0.25; r <= 1; r += 0.25) {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.stroke();

    // Rotating Radar Sweep Beam
    this.angle += 0.03;
    const grad = ctx.createConicGradient(this.angle, cx, cy);
    grad.addColorStop(0, 'rgba(0, 255, 65, 0.45)');
    grad.addColorStop(0.12, 'rgba(0, 240, 255, 0.05)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
    ctx.fill();

    // Plot threat targets
    const normAngle = this.angle % (Math.PI * 2);
    this.threats.forEach((t) => {
      const tx = cx + Math.cos(t.theta) * (maxR * t.r);
      const ty = cy + Math.sin(t.theta) * (maxR * t.r);

      // Check if sweep passes threat
      const diff = Math.abs(t.theta - normAngle);
      if (diff < 0.1) {
        t.alpha = 1;
        this.interceptedCount++;
        const countEl = document.getElementById('radarBlockedCount');
        if (countEl) countEl.innerText = this.interceptedCount.toLocaleString();
      } else {
        t.alpha = Math.max(0.2, t.alpha - 0.01);
      }

      ctx.fillStyle = `rgba(255, 0, 85, ${t.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff0055';
      ctx.beginPath();
      ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw threat tag
      ctx.fillStyle = `rgba(0, 240, 255, ${t.alpha})`;
      ctx.font = '10px monospace';
      ctx.fillText(`${t.type} [${t.status}]`, tx + 7, ty - 4);
    });

    this.animId = requestAnimationFrame(() => this.loop());
  }
}

/* ===================================================================
   2. HACKER TERMINAL CLI (Interactive Shell)
   =================================================================== */
class HackerTerminalCLI {
  constructor() {
    this.history = [];
    this.histIdx = -1;
    this.isOpen = false;
  }

  init() {
    const input = document.getElementById('cliTerminalInput');
    const toggleBtn = document.getElementById('cliToggleBtn');
    const drawer = document.getElementById('cliTerminalDrawer');
    const closeBtn = document.getElementById('closeCliBtn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggle(false));
    }

    // Keyboard shortcut: Backtick opens terminal
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.toggle();
      }
    });

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = input.value.trim();
          input.value = '';
          if (cmd) {
            this.history.push(cmd);
            this.histIdx = this.history.length;
            this.exec(cmd);
          }
        } else if (e.key === 'ArrowUp') {
          if (this.histIdx > 0) {
            this.histIdx--;
            input.value = this.history[this.histIdx] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (this.histIdx < this.history.length - 1) {
            this.histIdx++;
            input.value = this.history[this.histIdx] || '';
          } else {
            this.histIdx = this.history.length;
            input.value = '';
          }
        }
      });
    }
  }

  toggle(forceState) {
    const drawer = document.getElementById('cliTerminalDrawer');
    if (!drawer) return;
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      drawer.classList.add('active');
      const input = document.getElementById('cliTerminalInput');
      if (input) setTimeout(() => input.focus(), 150);
      window.cyberAudio.playSuccess();
    } else {
      drawer.classList.remove('active');
      window.cyberAudio.playClick();
    }
  }

  print(text, type = 'normal') {
    const output = document.getElementById('cliTerminalOutput');
    if (!output) return;
    const line = document.createElement('div');
    line.className = `cli-line cli-${type}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  exec(raw) {
    this.print(`shrikant@shugo-root:~# ${raw}`, 'prompt');
    const [cmd, ...args] = raw.toLowerCase().split(' ');

    switch (cmd) {
      case 'help':
        this.print(`AVAILABLE SHELL COMMANDS:
  <span style="color:#00ff41">whoami</span>       - Display system identity & clearances
  <span style="color:#00ff41">skills</span>       - Inspect technical dossiers & capabilities
  <span style="color:#00ff41">shugo</span>        - Query live SHUGO Swarm defense network
  <span style="color:#00ff41">nmap</span>         - Run cyber port scan against local host
  <span style="color:#00ff41">theme &lt;name&gt;</span> - Set colorway: matrix, cyan, kali, amber
  <span style="color:#00ff41">radio</span>        - Toggle synthesized cyber ambient stream
  <span style="color:#00ff41">resume</span>       - Generate and open ATS printable dossier
  <span style="color:#00ff41">unlock &lt;key&gt;</span> - Submit cryptographic CTF flag
  <span style="color:#00ff41">clear</span>        - Clear terminal output buffer
  <span style="color:#00ff41">exit</span>         - Minimize terminal shell`);
        break;

      case 'whoami':
        this.print(`IDENTITY: Shrikant More (Codename: SAMORE)
ROLE: AI/ML Researcher • Certified Ethical Hacker (CEH) • Defense Aviation
CLEARANCE: Level 5 // Root Node
ORGANIZATIONS: SHUGO Defense, EduSkills Academy, ACES NMIET, IEEE`);
        break;

      case 'skills':
      case 'cat':
        this.print(`[+] SECTOR 01: Deep Learning, TensorFlow, Object Detection, Satellite Vision
[+] SECTOR 02: Certified Ethical Hacker (CEH), Threat Intelligence (CTI/CTH), Kali
[+] SECTOR 03: Red Hat OpenShift AI 2.13, AWS Cloud, Industrial IT (Flash Electronics)
[+] SECTOR 04: Defense Aviation, Remote Sensing (Bharatiya Antariksh Hackathon)`);
        break;

      case 'nmap':
        this.print(`Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-19
Nmap scan report for samore.cyber.internal (127.0.0.1)
Host is up (0.00012s latency).
PORT       STATE SERVICE     VERSION
22/tcp     OPEN  ssh         OpenSSH 9.6 (SHUGO Shielded)
80/tcp     OPEN  http        Nginx / SAMORE Terminal
443/tcp    OPEN  ssl/https   TLSv1.3 Encrypted
141025/tcp OPEN  shugo-core  Autonomous Agent Swarm v2.6
Nmap done: 1 IP address (1 host up) scanned in 0.42 seconds`);
        break;

      case 'shugo':
        this.print(`[SHUGO THREAT INTELLIGENCE CORE]
● Status: ACTIVE & MONITORING
● Swarm Daemons: 32 Multi-Agent Watchdogs
● Neutralized Attacks: 5,240+ Packets
● Defense Vector: Aviation Systems & Cloud Orchestration`);
        break;

      case 'theme':
        const themeName = args[0];
        if (['matrix', 'cyan', 'kali', 'amber'].includes(themeName)) {
          window.themeSwitcher.setTheme(themeName);
          this.print(`[+] System colorway switched to: ${themeName.toUpperCase()}`, 'success');
        } else {
          this.print(`Usage: theme &lt;matrix|cyan|kali|amber&gt;`, 'error');
        }
        break;

      case 'radio':
        window.cyberRadio.toggle();
        this.print(`[+] Cyber Ambient Radio state toggled.`, 'success');
        break;

      case 'resume':
        window.resumeExporter.open();
        this.print(`[+] Opening ATS Dossier view...`, 'success');
        break;

      case 'unlock':
        const key = args.join(' ');
        if (key === 'c2Ftb3JlX3Jvb3RfcGFzc3dvcmRfMTQxMDI1' || key === 'samore_root_password_141025') {
          window.ctfChallenge.solve();
          this.print(`[!!!] ROOT FLAG ACCEPTED: ACCESS GRANTED [!!!]`, 'success');
        } else {
          this.print(`[-] Access denied. Invalid authorization key. Check DevTools console for cipher.`, 'error');
        }
        break;

      case 'clear':
        const output = document.getElementById('cliTerminalOutput');
        if (output) output.innerHTML = '';
        break;

      case 'exit':
        this.toggle(false);
        break;

      default:
        this.print(`command not found: ${cmd}. Type 'help' for authorized commands.`, 'error');
        break;
    }
  }
}

/* ===================================================================
   3. AI COMPUTER VISION & OPTICAL FLOW SIMULATOR
   =================================================================== */
class AiComputerVisionEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.showVectors = true;
    this.showBBoxes = true;
  }

  init() {
    this.canvas = document.getElementById('cvCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Optical Flow motion grid
    for (let i = 0; i < 48; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        label: ['AEROSPACE_UAV', 'SATELLITE_ORBIT', 'GROUND_TELEMETRY', 'OPTICAL_TARGET'][i % 4],
        conf: (Math.random() * 8 + 92).toFixed(1)
      });
    }

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    });
    this.canvas.addEventListener('mouseleave', () => this.mouse.active = false);

    const toggleVectorBtn = document.getElementById('cvToggleVectors');
    if (toggleVectorBtn) {
      toggleVectorBtn.addEventListener('click', () => {
        this.showVectors = !this.showVectors;
        toggleVectorBtn.classList.toggle('active', this.showVectors);
      });
    }

    const toggleBBoxBtn = document.getElementById('cvToggleBBoxes');
    if (toggleBBoxBtn) {
      toggleBBoxBtn.addEventListener('click', () => {
        this.showBBoxes = !this.showBBoxes;
        toggleBBoxBtn.classList.toggle('active', this.showBBoxes);
      });
    }

    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 360;
  }

  loop() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = 'rgba(4, 8, 16, 0.3)';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    this.particles.forEach((p, idx) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Mouse attraction / optical flow influence
      if (this.mouse.active) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }
      }

      // Draw Optical Flow Vector
      if (this.showVectors) {
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 12, p.y + p.vy * 12);
        ctx.stroke();

        ctx.fillStyle = '#00ff41';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Bounding Boxes on key objects
      if (this.showBBoxes && idx % 7 === 0) {
        const boxSize = 56;
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(p.x - boxSize/2, p.y - boxSize/2, boxSize, boxSize);

        // Corner brackets
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.font = '10px monospace';
        ctx.fillText(`[${p.label} ${p.conf}%]`, p.x - boxSize/2, p.y - boxSize/2 - 4);
      }
    });

    // Crosshair over mouse
    if (this.mouse.active) {
      ctx.strokeStyle = 'rgba(255, 0, 85, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.mouse.x - 16, this.mouse.y - 16, 32, 32);
      ctx.beginPath();
      ctx.moveTo(this.mouse.x, this.mouse.y - 22);
      ctx.lineTo(this.mouse.x, this.mouse.y + 22);
      ctx.moveTo(this.mouse.x - 22, this.mouse.y);
      ctx.lineTo(this.mouse.x + 22, this.mouse.y);
      ctx.stroke();
    }

    requestAnimationFrame(() => this.loop());
  }
}

/* ===================================================================
   4. HOLOGRAPHIC 3D AEROSPACE WIREFRAME (Pure 3D Canvas Math)
   =================================================================== */
class Aerospace3DEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.rotX = 0.3;
    this.rotY = 0.5;
    this.rotZ = 0;
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };

    // 3D Model: Defense Satellite with Solar Wings & Antenna Core
    this.vertices = [
      // Core cube
      {x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}, {x: -1, y: 1, z: -1},
      {x: -1, y: -1, z: 1},  {x: 1, y: -1, z: 1},  {x: 1, y: 1, z: 1},  {x: -1, y: 1, z: 1},
      // Solar Panel Left
      {x: -3.5, y: -0.6, z: 0}, {x: -1.2, y: -0.6, z: 0}, {x: -1.2, y: 0.6, z: 0}, {x: -3.5, y: 0.6, z: 0},
      // Solar Panel Right
      {x: 1.2, y: -0.6, z: 0}, {x: 3.5, y: -0.6, z: 0}, {x: 3.5, y: 0.6, z: 0}, {x: 1.2, y: 0.6, z: 0},
      // Top Dish
      {x: 0, y: -2.2, z: 0}, {x: 0, y: -1.0, z: 0}
    ];

    this.edges = [
      // Cube edges
      [0,1], [1,2], [2,3], [3,0],
      [4,5], [5,6], [6,7], [7,4],
      [0,4], [1,5], [2,6], [3,7],
      // Solar Panels
      [8,9], [9,10], [10,11], [11,8],
      [12,13], [13,14], [14,15], [15,12],
      // Dish antenna
      [16,17]
    ];
  }

  init() {
    this.canvas = document.getElementById('aerospaceCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse drag rotation
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      this.rotY += dx * 0.01;
      this.rotX += dy * 0.01;
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => this.isDragging = false);

    this.loop();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width || 600;
    this.canvas.height = 360;
  }

  project(p, w, h) {
    // Rotation X
    let y1 = p.y * Math.cos(this.rotX) - p.z * Math.sin(this.rotX);
    let z1 = p.y * Math.sin(this.rotX) + p.z * Math.cos(this.rotX);

    // Rotation Y
    let x2 = p.x * Math.cos(this.rotY) + z1 * Math.sin(this.rotY);
    let z2 = -p.x * Math.sin(this.rotY) + z1 * Math.cos(this.rotY);

    // Perspective scale
    const fov = 300;
    const scale = fov / (fov + z2 * 45 + 160);
    return {
      x: x2 * scale * 55 + w / 2,
      y: y1 * scale * 55 + h / 2,
      scale: scale
    };
  }

  loop() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Auto spin if not dragging
    if (!this.isDragging) {
      this.rotY += 0.012;
      this.rotZ += 0.004;
    }

    ctx.fillStyle = '#030611';
    ctx.fillRect(0, 0, w, h);

    // Telemetry HUD readouts
    ctx.fillStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.font = '11px monospace';
    ctx.fillText(`PITCH: ${(this.rotX * 57.3).toFixed(1)}°`, 14, 24);
    ctx.fillText(`YAW:   ${(this.rotY * 57.3 % 360).toFixed(1)}°`, 14, 40);
    ctx.fillText(`TARGET: BHARATIYA_ANTARIKSH_SAT`, 14, 56);
    ctx.fillText(`STATUS: TELEMETRY ENCRYPTED`, 14, 72);

    // Projected vertices
    const proj = this.vertices.map(v => this.project(v, w, h));

    // Render edges
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';

    this.edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(proj[i].x, proj[i].y);
      ctx.lineTo(proj[j].x, proj[j].y);
      ctx.stroke();
    });

    // Render vertices
    ctx.fillStyle = '#00ff41';
    ctx.shadowColor = '#00ff41';
    proj.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    requestAnimationFrame(() => this.loop());
  }
}

/* ===================================================================
   5. OPENSHIFT AI CLUSTER TOPOLOGY MAP
   =================================================================== */
class OpenShiftClusterMap {
  init() {
    const nodes = document.querySelectorAll('.cluster-node');
    const infoPanel = document.getElementById('clusterNodeInfo');
    if (!nodes.length || !infoPanel) return;

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        nodes.forEach(n => n.classList.remove('selected'));
        node.classList.add('selected');

        const title = node.getAttribute('data-title');
        const role = node.getAttribute('data-role');
        const pods = node.getAttribute('data-pods');
        const cpu = node.getAttribute('data-cpu');
        const status = node.getAttribute('data-status');

        infoPanel.innerHTML = `
          <div style="font-family:var(--font-cyber); font-size:15px; color:var(--text-cyan); margin-bottom:8px;">
            ${title}
          </div>
          <div style="font-size:12px; color:var(--text-muted); line-height:1.6;">
            <div>&gt; ROLE: <span style="color:#fff">${role}</span></div>
            <div>&gt; ACTIVE PODS: <span style="color:var(--text-primary)">${pods}</span></div>
            <div>&gt; COMPUTE LOAD: <span style="color:var(--text-cyan)">${cpu}</span></div>
            <div>&gt; WATCHDOG: <span style="color:#00ff41">${status}</span></div>
          </div>
        `;
        window.cyberAudio.playClick();
      });
    });
  }
}

/* ===================================================================
   6. CTF CHALLENGE (DevTools Console Challenge)
   =================================================================== */
class CtfChallengeEngine {
  init() {
    console.log("%c========================================================", "color:#00ff41; font-weight:bold;");
    console.log("%c[!] SHUGO SECURITY SYSTEM // ROOT PROTOCOL INITIALIZED", "color:#00f0ff; font-weight:bold; font-size:14px;");
    console.log("%c[!] HACKER CTF CHALLENGE FOR OPERATORS & RECRUITERS:", "color:#ff0055; font-weight:bold;");
    console.log("%cDecode the Base64 security string below:", "color:#ffffff;");
    console.log("%cc2Ftb3JlX3Jvb3RfcGFzc3dvcmRfMTQxMDI1", "color:#00ff41; background:#070d18; font-size:13px; padding:4px;");
    console.log("%cTransmit in Terminal CLI: 'unlock <decoded_key>' or 'unlock c2Ftb3JlX3Jvb3RfcGFzc3dvcmRfMTQxMDI1'", "color:#8892b0;");
    console.log("%c========================================================", "color:#00ff41; font-weight:bold;");
  }

  solve() {
    window.cyberAudio.playSuccess();
    const banner = document.getElementById('ctfSuccessBanner');
    if (banner) {
      banner.style.display = 'block';
      setTimeout(() => banner.scrollIntoView({ behavior: 'smooth' }), 200);
    }
    alert("⚡ [SECURITY CLEARANCE GRANTED] ⚡\nCryptographic CTF Verified! You have unlocked Root Clearance Level 5.");
  }
}

/* ===================================================================
   7. RESUME DOSSIER EXPORTER (ATS Print View)
   =================================================================== */
class ResumeDossierExporter {
  init() {
    const btn = document.getElementById('exportResumeBtn');
    const modal = document.getElementById('resumeModal');
    const closeBtn = document.getElementById('closeResumeBtn');
    const printBtn = document.getElementById('printResumeBtn');

    if (btn) btn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());
  }

  open() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
      modal.classList.add('active');
      window.cyberAudio.playSuccess();
    }
  }

  close() {
    const modal = document.getElementById('resumeModal');
    if (modal) {
      modal.classList.remove('active');
      window.cyberAudio.playClick();
    }
  }
}

/* ===================================================================
   8. CERTIFICATION VERIFICATION MODAL
   =================================================================== */
class CertVerificationModal {
  constructor() {
    this.certs = {
      ceh: {
        title: "CERTIFIED ETHICAL HACKER (CEH)",
        issuer: "EduSkills Academy / EC-Council Aligned",
        id: "AUTH-CEH-EDU-141025",
        status: "CRYPTOGRAPHICALLY VERIFIED",
        skills: "Penetration Testing, Vulnerability Assessment, Kali Linux, Malware Analysis, Network Defense"
      },
      openshift: {
        title: "RED HAT OPENSHIFT AI (AI262F)",
        issuer: "Red Hat Training & Certification (RHA Ver. 2.13)",
        id: "RH-AI262F-2.13-141025",
        status: "ENTERPRISE VERIFIED",
        skills: "OpenShift AI, Enterprise Kubernetes, Model Serving Pipelines, GPU Containerization"
      },
      shugo: {
        title: "SHUGO GUARDIAN INTELLIGENCE CORE",
        issuer: "SHUGO Cyber Threat Intelligence Project",
        id: "SHUGO-CTI-CTH-994",
        status: "ACTIVE RESEARCH CLEARANCE",
        skills: "Cyber Threat Intelligence (CTI), Cyber Threat Hunting (CTH), Multi-Agent Defense Swarms"
      },
      aviation: {
        title: "DEFENSE AVIATION & SATELLITE VISION",
        issuer: "Bharatiya Antariksh Hackathon / ISRO Space Vision",
        id: "BAH-SPACE-OPTICAL-2025",
        status: "AWARD / COMPETENCY VERIFIED",
        skills: "Satellite Image Processing, Remote Sensing, Optical Flow Estimation, Aerospace Telemetry"
      }
    };
  }

  init() {
    const modal = document.getElementById('certModal');
    const closeBtn = document.getElementById('closeCertBtn');

    document.querySelectorAll('.verify-cert-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const certKey = btn.getAttribute('data-cert');
        const data = this.certs[certKey];
        if (!data || !modal) return;

        document.getElementById('certModalTitle').innerText = data.title;
        document.getElementById('certModalIssuer').innerText = data.issuer;
        document.getElementById('certModalId').innerText = data.id;
        document.getElementById('certModalStatus').innerText = data.status;
        document.getElementById('certModalSkills').innerText = data.skills;

        modal.classList.add('active');
        window.cyberAudio.playSuccess();
      });
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        window.cyberAudio.playClick();
      });
    }
  }
}

/* ===================================================================
   9. CYBER AMBIENT RADIO (Web Audio Synthesized Drone)
   =================================================================== */
class CyberAmbientRadio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.osc1 = null;
    this.osc2 = null;
    this.gain = null;
  }

  init() {
    const btn = document.getElementById('radioToggleBtn');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    const btn = document.getElementById('radioToggleBtn');
    if (!this.isPlaying) {
      this.start();
      if (btn) {
        btn.innerText = "📻 RADIO: ONLINE";
        btn.style.color = "var(--text-cyan)";
        btn.style.borderColor = "var(--border-cyan)";
      }
    } else {
      this.stop();
      if (btn) {
        btn.innerText = "📻 RADIO: OFF";
        btn.style.color = "var(--text-primary)";
        btn.style.borderColor = "var(--border-neon)";
      }
    }
  }

  start() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Low-frequency ambient sci-fi drone
    this.osc1 = this.ctx.createOscillator();
    this.osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.gain = this.ctx.createGain();

    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // A1 note
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(110.5, this.ctx.currentTime); // Slight binaural beat

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);

    this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 2); // Soft volume

    this.osc1.connect(filter);
    this.osc2.connect(filter);
    filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.isPlaying = true;
  }

  stop() {
    if (this.gain && this.ctx) {
      this.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        if (this.osc1) this.osc1.stop();
        if (this.osc2) this.osc2.stop();
        if (this.ctx) this.ctx.close();
        this.isPlaying = false;
      }, 800);
    } else {
      this.isPlaying = false;
    }
  }
}

/* ===================================================================
   10. PALETTE / MATRIX THEME SWITCHER
   =================================================================== */
class ThemeSwitcherEngine {
  constructor() {
    this.themes = ['matrix', 'cyan', 'kali', 'amber'];
    this.current = 'matrix';
  }

  init() {
    const saved = localStorage.getItem('samore_theme');
    if (saved && this.themes.includes(saved)) {
      this.setTheme(saved);
    }

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const nextIdx = (this.themes.indexOf(this.current) + 1) % this.themes.length;
        this.setTheme(this.themes[nextIdx]);
        window.cyberAudio.playClick();
      });
    }
  }

  setTheme(name) {
    this.current = name;
    document.body.setAttribute('data-theme', name);
    localStorage.setItem('samore_theme', name);

    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.innerText = `🎨 PALETTE: ${name.toUpperCase()}`;
    }
  }
}

// Global Exports
window.shugoRadar = new ShugoThreatRadar();
window.hackerCLI = new HackerTerminalCLI();
window.cvEngine = new AiComputerVisionEngine();
window.aerospace3D = new Aerospace3DEngine();
window.clusterMap = new OpenShiftClusterMap();
window.ctfChallenge = new CtfChallengeEngine();
window.resumeExporter = new ResumeDossierExporter();
window.certModal = new CertVerificationModal();
window.cyberRadio = new CyberAmbientRadio();
window.themeSwitcher = new ThemeSwitcherEngine();

onReady(() => {
  window.shugoRadar.init();
  window.hackerCLI.init();
  window.cvEngine.init();
  window.aerospace3D.init();
  window.clusterMap.init();
  window.ctfChallenge.init();
  window.resumeExporter.init();
  window.certModal.init();
  window.cyberRadio.init();
  window.themeSwitcher.init();
});
