
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";
import { formatCurrency } from "../utils";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSpendingInsights = async (transactions: Transaction[]): Promise<string> => {
    if (!transactions.length) return "No transactions found to analyze.";

    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const summaryData = transactions.slice(0, 10).map(t => `${t.merchant} (${t.category}): ${formatCurrency(t.amount)}`).join(', ');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze these corporate card transactions and provide 3 key insights or suggestions to optimize spending. Total spent: ${formatCurrency(totalSpent)}. Sample transactions: ${summaryData}`,
            config: {
                systemInstruction: "You are a senior financial analyst providing concise, actionable insights for corporate card users."
            }
        });
        return response.text || "Analysis complete. Spending appears normal.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Unable to generate insights at this time.";
    }
};
