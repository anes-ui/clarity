import { WealthsimpleUser } from "@/lib/users";
import { Target } from "lucide-react";

export default function GoalTracker({ goals }: { goals: WealthsimpleUser["goals"] }) {
    if (goals.length === 0) return null;

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Target size={14} /> Goals
            </h3>

            <div className="space-y-3">
                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const shortfall = goal.requiredMonthlyContribution - goal.monthlyContribution;

                    let statusLabel = "On Track";
                    let statusColor = "text-[#00d492] bg-[#00d492]/10";

                    if (shortfall > (goal.requiredMonthlyContribution * 0.2)) {
                        statusLabel = "Behind";
                        statusColor = "text-red-400 bg-red-400/10";
                    } else if (shortfall > 0) {
                        statusLabel = "At Risk";
                        statusColor = "text-amber-400 bg-amber-400/10";
                    }

                    return (
                        <div key={goal.id} className="ws-card p-4 bg-white/[0.02] border-white/5">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-sm tracking-tight">{goal.name}</h4>
                                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${statusLabel === "Behind" ? "bg-red-400" : statusLabel === "At Risk" ? "bg-amber-400" : "bg-[#00d492]"}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                    <span>Current: ${goal.currentAmount.toLocaleString()}</span>
                                    <span>Target: ${goal.targetAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
