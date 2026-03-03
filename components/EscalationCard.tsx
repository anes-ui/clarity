import { ShieldAlert, Users, ArrowRight } from "lucide-react";

export default function EscalationCard({
    reason,
    userName
}: {
    reason?: string;
    userName: string;
}) {
    return (
        <div className="ws-card bg-amber-500/10 border border-amber-500/40 p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] animate-pulse relative overflow-hidden">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/30">
                <ShieldAlert size={32} />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
                <h4 className="text-xl font-bold text-white tracking-tight">This decision needs a conversation.</h4>
                <div className="space-y-4">
                    <p className="text-amber-200/80 text-sm font-medium italic">&quot;{reason}&quot;</p>
                    <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                        While Clarity can provide general insights, your current situation involves irreversible strategic shifts or potential tax complexities that require human nuance. A Wealthsimple Portfolio Manager will review your case to ensure your {userName} family legacy is fully protected.
                    </p>
                </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
                <button className="w-full bg-amber-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                    <Users size={16} />
                    Talk to a Wealthsimple Advisor
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
