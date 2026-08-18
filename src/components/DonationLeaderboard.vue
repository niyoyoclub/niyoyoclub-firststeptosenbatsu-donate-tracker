<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { 
  Award, Search, Sparkles, Trophy, Heart, Clock, 
  RefreshCw, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight 
} from 'lucide-vue-next';
import { Donation, CampaignData } from '../types';

const props = defineProps<{
  campaign: CampaignData;
  donations: Donation[];
  lastGoogleSheetSync?: Date;
}>();

const emit = defineEmits<{
  (e: 'refresh'): void;
}>();

const activeTab = ref<'recent' | 'top' | 'big'>('recent');
const searchQuery = ref('');
const isSyncing = ref(false);
let syncTimer: ReturnType<typeof setTimeout> | null = null;

// --- Pagination State ---
const currentPage = ref(1);
const itemsPerPage = 5;

// Helper ป้องกัน Date parse พัง
const parseTimestamp = (ts: string | number | Date): number => {
  const parsed = new Date(ts).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

const sortedDonations = computed(() => {
  const list = [...props.donations];
  if (activeTab.value === 'top' || activeTab.value === 'big') {
    return list.sort((a, b) => b.amount - a.amount);
  }
  return list.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
});

const filteredDonations = computed(() => {
  return sortedDonations.value.filter((don) => {
    if (activeTab.value === 'big' && don.amount < 500) return false;
    if (!searchQuery.value.trim()) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      don.donorName.toLowerCase().includes(q) ||
      (don.note && don.note.toLowerCase().includes(q))
    );
  });
});

// --- Pagination Computed ---
const totalPages = computed(() => {
  return Math.ceil(filteredDonations.value.length / itemsPerPage) || 1;
});

const paginatedDonations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredDonations.value.slice(start, start + itemsPerPage);
});

// รีเซ็ตหน้าเป็นหน้า 1 เมื่อค้นหาหรือสลับแท็บ
watch([searchQuery, activeTab], () => {
  currentPage.value = 1;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const triggerManualSync = () => {
  if (isSyncing.value) return;
  isSyncing.value = true;
  emit('refresh');
  
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    isSyncing.value = false;
  }, 2000);
};

onUnmounted(() => {
  if (syncTimer) clearTimeout(syncTimer);
});
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
          อัปเดตเรียลไทม์ ทุกๆ {{ props.campaign.refreshEveryMinutes }} นาที
          ( ดึงข้อมูลล่าสุดเมื่อ <span class="font-semibold text-slate-700">{{ lastGoogleSheetSync ? lastGoogleSheetSync.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }) : 'กำลังโหลด...' }}</span> )
        </p>
      </div>

      <!-- Search & Tabs & Sync -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อผู้โดเนท / ข้อความ..."
            v-model="searchQuery"
            class="pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-300 text-xs w-full sm:w-48 md:w-56 bg-slate-50/50"
          />
        </div>

        <div class="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            @click="activeTab = 'recent'"
            class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'recent'
                ? 'bg-white text-pink-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            🕒 ล่าสุด
          </button>
          <button
            @click="activeTab = 'top'"
            class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'top'
                ? 'bg-white text-pink-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            🔥 ยอดสูงสุด
          </button>
          <button
            @click="activeTab = 'big'"
            class="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            :class="[
              activeTab === 'big'
                ? 'bg-white text-pink-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            💎 Big Fan
          </button>
          
          <button 
            @click="triggerManualSync" 
            :disabled="isSyncing"
            class="py-1.5 px-3 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
          >
            <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': isSyncing }" />
            <span>{{ isSyncing ? 'กำลังดึง...' : 'ดึงข้อมูล' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Donors List -->
    <div class="space-y-2.5">
      <div v-if="filteredDonations.length === 0" class="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p class="text-sm text-slate-400">ไม่พบรายการโดเนทที่ค้นหา</p>
      </div>

      <div
        v-else
        v-for="(item, idx) in paginatedDonations"
        :key="item.id"
        class="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-50/60 hover:bg-pink-50/30 border border-slate-100 hover:border-pink-200/60 transition-all"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 font-bold text-xs text-slate-700 shadow-2xs">
            <!-- คำนวณ Index จริงตามหน้าปัจจุบัน -->
            <template v-if="(activeTab === 'top' || activeTab === 'big') && (currentPage === 1 && idx < 3)">
              {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉' }}
            </template>
            <template v-else>
              #{{ (currentPage - 1) * itemsPerPage + idx + 1 }}
            </template>
          </div>

          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-slate-800 text-sm font-heading">
                {{ item.isAnonymous ? 'ผู้ไม่ประสงค์ออกนาม 🌸' : item.donorName }}
              </span>

              <!-- Tier Badges -->
              <span v-if="item.amount >= 10000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 border border-pink-200">
                <Sparkles class="w-3 h-3 text-pink-500" /> Diamond Supporters
              </span>
              <span v-else-if="item.amount >= 2000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                <Trophy class="w-3 h-3 text-purple-500" /> Gold Fan
              </span>
              <span v-else-if="item.amount >= 500" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Award class="w-3 h-3 text-blue-500" /> Silver Fan
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Heart class="w-3 h-3 text-pink-400" /> Supporter
              </span>

              <!-- Verification Badges -->
              <span v-if="item.verified" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 class="w-3 h-3 text-emerald-500" /> ยืนยันแล้ว
              </span>
              <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <AlertCircle class="w-3 h-3 text-amber-500" /> รอตรวจสอบ
              </span>
            </div>

            <!-- Note Box -->
            <p v-if="item.note" class="text-xs text-slate-600 mt-1 italic bg-white/80 px-2.5 py-0.5 rounded-lg border border-slate-100 inline-block">
              "{{ item.note }}"
            </p>

            <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <Clock class="w-3 h-3 text-slate-400" />
              <span>{{ item.timestamp }}</span>
            </div>
          </div>
        </div>

        <div class="text-right sm:self-center shrink-0">
          <span class="text-base sm:text-lg font-bold text-pink-600 font-mono block">
            +฿{{ item.amount.toLocaleString() }}
          </span>
          <span class="text-[11px] text-slate-400 block font-normal">
            ({{ Math.floor(item.amount / props.campaign.votePrice) }} Tokens)
          </span>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredDonations.length > itemsPerPage" class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-4 border-t border-slate-100">
      <div class="text-xs text-slate-500">
        แสดง <span class="font-semibold text-slate-700">{{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredDonations.length) }}</span> จากทั้งหมด <span class="font-semibold text-slate-700">{{ filteredDonations.length }}</span> รายการ
      </div>

      <div class="flex items-center gap-1.5">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
          title="หน้าก่อนหน้า"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <!-- เลขหน้า -->
        <div class="flex items-center gap-1">
          <template v-for="page in totalPages" :key="page">
            <!-- แสดงปุ่มเฉพาะหน้าใกล้เคียงเพื่อไม่ให้ล้นกรณีมีหลายสิบหน้า -->
            <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="goToPage(page)"
              class="w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center"
              :class="[
                currentPage === page
                  ? 'bg-pink-500 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="text-slate-400 text-xs px-1"
            >
              ...
            </span>
          </template>
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all cursor-pointer"
          title="หน้าถัดไป"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>