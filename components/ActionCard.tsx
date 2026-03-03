"use client";

import React, { useState } from 'react';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface ActionCardProps {
    type: 'transfer' | 'rebalance' | 'contribution';
    title: string;
    description: string;
    amount: number;
    from?: string;
    to?: string;
    onSuccess?: () => void;
}

export default function ActionCard({ type, title, description, amount, from, to, onSuccess }: ActionCardProps) {
    const [status, setStatus] = useState<'idle' | 'executing' | 'success'>('idle');
    const { performTransfer } = useUser();

    const handleExecute = async () => {
        setStatus('executing');

        // Simulate network delay for "Agentic Realism"
        await new Promise(resolve => setTimeout(resolve, 1800));

        if (type === 'transfer' && from && to) {
            performTransfer(amount, from as never, to as never);
        }

        setStatus('success');
        if (onSuccess) onSuccess();
    };

    return (
        <div className={`my-6 rounded-2xl border transition-all duration-500 overflow-hidden ${status === 'success'
            ? 'bg-ws-green-muted border-ws-green shadow-[0_0_20px_rgba(0,212,146,0.1)]'
            : 'bg-ws-white border-ws-border shadow-sm'
            }`}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-ws-green text-ws-white' : 'bg-ws-dune text-ws-white'
                            }`}>
                            {status === 'success' ? <Check size={20} /> : <ArrowRight size={20} />}
                        </div>
                        <div>
                            <h4 className="text-[16px] font-bold text-ws-dune">{title}</h4>
                            <p className="text-[13px] text-ws-text-secondary">{description}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-ws-surface-1 rounded-xl p-4 flex items-center justify-between mb-6 border border-ws-border">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-ws-text-muted tracking-widest">{from?.toUpperCase() || 'Source'}</span>
                        <span className="text-[14px] font-semibold text-ws-dune">Clarity Suggestion</span>
                    </div>
                    <ArrowRight className="text-ws-text-muted" size={16} />
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase text-ws-text-muted tracking-widest">{to?.toUpperCase() || 'Destination'}</span>
                        <span className="text-[14px] font-semibold text-ws-dune">${amount.toLocaleString()}</span>
                    </div>
                </div>

                {status === 'idle' && (
                    <button
                        onClick={handleExecute}
                        className="w-full ws-btn-accent !py-3 font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Approve & Execute
                    </button>
                )}

                {status === 'executing' && (
                    <button disabled className="w-full bg-ws-surface-2 text-ws-text-muted pointer-events-none py-3 rounded-full flex items-center justify-center gap-2 font-bold">
                        <Loader2 size={18} className="animate-spin text-ws-green" />
                        Executing Trade...
                    </button>
                )}

                {status === 'success' && (
                    <div className="flex items-center justify-center gap-2 py-3 text-ws-green font-bold text-[14px] animate-in fade-in slide-in-from-bottom-2">
                        <ShieldCheck size={18} />
                        Successfully Actioned
                    </div>
                )}
            </div>

            {status === 'success' && (
                <div className="bg-ws-green px-6 py-2 text-center">
                    <p className="text-[11px] font-bold text-ws-white uppercase tracking-[0.1em]">Dashboard Updated in Real-Time</p>
                </div>
            )}
        </div>
    );
}

function ShieldCheck({ size }: { size: number }) {
    return (
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
