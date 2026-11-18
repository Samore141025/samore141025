/**
 * SAMORE-AI // AUTONOMOUS CYBER INTELLIGENCE AGENT
 * Target: Shrikant More (@Samore141025)
 * Capabilities: Voice Synthesis (TTS), Voice Recognition (STT), Real-time Visualizer, Knowledge Retrieval
 */

class SamoreAIAgent {
  constructor() {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isSpeaking = false;
    this.isListening = false;
    this.voice = null;
    this.visualizerCanvas = null;
    this.visualizerCtx = null;
    this.animFrame = null;
    
    // Knowledge Base compiled from Shrikant More's full verified profile
    this.knowledge = [
      {
        keywords: ["who", "identity", "name", "shrikant", "about", "samore"],
        response: "Greetings. I am SAMORE-AI, the autonomous intelligence persona of Shrikant More. SAMORE stands for Sustainable, Automation, Manufacturing, Optimization, Research, and Expansion. Shrikant is an AI/ML Researcher, Certified Ethical Hacker (CEH), and Cyber Threat Intelligence specialist based in Pune, India."
      },
      {
        keywords: ["acronym", "legend", "meaning", "s.a.m.o.r.e"],
        response: "The SAMORE protocol is an engineering doctrine: S for Sustainable systems, A for Automation and multi-agent frameworks, M for Manufacturing and industrial technology, O for Optimization of models and networks, R for Research with IEEE and space vision, and E for Global Expansion."
      },
      {
        keywords: ["cyber", "security", "hacking", "ceh", "shugo", "cti", "cth", "threat", "aviation", "defense"],
        response: "In Cybersecurity and Defense Systems, Shrikant is trained as a Certified Ethical Hacker (CEH) with expertise in Penetration Testing, Malware Analysis, and Aviation Defense. At SHUGO, he focuses on Cyber Threat Intelligence (CTI), Threat Hunting (CTH), Orchestration Defense, Multi-Agent Swarm Systems, and Guardian Intelligence."
      },
      {
        keywords: ["ai", "machine learning", "ml", "deep learning", "tensorflow", "vision"],
        response: "Shrikant's AI expertise spans TensorFlow, Deep Learning, Object Detection, and Computer Vision from his AI-ML internship at EduSkills Academy. He developed Satellite Image Processing and Optical Flow pipelines at the Bharatiya Antariksh Hackathon, and built Generative AI solutions with Google Cloud Run at the Google Cloud GenAI Academy APAC."
      },
      {
        keywords: ["eduskills", "internship", "work", "experience"],
        response: "At EduSkills Academy, Shrikant completed dual virtual internships: one as an AI-ML Intern focusing on TensorFlow, Computer Vision, and Deep Learning, and another as an Ethical Hacking Intern mastering CEH domains, vulnerability assessment, and malware defense."
      },
      {
        keywords: ["hackathon", "space", "antariksh", "google", "delhi", "bellatrix"],
        response: "Shrikant has competed across elite hackathons: the Bharatiya Antariksh Hackathon (Remote Sensing & Satellite Vision), Google Cloud Gen AI Academy APAC 2026 (GenAI & Cloud Run), HackIndia Spark 6 @ NIT Delhi of Bellatrix (Game Dev & E-Learning), and Google Cloud GenAI Exchange."
      },
      {
        keywords: ["openshift", "redhat", "cloud", "aws", "linux"],
        response: "In Cloud & Infrastructure, Shrikant is certified in Red Hat OpenShift AI (Ver 2.13, AI262F) for deploying enterprise AI workloads, holds AWS Cloud Practitioner credentials, and manages high-availability Linux systems."
      },
      {
        keywords: ["leadership", "nmiet", "aces", "head", "management"],
        response: "Shrikant served as Student Coordinator Head at ACES (Association of Computer Engineering Students) at NMIET, leading team management, technical drives, and organizational leadership. He is also an active IEEE member involved in R&D and event operations."
      },
      {
        keywords: ["contact", "email", "hire", "reach", "linkedin"],
        response: "You can establish direct transmission with Shrikant More via encrypted email at shrikantashokmore@gmail.com, or through his verified LinkedIn profile at linkedin.com/in/samore141025."
      },
      {
        keywords: ["data science", "cognifyz", "deloitte", "pandas"],
        response: "As a Data Science Intern at Cognifyz Technologies, Shrikant worked with Pandas, NumPy, Matplotlib, Seaborn, and Big Data modeling. He also completed the Deloitte Australia Data Analytics Job Simulation."
      }
    ];
  }

