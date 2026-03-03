import { Users, ArrowRight } from "lucide-react";

export default function EscalationCard({
    reason,
    userName
}: {
    reason?: string;
    userName: string;
}) {
    return (
        <div className="bg-[#FFF9EE] border border-[#F5A62340] border-l-[4px] border-l-ws-amber rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden text-ws-dune">
            <div className="w-16 h-16 bg-[#F5A62315] rounded-full flex items-center justify-center text-ws-amber shrink-0">
                <Users size={32} />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left">
                <h4 className="text-[20px] font-semibold tracking-tight">A conversation worth having.</h4>
                <div className="space-y-4">
                    <p className="text-[#C27A00] text-[15px] font-medium leading-relaxed italic">&quot;{reason}&quot;</p>
                    <p className="text-ws-text-secondary text-[15px] max-w-2xl leading-[1.6]">
                        While Clarity can provide general insights, your current situation involves irreversible strategic shifts or potential tax complexities that require human nuance. A Wealthsimple Portfolio Manager will review your case to ensure your {userName} family legacy is fully protected.
                    </p>
                </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
                <button className="w-full bg-ws-dune text-ws-white font-semibold py-[14px] px-[28px] rounded-full hover:bg-[#4A4745] transition-colors flex items-center justify-center gap-2 text-[14px]">
                    Talk to an Advisor
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
