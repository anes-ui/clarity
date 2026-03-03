"use client";

import { WealthsimpleUser } from "@/lib/users";
import { AnalysisReport } from "@/lib/analyzer";
import { Info, Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function PortfolioSnapshot({
    user,
    report
}: {
    user: WealthsimpleUser;
    report: AnalysisReport;
}) {
    const accounts = [
        { label: "TFSA", value: user.accounts.tfsa.balance, room: user.accounts.tfsa.contributionRoom, key: "TFSA Optimization" },
        { label: "RRSP", value: user.accounts.rrsp.balance, room: user.accounts.rrsp.contributionRoom, key: "RRSP Optimization" },
        { label: "Non-Reg", value: user.accounts.nonReg.balance, key: null },
        { label: "Cash", value: user.accounts.cashSavings.balance, key: null },
    ];

    const currentData = [
        { name: "Equities", value: user.portfolio.currentAllocation.equities, color: "#00d492" },
        { name: "Bonds", value: user.portfolio.currentAllocation.bonds, color: "#3b82f6" },
        { name: "Cash", value: user.portfolio.currentAllocation.cash, color: "#4b5563" },
    ];

    const targetData = [
        { name: "Equities", value: user.portfolio.targetAllocation.equities, color: "#00d49280" },
        { name: "Bonds", value: user.portfolio.targetAllocation.bonds, color: "#3b82f680" },
        { name: "Cash", value: user.portfolio.targetAllocation.cash, color: "#4b556380" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                {accounts.map((acc) => {
                    const gap = report.gaps.find(g => g.category === acc.key);
                    const hasBigGap = gap && (gap.priority === "high" || gap.priority === "critical");

                    return (
                        <div key={acc.label} className={`ws-card p-5 bg-white/5 border ${hasBigGap ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/5'}`}>
                            <p className="text-xs font-bold uppercase text-gray-400 mb-1">{acc.label}</p>
                            <p className="text-3xl font-bold tracking-tight">${acc.value.toLocaleString()}</p>
                            {hasBigGap && (
                                <div className="mt-3 flex flex-col gap-1.5">
                                    <div className="inline-flex w-fit items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/20 px-2 py-1 rounded">
                                        <Lightbulb size={14} />
                                        <span>${acc.room?.toLocaleString()} unused room</span>
                                    </div>
                                    <span className="text-[10px] text-amber-500/80 font-medium uppercase tracking-widest pl-1">
                                        ↳ {acc.label === "RRSP" ? "Maximize tax refund" : "Shield growth from tax"}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="ws-card bg-[#111] p-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                    <Info size={14} /> Allocation vs Target
                </h4>

                <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                    {/* Current Allocation */}
                    <div className="flex flex-col items-center">
                        <p className="text-xs uppercase font-bold text-white mb-2 tracking-widest">Current</p>
                        <div className="h-32 w-32 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={currentData}
                                        innerRadius={35}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {currentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex gap-3 text-[10px] font-bold uppercase tracking-widest">
                            {currentData.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span style={{ color: d.color }}>{d.value}% <span className="text-gray-500">{d.name}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Target Allocation */}
                    <div className="flex flex-col items-center">
                        <p className="text-xs uppercase font-bold text-gray-500 mb-2 tracking-widest">Target</p>
                        <div className="h-32 w-32 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={targetData}
                                        innerRadius={35}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {targetData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex gap-3 text-[10px] font-bold uppercase tracking-widest opacity-70">
                            {targetData.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color.replace('80', '') }} />
                                    <span style={{ color: d.color.replace('80', '') }}>{d.value}% <span className="text-gray-500">{d.name}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
