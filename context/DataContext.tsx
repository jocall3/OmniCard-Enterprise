
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { CorporateCard, CorporateCardControls, CorporateCardStatus, Transaction } from '../types';
import { generateUniqueId, getRandomNumber } from '../utils';

interface DataContextType {
    corporateCards: CorporateCard[];
    toggleCorporateCardFreeze: (id: string) => void;
    updateCorporateCardControls: (id: string, controls: CorporateCardControls) => void;
}

export const DataContext = createContext<DataContextType | null>(null);

const generateMockTransactions = (count: number): Transaction[] => {
    const merchants = ['Amazon', 'Uber', 'Starbucks', 'Zoom', 'DigitalOcean', 'Google Ads', 'Office Depot'];
    const categories = ['E-commerce', 'Transport', 'Food', 'Software', 'Infrastructure', 'Advertising', 'Supplies'];
    
    return Array.from({ length: count }, (_, i) => ({
        id: `tx-${i}`,
        date: new Date(Date.now() - getRandomNumber(0, 30 * 24 * 60 * 60 * 1000)).toISOString(),
        description: `Order #${1000 + i}`,
        merchant: merchants[i % merchants.length],
        category: categories[i % categories.length],
        amount: Math.floor(getRandomNumber(5, 500)),
        status: 'Completed'
    }));
};

const INITIAL_CARDS: CorporateCard[] = [
    {
        id: 'card-1',
        holderName: 'Alice Johnson',
        cardNumberMask: '1234',
        balance: 1450,
        limit: 5000,
        status: 'Active',
        type: 'Physical',
        frozen: false,
        transactions: generateMockTransactions(12),
        controls: { monthlyLimit: 5000, atm: true, online: true, contactless: true, international: true }
    },
    {
        id: 'card-2',
        holderName: 'Bob Smith',
        cardNumberMask: '5678',
        balance: 4200,
        limit: 5000,
        status: 'Active',
        type: 'Physical',
        frozen: false,
        transactions: generateMockTransactions(8),
        controls: { monthlyLimit: 5000, atm: false, online: true, contactless: true }
    }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [corporateCards, setCorporateCards] = useState<CorporateCard[]>(INITIAL_CARDS);

    const toggleCorporateCardFreeze = useCallback((id: string) => {
        setCorporateCards(prev => prev.map(c => 
            c.id === id ? { ...c, frozen: !c.frozen, status: !c.frozen ? 'Frozen' : 'Active' } : c
        ));
    }, []);

    const updateCorporateCardControls = useCallback((id: string, controls: CorporateCardControls) => {
        setCorporateCards(prev => prev.map(c => 
            c.id === id ? { ...c, controls, limit: controls.monthlyLimit } : c
        ));
    }, []);

    return (
        <DataContext.Provider value={{ corporateCards, toggleCorporateCardFreeze, updateCorporateCardControls }}>
            {children}
        </DataContext.Provider>
    );
};
