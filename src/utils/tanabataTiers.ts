import { TanabataTierInfo } from '../types';

export const TANABATA_TIERS: TanabataTierInfo[] = [
    {
        index: 0,
        name: 'Boss Meow',
        nameEn: 'Boss Meow Supporter',
        minDonation: 2000,
        badge: '🐱 Boss Meow',
        icon: '🐱',
        colorName: 'Holographic Boss Meow',
        description: 'โดเนท 2,000 บาท • ขั้นสูงสุด สปอยล์เต็มที่เหมือนยอมเป็นบอสแมวสายเปย์'
    },
    {
        index: 1,
        name: 'Heartbeat',
        nameEn: 'Heartbeat Supporter',
        minDonation: 500,
        badge: '💖 Heartbeat',
        icon: '💖',
        colorName: 'Imperial Heartbeat',
        description: 'โดเนท 500 บาท • หัวใจเต็มร้อย ส่งความรักและพลังใจแบบอัดแน่นไม่มีกั๊ก'
    },
    {
        index: 2,
        name: 'Sakura Blossom',
        nameEn: 'Sakura Blossom Supporter',
        minDonation: 200,
        badge: '🌸 Sakura Blossom',
        icon: '🌸',
        colorName: 'Sakura Blossom',
        description: 'โดเนท 200 บาท • ซากุระแรกแย้ม กำลังใจที่สดใส อบอุ่น และเบ่งบานไปพร้อมกัน'
    },
    {
        index: 3,
        name: 'Sparkling Star',
        nameEn: 'Sparkling Star Supporter',
        minDonation: 100,
        badge: '🌟 Sparkling Star',
        icon: '🌟',
        colorName: 'Sparkling Star',
        description: 'โดเนท 100 บาท • ละอองประกาย แสงวิบวับเล็กๆ ที่มารวมกันแล้วสดใสมาก'
    },
    {
        index: 4,
        name: 'Stardust',
        nameEn: 'Stardust Supporter',
        minDonation: 50,
        badge: '✨ Stardust',
        icon: '✨',
        colorName: 'Stardust Pastel',
        description: 'โดเนท 50 บาท • ดาราดวงน้อย แสงดาวเริ่มต้นที่มีพลัง จุดรวมพลังใจก้อนใหญ่'
    },
    {
        index: 5,
        name: 'Stardust',
        nameEn: 'Stardust Supporter',
        minDonation: 50,
        badge: '✨ Stardust',
        icon: '✨',
        colorName: 'Stardust Pastel',
        description: 'โดเนท 50 บาท • ดาราดวงน้อย แสงดาวเริ่มต้นที่มีพลัง จุดรวมพลังใจก้อนใหญ่'
    }
];

export const getTierByBranchIndex = (branchIndex: number): TanabataTierInfo => {
    const normalized = Math.max(0, Math.min(5, Number(branchIndex) || 0));
    return TANABATA_TIERS[normalized] || TANABATA_TIERS[5];
};

export const getBranchIndexFromAmount = (amount?: number): number => {
    if (amount === undefined || amount === null || isNaN(amount)) return 5;
    if (amount >= 2000) return 0; // Diamond
    if (amount >= 500) return 1; // Gold
    if (amount >= 200) return 2;  // Silver
    if (amount >= 100) return 3;  // Fan > 100
    if (amount >= 50) return 4;    // Fan > 1
    return 5;                    // General / 0
};

