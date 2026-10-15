import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Pause, Play, Volume2, VolumeX, LogOut } from "lucide-react";

const W = 960;
const H = 540;
const GEM_COUNT = 8;
const HEARTS = 3;

type Phase = "menu" | "playing" | "paused" | "won" | "lost";

interface Gem { x: number; y: number; got: boolean; bob: number }
interface Enemy { cx: number; cy: number; amp: number; axis: "x" | "y"; speed: number; phase: number; x: number; y: number }
interface Star { x: number; y: number; r: number; tw: number }

function rand(min: number, max: number) { return min + Math.random() * (max - min); }

function makeGems(): Gem[] {
  const gems: Gem[] = [];
  let guard = 0;
  while (gems.length < GEM_COUNT && guard < 500) {
    guard++;
    const x = rand(70, W - 70);
    const y = rand(70, H - 70);
    if (Math.hypot(x - W / 2, y - H / 2) < 150) continue;
    if (gems.some(g => Math.hypot(g.x - x, g.y - y) < 80)) continue;
    gems.push({ x, y, got: false, bob: rand(0, Math.PI * 2) });
  }
  return gems;
}

function makeEnemies(): Enemy[] {
  return [
    { cx: W * 0.25, cy: H * 0.25, amp: 150, axis: "x", speed: 1.1, phase: 0, x: 0, y: 0 },
    { cx: W * 0.75, cy: H * 0.35, amp: 130, axis: "y", speed: 1.4, phase: 2, x: 0, y: 0 },
    { cx: W * 0.5, cy: H * 0.7, amp: 260, axis: "x", speed: 0.9, phase: 4, x: 0, y: 0 },
    { cx: W * 0.15, cy: H * 0.6, amp: 140, axis: "y", speed: 1.2, phase: 1, x: 0, y: 0 },
  ];
}

function makeStars(): Star[] {
  return Array.from({ length: 70 }, () => ({ x: rand(0, W), y: rand(0, H), r: rand(0.5, 1.8), tw: rand(0, Math.PI * 2) }));
}

