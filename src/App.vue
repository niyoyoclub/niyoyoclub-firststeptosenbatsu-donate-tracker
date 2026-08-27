<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Header from './components/Header.vue';
import HeroProgress from './components/HeroProgress.vue';
import DonationLeaderboard from './components/DonationLeaderboard.vue';
import MilestonesTimeline from './components/MilestonesTimeline.vue';
import RewardCalculator from './components/RewardCalculator.vue';
import WishWall from './components/WishWall.vue';
import TransparencyBoard from './components/TransparencyBoard.vue';
import QuickDonateModal from './components/QuickDonateModal.vue';
import QuickJoinOpenChatModal from './components/QuickJoinOpenChatModal.vue';
import GoogleSheetsModal from './components/GoogleSheetsModal.vue';
import TopSupportersLeaderboard from './components/TopSupportersLeaderboard.vue';
import TanabataPage from './components/TanabataPage.vue';

import { CampaignData, Donation, Milestone, RewardTier, WishMessage, ExpenseCategory } from './types';
import {
  INITIAL_CAMPAIGN,
  INITIAL_DONATIONS,
  INITIAL_MILESTONES,
  INITIAL_REWARD_TIERS,
  INITIAL_WISHES,
  INITIAL_EXPENSES
} from './data/campaignData';
import {
  getCampaign,
  saveCampaign,
  getDonations,
  saveDonations,
  getWishes,
  saveWishes,
  getTanabataWishes,
  saveTanabataWishes
} from './utils/storage';
import { ArrowUp } from 'lucide-vue-next';

const campaign = ref<CampaignData>(getCampaign());
const donations = ref<Donation[]>(getDonations());
const wishes = ref<WishMessage[]>(getWishes());
const tanabataWishes = ref<TanabataWish[]>(getTanabataWishes());
const milestones = ref<Milestone[]>(INITIAL_MILESTONES);
const rewardTiers = ref<RewardTier[]>(INITIAL_REWARD_TIERS);
const expenses = ref<ExpenseCategory[]>(INITIAL_EXPENSES);

const activeTab = ref<'campaign' | 'tanabata'>('campaign');
const isDonateOpen = ref(false);
const isSheetOpen = ref(false);
const showScrollTop = ref(false);
const isOpenChatOpen = ref(false);

const totalAmount = computed(() =>
  donations.value.reduce((sum, item) => sum + item.amount, 0)
);

const totalDonors = computed(() =>
  new Set(donations.value.map((d) => d.donorName)).size
);

watch(campaign, (newVal) => saveCampaign(newVal), { deep: true });
watch(donations, (newVal) => saveDonations(newVal), { deep: true });
watch(wishes, (newVal) => saveWishes(newVal), { deep: true });
watch(tanabataWishes, (newVal) => saveTanabataWishes(newVal), { deep: true });

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 400;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleAddDonation = (newDonation: Donation) => {
  // ส่งข้อมูลการ donate ลง google sheet
  donations.value.unshift(newDonation);
};

const handleAddWish = (newWish: WishMessage) => {
  wishes.value.unshift(newWish);
};

const handleLikeWish = (id: string) => {
  const target = wishes.value.find((w) => w.id === id);
  if (target) {
    target.likes += 1;
  }
};

const handleAddTanabataWish = (newWish: TanabataWish) => {
  tanabataWishes.value.unshift(newWish);
};

const handleBlessTanabataWish = (id: string) => {
  const target = tanabataWishes.value.find((w) => w.id === id);
  if (target) {
    target.blessings += 1;
  }
};

const handleImportSheetDonations = (importedDonations: Donation[], sheetUrl: string) => {
  donations.value = importedDonations;
  campaign.value.sheetCsvUrl = sheetUrl;
};

const handleResetData = () => {
  if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
    localStorage.clear();
    campaign.value = INITIAL_CAMPAIGN;
    donations.value = INITIAL_DONATIONS;
    wishes.value = INITIAL_WISHES;
    tanabataWishes.value = INITIAL_TANABATA_WISHES;
  }
};

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const googleSheetRef = ref(null);
const lastGoogleSheetSync = ref(new Date());

