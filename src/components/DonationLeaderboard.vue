<script setup lang="ts">
import { ref, computed } from 'vue';
import { Award, Search, Sparkles, Trophy, Heart, Clock, RefreshCw } from 'lucide-vue-next';
import { Donation, CampaignData } from '../types';

const props = defineProps<{
  campaign: CampaignData;
  donations: Donation[];
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const activeTab = ref<'recent' | 'top' | 'big'>('top');
const searchQuery = ref('');

const sortedDonations = computed(() => {
  const list = [...props.donations];
  if (activeTab.value === 'top' || activeTab.value === 'big') {
    return list.sort((a, b) => b.amount - a.amount);
  }
  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
});

const filteredDonations = computed(() => {
  return sortedDonations.value.filter((don) => {
    if (activeTab.value === 'big' && don.amount < 2000) return false;
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      don.donorName.toLowerCase().includes(q) ||
      (don.note && don.note.toLowerCase().includes(q))
    );
  });
});

const isSyncing = ref(false);

const triggerManualSync = () => {
  isSyncing.value = true;
  emit('refresh');
  setTimeout(() => {
    isSyncing.value = false;
  }, 3000);  
}
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
            <Trophy class="w-5 h-5" />
          </span>
          <h3 class="text-xl font-bold text-slate-900 font-heading">
            ตารางผู้ร่วมโดเนท & ยอดสนับสนุน
          </h3>
        </div>
        <p class="text-xs text-slate-500 pl-9">
          อัปเดตเรียลไทม์ ทุกๆ {{ props.campaign.refreshEveryMinutes }} นาที ตรวจสอบความถูกต้องและโปร่งใส
        </p>
      </div>

      <!-- Search & Tabs -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้โดเนท / ข้อความ..."
            v-model="searchQuery"
            class="pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-300 text-xs w-full sm:w-56 bg-slate-50/50"
          />
        </div>

        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button
            @click="activeTab = 'top'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'top'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            🔥 อันดับสูงสุด
          </button>
          <button
            @click="activeTab = 'recent'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'recent'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            🕒 ล่าสุด
          </button>
          <button
            @click="activeTab = 'big'"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'big'
                ? 'bg-white text-pink-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            💎 Big Supporters
          </button>
          <button 
            @click="triggerManualSync" 
            :disabled="isSyncing"
            class="py-1 px-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg border border-[#1e293b] shadow-[1px_1px_0px_#1e293b] flex items-center gap-1 active:translate-y-0.5"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isSyncing }" />
            <span>{{ isSyncing ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูลทันที' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Donors List -->
    <div class="space-y-3">
      <div v-if="filteredDonations.length === 0" class="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <p class="text-sm text-slate-500">ไม่พบรายการโดเนทที่ค้นหา</p>
      </div>

      <div
        v-else
        v-for="(item, idx) in filteredDonations"
        :key="item.id"
        class="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/60 hover:bg-pink-50/40 border border-slate-100 hover:border-pink-200/80 transition-all"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 font-bold text-xs text-slate-600 shadow-2xs">
            <template v-if="activeTab === 'top' || activeTab === 'big'">
              {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}` }}
            </template>
            <template v-else>
              #{{ idx + 1 }}
            </template>
          </div>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-slate-800 text-sm font-heading">
                {{ item.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม 🌸' : item.donorName }}
              </span>

              <!-- Tier Badge -->
              <span v-if="item.amount >= 10000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <Sparkles class="w-3 h-3 text-pink-500" /> Diamond Supporters
              </span>
              <span v-else-if="item.amount >= 2000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                <Trophy class="w-3 h-3 text-purple-500" /> Gold Fan
              </span>
              <span v-else-if="item.amount >= 500" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Award class="w-3 h-3 text-blue-500" /> Silver Fan
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Heart class="w-3 h-3 text-pink-400" /> Supporter
              </span>
            </div>

            <p v-if="item.note" class="text-xs text-slate-600 mt-1 italic bg-white/70 px-3 py-1 rounded-lg border border-slate-100 inline-block">
              "{{ item.note }}"
            </p>

            <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock class="w-3 h-3 text-slate-400" />
              <span>{{ item.timestamp }}</span>
            </div>
          </div>
        </div>

        <div class="text-right sm:self-center shrink-0">
          <span class="text-base sm:text-lg font-bold text-pink-600 font-heading">
            +฿{{ item.amount.toLocaleString() }}
          </span>
          <span class="text-xs text-slate-400 block font-normal">
            ({{ Math.floor(item.amount / props.campaign.votePrice) }} Tokens)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
