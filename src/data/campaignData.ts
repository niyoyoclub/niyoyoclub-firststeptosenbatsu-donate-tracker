import { CampaignData, Donation, Milestone, RewardTier, WishMessage, ExpenseCategory } from '../types';

export const INITIAL_CAMPAIGN: CampaignData = {
  title: "#NiyaFirstStepToSenbatsu 🌸",
  subtitle: "โครงการโดเนทเพื่อส่ง 'นีญ่า' สู่ตำแหน่ง 13 หรือ เซ็มบัตสึ",  
  candidateName: "Niya BNK48 (นีญ่า)",
  targetGoal: 136000,
  votePrice: 68, // 68 Baht per vote
  deadline: "2026-11-12T19:59:59Z",
  promptPayNumber: "236-1-62262-9",
  bankAccountName: "นาย วัฒนชัย ยิ้มงาม",
  bankName: "ธนาคารกสิกรไทย (KBank)",
  bankAccountNumber: "236-1-62262-9",
  sheetCsvUrl: "",
  startToken: 2085,
};

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m1",
    amount: 6000,
    title: "6,000 ฿ — Bonus +600 Tokens",
    description: "ทบจากผู้สนับสนุน +600 Tokens",
    icon: "Tv",
    isUnlocked: true,
    tokenBonus: 600
  },
  {
    id: "m2",
    amount: 12000,
    title: "12,000 ฿ — Bonus +600 Tokens",
    description: "ทบจากผู้สนับสนุน +600 Tokens รวมทบ 1,200 Tokens",
    icon: "Daifuku",
    isUnlocked: true,
    tokenBonus: 1200,
  },
  {
    id: "m3",
    amount: 24000,
    title: "24,000 ฿ — Bonus +1,200 Tokens",
    description: "ทบจากผู้สนับสนุน +1,200 Tokens รวมทบ 2,400 Tokens",
    icon: "Sparkles",
    isUnlocked: false,
    tokenBonus: 2400
  },
  {
    id: "m4",
    amount: 48000,
    title: "48,000 ฿ — Bonus +2,400 Tokens",
    description: "ทบจากผู้สนับสนุน +2,400 Tokens รวมทบ 4,800 Tokens",
    icon: "Trophy",
    isUnlocked: false,
    tokenBonus: 4800
  },
  {
    id: "m5",
    amount: 68000,
    title: "68,000 ฿ — Bonus +2,000 Tokens",
    description: "ทบจากผู้สนับสนุน +2,000 Tokens รวมทบ 6,800 Tokens",
    icon: "Trophy",
    isUnlocked: false,
    tokenBonus: 6800
  },
  {
    id: "m6",
    amount: 136000,
    title: "136,000 ฿ — Final Bonus +6,800 Tokens",
    description: "ทบจากผู้สนับสนุน +6,800 Tokens รวมทบตลอดแคมเปญ 13,600 Tokens",
    icon: "Trophy",
    isUnlocked: false,
    tokenBonus: 13600
  }
];

export const INITIAL_REWARD_TIERS: RewardTier[] = [
  {
    minAmount: 100,
    title: "Supporter Tier",
    perks: ["Digital Wallpaper นีญ่าสุดพิเศษ", "บันทึกชื่อในรายชื่อขอบคุณท้ายโครงการ"],
    badgeColor: "bg-pink-100 text-pink-700 border-pink-200",
    iconName: "Heart"
  },
  {
    minAmount: 500,
    title: "Bronze Fan Tier",
    perks: ["พวงกุญแจอะคริลิคนีญ่า Limited Edition", "สิทธิ์เข้าร่วม Exclusive Live สรุปยอด", "Perks ทั้งหมดของ Supporter"],
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    iconName: "Star"
  },
  {
    minAmount: 2000,
    title: "Silver Senbatsu Tier",
    perks: ["เข็มกลัดยิ้มสดใสนีญ่า", "โปสการ์ดพร้อมลายเซ็นสกรีนพิเศษ", "สิทธิ์สุ่มรับรูปถ่าย Exclusive Cheki"],
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    iconName: "Award"
  },
  {
    minAmount: 5000,
    title: "Gold VIP Tier",
    perks: ["กรอบรูปพร้อมลายเซ็นสดจากนีญ่า", "เสื้อยืดสกรีนลายโครงการ Niya Senbatsu", "Special Video Thanks ส่งตรงถึงคุณ"],
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    iconName: "Crown"
  }
];

export const INITIAL_DONATIONS: Donation[] = [];

