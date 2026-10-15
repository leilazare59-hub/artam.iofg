import { useState } from "react";
import { Download, ShieldCheck, Code2, Globe, PenTool, Play } from "lucide-react";
import { motion } from "framer-motion";
import Game from "./Game";

function App() {
  const [view, setView] = useState<"home" | "game">("home");

  const handleDownload = () => {
    const apkUrl = "./app-release.apk";
    const link = document.createElement("a");
    link.href = apkUrl;
    link.download = "app-release.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#d0d0d0] selection:bg-[#7c5cfc]/30 flex flex-col font-sans" dir="rtl">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7c5cfc] rounded-full blur-[120px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00e676] rounded-full blur-[120px] opacity-5"></div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md border-b border-[#1a1a2e] h-16 flex items-center justify-between px-8">
        <button className="flex items-center gap-3" onClick={() => setView("home")}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#7c5cfc] to-[#5a3fd6] rounded-lg flex items-center justify-center shadow-lg shadow-[#7c5cfc]/20">
            <span className="text-white font-bold text-sm">آ</span>
          </div>
          <span className="text-lg font-black tracking-tight text-white">آرتام حمیدی</span>
        </button>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <span className="flex items-center gap-1"><PenTool className="w-4 h-4" /> محتوا</span>
          <span className="flex items-center gap-1"><Code2 className="w-4 h-4" /> برنامه‌نویسی</span>
          <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> جهان‌سازی</span>
        </div>
      </nav>

      {view === "game" ? (
        <main className="flex-grow flex items-start justify-center px-4 pt-24 pb-12 relative z-10 w-full">
          <Game onExit={() => setView("home")} />
        </main>
      ) : (
        /* Main Card */
        <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
          <div className="max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#161625] border border-[#1a1a2e] rounded-[2rem] p-10 shadow-2xl text-center relative overflow-hidden group hover:border-[#7c5cfc]/50 transition-colors"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#7c5cfc] to-[#00e676]"></div>

              <div className="w-20 h-20 bg-[#7c5cfc]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 text-4xl">
                🌍
              </div>

              <h1 className="text-3xl font-black text-white mb-4">جهان ماجراجویی</h1>
              <p className="text-[#888] mb-8 text-sm leading-relaxed">
                نویسنده و تولیدکننده محتوا | سازنده جهان ماجراجویی<br />
                همین حالا داخل مرورگر بازی کن، یا نسخهٔ اندروید را نصب کن.
              </p>

              <button
                onClick={() => setView("game")}
                className="w-full bg-gradient-to-l from-[#00c853] to-[#00e676] hover:brightness-110 text-black py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl shadow-[#00e676]/20 mb-4"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>بازی آنلاین در مرورگر</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full bg-[#7c5cfc] hover:bg-[#5a3fd6] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl shadow-[#7c5cfc]/30 hover:shadow-[#7c5cfc]/50"
              >
                <Download className="w-6 h-6" />
                <span>نصب نسخه APK</span>
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#555]">
                <ShieldCheck className="w-4 h-4 text-[#00e676]" />
                <span>تایید شده توسط آرتام حمیدی</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center text-[#444] text-xs leading-loose"
            >
              این سایت به صورت خودکار از روی سورس‌کد شما در گیت‌هاب اجرا می‌شود.<br />
              بدون نیاز به سرور و کاملاً پایدار.
            </motion.p>
          </div>
        </main>
      )}

      <footer className="py-8 text-center border-t border-[#1a1a2e] text-[#444] text-[10px] tracking-widest uppercase">
        Artam Hamidi Personal Project © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
