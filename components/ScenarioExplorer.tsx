"use client";

import { useState } from "react";
import { HelpCircle, Send, Sparkles } from "lucide-react";

export default function ScenarioExplorer({ userId }: { userId: string }) {
    const [scenario, setScenario] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const presets = [
        { label: "Retire at 60", prompt: "What if I retire at 60 instead of 65?" },
        { label: "RRSP +$500/mo", prompt: "What if I contribute $500 more/month to my RRSP?" },
        { label: "Max TFSA room", prompt: "What if I invest my entire TFSA room this year?" },
    ];

    const runScenario = async (input: string) => {
        setLoading(true);
        setAnswer("");
        setScenario(input);
        try {
            const response = await fetch("/api/advise", {
                method: "POST",
                body: JSON.stringify({ userId, scenario: input }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setAnswer(prev => prev + decoder.decode(value));
            }
        } catch {
            setAnswer("Could not run scenario exploration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <HelpCircle size={16} /> What-if Simulator
            </div>

            <div className="ws-card bg-white/[0.02] border border-white/5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {presets.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => runScenario(p.prompt)}
                            disabled={loading}
                            className="px-4 py-4 text-center bg-white/5 border border-white/10 rounded-xl hover:border-[#00d492]/50 hover:bg-[#00d492]/5 transition-all group disabled:opacity-50"
                        >
                            <p className="text-[10px] font-bold text-[#00d492] uppercase tracking-widest mb-1.5">{p.label}</p>
                            <p className="text-xs text-gray-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">
                                {p.prompt}
                            </p>
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        disabled={loading}
                        placeholder="Ask your own question..."
                        className="w-full bg-black border border-white/10 rounded-lg py-4 px-5 pr-14 text-sm focus:border-[#00d492] outline-none transition-colors disabled:opacity-50"
                        onKeyDown={(e) => e.key === 'Enter' && runScenario(scenario)}
                    />
                    <button
                        onClick={() => runScenario(scenario)}
                        disabled={loading || !scenario}
                        className="absolute right-3 top-2.5 p-2 text-[#00d492] hover:bg-[#00d492]/10 rounded-md transition-colors disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>

                {answer && (
                    <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-start gap-4 p-5 bg-[#00d492]/5 rounded-xl border border-[#00d492]/10">
                            <Sparkles size={20} className="text-[#00d492] mt-1 shrink-0" />
                            <div className="text-sm text-gray-200 space-y-4 leading-relaxed">
                                {answer.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                                {loading && <span className="inline-block w-2 h-4 bg-[#00d492] ml-1 animate-pulse" />}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
