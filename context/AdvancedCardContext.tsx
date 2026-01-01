
import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { 
    MerchantCategory, PolicyRule, CardRequest, VirtualCard, AuditLogEntry, 
    UserPermissionProfile, AlertConfiguration, Subscription, Budget, APISetting, 
    ComplianceReport, Statement, AppConfig 
} from '../types';
import { DataContext } from './DataContext';
import { generateUniqueId, getRandomNumber, formatDate, capitalizeFirstLetter } from '../utils';

interface AdvancedCardData {
    merchantCategories: MerchantCategory[];
    policyRules: PolicyRule[];
    cardRequests: CardRequest[];
    virtualCards: VirtualCard[];
    auditLogs: AuditLogEntry[];
    userPermissionProfiles: UserPermissionProfile[];
    alertConfigurations: AlertConfiguration[];
    subscriptions: Subscription[];
    budgets: Budget[];
    apiSettings: APISetting[];
    complianceReports: ComplianceReport[];
    statements: Statement[];
    appConfig: AppConfig;
}

interface AdvancedCardActions {
    updateMerchantCategory: (id: string, updates: Partial<MerchantCategory>) => void;
    addPolicyRule: (rule: PolicyRule) => void;
    updatePolicyRule: (id: string, updates: Partial<PolicyRule>) => void;
    deletePolicyRule: (id: string) => void;
    createCardRequest: (request: Omit<CardRequest, 'id' | 'status' | 'requestedDate'>) => void;
    updateCardRequestStatus: (id: string, status: CardRequest['status'], approverId: string) => void;
    createVirtualCard: (card: any) => void;
    updateVirtualCard: (id: string, updates: Partial<VirtualCard>) => void;
    deleteVirtualCard: (id: string) => void;
    addAuditLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
    addUserPermissionProfile: (profile: UserPermissionProfile) => void;
    updateUserPermissionProfile: (id: string, updates: Partial<UserPermissionProfile>) => void;
    deleteUserPermissionProfile: (id: string) => void;
    addAlertConfiguration: (config: AlertConfiguration) => void;
    updateAlertConfiguration: (id: string, updates: Partial<AlertConfiguration>) => void;
    deleteAlertConfiguration: (id: string) => void;
    addSubscription: (sub: Omit<Subscription, 'id'>) => void;
    updateSubscription: (id: string, updates: Partial<Subscription>) => void;
    deleteSubscription: (id: string) => void;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    updateBudget: (id: string, updates: Partial<Budget>) => void;
    deleteBudget: (id: string) => void;
    updateAPISetting: (id: string, updates: Partial<APISetting>) => void;
    generateComplianceReport: (params: any) => Promise<ComplianceReport>;
    generateStatement: (cardId: string, month: number, year: number) => Promise<Statement>;
    updateAppConfig: (config: Partial<AppConfig>) => void;
}

export const AdvancedCardContext = createContext<{ data: AdvancedCardData; actions: AdvancedCardActions } | null>(null);