  init() {
    this.setupVoices();
    this.setupSpeechRecognition();
    this.setupVisualizer();
    this.bindDOM();
  }

  setupVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Prefer futuristic / english voice
      this.voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira'))) || voices[0];
    };
    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  setupSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        const micBtn = document.getElementById('micBtn');
        if (micBtn) micBtn.classList.add('recording');
        this.appendMessage('agent', 'Listening for incoming audio transmission...');
        window.cyberAudio.playBeep(880, 'sine', 0.1);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleUserQuery(transcript);
      };

      this.recognition.onerror = () => {
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (e) {}
    } else {
      this.appendMessage('agent', 'Voice input not supported in this browser. Please type your query in the terminal input.');
    }
  }

  stopListening() {
    this.isListening = false;
    const micBtn = document.getElementById('micBtn');
    if (micBtn) micBtn.classList.remove('recording');
  }

  speak(text) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any pending speech

    const cleanText = text.replace(/[*_#`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.voice) utterance.voice = this.voice;
    utterance.pitch = 0.95; // Slightly cyber robotic
    utterance.rate = 1.05;

    utterance.onstart = () => {
      this.isSpeaking = true;
      const statusEl = document.getElementById('aiStatusText');
      if (statusEl) statusEl.innerText = "STATUS: VOCALIZING TRANSMISSION...";
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      const statusEl = document.getElementById('aiStatusText');
      if (statusEl) statusEl.innerText = "STATUS: ONLINE & MONITORING";
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    this.synth.speak(utterance);
  }

  setupVisualizer() {
    this.visualizerCanvas = document.getElementById('aiVisualizerCanvas');
    if (this.visualizerCanvas) {
      this.visualizerCtx = this.visualizerCanvas.getContext('2d');
      this.renderVisualizer();
    }
  }

  renderVisualizer() {
    const ctx = this.visualizerCtx;
    const canvas = this.visualizerCanvas;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.isSpeaking ? '#00f0ff' : '#00ff41';
    ctx.shadowBlur = this.isSpeaking ? 10 : 4;
    ctx.shadowColor = this.isSpeaking ? '#00f0ff' : '#00ff41';

    ctx.beginPath();
    ctx.moveTo(0, centerY);

    const time = Date.now() * 0.005;
    const amplitude = this.isSpeaking ? (height / 2.5) : 3;

    for (let x = 0; x < width; x += 4) {
      const freq = this.isSpeaking ? 0.08 : 0.02;
      const y = centerY + Math.sin(x * freq + time) * amplitude * Math.sin(x * 0.03);
      ctx.lineTo(x, y);
    }

    ctx.stroke();
    requestAnimationFrame(() => this.renderVisualizer());
  }

  findResponse(input) {
    const query = input.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    for (const item of this.knowledge) {
      let score = 0;
      for (const kw of item.keywords) {
        if (query.includes(kw)) score += 1;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item.response;
      }
    }

    if (highestScore > 0) {
      return bestMatch;
    }

    return "Query processed. Shrikant More specializes in AI/ML (TensorFlow, Computer Vision), Certified Ethical Hacking (CEH), Cyber Threat Intelligence at SHUGO, Red Hat OpenShift AI, and Space Vision. Click any quick query chip below or ask about his hackathons, internships, or contact info.";
  }

  handleUserQuery(query) {
    if (!query || !query.trim()) return;
    this.appendMessage('user', query);
    window.cyberAudio.playClick();

    const response = this.findResponse(query);
    setTimeout(() => {
      this.appendMessage('agent', response);
      this.speak(response);
    }, 350);
  }

  appendMessage(sender, text) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${sender === 'user' ? 'msg-user' : 'msg-agent'}`;
    msgDiv.innerHTML = `<strong>${sender === 'user' ? 'OPERATOR' : 'SAMORE-AI'} //</strong> ${text}`;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  bindDOM() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendChatBtn');
    const micBtn = document.getElementById('micBtn');

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        const text = input.value;
        if (text) {
          this.handleUserQuery(text);
          input.value = '';
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const text = input.value;
          if (text) {
            this.handleUserQuery(text);
            input.value = '';
          }
        }
      });
    }

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (this.isListening) {
          this.stopListening();
        } else {
          this.startListening();
        }
      });
    }

    // Quick prompt buttons
    document.querySelectorAll('.prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          this.handleUserQuery(prompt);
        }
      });
    });
  }
}

function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

window.samoreAI = new SamoreAIAgent();
onReady(() => {
  window.samoreAI.init();
});
