"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Play, Bot, RotateCcw } from "lucide-react";

export default function AdvisorySession({
    userId
}: {
    userId: string
}) {
    const [advice, setAdvice] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [advice]);

    const startSession = async () => {
        setIsLoading(true);
        setHasStarted(true);
        setAdvice("");
        setError(null);

        try {
            const response = await fetch("/api/advise", {
                method: "POST",
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error("Connection failed");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) return;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                setAdvice(prev => prev + decoder.decode(value));
            }
        } catch (err) {
            setError("Clarity is currently unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ws-card bg-[#111] border-l-4 border-l-[#00d492] min-h-[400px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" ref={scrollRef}>
                {!hasStarted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                        <div className="w-16 h-16 bg-[#00d492]/10 rounded-full flex items-center justify-center text-[#00d492]">
                            <Sparkles size={32} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold text-white tracking-tight">Personalized Guidance</h4>
                            <p className="text-sm text-gray-500 max-w-xs">
                                Get a deep-dive analysis of your current financial trajectory and actionable next steps.
                            </p>
                        </div>
                        <button
                            onClick={startSession}
                            className="ws-btn-primary w-full max-w-[200px]"
                        >
                            <Play size={18} fill="currentColor" />
                            Get Your Guidance
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded bg-[#00d492] flex items-center justify-center text-black shrink-0">
                                <Bot size={18} />
                            </div>
                            <div className="flex-1 text-sm leading-relaxed text-gray-200 space-y-4 prose prose-invert">
                                {advice.split('\n').map((line, i) => {
                                    if (line.startsWith('##')) {
                                        return <h3 key={i} className="text-lg font-bold text-white pt-4 pb-2 border-b border-white/10 uppercase tracking-widest text-[#00d492]">{line.replace('## ', '')}</h3>
                                    }
                                    if (line.startsWith('- ')) {
                                        return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>
                                    }
                                    if (line.trim() === "") return <br key={i} />;
                                    return <p key={i}>{line}</p>;
                                })}
                                {isLoading && (
                                    <div className="flex items-center gap-2 text-[#00d492] font-medium italic animate-pulse mt-4">
                                        <Sparkles size={14} />
                                        <span>Clarity is thinking...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center mt-4">
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                        <button onClick={startSession} className="text-xs text-white underline mt-1">Retry</button>
                    </div>
                )}
            </div>

            {hasStarted && !isLoading && !error && (
                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end">
                    <button
                        onClick={startSession}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00d492] hover:bg-[#00d492]/10 px-4 py-2 rounded transition-colors"
                    >
                        <RotateCcw size={14} /> Regenerate
                    </button>
                </div>
            )}
        </div>
    );
}
