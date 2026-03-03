import { WealthsimpleUser } from "@/lib/users";
import { Target } from "lucide-react";

export default function GoalTracker({ goals }: { goals: WealthsimpleUser["goals"] }) {
    if (goals.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.08em] text-ws-text-muted flex items-center gap-2">
                <Target size={16} /> Goals
            </h3>

            <div className="space-y-4">
                {goals.map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const shortfall = goal.requiredMonthlyContribution - goal.monthlyContribution;

                    let statusLabel = "On Track";
                    let statusColor = "text-[#00a872] bg-[#00d49220]";
                    let barColor = "bg-ws-green";

                    if (shortfall > (goal.requiredMonthlyContribution * 0.2)) {
                        statusLabel = "Behind";
                        statusColor = "text-[#C23020] bg-[#E5533D20]";
                        barColor = "bg-ws-red";
                    } else if (shortfall > 0) {
                        statusLabel = "At Risk";
                        statusColor = "text-[#C27A00] bg-[#F5A62320]";
                        barColor = "bg-ws-amber";
                    }

                    return (
                        <div key={goal.id} className="ws-card">
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="font-semibold text-[15px] tracking-tight">{goal.name}</h4>
                                <span className={`text-[12px] font-semibold px-[10px] py-[4px] rounded-full ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="h-[6px] w-full bg-ws-surface-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${barColor}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[12px] font-semibold text-ws-text-muted uppercase tracking-[0.02em]">
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
