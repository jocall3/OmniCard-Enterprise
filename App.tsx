
import React, { useState, useContext, useMemo } from 'react';
import { DataProvider, DataContext } from './context/DataContext';
import { AdvancedCardProvider, AdvancedCardContext } from './context/AdvancedCardContext';
import { Layout } from './components/Layout';
import { Card, Button, Badge } from './components/Common';
import { formatCurrency, formatDate, calculateBudgetUtilization } from './utils';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { getSpendingInsights } from './services/geminiService';

// --- Views ---

const DashboardView: React.FC = () => {
    const { corporateCards } = useContext(DataContext)!;
    const { data: advData } = useContext(AdvancedCardContext)!;
    const [aiInsights, setAiInsights] = useState<string>("");
    const [loadingInsights, setLoadingInsights] = useState(false);

    const totalSpent = useMemo(() => corporateCards.reduce((sum, c) => sum + c.balance, 0), [corporateCards]);
    const totalLimit = useMemo(() => corporateCards.reduce((sum, c) => sum + c.limit, 0), [corporateCards]);
    const utilization = calculateBudgetUtilization(totalSpent, totalLimit);

    const spendingByCategory = useMemo(() => {
        const cats: any = {};
        corporateCards.flatMap(c => c.transactions).forEach(tx => {
            cats[tx.category] = (cats[tx.category] || 0) + tx.amount;
        });
        return Object.entries(cats).map(([name, value]) => ({ name, value }));
    }, [corporateCards]);

    const handleInsights = async () => {
        setLoadingInsights(true);
        const allTransactions = corporateCards.flatMap(c => c.transactions);
        const insights = await getSpendingInsights(allTransactions);
        setAiInsights(insights);
        setLoadingInsights(false);
    };

    const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Spend</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-credit-card"></i>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Cards</p>
                            <p className="text-2xl font-bold">{corporateCards.length + advData.virtualCards.length}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-chart-pie"></i>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Utilization</p>
                            <p className="text-2xl font-bold">{utilization.toFixed(1)}%</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-hourglass-half"></i>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Pending Req</p>
                            <p className="text-2xl font-bold">{advData.cardRequests.filter(r => r.status === 'pending').length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* AI Insights Card */}
            <Card className="bg-slate-800 border-cyan-500/30">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-300">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            AI-Powered Spending Analysis
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {aiInsights || "Click the button to generate intelligent insights from your company's transaction history."}
                        </p>
                    </div>
                    <Button onClick={handleInsights} loading={loadingInsights} variant="outline" className="flex-shrink-0">
                        Generate Insights
                    </Button>
                </div>
            </Card>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Spending by Category">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {spendingByCategory.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Monthly Spending Trend">
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={spendingByCategory}>
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} cursor={{ fill: '#334155' }} />
                                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const CardsView: React.FC = () => {
    const { corporateCards, toggleCorporateCardFreeze } = useContext(DataContext)!;
    const { data: advData, actions: advActions } = useContext(AdvancedCardContext)!;
    const [isIssuingVirtual, setIsIssuingVirtual] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Cards</h2>
                <Button onClick={() => setIsIssuingVirtual(true)}>
                    <i className="fa-solid fa-plus"></i> Issue Virtual Card
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {corporateCards.map(card => (
                    <Card key={card.id} className="relative group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-2 rounded-lg ${card.frozen ? 'bg-slate-700 text-slate-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                                <i className={`fa-solid ${card.type === 'Physical' ? 'fa-id-card' : 'fa-bolt'}`}></i>
                            </div>
                            <Badge variant={card.frozen ? 'warning' : 'success'}>
                                {card.status}
                            </Badge>
                        </div>
                        <div className="space-y-1 mb-8">
                            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Card Holder</p>
                            <h4 className="text-lg font-bold">{card.holderName}</h4>
                            <p className="text-slate-300 font-mono text-lg">•••• •••• •••• {card.cardNumberMask}</p>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-slate-400 text-xs mb-1">Spent / Limit</p>
                                <p className="font-bold">
                                    {formatCurrency(card.balance)} <span className="text-slate-500 text-sm font-normal">/ {formatCurrency(card.limit)}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" className="px-3 py-1.5" onClick={() => toggleCorporateCardFreeze(card.id)}>
                                    <i className={`fa-solid ${card.frozen ? 'fa-unlock' : 'fa-lock'}`}></i>
                                </Button>
                                <Button variant="outline" className="px-3 py-1.5">
                                    <i className="fa-solid fa-gear"></i>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${card.balance / card.limit > 0.8 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                style={{ width: `${Math.min(100, (card.balance / card.limit) * 100)}%` }}
                            ></div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card title="Transaction History">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-sm border-b border-slate-700">
                                <th className="pb-4 font-medium">Merchant</th>
                                <th className="pb-4 font-medium">Category</th>
                                <th className="pb-4 font-medium">Date</th>
                                <th className="pb-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {corporateCards.flatMap(c => c.transactions).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 10).map(tx => (
                                <tr key={tx.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                    <td className="py-4 font-semibold">{tx.merchant}</td>
                                    <td className="py-4 text-slate-400">{tx.category}</td>
                                    <td className="py-4 text-slate-400">{formatDate(new Date(tx.date))}</td>
                                    <td className="py-4 text-right font-mono font-bold text-slate-100">-{formatCurrency(tx.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const SettingsView: React.FC = () => {
    const { data: advData, actions: advActions } = useContext(AdvancedCardContext)!;
    
    return (
        <div className="max-w-3xl space-y-8">
            <Card title="Application Preferences">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Default Currency</p>
                            <p className="text-sm text-slate-400">The base currency for all new cards and reports.</p>
                        </div>
                        <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500">
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Multi-Factor Authentication</p>
                            <p className="text-sm text-slate-400">Require additional verification for high-value transactions.</p>
                        </div>
                        <input type="checkbox" className="toggle-checkbox" checked={advData.appConfig.enableMultiFactorAuthentication} readOnly />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">Audit Log Retention</p>
                            <p className="text-sm text-slate-400">How long historical data should be kept in the system.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 w-20 text-center" 
                                value={advData.appConfig.auditLogRetentionDays}
                                readOnly
                            />
                            <span className="text-sm text-slate-400">Days</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="API Integration">
                <p className="text-sm text-slate-400 mb-6">Manage API access for external enterprise systems like SAP, Oracle, or custom tools.</p>
                <div className="space-y-4">
                    {advData.apiSettings.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <i className="fa-solid fa-code text-4xl mb-4 opacity-20"></i>
                            <p>No active API keys configured.</p>
                        </div>
                    ) : (
                        advData.apiSettings.map(api => (
                            <div key={api.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="font-bold">{api.name}</p>
                                    <p className="text-xs font-mono text-slate-500">{api.endpoint}</p>
                                </div>
                                <Badge variant={api.isActive ? 'success' : 'neutral'}>
                                    {api.isActive ? 'Active' : 'Disabled'}
                                </Badge>
                            </div>
                        ))
                    )}
                    <Button variant="outline" className="w-full">
                        <i className="fa-solid fa-plus"></i> Generate API Key
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// --- Main App Implementation ---

const MainContent: React.FC = () => {
    const [currentTab, setCurrentTab] = useState('dashboard');

    const renderContent = () => {
        switch(currentTab) {
            case 'dashboard': return <DashboardView />;
            case 'cards': return <CardsView />;
            case 'settings': return <SettingsView />;
            default: return (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-4">
                    <i className="fa-solid fa-hammer text-6xl opacity-20"></i>
                    <p className="text-xl font-medium">Panel under construction</p>
                    <p className="text-sm">The <strong>{currentTab}</strong> module is being prepared for rollout.</p>
                </div>
            );
        }
    };

    return (
        <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
            {renderContent()}
        </Layout>
    );
};

export default function App() {
    return (
        <DataProvider>
            <AdvancedCardProvider>
                <MainContent />
            </AdvancedCardProvider>
        </DataProvider>
    );
}
