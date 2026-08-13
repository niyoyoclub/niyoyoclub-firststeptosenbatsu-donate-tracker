import { CampaignData, Donation, WishMessage, Milestone } from '../types';
import { INITIAL_CAMPAIGN, INITIAL_DONATIONS, INITIAL_WISHES, INITIAL_MILESTONES } from '../data/campaignData';

const CAMPAIGN_KEY = 'niya_campaign_data_v1';
const DONATIONS_KEY = 'niya_donations_data_v1';
const WISHES_KEY = 'niya_wishes_data_v1';

export function getCampaign(): CampaignData {
  try {
    const saved = localStorage.getItem(CAMPAIGN_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse campaign state", e);
  }
  return INITIAL_CAMPAIGN;
}

export function saveCampaign(data: CampaignData) {
  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save campaign state", e);
  }
}

export function getDonations(): Donation[] {
  try {
    const saved = localStorage.getItem(DONATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse donations state", e);
  }
  return INITIAL_DONATIONS;
}

export function saveDonations(donations: Donation[]) {
  try {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
  } catch (e) {
    console.error("Failed to save donations state", e);
  }
}

export function getWishes(): WishMessage[] {
  try {
    const saved = localStorage.getItem(WISHES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to parse wishes state", e);
  }
  return INITIAL_WISHES;
}

export function saveWishes(wishes: WishMessage[]) {
  try {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
  } catch (e) {
    console.error("Failed to save wishes state", e);
  }
}

// Parse Google Sheets CSV format if user attaches a sheet link
export function parseCSVDonations(csvText: string): Donation[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const donations: Donation[] = [];
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting handling quotes
    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    if (row && row.length >= 2) {
      const name = row[0] ? row[0].replace(/^"|"$/g, '').trim() : 'Donation';
      const rawAmount = row[1] ? row[1].replace(/[^0-9.]/g, '') : '0';
      const amount = parseFloat(rawAmount) || 0;
      const note = row[2] ? row[2].replace(/^"|"$/g, '').trim() : '';
      const time = row[3] ? row[3].replace(/^"|"$/g, '').trim() : new Date().toISOString().split('T')[0];

      if (amount > 0) {
        let tier: 'tier-normal' | 'tier-silver' | 'tier-gold' | 'tier-diamond' = 'tier-normal';
        if (amount >= 10000) tier = 'tier-diamond';
        else if (amount >= 2000) tier = 'tier-gold';
        else if (amount >= 500) tier = 'tier-silver';

        donations.push({
          id: `sheet-${i}-${Date.now()}`,
          donorName: name,
          amount,
          timestamp: time,
          note,
          verified: true,
          tier
        });
      }
    }
  }

  return donations;
}
