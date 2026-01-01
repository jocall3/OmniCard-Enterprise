
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    currentTab: string;
    setCurrentTab: (tab: string) => void;
}

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'cards', label: 'Cards', icon: 'fa-credit-card' },
    { id: 'requests', label: 'Requests', icon: 'fa-paper-plane' },
    { id: 'budgets', label: 'Budgets', icon: 'fa-piggy-bank' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'fa-repeat' },
    { id: 'policies', label: 'Policies', icon: 'fa-shield-halved' },
    { id: 'audit', label: 'Audit Trail', icon: 'fa-list-check' },
    { id: 'settings', label: 'Settings', icon: 'fa-gear' },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, setCurrentTab }) => {
    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
                        <i className="fa-solid fa-cube"></i>
                        OmniCard
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Enterprise Management</p>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                currentTab === item.id 
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' 
                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-900">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">Jane Doe</p>
                            <p className="text-xs text-slate-400 truncate">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-300">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <h2 className="text-lg font-semibold">{NAV_ITEMS.find(i => i.id === currentTab)?.label}</h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyan-500 w-64"
                            />
                        </div>
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <i className="fa-solid fa-bell"></i>
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <i className="fa-solid fa-circle-question"></i>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