const refreshGoogleSheet = () => {
  if (googleSheetRef.value) {
    googleSheetRef.value.refresh();
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF8FC] text-slate-800 flex flex-col font-sans selection:bg-pink-300 selection:text-pink-900">
    <!-- Header -->
    <Header
      :campaign="campaign"
      :activeTab="activeTab"
      :tanabataWishCount="tanabataWishes.length"
      @changeTab="(tab) => activeTab = tab"
      @openDonate="isDonateOpen = true"
      @openChatOpen="isOpenChatOpen = true"
      @openSheetModal="isSheetOpen = true"
      @resetData="handleResetData"
    />

    <!-- Main Container -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-8 sm:space-y-10">
      <!-- Tanabata Festival Page View -->
      <TanabataPage
        v-if="activeTab === 'tanabata'"
        :campaign="campaign"
        :wishes="tanabataWishes"
        @addWish="handleAddTanabataWish"
        @blessWish="handleBlessTanabataWish"
        @navigateToDonation="activeTab = 'campaign'"
      />

      <!-- Main Campain Tracker Page View -->
      <div v-else class="space-y-8 sm:space-y-10">
        <!-- Hero Banner & Goal Tracker -->
        <HeroProgress
          :campaign="campaign"
          :milestones="milestones"
          :totalAmount="totalAmount"
          :totalDonors="totalDonors"
          @openDonate="isDonateOpen = true"
          @openChatOpen="isOpenChatOpen = true"
          @scrollToCalculator="scrollToSection('reward-calculator')"
          @scrollToWish="scrollToSection('wish-wall')"
        />

        <!-- Milestones Timeline -->
        <MilestonesTimeline
          :milestones="milestones"
          :currentTotal="totalAmount"
        />

        <!-- Top Supporters Leaderboard -->
        <TopSupportersLeaderboard
          :donations="donations"
          :totalAmount="totalAmount"
        />

        <!-- Leaderboard & Recent Donations -->
        <DonationLeaderboard 
          :donations="donations"
          :campaign="campaign"
          @refresh="refreshGoogleSheet" 
          :lastGoogleSheetSync="lastGoogleSheetSync"
        />

        <!-- Reward & Perk Calculator -->
        <!--
        <RewardCalculator
          :rewardTiers="rewardTiers"
          @openDonateWithAmount="(amt) => { isDonateOpen = true; }"
        />
        -->

        <!-- Wish & Message Wall -->
        <!--
        <WishWall
          :wishes="wishes"
          @addWish="handleAddWish"
          @likeWish="handleLikeWish"
        />
        -->

        <!-- Financial Transparency -->
        <TransparencyBoard
          :expenses="expenses"
          :totalAmount="totalAmount"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-pink-100 py-8 mt-12 text-center text-xs text-slate-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-pink-100 text-pink-500 flex items-center justify-center font-bold">
            🌸
          </div>
          <span class="font-bold text-slate-700 font-heading">
            Niya First Step To Senbatsu Project 2026
          </span>
        </div>

        <p class="text-slate-400">
          จัดทำโดยทีมงานแฟนคลับเพื่อส่งเสริมสนับสนุนนีญ่า | Clean & Minimal Design
        </p>
        
        <div class="flex items-center gap-3">
          <button
            @click="activeTab = 'campaign'"
            class="text-xs hover:text-pink-600 font-medium"
            :class="activeTab === 'campaign' ? 'text-pink-600 font-bold' : 'text-slate-500'"
          >
            หน้าโดเนท
          </button>
          <span>•</span>
          <button
            @click="activeTab = 'tanabata'"
            class="text-xs hover:text-purple-600 font-medium"
            :class="activeTab === 'tanabata' ? 'text-purple-600 font-bold' : 'text-slate-500'"
          >
            🎋 ลานอธิษฐานทานาบาตะ
          </button>
        </div>

        <button
          @click="handleResetData"
          class="text-[11px] text-slate-900 hover:text-slate-600 underline cursor-pointer bg-red-200"
        >
          รีเซ็ตข้อมูล
        </button>
      </div>
    </footer>

    <!-- Quick Donate Modal -->
    <QuickDonateModal
      :isOpen="isDonateOpen"
      :campaign="campaign"
      @close="isDonateOpen = false"
      @addDonation="handleAddDonation"
    />

    <!-- Quick Join Open Modal -->
    <QuickJoinOpenChatModal
      :isOpen="isOpenChatOpen"
      :campaign="campaign"
      @close="isOpenChatOpen = false"
    />

    <!-- Google Sheets Modal -->
    <GoogleSheetsModal
      :isOpen="isSheetOpen"
      :campaign="campaign"
      :currentSheetUrl="campaign.sheetCsvUrl"      
      @close="isSheetOpen = false"
      @importDonations="handleImportSheetDonations"
      @callbackLastSync="lastGoogleSheetSync = new Date()";
      ref="googleSheetRef"
    />

    <!-- Scroll To Top Button -->
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 p-3 rounded-2xl bg-white border border-pink-200 shadow-lg text-pink-500 hover:bg-pink-50 transition-all z-30 cursor-pointer"
      title="กลับสู่ด้านบน"
    >
      <ArrowUp class="w-5 h-5" />
    </button>
  </div>
</template>