// Styling for Small Tanzaku on Bamboo Tree
export const getTreePaperStyle = (branchIndex: number) => {
    switch (branchIndex) {
        case 0: // Diamond Fan (>5,000฿)
            return {
                cardBg: 'bg-gradient-to-b from-indigo-100/95 via-pink-100/95 to-amber-100/95',
                border: 'border-2 border-amber-300 ring-2 ring-pink-400/50',
                shadow: 'shadow-[0_0_18px_rgba(244,114,182,0.5),0_0_8px_rgba(234,179,8,0.4)]',
                badgeBg: 'bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-white font-black',
                textColor: 'text-indigo-950 font-semibold',
                stringColor: '#f59e0b',
                knotColor: 'bg-gradient-to-r from-amber-400 to-pink-500',
                tasselColor: 'bg-gradient-to-b from-amber-400 via-pink-500 to-indigo-500',
                tagText: 'text-amber-900',
                tierLabel: '💎 Diamond',
                isDiamond: true,
                isGold: false,
                isSilver: false
            };
        case 1: // Gold Fan (>2,000฿)
            return {
                cardBg: 'bg-gradient-to-b from-amber-100/95 via-yellow-50/95 to-amber-200/95',
                border: 'border-2 border-amber-400 ring-1 ring-yellow-300',
                shadow: 'shadow-[0_0_14px_rgba(245,158,11,0.45)]',
                badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-50 font-bold',
                textColor: 'text-amber-950 font-semibold',
                stringColor: '#d97706',
                knotColor: 'bg-amber-500',
                tasselColor: 'bg-gradient-to-b from-amber-400 to-yellow-600',
                tagText: 'text-amber-900',
                tierLabel: '👑 Gold',
                isDiamond: false,
                isGold: true,
                isSilver: false
            };
        case 2: // Silver Fan (>500฿)
            return {
                cardBg: 'bg-gradient-to-b from-slate-100/95 via-sky-50/95 to-slate-200/95',
                border: 'border-2 border-slate-300 ring-1 ring-sky-200',
                shadow: 'shadow-[0_0_10px_rgba(148,163,184,0.4)]',
                badgeBg: 'bg-gradient-to-r from-slate-600 to-slate-800 text-white font-bold',
                textColor: 'text-slate-900 font-semibold',
                stringColor: '#94a3b8',
                knotColor: 'bg-slate-400',
                tasselColor: 'bg-slate-400',
                tagText: 'text-slate-800',
                tierLabel: '✨ Silver',
                isDiamond: false,
                isGold: false,
                isSilver: true
            };
        case 3: // Fan (>100฿)
            return {
                cardBg: 'bg-gradient-to-b from-rose-50/95 via-pink-100/95 to-rose-100/95',
                border: 'border-1.5 border-rose-300',
                shadow: 'shadow-md shadow-pink-500/20',
                badgeBg: 'bg-rose-500 text-white font-semibold',
                textColor: 'text-rose-950',
                stringColor: '#fb7185',
                knotColor: 'bg-rose-400',
                tasselColor: 'bg-rose-400',
                tagText: 'text-rose-800',
                tierLabel: '🌸 Fan 100฿+',
                isDiamond: false,
                isGold: false,
                isSilver: false
            };
        case 4: // Fan (>1฿)
            return {
                cardBg: 'bg-gradient-to-b from-pink-50/95 via-purple-50/95 to-sky-50/95',
                border: 'border border-pink-200',
                shadow: 'shadow-sm shadow-purple-500/15',
                badgeBg: 'bg-pink-400 text-white font-medium',
                textColor: 'text-slate-800',
                stringColor: '#f472b6',
                knotColor: 'bg-pink-400',
                tasselColor: 'bg-pink-300',
                tagText: 'text-slate-700',
                tierLabel: '💖 Fan 1฿+',
                isDiamond: false,
                isGold: false,
                isSilver: false
            };
        default: // 5 - General Public / No donate
            return {
                cardBg: 'bg-[#faf6ee]/95',
                border: 'border border-amber-200/80',
                shadow: 'shadow-xs',
                badgeBg: 'bg-emerald-700 text-emerald-50 font-medium',
                textColor: 'text-stone-800',
                stringColor: '#a8a29e',
                knotColor: 'bg-stone-400',
                tasselColor: 'bg-stone-300',
                tagText: 'text-stone-600',
                tierLabel: '🎋 ทั่วไป',
                isDiamond: false,
                isGold: false,
                isSilver: false
            };
    }
};
