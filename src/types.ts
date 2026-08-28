export interface Donation {
  id: string;
  timestamp: string; // ISO or formatted date string
  donorName: string;
  amount: number;  
  paymentChannel: string;
  slipRef: string;
  note?: string;
  verified?: boolean;
  tier?: 'tier-normal' | 'tier-silver' | 'tier-gold' | 'tier-diamond';
  isAnonymous?: boolean;
  slipUrl?: string;
}

export interface ImagePayload {
  fileName: string;
  fileMimeType: string;
  fileBase64: string;
}

export interface DonationSheetPayload {
  donationPayload: Donation;
  imagePayload: ImagePayload;
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
  endVote: string; // ISO string
  promptPayNumber: string;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  sheetCsvUrl?: string;
  startToken: number;
  maxAddonToken: number;
  currentBonusToken: number;
  refreshEveryMinutes: number;
}

export type TanzakuColor = 'pink' | 'blue' | 'yellow' | 'green' | 'purple' | 'red';

export interface TanabataWish {
  id: string;
  author: string;
  wish: string;
  timestamp: string; // e.g. '2026-07-07 19:30'
  color: TanzakuColor;
  category: string; // e.g. 'Senbatsu Dream', 'Health & Happiness', 'Daily Cheer'
  branchIndex: number; // 0 to 5 for bamboo branch position
  hangPositionPercent: number; // 10 to 90% along branch
  blessings: number; // likes / prayers จำนวนยอดเงินโดเนท
  pattern?: 'stars' | 'cherry' | 'bamboo' | 'plain';
}