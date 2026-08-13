export interface Donation {
  id: string;
  timestamp: string; // ISO or formatted date string
  donorName: string;
  amount: number;  
  paymentChannel: string;
  slipRef: string;
  note?: string;
  verified?: boolean;  
  tier: number;
  isAnonymous?: boolean;
}

export interface Milestone {
  id: string;
  amount: number;
  tokenBonus: number;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}

export interface WishMessage {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  tag: string;
  avatarColor: string;
}

export interface RewardTier {
  minAmount: number;
  title: string;
  perks: string[];
  badgeColor: string;
  iconName: string;
}

export interface ExpenseCategory {
  category: string;
  percentage: number;
  allocatedAmount: number;
  color: string;
}

export interface CampaignData {
  title: string;
  subtitle: string;
  candidateName: string;
  targetGoal: number;
  votePrice: number; // e.g. 68 THB per vote
  deadline: string; // ISO string
  promptPayNumber: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  sheetCsvUrl?: string;
}
