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
        { name: "Equities", value: user.portfolio.currentAllocation.equities, color: "var(--ws-green)" },
        { name: "Bonds", value: user.portfolio.currentAllocation.bonds, color: "#92A2B1" },
        { name: "Cash", value: user.portfolio.currentAllocation.cash, color: "#D1D5DB" },
    ];

    const targetData = [
        { name: "Equities", value: user.portfolio.targetAllocation.equities, color: "#00d49280" },
        { name: "Bonds", value: user.portfolio.targetAllocation.bonds, color: "#92A2B180" },
        { name: "Cash", value: user.portfolio.targetAllocation.cash, color: "#D1D5DB80" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                {accounts.map((acc) => {
                    const gap = report.gaps.find(g => g.category === acc.key);
                    const hasBigGap = gap && (gap.priority === "high" || gap.priority === "critical");

                    return (
                        <div key={acc.label} className={`ws-card ${hasBigGap ? '!border-ws-amber' : ''}`}>
                            <p className="text-[12px] font-bold uppercase text-ws-text-muted mb-1 tracking-[0.08em]">{acc.label}</p>
                            <p className="text-[28px] font-bold tracking-tight text-ws-dune">${acc.value.toLocaleString()}</p>
                            {hasBigGap && (
                                <div className="mt-4 flex flex-col gap-2">
                                    <div className="inline-flex w-fit items-center gap-1.5 text-[12px] text-[#C27A00] font-bold bg-[#F5A62320] px-2.5 py-1 rounded-md">
                                        <Lightbulb size={14} />
                                        <span>${acc.room?.toLocaleString()} unused room</span>
                                    </div>
                                    <span className="text-[11px] text-[#C27A00] font-semibold uppercase tracking-widest pl-1">
                                        ↳ {acc.label === "RRSP" ? "Maximize tax refund" : "Shield growth from tax"}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="ws-card">
                <h4 className="text-[12px] font-bold uppercase tracking-[0.08em] text-ws-text-muted mb-8 flex items-center gap-2">
                    <Info size={16} /> Allocation vs Target
                </h4>

                <div className="flex flex-col md:flex-row items-start justify-center gap-12">
                    {/* Current Allocation */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                        <p className="text-[12px] uppercase font-bold text-ws-dune mb-4 tracking-[0.08em]">Current</p>
                        <div className="flex justify-center items-center">
                            <PieChart width={140} height={140}>
                                <Pie
                                    data={currentData}
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {currentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] font-bold uppercase tracking-widest text-[#32302F]">
                            {currentData.map(d => (
                                <div key={d.name} className="flex items-center gap-1.5 whitespace-nowrap">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color.startsWith('var') ? '#00d492' : d.color }} />
                                    <span>{d.value}% <span className="text-ws-text-muted font-semibold">{d.name}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Target Allocation */}
                    <div className="flex flex-col items-center flex-1 min-w-0">
                        <p className="text-[12px] uppercase font-bold text-ws-text-muted mb-4 tracking-[0.08em]">Target</p>
                        <div className="opacity-80 flex justify-center items-center">
                            <PieChart width={140} height={140}>
                                <Pie
                                    data={targetData}
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {targetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] font-bold uppercase tracking-widest opacity-60 text-[#32302F]">
                            {targetData.map(d => (
                                <div key={d.name} className="flex items-center gap-1.5 whitespace-nowrap">
                                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color.replace('80', '') }} />
                                    <span>{d.value}% <span className="text-ws-text-muted font-semibold">{d.name}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