export const AdvancedCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dataContext = useContext(DataContext);
    if (!dataContext) throw new Error("AdvancedCardProvider depends on DataProvider");

    // Mock data generators
    const mockCategories: MerchantCategory[] = [
        { id: '1', name: 'Software', code: '7372', description: 'Computing tools', blockedByDefault: false },
        { id: '2', name: 'Restaurants', code: '5812', description: 'Dining', blockedByDefault: true },
        { id: '3', name: 'Advertising', code: '7311', description: 'Ads', blockedByDefault: false },
    ];

    const [merchantCategories, setMerchantCategories] = useState(mockCategories);
    const [policyRules, setPolicyRules] = useState<PolicyRule[]>([]);
    const [cardRequests, setCardRequests] = useState<CardRequest[]>([]);
    const [virtualCards, setVirtualCards] = useState<VirtualCard[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
    const [userPermissionProfiles, setUserPermissionProfiles] = useState<UserPermissionProfile[]>([]);
    const [alertConfigurations, setAlertConfigurations] = useState<AlertConfiguration[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [apiSettings, setApiSettings] = useState<APISetting[]>([]);
    const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
    const [statements, setStatements] = useState<Statement[]>([]);
    const [appConfig, setAppConfig] = useState<AppConfig>({
        defaultCurrency: 'USD',
        auditLogRetentionDays: 365,
        cardRequestApprovalWorkflow: 'single_approver',
        maxVirtualCardsPerUser: 5,
        enableMultiFactorAuthentication: true
    });

    const addAuditLog = useCallback((log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
        setAuditLogs(prev => [...prev, { ...log, id: generateUniqueId(), timestamp: new Date() }]);
    }, []);

    const updateMerchantCategory = useCallback((id: string, updates: Partial<MerchantCategory>) => {
        setMerchantCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const addPolicyRule = useCallback((rule: PolicyRule) => {
        setPolicyRules(prev => [...prev, { ...rule, id: generateUniqueId() }]);
    }, []);

    const updatePolicyRule = useCallback((id: string, updates: Partial<PolicyRule>) => {
        setPolicyRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    }, []);

    const deletePolicyRule = useCallback((id: string) => {
        setPolicyRules(prev => prev.filter(r => r.id !== id));
    }, []);

    const createCardRequest = useCallback((request: any) => {
        setCardRequests(prev => [...prev, { ...request, id: generateUniqueId(), status: 'pending', requestedDate: new Date() }]);
    }, []);

    const updateCardRequestStatus = useCallback((id: string, status: CardRequest['status'], approverId: string) => {
        setCardRequests(prev => prev.map(r => r.id === id ? { ...r, status, approvedBy: approverId, approvalDate: new Date() } : r));
    }, []);

    const createVirtualCard = useCallback((card: any) => {
        setVirtualCards(prev => [...prev, { ...card, id: generateUniqueId(), generationDate: new Date(), cardNumberMask: 'V-' + Math.floor(getRandomNumber(1000, 9999)) }]);
    }, []);

    const updateVirtualCard = useCallback((id: string, updates: Partial<VirtualCard>) => {
        setVirtualCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    }, []);

    const deleteVirtualCard = useCallback((id: string) => {
        setVirtualCards(prev => prev.filter(c => c.id !== id));
    }, []);

    const addUserPermissionProfile = useCallback((profile: UserPermissionProfile) => {
        setUserPermissionProfiles(prev => [...prev, { ...profile, id: generateUniqueId() }]);
    }, []);

    const updateUserPermissionProfile = useCallback((id: string, updates: Partial<UserPermissionProfile>) => {
        setUserPermissionProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    const deleteUserPermissionProfile = useCallback((id: string) => {
        setUserPermissionProfiles(prev => prev.filter(p => p.id !== id));
    }, []);

    const addAlertConfiguration = useCallback((config: AlertConfiguration) => {
        setAlertConfigurations(prev => [...prev, { ...config, id: generateUniqueId() }]);
    }, []);

    const updateAlertConfiguration = useCallback((id: string, updates: Partial<AlertConfiguration>) => {
        setAlertConfigurations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }, []);

    const deleteAlertConfiguration = useCallback((id: string) => {
        setAlertConfigurations(prev => prev.filter(a => a.id !== id));
    }, []);

    const addSubscription = useCallback((sub: any) => {
        setSubscriptions(prev => [...prev, { ...sub, id: generateUniqueId() }]);
    }, []);

    const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
        setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const deleteSubscription = useCallback((id: string) => {
        setSubscriptions(prev => prev.filter(s => s.id !== id));
    }, []);

    const addBudget = useCallback((budget: any) => {
        setBudgets(prev => [...prev, { ...budget, id: generateUniqueId(), allocatedAmount: 0, spentAmount: 0 }]);
    }, []);

    const updateBudget = useCallback((id: string, updates: Partial<Budget>) => {
        setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    }, []);

    const deleteBudget = useCallback((id: string) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    }, []);

    const updateAPISetting = useCallback((id: string, updates: Partial<APISetting>) => {
        setApiSettings(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    }, []);

    const generateComplianceReport = useCallback(async (params: any) => {
        return new Promise<ComplianceReport>(resolve => {
            setTimeout(() => {
                const report: ComplianceReport = {
                    id: generateUniqueId(),
                    name: `Report ${formatDate(new Date())}`,
                    description: "Auto-generated analysis",
                    reportType: params.reportType || 'user_activity',
                    generatedBy: 'System',
                    generatedDate: new Date(),
                    startDate: new Date(),
                    endDate: new Date(),
                    status: 'completed',
                    downloadUrl: '#',
                    parameters: params
                };
                setComplianceReports(prev => [...prev, report]);
                resolve(report);
            }, 1000);
        });
    }, []);

    const generateStatement = useCallback(async (cardId: string, month: number, year: number) => {
        return new Promise<Statement>(resolve => {
            setTimeout(() => {
                const stmt: Statement = {
                    id: generateUniqueId(),
                    cardId,
                    statementDate: new Date(),
                    startDate: new Date(year, month - 1, 1),
                    endDate: new Date(year, month, 0),
                    totalSpent: 1200,
                    totalRefunds: 50,
                    closingBalance: 1150,
                    status: 'generated',
                    downloadUrl: '#'
                };
                setStatements(prev => [...prev, stmt]);
                resolve(stmt);
            }, 1000);
        });
    }, []);

    const updateAppConfig = useCallback((updates: Partial<AppConfig>) => {
        setAppConfig(prev => ({ ...prev, ...updates }));
    }, []);

    const advancedData: AdvancedCardData = useMemo(() => ({
        merchantCategories, policyRules, cardRequests, virtualCards, auditLogs,
        userPermissionProfiles, alertConfigurations, subscriptions, budgets,
        apiSettings, complianceReports, statements, appConfig
    }), [
        merchantCategories, policyRules, cardRequests, virtualCards, auditLogs,
        userPermissionProfiles, alertConfigurations, subscriptions, budgets,
        apiSettings, complianceReports, statements, appConfig
    ]);

    const advancedActions: AdvancedCardActions = useMemo(() => ({
        updateMerchantCategory, addPolicyRule, updatePolicyRule, deletePolicyRule,
        createCardRequest, updateCardRequestStatus, createVirtualCard, updateVirtualCard,
        deleteVirtualCard, addAuditLog, addUserPermissionProfile, updateUserPermissionProfile,
        deleteUserPermissionProfile, addAlertConfiguration, updateAlertConfiguration,
        deleteAlertConfiguration, addSubscription, updateSubscription, deleteSubscription,
        addBudget, updateBudget, deleteBudget, updateAPISetting, generateComplianceReport,
        generateStatement, updateAppConfig
    }), [
        updateMerchantCategory, addPolicyRule, updatePolicyRule, deletePolicyRule,
        createCardRequest, updateCardRequestStatus, createVirtualCard, updateVirtualCard,
        deleteVirtualCard, addAuditLog, addUserPermissionProfile, updateUserPermissionProfile,
        deleteUserPermissionProfile, addAlertConfiguration, updateAlertConfiguration,
        deleteAlertConfiguration, addSubscription, updateSubscription, deleteSubscription,
        addBudget, updateBudget, deleteBudget, updateAPISetting, generateComplianceReport,
        generateStatement, updateAppConfig
    ]);

    return (
        <AdvancedCardContext.Provider value={{ data: advancedData, actions: advancedActions }}>
            {children}
        </AdvancedCardContext.Provider>
    );
};