export default function Game({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("menu");
  const [hud, setHud] = useState({ gems: 0, hearts: HEARTS, time: 0, best: Number(localStorage.getItem("artam_game_best") || 0) });
  const [muted, setMuted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const phaseRef = useRef<Phase>("menu");
  phaseRef.current = phase;
  const mutedRef = useRef(false);
  mutedRef.current = muted;

  const keys = useRef<Record<string, boolean>>({});
  const world = useRef({
    px: W / 2, py: H / 2, inv: 0,
    gems: makeGems(), enemies: makeEnemies(), stars: makeStars(),
    portal: { x: W / 2, y: 90 }, portalOpen: false,
    hearts: HEARTS, got: 0, t: 0, score: 0,
  });
  const audioRef = useRef<AudioContext | null>(null);

  const beep = (freq: number, dur = 0.12, type: OscillatorType = "sine", vol = 0.15) => {
    if (mutedRef.current) return;
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      const ctx = audioRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch { /* ignore */ }
  };

  const reset = () => {
    world.current = {
      px: W / 2, py: H / 2, inv: 0,
      gems: makeGems(), enemies: makeEnemies(), stars: makeStars(),
      portal: { x: W / 2, y: 90 }, portalOpen: false,
      hearts: HEARTS, got: 0, t: 0, score: 0,
    };
    setHud(h => ({ ...h, gems: 0, hearts: HEARTS, time: 0 }));
  };

  const start = () => { reset(); setPhase("playing"); };

  // کنترل کیبورد
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      keys.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === "p" && (phaseRef.current === "playing" || phaseRef.current === "paused"))
        setPhase(p => (p === "playing" ? "paused" : "playing"));
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // حلقه اصلی بازی
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const w = world.current;
      const ph = phaseRef.current;

      if (ph === "playing") {
        w.t += dt;
        // حرکت بازیکن
        let dx = 0, dy = 0;
        const k = keys.current;
        if (k["arrowup"] || k["w"] || k["up"]) dy -= 1;
        if (k["arrowdown"] || k["s"] || k["down"]) dy += 1;
        if (k["arrowleft"] || k["a"] || k["left"]) dx -= 1;
        if (k["arrowright"] || k["d"] || k["right"]) dx += 1;
        if (dx || dy) {
          const len = Math.hypot(dx, dy);
          w.px += (dx / len) * 260 * dt;
          w.py += (dy / len) * 260 * dt;
        }
        w.px = Math.max(30, Math.min(W - 30, w.px));
        w.py = Math.max(30, Math.min(H - 30, w.py));
        if (w.inv > 0) w.inv -= dt;

        // دشمن‌ها
        for (const e of w.enemies) {
          const off = Math.sin(w.t * e.speed + e.phase) * e.amp;
          e.x = e.axis === "x" ? e.cx + off : e.cx;
          e.y = e.axis === "y" ? e.cy + off : e.cy;
          if (w.inv <= 0 && Math.hypot(e.x - w.px, e.y - w.py) < 34) {
            w.hearts -= 1; w.inv = 1.6;
            beep(140, 0.25, "sawtooth", 0.2);
            setHud(h => ({ ...h, hearts: w.hearts }));
            if (w.hearts <= 0) { setPhase("lost"); beep(90, 0.5, "sawtooth", 0.25); }
          }
        }

        // جمع‌آوری الماس‌ها
        for (const g of w.gems) {
          if (!g.got && Math.hypot(g.x - w.px, g.y - w.py) < 32) {
            g.got = true; w.got += 1;
            beep(700 + w.got * 60, 0.12, "triangle", 0.18);
            setHud(h => ({ ...h, gems: w.got }));
            if (w.got >= GEM_COUNT) {
              w.portalOpen = true;
              beep(520, 0.3, "sine", 0.2); setTimeout(() => beep(780, 0.3, "sine", 0.2), 150);
            }
          }
        }

        // دروازه پایان
        if (w.portalOpen && Math.hypot(w.portal.x - w.px, w.portal.y - w.py) < 40) {
          w.score = w.got * 100 + Math.max(0, Math.round(1500 - w.t * 10)) + w.hearts * 150;
          setFinalScore(w.score);
          setHud(h => {
            const best = Math.max(h.best, w.score);
            localStorage.setItem("artam_game_best", String(best));
            return { ...h, best };
          });
          setPhase("won");
          beep(660, 0.15, "triangle", 0.2); setTimeout(() => beep(880, 0.15, "triangle", 0.2), 140); setTimeout(() => beep(1100, 0.3, "triangle", 0.2), 280);
        }
        setHud(h => (Math.floor(h.time) !== Math.floor(w.t) ? { ...h, time: w.t } : h));
      }

      // ===== رسم =====
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0b0b18"); bg.addColorStop(1, "#07070d");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      for (const s of w.stars) {
        ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(now / 900 + s.tw));
        ctx.fillStyle = "#8f7bff";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(124,92,252,0.5)"; ctx.lineWidth = 3;
      ctx.strokeRect(14, 14, W - 28, H - 28);

      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      // الماس‌ها
      for (const g of w.gems) {
        if (g.got) continue;
        const bob = Math.sin(now / 400 + g.bob) * 4;
        ctx.font = "26px serif";
        ctx.fillText("💎", g.x, g.y + bob);
      }
      // دروازه
      if (w.portalOpen) {
        ctx.save();
        ctx.translate(w.portal.x, w.portal.y);
        ctx.rotate(now / 500);
        ctx.shadowColor = "#00e676"; ctx.shadowBlur = 25;
        ctx.font = "44px serif";
        ctx.fillText("🌀", 0, 0);
        ctx.restore();
      }
      // دشمن‌ها
      for (const e of w.enemies) {
        ctx.font = "30px serif";
        ctx.shadowColor = "#ff3b6b"; ctx.shadowBlur = 12;
        ctx.fillText("👾", e.x, e.y);
        ctx.shadowBlur = 0;
      }
      // بازیکن
      const blink = w.inv > 0 && Math.floor(now / 100) % 2 === 0;
      if (!blink) {
        ctx.font = "34px serif";
        ctx.shadowColor = "#7c5cfc"; ctx.shadowBlur = 18;
        ctx.fillText("🧑‍🚀", w.px, w.py);
        ctx.shadowBlur = 0;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const hold = (key: string) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); keys.current[key] = true; },
    onPointerUp: () => { keys.current[key] = false; },
    onPointerLeave: () => { keys.current[key] = false; },
    onPointerCancel: () => { keys.current[key] = false; },
  });

  const padBtn = "w-14 h-14 rounded-2xl bg-[#161625] border border-[#1a1a2e] active:bg-[#7c5cfc]/40 flex items-center justify-center text-[#7c5cfc] select-none touch-none";

  return (
    <div className="w-full max-w-5xl mx-auto px-3 pb-10" dir="rtl">
      {/* نوار وضعیت */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 bg-[#161625] border border-[#1a1a2e] rounded-2xl px-4 py-3 text-sm">
        <div className="flex items-center gap-4 font-bold text-white">
          <span className="text-[#ff3b6b]">{"❤️".repeat(Math.max(0, hud.hearts))}{"🖤".repeat(Math.max(0, HEARTS - hud.hearts))}</span>
          <span className="text-[#7c5cfc]">💎 {hud.gems}/{GEM_COUNT}</span>
          <span className="text-[#888]">⏱ {Math.floor(hud.time)}s</span>
          <span className="text-[#00e676]"> رکورد: {hud.best}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMuted(m => !m)} className="p-2 rounded-xl bg-[#0f0f1a] border border-[#1a1a2e] text-[#888] hover:text-white" title="صدا">
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setPhase(p => (p === "playing" ? "paused" : "playing"))} className="p-2 rounded-xl bg-[#0f0f1a] border border-[#1a1a2e] text-[#888] hover:text-white" title="توقف">
            {phase === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={onExit} className="p-2 rounded-xl bg-[#0f0f1a] border border-[#1a1a2e] text-[#888] hover:text-[#ff3b6b]" title="خروج">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* بوم بازی */}
      <div className="relative rounded-[1.5rem] overflow-hidden border border-[#1a1a2e] shadow-2xl shadow-[#7c5cfc]/10">
        <canvas ref={canvasRef} width={W} height={H} className="w-full block bg-[#07070d]" />

        {phase === "menu" && (
          <Overlay>
            <h2 className="text-3xl font-black text-white mb-3">🌍 جهان ماجراجویی — نسخه وب</h2>
            <p className="text-[#888] text-sm leading-relaxed mb-6 max-w-md">
              همهٔ <b className="text-[#7c5cfc]">۸ الماس</b> را جمع کن، از <b className="text-[#ff3b6b]">هیولاها</b> فرار کن
              و وقتی دروازهٔ <b className="text-[#00e676]">🌀</b> باز شد واردش شو!
              <br />کنترل: کلیدهای جهت‌نما / WASD یا دکمه‌های لمسی زیر صفحه.
            </p>
            <Btn onClick={start}>▶ شروع بازی</Btn>
          </Overlay>
        )}
        {phase === "paused" && (
          <Overlay>
            <h2 className="text-2xl font-black text-white mb-4">⏸ توقف</h2>
            <Btn onClick={() => setPhase("playing")}>▶ ادامه</Btn>
          </Overlay>
        )}
        {phase === "won" && (
          <Overlay>
            <h2 className="text-3xl font-black text-[#00e676] mb-2">🎉 بردی!</h2>
            <p className="text-white text-lg mb-1">امتیاز: <b className="text-[#7c5cfc]">{finalScore}</b></p>
            <p className="text-[#888] text-sm mb-6">زمان: {Math.floor(hud.time)} ثانیه | رکورد: {hud.best}</p>
            <div className="flex gap-3">
              <Btn onClick={start}>🔄 دوباره</Btn>
              <Btn secondary onClick={onExit}>خروج</Btn>
            </div>
          </Overlay>
        )}
        {phase === "lost" && (
          <Overlay>
            <h2 className="text-3xl font-black text-[#ff3b6b] mb-2">💀 باختی!</h2>
            <p className="text-[#888] text-sm mb-6">هیولاها گرفتنت... یه بار دیگه تلاش کن قهرمان!</p>
            <div className="flex gap-3">
              <Btn onClick={start}>🔄 دوباره</Btn>
              <Btn secondary onClick={onExit}>خروج</Btn>
            </div>
          </Overlay>
        )}
      </div>

      {/* دکمه‌های لمسی */}
      <div className="mt-4 flex justify-center gap-2 md:hidden" dir="ltr">
        <button className={padBtn} {...hold("left")}><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex flex-col gap-2">
          <button className={padBtn} {...hold("up")}><ArrowUp className="w-6 h-6" /></button>
          <button className={padBtn} {...hold("down")}><ArrowDown className="w-6 h-6" /></button>
        </div>
        <button className={padBtn} {...hold("right")}><ArrowRight className="w-6 h-6" /></button>
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 bg-[#07070d]/85 backdrop-blur-sm flex flex-col items-center justify-center text-center px-6"
    >
      {children}
    </motion.div>
  );
}

function Btn({ children, onClick, secondary }: { children: React.ReactNode; onClick: () => void; secondary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={
        secondary
          ? "px-6 py-3 rounded-2xl border border-[#1a1a2e] text-[#888] hover:text-white font-bold"
          : "px-8 py-3 rounded-2xl bg-[#7c5cfc] hover:bg-[#5a3fd6] text-white font-black shadow-lg shadow-[#7c5cfc]/30 active:scale-[0.97] transition-all"
      }
    >
      {children}
    </button>
  );
}
