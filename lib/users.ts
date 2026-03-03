export type WealthsimpleUser = {
    id: string
    name: string
    age: number
    province: string
    income: number
    lifeStage: "young-professional" | "family-building" | "pre-retirement"
    accounts: {
        tfsa: { balance: number; contributionRoom: number; ytdContributed: number }
        rrsp: { balance: number; contributionRoom: number; ytdContributed: number }
        nonReg: { balance: number }
        cashSavings: { balance: number }
    }
    portfolio: {
        currentAllocation: { equities: number; bonds: number; cash: number }
        targetAllocation: { equities: number; bonds: number; cash: number }
        ytdReturn: number
        benchmarkReturn: number
    }
    goals: Array<{
        id: string
        name: string
        targetAmount: number
        currentAmount: number
        targetDate: string
        monthlyContribution: number
        requiredMonthlyContribution: number
    }>
    recentLifeEvents: string[]
    monthlyBudget: { income: number; expenses: number; surplus: number }
}

export const USERS: WealthsimpleUser[] = [
    {
        id: "sofia-chen",
        name: "Sofia Chen",
        age: 29,
        province: "Ontario",
        income: 105000,
        lifeStage: "young-professional",
        accounts: {
            tfsa: { balance: 112000, contributionRoom: 0, ytdContributed: 7000 },
            rrsp: { balance: 0, contributionRoom: 48000, ytdContributed: 0 },
            nonReg: { balance: 0 },
            cashSavings: { balance: 22000 }
        },
        portfolio: {
            currentAllocation: { equities: 90, bonds: 10, cash: 0 },
            targetAllocation: { equities: 90, bonds: 10, cash: 0 },
            ytdReturn: 0.084,
            benchmarkReturn: 0.079
        },
        goals: [
            {
                id: "emergency-fund",
                name: "Emergency Fund",
                targetAmount: 30000,
                currentAmount: 22000,
                targetDate: "2025-12-01",
                monthlyContribution: 800,
                requiredMonthlyContribution: 888
            }
        ],
        recentLifeEvents: ["started new job with higher income"],
        monthlyBudget: { income: 6200, expenses: 3800, surplus: 2400 }
    },
    {
        id: "marcus-williams",
        name: "Marcus Williams",
        age: 41,
        province: "British Columbia",
        income: 140000,
        lifeStage: "family-building",
        accounts: {
            tfsa: { balance: 35000, contributionRoom: 60000, ytdContributed: 1200 },
            rrsp: { balance: 65000, contributionRoom: 82000, ytdContributed: 5000 },
            nonReg: { balance: 5000 },
            cashSavings: { balance: 8500 }
        },
        portfolio: {
            currentAllocation: { equities: 60, bonds: 30, cash: 10 },
            targetAllocation: { equities: 80, bonds: 20, cash: 0 },
            ytdReturn: 0.042,
            benchmarkReturn: 0.065
        },
        goals: [
            {
                id: "education-fund",
                name: "Kids Education",
                targetAmount: 100000,
                currentAmount: 15000,
                targetDate: "2035-09-01",
                monthlyContribution: 400,
                requiredMonthlyContribution: 550
            },
            {
                id: "retirement",
                name: "Retirement at 62",
                targetAmount: 1500000,
                currentAmount: 100000,
                targetDate: "2046-06-01",
                monthlyContribution: 1200,
                requiredMonthlyContribution: 2100
            }
        ],
        recentLifeEvents: ["youngest child started school"],
        monthlyBudget: { income: 8500, expenses: 7200, surplus: 1300 }
    },
    {
        id: "isabelle-tremblay",
        name: "Isabelle Tremblay",
        age: 57,
        province: "Quebec",
        income: 180000,
        lifeStage: "pre-retirement",
        accounts: {
            tfsa: { balance: 145000, contributionRoom: 0, ytdContributed: 7000 },
            rrsp: { balance: 850000, contributionRoom: 12000, ytdContributed: 18000 },
            nonReg: { balance: 250000 },
            cashSavings: { balance: 105000 }
        },
        portfolio: {
            currentAllocation: { equities: 85, bonds: 10, cash: 5 },
            targetAllocation: { equities: 50, bonds: 40, cash: 10 },
            ytdReturn: 0.091,
            benchmarkReturn: 0.068
        },
        goals: [
            {
                id: "retirement-goal",
                name: "Retire at 63",
                targetAmount: 2000000,
                currentAmount: 1350000,
                targetDate: "2031-01-01",
                monthlyContribution: 4000,
                requiredMonthlyContribution: 5200
            }
        ],
        recentLifeEvents: ["received inheritance of $85K"],
        monthlyBudget: { income: 10500, expenses: 5500, surplus: 5000 }
    }
];

export const getUserById = (id: string) => USERS.find((u) => u.id === id);
