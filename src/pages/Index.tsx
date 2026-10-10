import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Sparkles,
  Copy,
  Download,
  Share2,
  Check,
  RefreshCw,
  Sliders,
  Moon,
  Sun,
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Send,
  ShieldCheck,
  Calendar,
  Layers,
  Flame,
  Zap,
  Globe,
  Github,
  Code2,
  Volume2,
  VolumeX,
  Edit3,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { TemporalEngine } from "@/core";

type PlatformType = "facebook" | "linkedin" | "twitter" | "instagram";
type ToneType = "visionary" | "insider" | "educational" | "storyteller" | "concise";

interface SocialPost {
  title: string;
  hook: string;
  body: string;
  codeSnippet?: string;
  codeLanguage?: string;
  bulletPoints: string[];
  takeaway: string;
  tags: string[];
  imageUrl: string;
  imagePrompt: string;
  author: string;
  timestamp: string;
}

const PRESET_CS_IMAGES: Record<string, string> = {
  "Machine Learning": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
  "Artificial Intelligence": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
  "Cybersecurity": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  "Cloud Computing": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  "Algorithms": "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1200&auto=format&fit=crop",
  "Quantum Computing": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
  "Web Development": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  "Distributed Systems": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
};

const CODE_PRESETS: Record<string, { lang: string; code: string }> = {
  "Autonomous Agent Swarms": {
    lang: "typescript",
    code: `// Deterministic Agent Consensus Loop
interface AgentMessage {
  senderId: string;
  judgment: "commit" | "abort";
  confidence: number;
}

async function reconcileSwarm(agents: AgentMessage[]): Promise<boolean> {
  const quorum = agents.filter(a => a.judgment === "commit" && a.confidence > 0.85);
  return quorum.length >= Math.ceil(agents.length * 0.67);
}`
  },
  "Neuromorphic Architecture": {
    lang: "rust",
    code: `// Spiking Neural Network Synapse Weight Update
pub fn stdp_update(delta_t: f32, weight: &mut f32, a_plus: f32, tau_plus: f32) {
    if delta_t > 0.0 {
        *weight += a_plus * (-delta_t / tau_plus).exp();
    }
}`
  },
  "Post-Quantum Cryptography": {
    lang: "go",
    code: `// Kyber-1024 Lattice Decapsulation
func Decapsulate(sk []byte, ciphertext []byte) ([]byte, error) {
    sharedKey, err := mlkem.Decapsulate(sk, ciphertext)
    if err != nil {
        return nil, fmt.Errorf("decapsulation failed: %w", err)
    }
    return sharedKey, nil
}`
  },
  default: {
    lang: "typescript",
    code: `// Resilient Step Replay with Idempotency Key
export async function executeStep<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = await storage.get(key);
  if (cached) return cached;
  const result = await fn();
  await storage.set(key, result);
  return result;
}`
  }
};

