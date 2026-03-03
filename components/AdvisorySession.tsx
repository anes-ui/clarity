"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Play, Bot, RotateCcw } from "lucide-react";
import ReactMarkdown from 'react-markdown';

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
        } catch {
            setError("Clarity is currently unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-ws-surface-0 border border-ws-border border-l-[3px] border-l-ws-green rounded-2xl min-h-[400px] flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar" ref={scrollRef}>
                {!hasStarted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-8">
                        <div className="w-[72px] h-[72px] bg-ws-green-muted rounded-full flex items-center justify-center text-ws-green mb-2">
                            <Sparkles size={36} />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[24px] font-semibold text-ws-dune tracking-tight">Personalized Guidance</h4>
                            <p className="text-[16px] text-ws-text-secondary max-w-[320px] mx-auto leading-[1.6]">
                                Get a deep-dive analysis of your current financial trajectory and actionable next steps.
                            </p>
                        </div>
                        <button
                            onClick={startSession}
                            className="ws-btn-accent mt-4"
                        >
                            <Play size={16} fill="currentColor" />
                            Get Your Guidance
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-start gap-5">
                            <div className="w-10 h-10 rounded-full bg-ws-green-muted flex items-center justify-center text-ws-green shrink-0 mt-1">
                                <Bot size={20} />
                            </div>
                            <div className="flex-1 text-[15px] leading-[1.8] text-ws-text-primary mt-1">
                                <ReactMarkdown
                                    components={{
                                        h2: ({ ...props }) => <h2 className="text-[17px] font-semibold text-ws-dune mt-8 mb-4 tracking-tight" {...props} />,
                                        h3: ({ ...props }) => <h3 className="text-[16px] font-semibold text-ws-dune pt-4 pb-2 mb-2" {...props} />,
                                        p: ({ ...props }) => <p className="mb-4 text-ws-text-secondary" {...props} />,
                                        ul: ({ ...props }) => <ul className="list-disc pl-5 mb-6 space-y-2 text-ws-text-secondary" {...props} />,
                                        ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-ws-text-secondary" {...props} />,
                                        li: ({ ...props }) => <li className="pl-1" {...props} />,
                                        strong: ({ ...props }) => <strong className="text-ws-dune font-semibold" {...props} />,
                                        hr: ({ ...props }) => <hr className="my-8 border-ws-border border-t" {...props} />,
                                    }}
                                >
                                    {advice}
                                </ReactMarkdown>
                                {isLoading && (
                                    <div className="flex items-center gap-1.5 mt-4 opacity-70 mb-8">
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse delay-75" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-ws-green animate-pulse delay-150" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center mt-6">
                        <p className="text-red-700 text-[14px] font-medium">{error}</p>
                        <button onClick={startSession} className="text-[12px] font-semibold text-red-700 underline mt-2">Retry</button>
                    </div>
                )}
            </div>

            {hasStarted && !isLoading && !error && (
                <div className="px-6 py-4 border-t border-ws-border bg-ws-surface-1 flex justify-end">
                    <button
                        onClick={startSession}
                        className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-ws-text-muted hover:text-ws-dune px-4 py-2 rounded-md transition-colors"
                    >
                        <RotateCcw size={14} /> Regenerate
                    </button>
                </div>
            )}
        </div>
    );
}
