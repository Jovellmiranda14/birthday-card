import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Gift,
  Send,
  Heart,
  Share2,
  Copy,
  Check,
  Edit3,
  X,
  Star,
  Sun,
  Moon,
} from "lucide-react";

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playJingle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    // Happy Birthday melody notes: G4 G4 A4 G4 C5 B4
    const notes = [
      { note: 392.0, duration: 0.3, delay: 0 }, // G4
      { note: 392.0, duration: 0.3, delay: 0.35 }, // G4
      { note: 440.0, duration: 0.6, delay: 0.7 }, // A4
      { note: 392.0, duration: 0.6, delay: 1.35 }, // G4
      { note: 523.25, duration: 0.6, delay: 2.0 }, // C5
      { note: 493.88, duration: 1.0, delay: 2.65 }, // B4
    ];

    notes.forEach(({ note, duration, delay }) => {
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(note, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }
}

const sounds = new SoundEffects();

const getGreetingParam = (name) => {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name) || "";
};

const ConfettiCanvas = ({ active, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const colors = [
      "#f472b6",
      "#fb7185",
      "#38bdf8",
      "#c084fc",
      "#facc15",
      "#4ade80",
    ];
    const particles = Array.from({ length: 120 }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 1.2) * 16 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      gravity: 0.25,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    }));

    let startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;

        if (elapsed > 2000) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < height + 50) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      });

      if (aliveCount > 0 && elapsed < 4500) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};

const FloatingPetals = () => {
  const [petals] = useState(() =>
    Array.from({ length: 14 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: `${16 + Math.random() * 16}px`,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal, i) => {
        return (
          <div
            key={i}
            className="absolute opacity-40 animate-fall"
            style={{
              left: petal.left,
              animationDuration: petal.animationDuration,
              animationDelay: petal.animationDelay,
              top: "-30px",
            }}
          >
            <svg
              width={petal.size}
              height={petal.size}
              viewBox="0 0 24 24"
              fill="pink"
              className="text-pink-300 transform rotate-45 opacity-70 filter drop-shadow-sm"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      })}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-15px);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

const PeonyFlower = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg transition-transform duration-500 ease-out">
      <svg
        viewBox="0 0 300 350"
        className="w-48 h-48 md:w-64 md:h-64 object-contain select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e6f40" />
            <stop offset="50%" stopColor="#43a047" />
            <stop offset="100%" stopColor="#1b5e20" />
          </linearGradient>

          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43a047" />
            <stop offset="100%" stopColor="#1b5e20" />
          </linearGradient>

          <linearGradient id="petalLight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde8f1" />
            <stop offset="50%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>

          <linearGradient id="petalDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="70%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>

          <linearGradient id="centerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <radialGradient id="softGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="150" cy="140" r="110" fill="url(#softGlow)" />

        <path
          d="M 150 180 Q 148 260 145 330"
          stroke="url(#stemGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        <path
          d="M 148 240 C 110 230 70 210 50 170 C 75 185 115 205 147 235 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M 148 220 C 120 210 95 190 80 160 C 100 175 128 195 148 215 Z"
          fill="#2e6f40"
          opacity="0.8"
        />
        <path
          d="M 147 260 C 180 250 210 230 230 190 C 210 205 175 225 146 255 Z"
          fill="url(#leafGrad1)"
        />

        <g id="outer-petals">
          <path
            d="M 150 140 C 80 70 50 150 90 200 C 130 220 170 220 210 200 C 250 150 220 70 150 140 Z"
            fill="url(#petalDeep)"
            opacity="0.9"
          />
          <path
            d="M 150 150 C 70 100 60 190 110 220 C 160 235 200 210 230 170 C 220 110 170 100 150 150 Z"
            fill="url(#petalLight)"
          />
          <path
            d="M 150 140 C 100 50 200 50 150 140 Z"
            fill="url(#petalLight)"
          />
        </g>

        <g id="mid-petals">
          <path
            d="M 150 145 C 90 100 90 180 130 195 C 170 195 210 180 210 100 C 160 110 150 145 150 145 Z"
            fill="#f472b6"
            opacity="0.9"
          />
          <path
            d="M 110 120 C 80 150 120 200 160 180 C 190 150 180 110 140 105 C 120 105 110 120 110 120 Z"
            fill="url(#petalLight)"
          />
          <path
            d="M 130 110 C 100 130 110 170 150 175 C 180 170 190 130 160 110 C 145 100 135 100 130 110 Z"
            fill="#fbcfe8"
          />
        </g>

        <g id="inner-petals">
          <path
            d="M 135 125 C 115 140 125 165 150 168 C 175 165 185 140 165 125 C 150 115 135 125 135 125 Z"
            fill="#f472b6"
          />
          <path
            d="M 140 130 C 128 140 135 158 150 160 C 165 158 172 140 160 130 C 150 122 140 130 140 130 Z"
            fill="#fde8f1"
          />
        </g>

        <g id="center-stamen">
          <circle cx="150" cy="142" r="16" fill="url(#centerGold)" />

          {Array.from({ length: 18 }).map((_, i) => {
            const angle = (i * 20 * Math.PI) / 180;
            const r = 10 + (i % 3) * 2;
            const cx = 150 + r * Math.cos(angle);
            const cy = 142 + r * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="2.5"
                fill="#fef08a"
                stroke="#ca8a04"
                strokeWidth="0.5"
              />
            );
          })}

          <path
            d="M 148 140 Q 150 135 152 140 Q 150 145 148 140"
            fill="#be185d"
          />
          <path
            d="M 146 143 Q 150 148 154 143 Q 150 138 146 143"
            fill="#db2777"
          />
        </g>
      </svg>
    </div>
  );
};

