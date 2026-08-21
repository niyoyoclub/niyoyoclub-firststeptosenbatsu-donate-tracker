import { CampaignData, Donation, WishMessage, Milestone } from '../types';
import { INITIAL_CAMPAIGN, INITIAL_DONATIONS, INITIAL_WISHES, INITIAL_MILESTONES } from '../data/campaignData';

const CAMPAIGN_KEY = 'niya_campaign_data_v1.1';
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
    //console.log('line=', lines[i]);
    const row = lines[i].split(',');
    //console.log('row=', row);
    if (row && row.length >= 2) {
      const time = row[1] ? row[1].trim() : new Date().toISOString().split('T')[0];
      const name = row[2] ? row[2].trim() : 'Donation';
      const rawAmount = row[3] ? row[3].replace(/[^0-9.]/g, '') : '0';      
      const amount = parseFloat(rawAmount) || 0;
      const paymentChannel = row[4] ? row[4].trim() : '';
      const slipRef = row[5] ? row[5].trim() : '';      
      const note = row[6] ? row[6].trim() : '';
      const rawVerified = row[7] ? row[7].trim() : '' ;
      const verified = rawVerified.toLowerCase() === 'true';
      const isAnonymous = row[9] ? row[9].trim().toLowerCase() === 'true' : false;

      if (amount > 0) {
        let tier: 'tier-normal' | 'tier-silver' | 'tier-gold' | 'tier-diamond' = 'tier-normal';
        if (amount >= 5000) tier = 'tier-diamond';
        else if (amount >= 2000) tier = 'tier-gold';
        else if (amount >= 500) tier = 'tier-silver';

        donations.push({
          id: `sheet-${i}-${Date.now()}`,
          donorName: name,
          amount,
          timestamp: time,
          note,
          verified,
          tier,
          isAnonymous,
          paymentChannel,
          slipRef
        });
      }
    }
  }

  return donations;
}
