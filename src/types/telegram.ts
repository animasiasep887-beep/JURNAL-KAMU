// ==========================================
// TELEGRAM INTEGRATION & PARSER TYPES
// ==========================================

import type { TransactionType } from './index';

export interface ParsedTelegramExpense {
  isTransaction: boolean;
  type: TransactionType;
  item: string;
  amount: number;
  category: string;
  accountType?: 'cash' | 'bank' | 'ewallet' | 'savings';
  confidence: 'high' | 'medium' | 'low';
  rawMessage: string;
  suggestedAccountName?: string;
  date: string;
  time: string;
  notes?: string;
}

export interface TelegramBotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO
  interactiveButtons?: {
    label: string;
    action: string;
    payload?: any;
    style?: 'primary' | 'secondary' | 'danger';
  }[];
  parsedTransaction?: ParsedTelegramExpense;
}
