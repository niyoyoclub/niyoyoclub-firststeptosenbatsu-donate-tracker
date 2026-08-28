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
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- Left Brand / Title -->
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 p-0.5 shadow-sm flex items-center justify-center text-white">
          <div class="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-pink-500">
            <Heart class="w-6 h-6 fill-pink-500/20 text-pink-500" />
          </div>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg sm:text-xl font-bold text-slate-800 font-heading tracking-tight">
              {{ campaign.candidateName }} GE6 Project
            </h1>
            <span class="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600 border border-pink-200/60">
              <Sparkles class="w-3 h-3" /> Election 2026
            </span>
          </div>
          <p class="text-xs text-slate-500 line-clamp-1">{{ campaign.subtitle }}</p>
        </div>
      </div>

      <!-- Center Navigation Tabs (Switch between Main Campaign and Tanabata Festival) -->
      <div class="flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/70 shadow-inner w-full sm:w-auto justify-center">
        <button
          @click="emit('changeTab', 'campaign')"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          :class="[
            activeTab === 'campaign'
              ? 'bg-white text-pink-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <Heart class="w-3.5 h-3.5" :class="activeTab === 'campaign' ? 'fill-pink-500 text-pink-500' : ''" />
          <span>หน้าโดเนท</span>
        </button>

        <button
          @click="emit('changeTab', 'tanabata')"
          class="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative"
          :class="[
            activeTab === 'tanabata'
              ? 'bg-gradient-to-r from-indigo-900 to-purple-900 text-pink-300 shadow-sm border border-purple-700/50'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <span class="text-sm">🎋</span>
          <span>ทานาบาตะ</span>
          <span v-if="tanabataWishCount" class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
        </button>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
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
          class="p-2.5 rounded-xl text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-colors border border-slate-200/70 hover:border-pink-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          title="แชร์หน้านี้"
        >
          <Share2 class="w-4 h-4 text-pink-500" />
          <span class="hidden md:inline">{{ copied ? 'คัดลอกลิงก์แล้ว!' : 'แชร์' }}</span>
        </button>

        <button
          @click="emit('openChatOpen')"
          class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-rose-400 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart class="w-4 h-4 fill-white" />
          <span>เข้าร่วมชุมชน</span>
        </button>

        <button
          @click="emit('openDonate')"
          class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium text-xs sm:text-sm shadow-sm hover:shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart class="w-4 h-4 fill-white" />
          <span>ร่วมโดเนท</span>
        </button>
      </div>
    </div>
  </header>
</template>
