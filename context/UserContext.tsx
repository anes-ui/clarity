"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WealthsimpleUser, getUserById } from '@/lib/users';

interface UserContextType {
    user: WealthsimpleUser;
    updateUser: (newUser: WealthsimpleUser) => void;
    performTransfer: (amount: number, from: keyof WealthsimpleUser['accounts'], to: keyof WealthsimpleUser['accounts']) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ initialUser, children }: { initialUser: WealthsimpleUser, children: ReactNode }) {
    const [user, setUser] = useState<WealthsimpleUser>(initialUser);

    const updateUser = (newUser: WealthsimpleUser) => setUser(newUser);

    const performTransfer = (amount: number, from: keyof WealthsimpleUser['accounts'], to: keyof WealthsimpleUser['accounts']) => {
        setUser(prev => {
            const next = { ...prev };

            // Subtract from source
            const sourceAcc = next.accounts[from] as any;
            if (sourceAcc.balance !== undefined) {
                sourceAcc.balance -= amount;
            }

            // Add to destination
            const destAcc = next.accounts[to] as any;
            if (destAcc.balance !== undefined) {
                destAcc.balance += amount;
            }

            // Handle contribution room logic if it's RRSP/TFSA
            if (to === 'tfsa' || to === 'rrsp') {
                if (destAcc.contributionRoom !== undefined) {
                    destAcc.contributionRoom = Math.max(0, destAcc.contributionRoom - amount);
                }
                if (destAcc.ytdContributed !== undefined) {
                    destAcc.ytdContributed += amount;
                }
            }

            return { ...next };
        });
    };

    return (
        <UserContext.Provider value={{ user, updateUser, performTransfer }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