const LilyFlower = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg">
      <svg
        viewBox="0 0 300 350"
        className="w-48 h-48 md:w-64 md:h-64 object-contain select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lilyPetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="55%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="lilyStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        <path
          d="M150 175 Q148 260 145 330"
          stroke="url(#lilyStem)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M148 255 C105 238 78 205 58 166 C92 179 125 208 148 242 Z"
          fill="#2e7d32"
        />
        <path
          d="M148 270 C180 251 209 220 232 180 C205 195 174 225 147 258 Z"
          fill="#43a047"
        />

        <g>
          <path
            d="M150 164 C111 145 70 104 76 56 C119 67 143 105 150 143 C157 105 181 67 224 56 C230 104 189 145 150 164 Z"
            fill="url(#lilyPetal)"
          />
          <path
            d="M150 164 C124 129 119 82 150 30 C181 82 176 129 150 164 Z"
            fill="#f9a8d4"
          />
          <path
            d="M150 164 C137 130 140 96 150 66 C160 96 163 130 150 164 Z"
            fill="#fff1f2"
          />
          <path
            d="M150 164 C119 153 86 126 82 91 C113 99 138 122 150 151 C162 122 187 99 218 91 C214 126 181 153 150 164 Z"
            fill="#f472b6"
            opacity="0.8"
          />
        </g>

        {[-20, -10, 0, 10, 20].map((offset) => (
          <g key={offset}>
            <path
              d={`M150 151 Q${150 + offset} 112 ${150 + offset} 77`}
              stroke="#ca8a04"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx={150 + offset} cy="77" r="3" fill="#facc15" />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default function App() {
  const [recipientName, setRecipientName] = useState("Lorrea Ladao");

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("");

  const [isConfettiActive, setIsConfettiActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showWishesModal, setShowWishesModal] = useState(false);
  const [showPetals, setShowPetals] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [senderName, setSenderName] = useState("Jovell Miranda");
  const [customWish, setCustomWish] = useState(
    () =>
      getGreetingParam("msg") ||
      "May your day be filled with endless joy, beautiful moments, and all the love you deserve. Happy Birthday!",
  );
  const [selectedTheme, setSelectedTheme] = useState("rose");
  const [copiedLink, setCopiedLink] = useState(false);
  const [showGeneratedCard, setShowGeneratedCard] = useState(false);
  const [isLily, setIsLily] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setTilt({
      x: -(y / rect.height) * 15,
      y: (x / rect.width) * 15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCardFlip = () => {
    setIsCardFlipped((current) => {
      const next = !current;
      setIsLily(next);
      return next;
    });
  };

  const handleCelebrate = () => {
    sounds.playPop();
    sounds.playJingle();
    setIsConfettiActive(true);
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    sounds.isMuted = newMuteState;
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setRecipientName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCopyShareLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (recipientName) params.set("name", recipientName);
    if (customWish) params.set("msg", customWish);
    if (senderName) params.set("from", senderName);

    const fullUrl = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const themeStyles = {
    rose: "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 text-rose-900 border-pink-200",
    gold: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 text-amber-900 border-amber-200",
    sky: "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-sky-900 border-sky-200",
    lavender:
      "bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 text-purple-900 border-purple-200",
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 flex flex-col justify-between items-center relative overflow-hidden font-sans ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-950 via-slate-900 to-gray-900 text-gray-100"
          : "bg-gradient-to-b from-pink-50/60 via-slate-50 to-gray-100 text-gray-800"
      }`}
    >
      {showPetals && <FloatingPetals />}

      <ConfettiCanvas
        active={isConfettiActive}
        onComplete={() => setIsConfettiActive(false)}
      />

      {/* Header controls */}
      <header className="w-full max-w-5xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-sm text-pink-500">
            <Sparkles size={20} />
          </div>
          <span className="font-serif italic font-medium text-lg tracking-wide hidden sm:inline">
            Celebration Space
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setShowPetals(!showPetals)}
            title="Toggle Floating Petals"
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
              showPetals
                ? "bg-pink-100/80 dark:bg-pink-900/40 border-pink-300 text-pink-600 dark:text-pink-300"
                : "bg-white/70 dark:bg-gray-800/70 border-gray-200 dark:border-gray-700 text-gray-500"
            }`}
          >
            <Sparkles size={18} />
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 sm:p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Theme"
            className="p-2 sm:p-2.5 rounded-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main card stage */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 z-10 w-full max-w-2xl">
        <div className="text-center mb-5 sm:mb-8 group relative w-full">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2">
            {isEditingName ? (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-md border border-pink-200">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="px-3 py-1 bg-transparent outline-none text-center font-serif text-xl md:text-2xl font-bold text-gray-800 dark:text-white"
                  placeholder="Enter name..."
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 max-w-full">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl leading-tight font-serif font-medium tracking-tight text-gray-900 dark:text-white drop-shadow-sm break-words">
                  Happy Birthday Lorrea Ladao!
                </h1>
              </div>
            )}
          </div>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardFlip}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleCardFlip();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={isCardFlipped ? "Show front of birthday card" : "Show back of birthday card"}
          aria-pressed={isCardFlipped}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y + (isCardFlipped ? 180 : 0)}deg)`,
            transition: "transform 0.5s ease-out",
          }}
          className="w-full max-w-md min-h-[18rem] bg-white dark:bg-gray-800/90 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/80 dark:border-gray-700/50 backdrop-blur-xl flex flex-col items-center justify-center relative my-2 sm:my-4 group cursor-pointer [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-pink-100/40 via-transparent to-purple-100/30 dark:from-pink-900/10 dark:to-purple-900/10 pointer-events-none" />

          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center [backface-visibility:hidden]">
            <div
              className="transform cursor-pointer transition-transform duration-500 ease-out group-hover:scale-105"
              title={isLily ? "Switch to peony" : "Switch to lily"}
              aria-label={isLily ? "Switch to peony" : "Switch to lily"}
              onClick={() => setIsLily((current) => !current)}
            >
              {isLily ? <LilyFlower /> : <PeonyFlower />}
            </div>

            <div className="absolute top-6 right-6 text-pink-300 dark:text-pink-400 opacity-60 group-hover:opacity-100 transition-opacity">
              <Sparkles size={22} />
            </div>
            <div className="absolute bottom-6 left-6 text-amber-300 dark:text-amber-400 opacity-60 group-hover:opacity-100 transition-opacity">
              <Star size={18} />
            </div>
          </div>

          <div className="absolute inset-0 z-20 flex rotate-y-180 flex-col items-center justify-center rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 p-6 text-center text-rose-900 [backface-visibility:hidden] dark:from-pink-950 dark:via-slate-900 dark:to-gray-900 dark:text-pink-100">
            <Heart size={42} className="mb-4 text-pink-500" fill="currentColor" />
            <p className="font-serif text-xl italic leading-relaxed">
              “Every birthday deserves a little magic.”
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-pink-600 dark:text-pink-300">
              With love, {senderName || "your loved ones"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full max-w-md">
          <button
            onClick={handleCelebrate}
            className="w-full sm:w-1/2 group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-base shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-[0_15px_30px_rgba(244,114,182,0.2)] active:scale-95 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Gift className="w-5 h-5 text-pink-500 group-hover:rotate-12 transition-transform duration-300" />
            <span>Celebrate</span>
          </button>

          <button
            onClick={() => setShowWishesModal(true)}
            className="w-full sm:w-1/2 group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-base shadow-[0_10px_25px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 hover:shadow-[0_15px_30px_rgba(168,85,247,0.2)] active:scale-95 transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Send className="w-4 h-4 text-purple-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            <span>Send Wishes</span>
          </button>
        </div>

        {customWish && (
          <div className="mt-6 sm:mt-8 w-full max-w-md p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-pink-100 dark:border-gray-700 shadow-sm text-center relative">
            <p className="font-serif italic text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed">
              "{customWish}"
            </p>
            {senderName && (
              <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-pink-500">
                — With love from {senderName}
              </p>
            )}
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 text-xs text-gray-400 dark:text-gray-500 z-10">
        Made with ❤️ for special celebrations 
      </footer>

      {/* Wishes Customization Modal */}
      {showWishesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowWishesModal(false);
                setShowGeneratedCard(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <X size={20} />
            </button>

            {!showGeneratedCard ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                      Craft Your Birthday Wish
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Customize a message card and generate a shareable link.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      disabled
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Your Name / From
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                      disabled
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Personal Message
                    </label>
                    <textarea
                      rows={4}
                      value={customWish}
                      onChange={(e) => setCustomWish(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
                      placeholder="Write your heartfelt birthday note..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Card Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "rose", label: "Rose", color: "bg-pink-400" },
                        { id: "gold", label: "Gold", color: "bg-amber-400" },
                        { id: "sky", label: "Sky", color: "bg-sky-400" },
                        {
                          id: "lavender",
                          label: "Lavender",
                          color: "bg-purple-400",
                        },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTheme(t.id)}
                          className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                            selectedTheme === t.id
                              ? "border-pink-500 ring-2 ring-pink-200 dark:ring-pink-900/50 bg-pink-50 dark:bg-pink-950/20"
                              : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full ${t.color}`} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowGeneratedCard(true)}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium text-sm shadow-lg hover:from-pink-600 hover:to-rose-600 transition active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Preview Card & Share</span>
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Your Digital Greeting Card
                </h3>

                <div
                  className={`p-6 md:p-8 rounded-2xl border ${themeStyles[selectedTheme]} shadow-lg my-4 text-left relative overflow-hidden transition-all`}
                >
                  <div className="absolute top-4 right-4 opacity-30">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold mb-3">
                    Happy Birthday{recipientName ? `, ${recipientName}` : ""}!
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed mb-6 font-serif italic">
                    "{customWish}"
                  </p>
                  {senderName && (
                    <div className="border-t border-black/10 pt-3 text-right">
                      <span className="text-xs uppercase tracking-widest font-semibold opacity-80">
                        With love, {senderName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCopyShareLink}
                    className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-md ${
                      copiedLink
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                    }`}
                  >
                    {copiedLink ? (
                      <>
                        <Check size={18} />
                        <span>Shareable Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy Shareable Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setShowGeneratedCard(false)}
                    className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                  >
                    ← Back to edit message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
