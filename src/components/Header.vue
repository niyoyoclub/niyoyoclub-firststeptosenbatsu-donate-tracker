<script setup lang="ts">
import { ref } from 'vue';
import { Heart, Sparkles, Table, Share2, Compass } from 'lucide-vue-next';
import { CampaignData } from '../types';

const props = defineProps<{
  campaign: CampaignData;
  activeTab: 'campaign' | 'tanabata';
  tanabataWishCount?: number;
}>();

const emit = defineEmits<{
  (e: 'openDonate'): void;
  (e: 'openSheetModal'): void;
  (e: 'resetData'): void;
  (e: 'openChatOpen'): void;
  (e: 'changeTab', tab: 'campaign' | 'tanabata'): void;
}>();

const copied = ref(false);

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: props.campaign.title,
      text: props.campaign.subtitle,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs transition-all">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 lg:gap-4">
      <!-- Left Brand / Title -->
      <div class="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 justify-between md:justify-start">
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div class="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 p-0.5 shadow-sm flex items-center justify-center text-white shrink-0">
            <div class="w-full h-full bg-white rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-pink-500">
              <Heart class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-pink-500/20 text-pink-500" />
            </div>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <h1 class="text-sm sm:text-base lg:text-xl font-bold text-slate-800 font-heading tracking-tight truncate">
                {{ campaign.candidateName }} GE6 Project
              </h1>
              <span class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-pink-50 text-pink-600 border border-pink-200/60 shrink-0">
                <Sparkles class="w-3 h-3" /> Election 2026
              </span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-500 truncate max-w-[220px] sm:max-w-xs md:max-w-sm">{{ campaign.subtitle }}</p>
          </div>
        </div>

        <!-- Share Button (Quick access on mobile screen) -->
        <button
          @click="handleShare"
          class="flex md:hidden p-2 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors border border-slate-200/70 text-xs shrink-0 active:scale-95"
          title="แชร์หน้านี้"
        >
          <Share2 class="w-4 h-4 text-pink-500" />
        </button>
      </div>

      <!-- Center Navigation Tabs (Switch between Main Campaign and Tanabata Festival) -->
      <div class="flex items-center p-1 rounded-xl sm:rounded-2xl bg-slate-100/80 border border-slate-200/70 shadow-inner w-full sm:w-auto justify-center shrink-0">
        <button
          @click="emit('changeTab', 'campaign')"
          class="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
          :class="[
            activeTab === 'campaign'
              ? 'bg-white text-pink-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <Heart class="w-3.5 h-3.5 shrink-0" :class="activeTab === 'campaign' ? 'fill-pink-500 text-pink-500' : ''" />
          <span>หน้าโดเนท</span>
        </button>

        <button
          @click="emit('changeTab', 'tanabata')"
          class="flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative whitespace-nowrap active:scale-95"
          :class="[
            activeTab === 'tanabata'
              ? 'bg-gradient-to-r from-indigo-900 to-purple-900 text-pink-300 shadow-xs border border-purple-700/50'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span class="text-xs sm:text-sm">🎋</span>
          <span>ทานาบาตะ</span>
          <span v-if="tanabataWishCount" class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-400 animate-pulse" />
        </button>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
        <!--
        <button
          @click="emit('openSheetModal')"
          class="p-2.5 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors border border-slate-200/70 hover:border-purple-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          title="เชื่อมต่อ Google Sheets"
        >
          <Table class="w-4 h-4 text-purple-500" />
          <span class="hidden md:inline">Google Sheet</span>
        </button>
        -->

        <button
          @click="handleShare"
          class="hidden md:flex p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors border border-slate-200/70 hover:border-pink-200 text-xs font-medium items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
          title="แชร์หน้านี้"
        >
          <Share2 class="w-4 h-4 text-pink-500" />
          <span class="hidden lg:inline">{{ copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์' }}</span>
        </button>

        <button
          @click="emit('openChatOpen')"
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Heart class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
          <span>เข้าร่วมชุมชน</span>
        </button>

        <button
          @click="emit('openDonate')"
          class="flex-1 sm:flex-initial px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
        >
          <Heart class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
          <span>ร่วมโดเนท</span>
        </button>
      </div>
    </div>
  </header>
</template>