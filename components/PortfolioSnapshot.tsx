"use client";

import { WealthsimpleUser } from "@/lib/users";
import { AnalysisReport } from "@/lib/analyzer";
import { Wallet, Info, Lightbulb } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
        { label: "Cash", value: user.accounts.cashSavings.balance, key: "Emergency Fund" },
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
                        <div key={acc.label} className={`ws-card p-4 bg-white/5 border ${hasBigGap ? 'border-amber-500/30' : 'border-white/5'}`}>
                            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">{acc.label}</p>
                            <p className="text-xl font-bold tracking-tight">${acc.value.toLocaleString()}</p>
                            {hasBigGap && (
                                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded">
                                    <Lightbulb size={12} />
                                    <span>${acc.room?.toLocaleString()} room</span>
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

                <div className="flex items-center justify-around h-40">
                    <div className="text-center">
                        <div className="h-32 w-32 mx-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={currentData}
                                        innerRadius={35}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {currentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">Current</p>
                    </div>

                    <div className="text-center">
                        <div className="h-32 w-32 mx-auto">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={targetData}
                                        innerRadius={35}
                                        outerRadius={50}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {targetData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">Target</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
