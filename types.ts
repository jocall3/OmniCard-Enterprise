
export type UserRole = 'Admin' | 'Finance Manager' | 'Team Lead' | 'Employee' | 'Auditor' | 'Executive';
export type CorporateCardStatus = 'Active' | 'Frozen' | 'Expired' | 'Pending';

export interface Transaction {
    id: string;
    date: string;
    description: string;
    merchant: string;
    category: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Declined';
}

export interface CorporateCardControls {
    monthlyLimit: number;
    atm: boolean;
    online: boolean;
    contactless: boolean;
    international?: boolean;
    dailyTransactionLimit?: number;
    recurringTransactionLimit?: number;
    allowedSpendingCategories?: string[];
    singleTransactionLimit?: number;
    blockGambling?: boolean;
    blockAdultContent?: boolean;
}

export interface CorporateCard {
    id: string;
    holderName: string;
    cardNumberMask: string;
    balance: number;
    limit: number;
    status: CorporateCardStatus;
    type: 'Physical' | 'Virtual';
    issueDate?: string;
    expirationDate?: string;
    associatedProject?: string;
    frozen: boolean;
    transactions: Transaction[];
    controls: CorporateCardControls;
}

// --- Extended Data Interfaces ---

export interface MerchantCategory {
    id: string;
    name: string;
    code: string;
    description: string;
    blockedByDefault: boolean;
}

export interface PolicyRule {
    id: string;
    name: string;
    description: string;
    type: 'limit' | 'category_block' | 'time_restriction' | 'geo_restriction' | 'transaction_approval';
    isActive: boolean;
    priority: number;
    configuration: any;
    appliesTo: 'all_cards' | 'specific_cards' | 'specific_holders';
    targetIds?: string[];
}

export interface CardRequest {
    id: string;
    requestorId: string;
    requestType: 'new_card' | 'limit_increase' | 'freeze_unfreeze' | 'card_replacement' | 'close_card';
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requestedDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
    details: {
        cardHolderName?: string;
        cardType?: 'physical' | 'virtual';
        limit?: number;
        reason: string;
        currency?: string;
        expirationDate?: Date;
        existingCardId?: string;
    };
    notes?: string;
}

export interface VirtualCard extends CorporateCard {
    parentCardId?: string;
    isSingleUse: boolean;
    expiration: Date;
    purpose: string;
    generationDate: Date;
    autoTerminateDate?: Date;
}

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    actorId: string;
    action: string;
    targetType: 'card' | 'card_request' | 'policy' | 'user' | 'virtual_card';
    targetId: string;
    oldValue?: any;
    newValue?: any;
    description: string;
}

export interface UserPermissionProfile {
    id: string;
    name: string;
    description: string;
    permissions: {
        canViewAllCards: boolean;
        canManageOwnCards: boolean;
        canManageTeamCards: boolean;
        canManageAllCards: boolean;
        canCreateCards: boolean;
        canApproveRequests: boolean;
        canManagePolicies: boolean;
        canViewAuditLogs: boolean;
        canManageUserPermissions: boolean;
        canAccessReporting: boolean;
        canManageIntegrations: boolean;
    };
}

export interface AlertConfiguration {
    id: string;
    name: string;
    description: string;
    type: 'spending_threshold' | 'unusual_transaction' | 'policy_violation' | 'card_status_change' | 'low_balance';
    threshold?: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'transaction';
    targetCards?: string[];
    targetUsers?: string[];
    channels: ('email' | 'slack' | 'sms')[];
    isActive: boolean;
}

export interface Subscription {
    id: string;
    cardId: string;
    merchantName: string;
    amount: number;
    currency: string;
    billingCycle: 'monthly' | 'annually' | 'quarterly';
    nextBillingDate: Date;
    status: 'active' | 'cancelled' | 'paused';
    category: string;
    startDate: Date;
    notes?: string;
}

export interface Budget {
    id: string;
    name: string;
    period: 'monthly' | 'quarterly' | 'annually';
    totalAmount: number;
    allocatedAmount: number;
    spentAmount: number;
    departmentId?: string;
    projectId?: string;
    startDate: Date;
    endDate: Date;
    cardsLinked: string[];
}

export interface APISetting {
    id: string;
    name: string;
    description: string;
    apiKey: string;
    apiSecret?: string;
    endpoint: string;
    isActive: boolean;
    lastAccessed: Date;
    allowedIPs?: string[];
    webhookUrl?: string;
    eventsSubscribed?: string[];
}

export interface ComplianceReport {
    id: string;
    name: string;
    description: string;
    reportType: 'spending_policy_adherence' | 'transaction_audits' | 'user_activity' | 'financial_reconciliation';
    generatedBy: string;
    generatedDate: Date;
    startDate: Date;
    endDate: Date;
    status: 'pending' | 'completed' | 'failed';
    downloadUrl?: string;
    parameters: any;
}

export interface Statement {
    id: string;
    cardId: string;
    statementDate: Date;
    startDate: Date;
    endDate: Date;
    totalSpent: number;
    totalRefunds: number;
    closingBalance: number;
    status: 'generated' | 'reviewed' | 'approved';
    downloadUrl: string;
}

export interface AppConfig {
    defaultCurrency: string;
    auditLogRetentionDays: number;
    cardRequestApprovalWorkflow: 'single_approver' | 'multi_approver' | 'auto_approve';
    maxVirtualCardsPerUser: number;
    enableMultiFactorAuthentication: boolean;
}