const Index = () => {
  const currentBaseYear = TemporalEngine.getCurrentYear();
  const [selectedYear, setSelectedYear] = useState(currentBaseYear);
  const roadmapYears = TemporalEngine.getRoadmapYears(4);

  const [topic, setTopic] = useState("Autonomous Agent Swarms");
  const [tone, setTone] = useState<ToneType>("insider");
  const [platform, setPlatform] = useState<PlatformType>("facebook");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("hf_api_token") || "");
  const [isCopied, setIsCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [includeCode, setIncludeCode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(148);
  const [activeReaction, setActiveReaction] = useState<string>("👍");
  const [showReactionDock, setShowReactionDock] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synthesize Apple-like click sound
  const playHapticSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // AudioContext muted or not allowed
    }
  };

  const [generatedPost, setGeneratedPost] = useState<SocialPost>({
    title: `Autonomous Agent Swarms: The Architectural Shift of ${selectedYear}`,
    hook: "Single LLM prompts are yesterday's paradigm. The real frontier is deterministic multi-agent orchestration.",
    body: `We are witnessing a fundamental leap from monolithic model prompts to durable, distributed agent swarms. Instead of asking one reasoning engine to tackle full workflows, modern architectures divide intent into focused, typed judgments with bounded state machines and fault-tolerant event loops.`,
    codeSnippet: CODE_PRESETS["Autonomous Agent Swarms"].code,
    codeLanguage: CODE_PRESETS["Autonomous Agent Swarms"].lang,
    bulletPoints: [
      "Decoupled roles with distinct memory scopes and isolated tools",
      "Durable step replay that survives runtime restarts and latency spikes",
      "Event-driven consensus protocols eliminating token hallucination spirals"
    ],
    takeaway: `The winners of ${selectedYear} and ${selectedYear + 1} will not be those with the biggest models, but those with the cleanest orchestration boundaries.`,
    tags: ["ArtificialIntelligence", "AgentSwarms", "SoftwareArchitecture", "FutureTech", "ComputerScience"],
    imageUrl: PRESET_CS_IMAGES["Machine Learning"],
    imagePrompt: "Futuristic multi-agent holographic network nodes communicating with crystalline neural connections, ultra-clean Apple aesthetics, studio lighting",
    author: "Rahul Kumar",
    timestamp: TemporalEngine.formatRelativeTime()
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem("hf_api_token", val);
  };

  const trendingTopics = TemporalEngine.getTrendingTopicsForYear(selectedYear);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic to begin!");
      return;
    }

    playHapticSound();
    setIsGenerating(true);

    try {
      const cleanTopic = topic.trim();
      const sanitizedTag = cleanTopic.replace(/[^a-zA-Z0-9]/g, "");

      let hook = "";
      let toneDescription = "";
      let takeaway = "";

      switch (tone) {
        case "visionary":
          hook = `In ${selectedYear}, ${cleanTopic} is completely redefining the boundary between human intent and machine execution.`;
          toneDescription = `A transformative breakdown of why ${cleanTopic} will dominate software engineering for the next decade.`;
          takeaway = `Don't optimize for legacy standards. Architect around ${cleanTopic} today to build enduring systems.`;
          break;
        case "educational":
          hook = `Want to master ${cleanTopic}? Here is the exact mental model senior engineers use.`;
          toneDescription = `Understanding ${cleanTopic} boils down to three core invariants: predictability, isolation, and composability.`;
          takeaway = `Master the fundamental abstractions first; the syntax and frameworks will naturally fall into place.`;
          break;
        case "storyteller":
          hook = `Three years ago, building ${cleanTopic} was an academic paper. Today, it powers mission-critical production pipelines.`;
          toneDescription = `The journey of how ${cleanTopic} matured through trial, failure, and breakthroughs in distributed computing.`;
          takeaway = `Innovation isn't accidental—it is compounding curiosity applied to complex problems.`;
          break;
        case "concise":
          hook = `Fast takeaway: Why ${cleanTopic} matters in 30 seconds.`;
          toneDescription = `Core insights, zero fluff. The essential principles of ${cleanTopic} you need to remember.`;
          takeaway = `Keep it lean, keep it typed, and verify before you ship.`;
          break;
        case "insider":
        default:
          hook = `The quiet revolution in ${cleanTopic}: what top engineering teams are shipping right now in ${selectedYear}.`;
          toneDescription = `Deep-dive exploration of the technical trade-offs, architecture patterns, and real-world performance metrics behind ${cleanTopic}.`;
          takeaway = `Clean abstractions beat complex prompt chains every single time.`;
          break;
      }

      let imageUrl = PRESET_CS_IMAGES[cleanTopic] || PRESET_CS_IMAGES.default;

      if (apiKey.trim()) {
        try {
          toast.info("Connecting to Hugging Face Inference API...");
          const imagePrompt = `Sleek, photorealistic 3D visualization of ${cleanTopic}, modern glassmorphism tech aesthetic, 8k resolution, Apple keynote style lighting, clean dark background`;

          const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ inputs: imagePrompt })
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            imageUrl = URL.createObjectURL(blob);
            toast.success("AI Image generated via Hugging Face!");
          } else {
            toast.info("Using studio visual preset for ultra-fast render.");
          }
        } catch {
          toast.info("Switched to high-res studio visual preset.");
        }
      }

      const codePreset = CODE_PRESETS[cleanTopic] || CODE_PRESETS.default;

      const newPost: SocialPost = {
        title: `${cleanTopic}: The ${selectedYear} Engineering Blueprint`,
        hook,
        body: toneDescription,
        codeSnippet: includeCode ? codePreset.code : undefined,
        codeLanguage: codePreset.lang,
        bulletPoints: [
          `Fundamental invariant: Decouple ${cleanTopic} from volatile state`,
          `High-throughput benchmark: Sub-10ms latency thresholds`,
          `Production reliability: Built-in idempotency & recovery hooks`
        ],
        takeaway,
        tags: [
          "ComputerScience",
          sanitizedTag,
          "TechEngineering",
          "SoftwareArchitecture",
          `Tech${selectedYear}`
        ],
        imageUrl,
        imagePrompt: `Clean, modern visual concept of ${cleanTopic} with Apple Liquid Glass aesthetic`,
        author: "Rahul Kumar",
        timestamp: TemporalEngine.formatRelativeTime()
      };

      setGeneratedPost(newPost);
      setReactionsCount(Math.floor(Math.random() * 80) + 115);
      toast.success("Crafted with Apple HIG aesthetic!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Generation failed";
      toast.error(`Error: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, label: string = "Copied to clipboard!") => {
    playHapticSound();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success(label);
  };

  const getFullFormattedText = () => {
    if (!generatedPost) return "";
    let str = `${generatedPost.title}\n\n${generatedPost.hook}\n\n${generatedPost.body}\n\nKey Takeaways:\n${generatedPost.bulletPoints.map((b) => `• ${b}`).join("\n")}`;
    if (generatedPost.codeSnippet) {
      str += `\n\nCode (${generatedPost.codeLanguage}):\n${generatedPost.codeSnippet}`;
    }
    str += `\n\n💡 ${generatedPost.takeaway}\n\n${generatedPost.tags.map((t) => `#${t}`).join(" ")}`;
    return str;
  };

  // Render social card to Canvas and download
  const downloadGeneratedCard = () => {
    playHapticSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient - Apple style
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    if (isDarkMode) {
      bgGrad.addColorStop(0, "#0b0f19");
      bgGrad.addColorStop(0.5, "#131b2e");
      bgGrad.addColorStop(1, "#080c14");
    } else {
      bgGrad.addColorStop(0, "#f8fafc");
      bgGrad.addColorStop(0.5, "#e2e8f0");
      bgGrad.addColorStop(1, "#f1f5f9");
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Glowing orb
    const radial = ctx.createRadialGradient(900, 200, 10, 900, 200, 450);
    radial.addColorStop(0, "rgba(59, 130, 246, 0.25)");
    radial.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1200, 630);

    // Glass Card Frame
    ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.85)";
    ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 60, 1080, 510, 28);
    ctx.fill();
    ctx.stroke();

    // Brand Badge
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(100, 100, 200, 38, 12);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("✦ CLEVER POST", 125, 124);

    // Year Badge
    ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b";
    ctx.font = "600 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`Horizon ${selectedYear} Edition`, 320, 124);

    // Post Title
    ctx.fillStyle = isDarkMode ? "#ffffff" : "#0f172a";
    ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, sans-serif";
    const titleWords = generatedPost.title.split(" ");
    let line1 = "";
    let line2 = "";
    for (const w of titleWords) {
      if ((line1 + " " + w).length < 34) {
        line1 += (line1 ? " " : "") + w;
      } else {
        line2 += (line2 ? " " : "") + w;
      }
    }
    ctx.fillText(line1, 100, 200);
    if (line2) {
      ctx.fillText(line2, 100, 248);
    }

    // Hook
    ctx.fillStyle = isDarkMode ? "#cbd5e1" : "#334155";
    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(generatedPost.hook.slice(0, 80) + "...", 100, 310);

    // Bullet points
    ctx.fillStyle = isDarkMode ? "#94a3b8" : "#475569";
    ctx.font = "18px -apple-system, BlinkMacSystemFont, sans-serif";
    generatedPost.bulletPoints.slice(0, 2).forEach((bp, idx) => {
      ctx.fillText(`• ${bp}`, 100, 365 + idx * 36);
    });

    // Author and date footer inside card
    ctx.fillStyle = isDarkMode ? "#f8fafc" : "#0f172a";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`By ${generatedPost.author}`, 100, 490);

    ctx.fillStyle = "#3b82f6";
    ctx.font = "500 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(generatedPost.tags.map(t => `#${t}`).slice(0, 4).join(" "), 100, 520);

    // Trigger PNG download
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedPost.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_social_card.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("High-resolution Social Card exported!");
  };

  const handleSelectReaction = (emoji: string) => {
    playHapticSound();
    setActiveReaction(emoji);
    setReactionsCount(prev => prev + 1);
    setShowReactionDock(false);
    toast.success(`Reacted with ${emoji}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-500 relative overflow-x-hidden">
      <canvas ref={canvasRef} className="hidden" />

      {/* Background ambient lighting - Apple Liquid Glass glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-indigo-400/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Apple Floating Navigation Dock */}
      <header className="sticky top-4 z-40 px-4 sm:px-6 mb-8">
        <div className="max-w-7xl mx-auto apple-glass rounded-2xl p-3 sm:p-4 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-base sm:text-lg">Clever Post Creator</span>
                <Badge variant="secondary" className="text-[11px] font-medium tracking-wide bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none">
                  Liquid Glass Studio
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Apple HIG Architecture • Horizon {selectedYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Year Timeline Switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-500 ml-1.5 mr-1" />
              {roadmapYears.map(yr => (
                <button
                  key={yr}
                  onClick={() => {
                    playHapticSound();
                    setSelectedYear(yr);
                  }}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    selectedYear === yr
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(soundEnabled ? "Audio feedback muted" : "Audio feedback enabled");
              }}
              title="Toggle tactile sound"
              className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 apple-button"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/Rahul08319/clever-post-creator"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                playHapticSound();
                setIsDarkMode(!isDarkMode);
              }}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all apple-button"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto pt-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide border border-blue-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Built for Computer Science Creators & Architects</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Turn complex CS concepts into <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">aesthetic posts</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Craft viral, high-converting social media posts with AI-assisted clarity, Apple-inspired typography, code windows, and authentic multi-platform previews.
          </p>
        </div>

        {/* Dual Column Layout: Studio Controls & Live Canvas */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Creator Studio (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="apple-card border-none rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-2 sm:p-3">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Creation Parameters
                  </span>
                  <Badge variant="outline" className="font-mono text-[11px] font-normal border-slate-300 dark:border-slate-700">
                    Horizon {selectedYear}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="topic" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Topic or Architecture
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        playHapticSound();
                        const random = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
                        setTopic(random);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Inspire Me
                    </button>
                  </div>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Distributed Consensus in Rust"
                    className="h-12 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 text-sm font-medium"
                  />
                </div>

                {/* Trending Pills */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Frontier Topics ({selectedYear})
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingTopics.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          playHapticSound();
                          setTopic(item);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                          topic === item
                            ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                            : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Voice & Narrative Tone
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
                    {(
                      [
                        { id: "insider", label: "Insider" },
                        { id: "visionary", label: "Visionary" },
                        { id: "educational", label: "Educator" },
                        { id: "storyteller", label: "Story" },
                        { id: "concise", label: "Bite-Sized" }
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          playHapticSound();
                          setTone(t.id);
                        }}
                        className={`text-xs py-2 px-1 rounded-lg font-medium transition-all text-center apple-button ${
                          tone === t.id
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code Snippet Option */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-semibold">Include Code Window</p>
                      <p className="text-[11px] text-slate-500">macOS terminal snippet for developers</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeCode}
                    onChange={(e) => setIncludeCode(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                {/* API Key (Optional) */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apiKey" className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Hugging Face API Key
                    </Label>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </div>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    className="h-10 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Get free token at{" "}
                    <a
                      href="https://huggingface.co/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      huggingface.co/settings/tokens
                    </a>
                    . Kept 100% locally.
                  </p>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold text-base shadow-lg shadow-blue-500/25 apple-button transition-all duration-300"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Synthesizing CS Post...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Generate Apple-Grade Post
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Export Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(getFullFormattedText(), "Full post copied to clipboard!")}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs apple-button"
              >
                {isCopied ? <Check className="w-4 h-4 mr-1 text-emerald-500" /> : <Copy className="w-4 h-4 mr-1" />}
                Copy Text
              </Button>
              <Button
                variant="outline"
                onClick={downloadGeneratedCard}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs apple-button"
              >
                <ImageIcon className="w-4 h-4 mr-1 text-cyan-500" />
                Social Card
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl h-11 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs apple-button"
              >
                <Edit3 className="w-4 h-4 mr-1 text-blue-500" />
                {isEditing ? "Done" : "Edit"}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Multi-Platform Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Platform Selector Tabs */}
            <div className="flex items-center justify-between p-1.5 apple-glass rounded-2xl">
              <div className="flex items-center gap-1 w-full">
                {(
                  [
                    { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
                    { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-sky-600" },
                    { id: "twitter", label: "X / Twitter", icon: Twitter, color: "text-slate-800 dark:text-slate-200" },
                    { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" }
                  ] as const
                ).map((p) => {
                  const Icon = p.icon;
                  const isActive = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        playHapticSound();
                        setPlatform(p.id);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all apple-button ${
                        isActive
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? p.color : "opacity-70"}`} />
                      <span className="hidden sm:inline">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inline Editor (if editing mode toggled) */}
            {isEditing && (
              <Card className="apple-card p-4 rounded-2xl space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Post Refiner</p>
                <Input
                  value={generatedPost.title}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, title: e.target.value })}
                  placeholder="Post Title"
                  className="text-sm font-semibold"
                />
                <Textarea
                  value={generatedPost.hook}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, hook: e.target.value })}
                  placeholder="Hook"
                  rows={2}
                  className="text-xs"
                />
                <Textarea
                  value={generatedPost.body}
                  onChange={(e) => setGeneratedPost({ ...generatedPost, body: e.target.value })}
                  placeholder="Body text"
                  rows={3}
                  className="text-xs"
                />
              </Card>
            )}

            {/* Platform Post Canvas */}
            <div className="relative">
              {isGenerating ? (
                /* Shimmering Apple Skeleton Preview */
                <Card className="apple-card border-none rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
                  <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
                  <div className="h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full shimmer-loading" />
                </Card>
              ) : platform === "facebook" ? (
                /* Authentic Facebook Post Mockup */
                <div className="bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
                  {/* Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        RK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {generatedPost.author}
                          </p>
                          <span className="text-blue-500 text-xs">●</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                            Follow
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {generatedPost.timestamp} • <Globe className="w-3 h-3 inline text-slate-400" />
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-medium border-slate-200 dark:border-slate-700 text-slate-500">
                      Facebook
                    </Badge>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {generatedPost.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {generatedPost.hook}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {generatedPost.body}
                    </p>

                    {/* Code Snippet in macOS Terminal Frame */}
                    {generatedPost.codeSnippet && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-200 font-mono text-xs shadow-md">
                        <div className="px-3 py-2 bg-[#161b22] border-b border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest">{generatedPost.codeLanguage}</span>
                        </div>
                        <pre className="p-3.5 overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                          <code>{generatedPost.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Bullet Points */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Takeaways:</p>
                      {generatedPost.bulletPoints.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                          <span className="text-blue-500 mt-0.5">✦</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      💡 {generatedPost.takeaway}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {generatedPost.tags.map((tag, i) => (
                        <span key={i} className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Image Banner */}
                  <div className="relative group overflow-hidden bg-slate-900">
                    <img
                      src={generatedPost.imageUrl}
                      alt={generatedPost.title}
                      className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <span className="text-white text-xs font-medium backdrop-blur-md px-3 py-1.5 rounded-lg bg-black/40">
                        {generatedPost.imagePrompt}
                      </span>
                      <Button
                        size="sm"
                        onClick={downloadGeneratedCard}
                        className="bg-white/90 hover:bg-white text-black font-semibold rounded-lg text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Save Social Card
                      </Button>
                    </div>
                  </div>

                  {/* Reaction Summary Bar */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-[10px]">
                        {activeReaction}
                      </span>
                      <span className="font-medium ml-1">{reactionsCount} reactions</span>
                    </div>
                    <span>32 comments • 18 shares</span>
                  </div>

                  {/* Facebook Action Row with Interactive Spring Dock */}
                  <div className="p-2 relative grid grid-cols-3 gap-1 text-slate-600 dark:text-slate-300 text-xs font-medium">
                    {/* Floating Reaction Dock */}
                    {showReactionDock && (
                      <div className="absolute -top-12 left-4 z-30 apple-glass rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                        {["👍", "❤️", "💡", "🚀", "👏", "🧠"].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleSelectReaction(emoji)}
                            className="text-lg hover:scale-135 transition-transform duration-150 active:scale-95"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => setShowReactionDock(!showReactionDock)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all apple-button text-blue-600 font-semibold"
                    >
                      <span className="text-sm">{activeReaction}</span>
                      Like
                    </button>
                    <button
                      onClick={() => copyToClipboard(getFullFormattedText(), "Post copied to clipboard!")}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all apple-button"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Comment
                    </button>
                    <button
                      onClick={downloadGeneratedCard}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all apple-button"
                    >
                      <Share2 className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
              ) : platform === "linkedin" ? (
                /* Authentic LinkedIn Post Mockup */
                <div className="bg-white dark:bg-[#1b1f23] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
                  <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
                        RK
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {generatedPost.author}
                          </p>
                          <span className="text-[11px] text-slate-400 font-normal">• 1st</span>
                        </div>
                        <p className="text-xs text-slate-500">Tech Author & Computer Science Architect</p>
                        <p className="text-[11px] text-slate-400">{generatedPost.timestamp}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="rounded-full text-xs font-semibold text-sky-600 border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950">
                      + Follow
                    </Button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-3 text-sm text-slate-800 dark:text-slate-200">
                    <p className="font-bold text-base text-slate-900 dark:text-white">{generatedPost.title}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{generatedPost.hook}</p>
                    <p className="leading-relaxed">{generatedPost.body}</p>

                    {generatedPost.codeSnippet && (
                      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117] text-slate-200 font-mono text-xs my-2">
                        <div className="px-3 py-1.5 bg-[#161b22] border-b border-slate-800 text-[10px] text-slate-400">
                          {generatedPost.codeLanguage}
                        </div>
                        <pre className="p-3 overflow-x-auto text-[11px]">
                          <code>{generatedPost.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    <div className="space-y-1.5 py-1">
                      {generatedPost.bulletPoints.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="font-bold text-sky-600">→</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Key Principle: {generatedPost.takeaway}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {generatedPost.tags.map((t, i) => (
                        <span key={i} className="text-sky-600 dark:text-sky-400 text-xs font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <img
                    src={generatedPost.imageUrl}
                    alt={generatedPost.title}
                    className="w-full h-80 object-cover"
                  />

                  <div className="p-2 grid grid-cols-4 gap-1 text-slate-600 dark:text-slate-300 text-xs font-medium border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleSelectReaction("💡")}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 apple-button text-sky-600 font-semibold"
                    >
                      <Heart className="w-4 h-4 fill-sky-600" /> {reactionsCount}
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 apple-button">
                      <MessageCircle className="w-4 h-4" /> Comment
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 apple-button">
                      <Repeat2 className="w-4 h-4" /> Repost
                    </button>
                    <button onClick={downloadGeneratedCard} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 apple-button">
                      <Send className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>
              ) : platform === "twitter" ? (
                /* Authentic X / Twitter Mockup */
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-3.5 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        RK
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">Rahul Kumar</span>
                          <span className="text-blue-500">✓</span>
                          <span className="text-xs text-slate-500">@rahul_cs</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{generatedPost.timestamp}</span>
                      </div>
                    </div>
                    <Twitter className="w-5 h-5 text-slate-900 dark:text-white opacity-80" />
                  </div>

                  <div className="space-y-2 text-sm text-slate-900 dark:text-slate-100">
                    <p className="font-semibold">{generatedPost.hook}</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                      {generatedPost.body}
                    </p>
                    {generatedPost.codeSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                        <code>{generatedPost.codeSnippet}</code>
                      </div>
                    )}
                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      {generatedPost.bulletPoints.map((item, i) => (
                        <p key={i}>📌 {item}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 text-blue-500 text-xs">
                      {generatedPost.tags.map((t, i) => (
                        <span key={i}>#{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={generatedPost.imageUrl} alt="post" className="w-full h-72 object-cover" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-900">
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" /> 48
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors">
                      <Repeat2 className="w-4 h-4" /> 23
                    </button>
                    <button onClick={() => setReactionsCount(r => r + 1)} className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4 fill-pink-500 text-pink-500" /> {reactionsCount}
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                      <Bookmark className="w-4 h-4" /> 89
                    </button>
                    <button onClick={downloadGeneratedCard} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Authentic Instagram Card Mockup */
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300">
                  <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                        <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center font-bold text-xs">
                          RK
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 dark:text-white">rahul_codes</p>
                        <p className="text-[10px] text-slate-400">Audio: Futuristic Synthesizer</p>
                      </div>
                    </div>
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </div>

                  <img src={generatedPost.imageUrl} alt="preview" className="w-full h-96 object-cover" />

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Heart onClick={() => setReactionsCount(r => r + 1)} className="w-5 h-5 cursor-pointer fill-rose-500 text-rose-500" />
                        <MessageCircle className="w-5 h-5 cursor-pointer" />
                        <Send className="w-5 h-5 cursor-pointer" />
                      </div>
                      <Bookmark className="w-5 h-5 cursor-pointer" />
                    </div>
                    <p className="font-bold text-xs">{reactionsCount} likes</p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white mr-1.5">rahul_codes</span>
                      {generatedPost.hook} {generatedPost.takeaway}
                    </p>
                    <div className="flex flex-wrap gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      {generatedPost.tags.map((t, i) => (
                        <span key={i}>#{t}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase pt-1">{generatedPost.timestamp}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apple Bento Grid Showcase */}
        <section className="pt-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Designed with Cupertino Standards.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Clean typography, zero bloat, and durable multi-year intelligence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="apple-card rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Instant Studio Rendering</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Zero waiting time. Pre-calibrated high-definition visuals or optional live Stable Diffusion integration.
              </p>
            </div>

            <div className="apple-card rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Liquid Glass & SF Pro</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Crafted according to Apple Human Interface Guidelines: clarity, deference, and physical spring animations.
              </p>
            </div>

            <div className="apple-card rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Automated Year Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dynamic temporal engine that auto-calibrates tags, copyrights, and roadmap trends for {selectedYear}–{selectedYear + 4}.
              </p>
            </div>

            <div className="apple-card rounded-3xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Client-Side Privacy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your Hugging Face tokens are stored only in local browser memory. Zero external server persistence.
              </p>
            </div>
          </div>
        </section>

        {/* Dynamic Multi-Year Footer */}
        <footer className="pt-12 pb-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <span>© {selectedYear} Clever Post Creator</span>
            <span>•</span>
            <span>Crafted by Rahul Kumar</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Continuously Calibrated for {roadmapYears.join(" · ")}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Powered by React, Vite, Tailwind CSS, and Apple Human Interface Guidelines.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
