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

// Request Payload จาก Vue UI (รวมไฟล์รูป Base64)
export interface CreateDonationDto extends Omit<Donation, 'id' | 'timestamp'> {
  slipImageBase64?: string; // string รูปภาพ Base64 เช่น "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  slipFileName?: string;
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
