import { USERS } from "@/lib/users";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ws-surface-0 flex flex-col items-center justify-center py-20 px-12">
      <div className="max-w-[1280px] w-full space-y-20 text-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="12" fill="var(--ws-green)" />
              <path d="M12 28V12H16L20 18L24 12H28V28" stroke="var(--ws-dune)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-3xl font-black tracking-tighter uppercase italic text-ws-dune">Clarity</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-[64px] font-bold text-ws-dune leading-[1.15] max-w-[680px] mx-auto tracking-tight">
              Your financial picture. <br />
              <span className="text-ws-green text-[60px]">Fully understood.</span>
            </h1>
            <p className="text-[18px] text-ws-text-secondary max-w-xl mx-auto font-medium leading-[1.6]">
              AI-native financial guidance built for Wealthsimple&apos;s 3 million members.
            </p>
          </div>
        </div>

        {/* User Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USERS.map((user) => (
            <Link
              key={user.id}
              href={`/dashboard/${user.id}`}
              className="ws-card text-left group flex flex-col justify-between min-h-[200px]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-ws-dune transition-colors">{user.name}</h2>
                  <div className="w-8 h-8 rounded-full bg-ws-surface-2 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-ws-text-secondary group-hover:text-ws-green transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[12px] font-medium text-ws-text-muted uppercase tracking-[0.05em]">{user.province}</p>
                  <p className="text-[15px] text-ws-text-secondary font-medium">Age {user.age} • {user.lifeStage.split('-').join(' ')}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-8">
                <span className="text-[14px] font-semibold text-ws-green">View Guidance</span>
                <ArrowRight size={18} className="text-ws-green group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <footer className="pt-16 border-t border-ws-border">
          <p className="text-[12px] text-ws-text-muted font-medium uppercase tracking-[0.05em]">
            Demo only. Uses synthetic data. Not financial advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