/*
export const INITIAL_DONATIONS: Donation[] = [
  {
    id: "don-001",
    donorName: "แมวน้อยของนีญ่า 💗",
    amount: 15000,
    timestamp: "2026-08-13 09:30",
    note: "ส่งนีญ่าติดเซ็มบัตสึให้ได้นะ! จะคอยซัพพอร์ตเสมอจ้า ✨",
    tier: "tier-diamond",
    verified: true
  },
  {
    id: "don-002",
    donorName: "NiyaFC_Official",
    amount: 50000,
    timestamp: "2026-08-12 21:15",
    note: "ก้อนแรกจากบ้านแฟนคลับ ร่วมพลังเพื่อเซ็มแรก!",
    tier: "tier-diamond",
    verified: true
  },
  {
    id: "don-003",
    donorName: "คุณหมีพูห์สดใส",
    amount: 2500,
    timestamp: "2026-08-12 18:04",
    note: "รอยยิ้มนีญ่าคือพลังใจของพวกเรา สู้ๆ น้า",
    tier: "tier-gold",
    verified: true
  },
  {
    id: "don-004",
    donorName: "ผู้ไม่ประสงค์ออกนาม",
    amount: 1000,
    timestamp: "2026-08-12 14:20",
    note: "ขอให้นีญ่าโชคดีสมหวังในงานเลือกตั้งครั้งนี้นะครับ",
    isAnonymous: true,
    tier: "tier-silver",
    verified: true
  },
  {
    id: "don-005",
    donorName: "P'Korn_NiyaFan",
    amount: 5000,
    timestamp: "2026-08-11 20:00",
    note: "จัดไปเพื่อป้ายสยาม! อยากเห็นรอยยิ้มนีญ่าบนจอยักษ์",
    tier: "tier-gold",
    verified: true
  },
  {
    id: "don-006",
    donorName: "ต้มยำกุ้งใส่ใจ",
    amount: 500,
    timestamp: "2026-08-11 16:45",
    note: "ช่วยสมทบทุนจ้า เล็กๆ น้อยๆ แต่ให้ด้วยใจ 💖",
    tier: "tier-normal",
    verified: true
  },
  {
    id: "don-007",
    donorName: "Niya_Oshi_Always",
    amount: 10000,
    timestamp: "2026-08-10 11:10",
    note: "ขอให้นีญ่าส่องประกายสว่างที่สุดบนเวทีนะ!",
    tier: "tier-diamond",
    verified: true
  },
  {
    id: "don-008",
    donorName: "น้องส้มส้ม 🍊",
    amount: 300,
    timestamp: "2026-08-09 19:22",
    note: "สู้ๆ นะคะนีญ่าคนเก่ง!",
    tier: "tier-normal",
    verified: true
  }
];*/

export const INITIAL_WISHES: WishMessage[] = [];
/*
export const INITIAL_WISHES: WishMessage[] = [
  {
    id: "w1",
    author: "น้องส้มสดใส",
    message: "นีญ่าคือพลังบวกของพวกเราทุกคนเลยนะ ขอให้รอบนี้ติดเซ็มบัตสึตามที่ตั้งใจไว้! รักนีญ่าเสมอนะคะ 💖",
    timestamp: "2026-08-13 08:12",
    likes: 42,
    tag: "ส่งกำลังใจ ✨",
    avatarColor: "bg-pink-100 text-pink-600"
  },
  {
    id: "w2",
    author: "พี่ก้องใจดี",
    message: "ติดตามมาตั้งแต่วันแรก เห็นความพยายามของนีญ่ามาตลอด ครั้งนี้พวกเราจะพานีญ่าไปยืนบนแถวหน้าให้ได้!",
    timestamp: "2026-08-12 22:50",
    likes: 38,
    tag: "เป้าหมาย Senbatsu 🌟",
    avatarColor: "bg-purple-100 text-purple-600"
  },
  {
    id: "w3",
    author: "Strawberry_Cake",
    message: "รอยยิ้มนีญ่าทำให้วันแย่ๆ กลายเป็นวันที่ดีได้เสมอ เป็นกำลังใจให้นะคะ นีญ่าทำได้แน่นอน!",
    timestamp: "2026-08-12 17:30",
    likes: 29,
    tag: "รักนีญ่า 💗",
    avatarColor: "bg-rose-100 text-rose-600"
  }
];
*/

export const INITIAL_EXPENSES: ExpenseCategory[] = [
  { category: "โหวตคะแนนเลือกตั้ง (Election Tokens)", percentage: 0, allocatedAmount: 136000, color: "bg-pink-500" },  
];
/*
export const INITIAL_EXPENSES: ExpenseCategory[] = [
  { category: "โหวตคะแนนเลือกตั้ง (Election Tokens)", percentage: 70, allocatedAmount: 350000, color: "bg-pink-500" },
  { category: "สื่อโฆษณา PR & ป้าย LED Siam", percentage: 15, allocatedAmount: 75000, color: "bg-purple-500" },
  { category: "จัดงานคัพสลีฟ & Cafe Event", percentage: 10, allocatedAmount: 50000, color: "bg-sky-400" },
  { category: "ผลิต Goods & ค่าจัดส่งของรางวัล", percentage: 5, allocatedAmount: 25000, color: "bg-amber-400" }
];
*/
