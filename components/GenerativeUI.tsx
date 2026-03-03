"use client";

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

export function SavingsForecaster({ initialMonthly = 500, initialYears = 5, initialRate = 0.07 }: { initialMonthly?: number, initialYears?: number, initialRate?: number }) {
    const [monthly, setMonthly] = useState(initialMonthly);
    const [years, setYears] = useState(initialYears);
    const rate = initialRate;

    const total = monthly * ((Math.pow(1 + (rate / 12), 12 * years) - 1) / (rate / 12));
    const principal = monthly * 12 * years;
    const interest = total - principal;

    return (
        <div className="my-6 bg-ws-dune text-ws-white rounded-2xl p-6 shadow-xl border border-ws-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <TrendingUp size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-ws-green flex items-center justify-center text-ws-dune">
                        <TrendingUp size={16} />
                    </div>
                    <h4 className="text-[14px] font-bold uppercase tracking-widest text-ws-white/80">Interactive Savings Forecast</h4>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <label className="block">
                            <span className="text-[11px] font-bold text-ws-white/50 uppercase tracking-tight flex items-center gap-1.5 mb-2">
                                <DollarSign size={12} /> Monthly Contribution
                            </span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="100" max="10000" step="100"
                                    value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
                                    className="flex-1 accent-ws-green"
                                />
                                <span className="text-[18px] font-bold text-ws-green w-20 text-right">${monthly.toLocaleString()}</span>
                            </div>
                        </label>

                        <label className="block">
                            <span className="text-[11px] font-bold text-ws-white/50 uppercase tracking-tight flex items-center gap-1.5 mb-2">
                                <Calendar size={12} /> Investment Horizon
                            </span>
                            <div className="flex items-center gap-3">
                                <input
                                    type="range" min="1" max="40" step="1"
                                    value={years} onChange={(e) => setYears(Number(e.target.value))}
                                    className="flex-1 accent-ws-green"
                                />
                                <span className="text-[18px] font-bold text-ws-green w-20 text-right">{years}y</span>
                            </div>
                        </label>
                    </div>

                    <div className="bg-ws-white/5 rounded-xl p-5 border border-ws-white/10 flex flex-col justify-center">
                        <span className="text-[12px] text-ws-white/60 mb-1">Estimated Future Value</span>
                        <h3 className="text-[36px] font-bold text-ws-green tracking-tight transition-all duration-300">
                            ${Math.round(total).toLocaleString()}
                        </h3>
                        <div className="mt-3 text-[11px] space-y-1">
                            <p className="flex justify-between"><span className="text-ws-white/40">Total Contribution:</span> <span>${Math.round(principal).toLocaleString()}</span></p>
                            <p className="flex justify-between"><span className="text-ws-white/40">Growth (at 7%):</span> <span className="text-ws-green">+${Math.round(interest).toLocaleString()}</span></p>
                        </div>
                    </div>
                </div>

                <div className="text-[12px] text-ws-white/50 bg-ws-white/5 p-3 rounded-lg border border-ws-white/5">
                    <p>💡 <strong>Clarity Tip:</strong> By increasing your monthly contribution by just <strong>$200</strong>, you could add <strong>${Math.round((monthly + 200) * ((Math.pow(1 + (rate / 12), 12 * years) - 1) / (rate / 12)) - total).toLocaleString()}</strong> to your wealth over {years} years.</p>
                </div>
            </div>
        </div>
    );
}

export function GenerativeUI({ type, props }: { type: string, props: { monthlyContribution?: number; years?: number; rate?: number } }) {
    switch (type) {
        case 'savings-forecaster':
            return (
                <SavingsForecaster
                    initialMonthly={props.monthlyContribution}
                    initialYears={props.years}
                    initialRate={props.rate}
                />
            );
        default:
            return null;
    }
}
