
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
};

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
};

export const generateUniqueId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const calculateBudgetUtilization = (spent: number, limit: number): number => {
    if (limit === 0) return 0;
    return (spent / limit) * 100;
};

export const getRandomNumber = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const capitalizeFirstLetter = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const deepClone = <T,>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};
