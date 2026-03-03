import { WealthsimpleUser } from './users';

export type GapResult = {
    category: string;
    priority: "critical" | "high" | "medium" | "low";
    summary: string;
    data: Record<string, number | string>;
    requiresHumanAdvisor: boolean;
};

export type AnalysisReport = {
    user: WealthsimpleUser;
    gaps: GapResult[];
    netWorth: number;
    estimatedTaxRefundOpportunity: number;
    humanEscalationRequired: boolean;
    humanEscalationReason?: string;
};

export function analyzeTFSAOptimization(user: WealthsimpleUser): GapResult {
    const room = user.accounts.tfsa.contributionRoom;
    const balance = user.accounts.tfsa.balance;

    let priority: GapResult["priority"] = "low";
    if (room > 10000) priority = "high";
    else if (room > 0) priority = "medium";

    return {
        category: "TFSA Optimization",
        priority,
        summary: room > 0
            ? `You have $${room.toLocaleString()} in unused TFSA room which could be generating tax-free growth.`
            : "Your TFSA is fully optimized.",
        data: { room, balance },
        requiresHumanAdvisor: false,
    };
}

export function analyzeRRSPOptimization(user: WealthsimpleUser): GapResult {
    const room = user.accounts.rrsp.contributionRoom;
    const income = user.income;
    const province = user.province;

    // Simplified marginal rates based on prompt
    let marginalRate = 0.30; // base floor
    if (income >= 100000 && income <= 155000) {
        if (province === "Ontario") marginalRate = 0.4341;
        else if (province === "British Columbia") marginalRate = 0.477;
        else if (province === "Quebec") marginalRate = 0.4997;
    } else if (income > 155000) {
        marginalRate = 0.53; // rough top bracket
    }

    const shouldContribute = income > 80000 && room > 0;
    const estTaxRefund = room * marginalRate;

    return {
        category: "RRSP Optimization",
        priority: (shouldContribute && room > 20000) ? "high" : "medium",
        summary: shouldContribute
            ? `Contributing to your RRSP could trigger an estimated tax refund of $${Math.round(estTaxRefund).toLocaleString()}.`
            : "RRSP contributions are currently a secondary priority based on your income bracket.",
        data: { room, estTaxRefund, marginalRate: `${(marginalRate * 100).toFixed(2)}%` },
        requiresHumanAdvisor: false,
    };
}

export function analyzePortfolioDrift(user: WealthsimpleUser): GapResult {
    const { currentAllocation, targetAllocation } = user.portfolio;
    const diffEquities = Math.abs(currentAllocation.equities - targetAllocation.equities);
    const diffBonds = Math.abs(currentAllocation.bonds - targetAllocation.bonds);

    let priority: GapResult["priority"] = "low";
    let summary = "Your portfolio is well-aligned with your target allocation.";
    let requiresHumanAdvisor = false;

    if (diffEquities > 5 || diffBonds > 5) {
        priority = "medium";
        summary = "Your portfolio has drifted from your target allocation and may require rebalancing.";
    }

    if (user.age >= 55 && currentAllocation.equities > 65) {
        priority = "high";
        summary = "At your current life stage, your equity exposure (85%+) is significantly higher than typically recommended for pre-retirement.";
        requiresHumanAdvisor = true;
    }

    return {
        category: "Portfolio Drift",
        priority,
        summary,
        data: { ...currentAllocation, drift: Math.max(diffEquities, diffBonds) },
        requiresHumanAdvisor,
    };
}

export function analyzeGoalHealth(user: WealthsimpleUser): GapResult[] {
    return user.goals.map(goal => {
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        const shortfall = goal.requiredMonthlyContribution - goal.monthlyContribution;
        const shortfallPercent = (shortfall / goal.requiredMonthlyContribution) * 100;

        let priority: GapResult["priority"] = "low";
        let summary = `You're on track for your ${goal.name} goal.`;

        if (shortfallPercent > 20) {
            priority = "critical";
            summary = `Your ${goal.name} goal is at risk with a projected monthly shortfall of $${Math.round(shortfall).toLocaleString()}.`;
        } else if (shortfall > 0) {
            priority = "medium";
            summary = `A small increase in monthly contributions would secure your ${goal.name} goal.`;
        }

        return {
            category: `Goal: ${goal.name}`,
            priority,
            summary,
            data: { shortfall, shortfallPercent, targetDate: goal.targetDate },
            requiresHumanAdvisor: false,
        };
    });
}

export function analyzeEmergencyFund(user: WealthsimpleUser): GapResult {
    const monthlyExpenses = user.monthlyBudget.expenses;
    const currentSavings = user.accounts.cashSavings.balance;
    const monthsCovered = currentSavings / monthlyExpenses;

    let priority: GapResult["priority"] = "low";
    let summary = `Your emergency fund covers ${monthsCovered.toFixed(1)} months of expenses.`;

    if (monthsCovered < 3) {
        priority = "high";
        summary = `Your emergency fund is below the recommended 3-6 month benchmark (${monthsCovered.toFixed(1)} months).`;
    }

    return {
        category: "Emergency Fund",
        priority,
        summary,
        data: { monthsCovered, currentSavings, target: monthlyExpenses * 6 },
        requiresHumanAdvisor: false,
    };
}

export function analyzeRESP(user: WealthsimpleUser): GapResult | null {
    const hasEducationGoal = user.goals.some(g => g.name.toLowerCase().includes("education"));
    // Since there's no RESP account in the mock data structure, we assume if they have an education goal, 
    // we should flag setting up an RESP as a high priority optimized action.
    if (hasEducationGoal) {
        return {
            category: "RESP Setup",
            priority: "high",
            summary: "You have a child's education goal but no RESP modeled. An RESP provides a 20% guaranteed government match (CESG).",
            data: { currentSetup: "None" },
            requiresHumanAdvisor: false,
        };
    }
    return null;
}

export function runFullAnalysis(user: WealthsimpleUser): AnalysisReport {
    const tfsa = analyzeTFSAOptimization(user);
    const rrsp = analyzeRRSPOptimization(user);
    const drift = analyzePortfolioDrift(user);
    const goals = analyzeGoalHealth(user);
    const emergency = analyzeEmergencyFund(user);
    const resp = analyzeRESP(user);

    const allGaps = [tfsa, rrsp, drift, ...goals, emergency];
    if (resp) allGaps.push(resp);

    // Sort by priority
    const priorityMap = { critical: 0, high: 1, medium: 2, low: 3 };
    const sortedGaps = [...allGaps].sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority]);

    const netWorth = user.accounts.tfsa.balance +
        user.accounts.rrsp.balance +
        user.accounts.nonReg.balance +
        user.accounts.cashSavings.balance;

    const estimatedTaxRefundOpportunity = Number(rrsp.data.estTaxRefund) || 0;

    const humanRequiredGap = sortedGaps.find(g => g.requiresHumanAdvisor);

    return {
        user,
        gaps: sortedGaps,
        netWorth,
        estimatedTaxRefundOpportunity,
        humanEscalationRequired: !!humanRequiredGap,
        humanEscalationReason: humanRequiredGap?.summary
    };
}
