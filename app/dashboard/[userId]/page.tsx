import { getUserById } from "@/lib/users";
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
        <div className="min-h-screen bg-black text-white selection:bg-[#00d492]/30 animate-in fade-in duration-500">
            {/* Top Banner / Navigation */}
            <nav className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="40" height="40" rx="8" fill="#00d492" />
                            <path d="M12 28V12H16L20 18L24 12H28V28" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-bold text-lg tracking-tight">Wealthsimple Clarity</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-[#00d492]">Demo Mode</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
                        <span>Powered by Wealthsimple</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: User Context & Portfolio */}
                    <div className="lg:col-span-4 space-y-8">
                        <header className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 text-[#00d492] mb-2">
                                        <ShieldCheck size={16} />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Premium Profile Verified</span>
                                    </div>
                                    <h1 className="text-5xl font-bold tracking-tight premium-gradient-text mb-2">
                                        {user.name}
                                    </h1>
                                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><UserIcon size={14} /> {user.age} Years</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {user.province}</span>
                                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10 text-xs">
                                            {user.lifeStage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="ws-card bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                                <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Total Combined Net Worth</p>
                                <div className="flex items-end gap-3 text-[#00d492]">
                                    <h2 className="text-5xl font-bold tracking-tighter">
                                        ${report.netWorth.toLocaleString()}
                                    </h2>
                                    <div className="mb-2 flex items-center gap-1 text-xs font-semibold bg-[#00d492]/10 px-2 py-1 rounded">
                                        <ArrowUpRight size={12} />
                                        YTD +{(user.portfolio.ytdReturn * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </header>

                        <PortfolioSnapshot user={user} report={report} />
                        <GoalTracker goals={user.goals} />
                    </div>

                    {/* RIGHT COLUMN: Advisory & Intelligence */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <TrendingUp size={20} className="text-[#00d492]" />
                                Advisory Engine
                            </h3>
                        </div>

                        <AdvisorySession userId={user.id} />
                        <ScenarioExplorer userId={user.id} />
                    </div>
                </div>

                {/* Global Escalation Banner */}
                {report.humanEscalationRequired && (
                    <div className="mt-12">
                        <EscalationCard reason={report.humanEscalationReason} userName={user.name} />
                    </div>
                )}
            </main>
        </div>
    );
}
