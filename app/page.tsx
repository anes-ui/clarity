import { USERS } from "@/lib/users";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#00d492]/10 via-black to-black">
      <div className="max-w-4xl w-full space-y-16 text-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#00d492" />
              <path d="M12 28V12H16L20 18L24 12H28V28" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-3xl font-black tracking-tighter uppercase italic">Clarity</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              Your financial picture. <br />
              <span className="premium-gradient-text">Fully understood.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
              AI-native financial guidance built for Wealthsimple's 3 million members.
            </p>
          </div>
        </div>

        {/* User Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {USERS.map((user) => (
            <Link
              key={user.id}
              href={`/dashboard/${user.id}`}
              className="ws-card text-left group hover:border-[#00d492]/50 hover:bg-white/[0.03] transition-all flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold group-hover:text-[#00d492] transition-colors">{user.name}</h2>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-gray-600 group-hover:text-[#00d492]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{user.province}</p>
                  <p className="text-xs text-gray-500 font-medium">Age {user.age} • {user.lifeStage.split('-').join(' ')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-8">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00d492]">View Guidance</span>
                <ArrowRight size={18} className="text-[#00d492] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <footer className="pt-12 border-t border-white/5">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
            Demo only. Uses synthetic data. Not financial advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
