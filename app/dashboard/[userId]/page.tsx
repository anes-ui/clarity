import { getUserById } from "@/lib/users";
import Link from "next/link";
import { runFullAnalysis } from "@/lib/analyzer";
import { notFound } from "next/navigation";
import PortfolioSnapshot from "@/components/PortfolioSnapshot";
import GoalTracker from "@/components/GoalTracker";
import AdvisorySession from "@/components/AdvisorySession";
import ScenarioExplorer from "@/components/ScenarioExplorer";
import EscalationCard from "@/components/EscalationCard";
import { ArrowUpRight, TrendingUp, ShieldCheck, MapPin, User as UserIcon } from "lucide-react";

export default function Dashboard({ params }: { params: { userId: string } }) {
    const user = getUserById(params.userId);
    if (!user) notFound();

    const report = runFullAnalysis(user);

    return (
        <div className="min-h-screen bg-ws-surface-0 text-ws-text-primary selection:bg-ws-green-muted fade-in duration-500">
            {/* Top Banner / Navigation */}
            <nav className="border-b border-ws-border bg-ws-white sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-12 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="var(--ws-green)" />
                                <path d="M12 28V12H16L20 18L24 12H28V28" stroke="var(--ws-dune)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-semibold text-[20px] tracking-tight italic text-ws-dune" style={{ fontFamily: "'Playfair Display', serif" }}>Wealthsimple Clarity</span>
                        </Link>
                        <span className="ml-3 px-2 py-1 rounded bg-ws-surface-2 text-[10px] font-bold uppercase tracking-[0.05em] text-ws-dune">Demo Mode</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold tracking-wide text-ws-text-muted">
                        <span>Powered by Wealthsimple</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1280px] mx-auto px-12 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">

                    {/* LEFT COLUMN: User Context & Portfolio */}
                    <div className="lg:col-span-4 space-y-10">
                        <header className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 text-ws-green mb-3">
                                        <ShieldCheck size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.08em]">Premium Profile Verified</span>
                                    </div>
                                    <h1 className="text-[32px] font-bold tracking-tight text-ws-dune leading-[1.1] mb-3">
                                        {user.name}
                                    </h1>
                                    <div className="flex flex-wrap gap-3 text-[14px] text-ws-text-secondary font-medium">
                                        <span className="flex items-center gap-1"><UserIcon size={14} /> {user.age} Years</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {user.province}</span>
                                        <span className="bg-ws-surface-2 px-2.5 py-1 rounded-md text-[12px] font-semibold text-ws-text-primary">
                                            {user.lifeStage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ws-card">
                                <p className="text-[12px] font-semibold text-ws-text-muted uppercase tracking-[0.08em] mb-2">Total Combined Net Worth</p>
                                <div className="flex items-end gap-3 text-ws-dune">
                                    <h2 className="text-[48px] font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        ${report.netWorth.toLocaleString()}
                                    </h2>
                                    <div className="mb-2.5 flex items-center gap-1 text-[13px] font-bold text-ws-green bg-ws-green-muted px-2.5 py-1 rounded-md">
                                        <ArrowUpRight size={14} />
                                        YTD +{(user.portfolio.ytdReturn * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="space-y-[40px]">
                            <PortfolioSnapshot user={user} report={report} />
                            <GoalTracker goals={user.goals} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Advisory & Intelligence */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-[20px] font-semibold text-ws-dune tracking-[-0.01em] flex items-center gap-2">
                                <TrendingUp size={20} className="text-ws-green" />
                                Advisory Engine
                            </h3>
                        </div>

                        <div className="space-y-[32px]">
                            <AdvisorySession userId={user.id} />
                            <ScenarioExplorer userId={user.id} />
                        </div>
                    </div>
                </div>

                {/* Global Escalation Banner */}
                {report.humanEscalationRequired && (
                    <div className="mt-[40px]">
                        <EscalationCard reason={report.humanEscalationReason} userName={user.name} />
                    </div>
                )}
            </main>
        </div>
    );
}
