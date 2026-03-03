"use client";

import { useState } from "react";
import { HelpCircle, Send, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
            <div className="flex items-center gap-2 text-[12px] font-bold text-ws-text-muted uppercase tracking-[0.08em]">
                <HelpCircle size={16} /> What-if Simulator
            </div>

            <div className="ws-card space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {presets.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => runScenario(p.prompt)}
                            disabled={loading}
                            className="px-5 py-5 text-left bg-ws-surface-0 border border-ws-border rounded-[12px] hover:border-ws-green transition-all group disabled:opacity-50"
                        >
                            <p className="text-[12px] font-bold text-ws-green uppercase tracking-[0.05em] mb-2">{p.label}</p>
                            <p className="text-[14px] text-ws-text-secondary group-hover:text-ws-text-primary transition-colors line-clamp-2 leading-[1.6]">
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
                        className="ws-input w-full pr-14"
                        onKeyDown={(e) => e.key === 'Enter' && runScenario(scenario)}
                    />
                    <button
                        onClick={() => runScenario(scenario)}
                        disabled={loading || !scenario}
                        className="absolute right-3 top-2.5 p-2 text-ws-green hover:bg-ws-green-muted rounded-md transition-colors disabled:opacity-50"
                    >
                        <Send size={20} />
                    </button>
                </div>

                {answer && (
                    <div className="mt-8 pt-8 border-t border-ws-border animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-start gap-4 p-6 bg-ws-surface-0 rounded-2xl border border-ws-border">
                            <Sparkles size={20} className="text-ws-green mt-1 shrink-0" />
                            <div className="text-[15px] text-ws-text-primary mt-1 flex-1 leading-[1.6]">
                                <ReactMarkdown
                                    components={{
                                        p: ({ ...props }) => <p className="mb-4" {...props} />,
                                        ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                                        ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                                        li: ({ ...props }) => <li className="text-ws-text-secondary" {...props} />,
                                        strong: ({ ...props }) => <strong className="text-ws-dune font-semibold" {...props} />,
                                        h3: ({ ...props }) => <h3 className="text-[17px] font-semibold text-ws-dune mb-3 mt-5" {...props} />,
                                    }}
                                >
                                    {answer}
                                </ReactMarkdown>
                                {loading && (
                                    <div className="flex items-center gap-1.5 mt-2 opacity-70">
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse delay-75" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse delay-150" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
