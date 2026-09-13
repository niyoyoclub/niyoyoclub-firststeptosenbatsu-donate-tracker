<script setup lang="ts">
import { ref, computed, onUnmounted, onMounted, watch } from 'vue';
import { Sparkles, Heart, Plus, Search, Filter, Wind, Bell, Clock, User, Compass, Gem, Crown, Award, RefreshCcw } from 'lucide-vue-next';
import { TanabataWish, CampaignData, TanzakuColor } from '../types';
import { getTierByBranchIndex, TANABATA_TIERS } from '../utils/tanabataTiers';
import TanabataBambooTree from './TanabataBambooTree.vue';
import TanabataModal from './TanabataModal.vue';
import TanabataWriteModal from './TanabataWriteModal.vue';

const props = defineProps<{
  campaign: CampaignData;
  wishes: TanabataWish[];
}>();

const emit = defineEmits<{
  (e: 'addWish', wish: TanabataWish): void;
  (e: 'blessWish', id: string): void;
  (e: 'navigateToDonation'): void;
  (e: 'refresh'): void;
}>();

const selectedWish = ref<TanabataWish | null>(null);
const isInspectOpen = ref(false);
const isWriteOpen = ref(false);

const searchQuery = ref('');
const selectedCategory = ref('All');
const selectedTierFilter = ref<number | 'All'>('All');

// ตัวแปรสำหรับ Auto Fetch
const isAutoFetchEnabled = ref(true);
let autoFetchInterval: number | null = null;
const isLoading = ref(false);
const openInspect = (wish: TanabataWish) => {
  selectedWish.value = wish;
  isInspectOpen.value = true;
};

const handleAddWish = (newWish: TanabataWish) => {
  emit('addWish', newWish);
};

const handleBless = (id: string) => {
  emit('blessWish', id);
  if (selectedWish.value && selectedWish.value.id === id) {
    selectedWish.value.blessings += 1;
  }
};

const filteredWishes = computed(() => {
  return props.wishes.filter((w) => {
    if (selectedCategory.value !== 'All' && w.category !== selectedCategory.value) return false;
    if (selectedTierFilter.value !== 'All' && w.branchIndex !== selectedTierFilter.value) return false;
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      return w.author.toLowerCase().includes(q) || w.wish.toLowerCase().includes(q);
    }
    return true;
  });
});

const colorMeanings = [
  { color: 'pink', name: 'สีชมพู (Sakura)', meaning: 'ความรัก ความผูกพัน และรอยยิ้มสดใส', bg: 'bg-pink-100 border-pink-300 text-pink-700' },
  { color: 'blue', name: 'สีฟ้า (Amanogawa)', meaning: 'ความฝันอันกว้างใหญ่ และสติปัญญา', bg: 'bg-sky-100 border-sky-300 text-sky-700' },
  { color: 'yellow', name: 'สีเหลือง (Starlight)', meaning: 'ความสำเร็จ โชคลาภ และความมั่งคั่ง', bg: 'bg-amber-100 border-amber-300 text-amber-800' },
  { color: 'green', name: 'สีเขียว (Bamboo)', meaning: 'สุขภาพร่างกายแข็งแรง และการเติบโต', bg: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { color: 'purple', name: 'สีม่วง (Twilight)', meaning: 'ความสง่างาม จิตใจแน่วแน่ และความหวัง', bg: 'bg-purple-100 border-purple-300 text-purple-800' }
];

const handleRefresh = () => {
  //console.log('handleRefresh() called');

  try {
    isLoading.value = true;
    emit('refresh');
  } catch (err: any) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }

  //console.log('handleRefresh() end');
};

// ฟังก์ชันสำหรับจัดการ Interval
const startAutoFetch = () => {
  stopAutoFetch();
  if (isAutoFetchEnabled.value) {
    // 60,000 ms = 1 นาที
    autoFetchInterval = window.setInterval(() => {
      handleRefresh();
    },  props.campaign.refreshEveryMinutes * 60 * 1000);
  }
};

const stopAutoFetch = () => {
  if (autoFetchInterval !== null) {
    clearInterval(autoFetchInterval);
    autoFetchInterval = null;
  }
};

// เคลียร์ Interval เมื่อ Component ถูกลบ
onUnmounted(() => {
  stopAutoFetch();
});

// เริ่มทำงาน Interval เมื่อเริ่มเปิด
onMounted(() => {
  handleRefresh();
  startAutoFetch();
});

// สลับการทำงานถ้าผู้ใช้ปิด/เปิด Auto Fetch
watch(isAutoFetchEnabled, (newVal) => {
  if (newVal) {
    startAutoFetch();
  } else {
    stopAutoFetch();
  }
});
</script>

<template>
  <div class="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 w-full max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 lg:px-8 overflow-x-clip">
    <!-- Top Hero Banner for Tanabata Festival -->
    <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-3.5 sm:p-6 md:p-8 lg:p-10 shadow-xl border border-indigo-800/40 min-w-0">
      <!-- Decorative background stars and aura -->
      <div class="absolute -right-16 -top-16 w-36 h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 w-36 h-36 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-3xl min-w-0">
        <div class="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] sm:text-xs font-semibold mb-2.5 sm:mb-4 backdrop-blur-md">
          <Sparkles class="w-3 h-3 sm:w-4 sm:h-4 text-pink-300 shrink-0" />
          <span class="truncate">七夕祭り • Tanabata Festival 2026</span>
        </div>

        <h2 class="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-2 sm:mb-3 text-white leading-snug sm:leading-tight break-words [overflow-wrap:anywhere]">
          ลานอธิษฐานทานาบาตะเพื่อ {{ campaign.candidateName }} 🎋
        </h2>

        <p class="text-[11px] sm:text-xs md:text-sm text-slate-300 leading-relaxed mb-4 sm:mb-6 font-normal break-words">
          เทศกาลแห่งดวงดาวโอริฮิเมะและฮิโกโบชิ ร่วมผูกกระดาษทังซาขุ (Tanzaku) บนกิ่งไผ่
          ส่งแรงใจและความปรารถนาให้ลอยไปตามสายลม พานีญ่าก้าวสู่ Senbatsu อย่างงดงาม ✨
        </p>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <!--
          <button
            @click="isWriteOpen = true"
            class="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-pink-500/25 hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>เขียนกระดาษคำอธิษฐานใหม่</span>
          </button>
          -->

          <button
            @click="handleRefresh"
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-pink-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 touch-manipulation"
          >
            <RefreshCcw class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" :class="{ 'animate-spin': isLoading }" />
            <span>{{ isLoading ? 'กำลังดึงข้อมูล...' : 'ดึงข้อมูล' }}</span>
          </button>

          <button
            @click="emit('navigateToDonation')"
            class="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 touch-manipulation"
          >
            <Heart class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 fill-pink-400 shrink-0" />
            <span>กลับสู่หน้าโดเนท</span>
          </button>
        </div>
      </div>
    </div>

    <!-- The Interactive Bamboo Tree (ต้นไผ่และกระดาษคำอธิษฐาน 6 ระดับปลิวไหวตามลม) -->
    <div class="w-full min-w-0 overflow-hidden">
      <TanabataBambooTree
        :wishes="wishes"
        @selectWish="openInspect"
        @openWriteModal="isWriteOpen = true"
      />
    </div>

    <!-- 6 Levels Donor Tiers Infographic Card -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 lg:p-8 soft-pink-card border border-pink-100 shadow-sm min-w-0 overflow-hidden">
      <div class="flex items-center gap-2 mb-1">
        <span class="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-500 shrink-0">
          <Crown class="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        <h3 class="text-sm sm:text-lg md:text-xl font-bold text-slate-900 font-heading truncate">
          ระดับกิ่งไผ่และกระดาษคำอวยพร (6 Donor & Wish Tiers)
        </h3>
      </div>
      <p class="text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-5 pl-0 sm:pl-9 leading-relaxed break-words">
        ลำดับกิ่งไผ่จากยอดบนสุดลงสู่ล่างสุด ยิ่งโดเนทมาก กระดาษทังซาขุจะยิ่งวิจิตรงดงามและอยู่ระดับสูงขึ้น
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-3.5 min-w-0">
        <div
          v-for="tier in TANABATA_TIERS"
          :key="tier.index"
          class="p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border transition-all min-w-0"
          :class="[
            tier.index === 0 ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-amber-900/90 text-white border-amber-400/50 shadow-md' :
            tier.index === 1 ? 'bg-gradient-to-br from-amber-950 via-yellow-900 to-amber-900 text-amber-50 border-amber-400/40 shadow-sm' :
            tier.index === 2 ? 'bg-slate-900 text-slate-100 border-slate-400/30' :
            tier.index === 3 ? 'bg-rose-50 text-rose-950 border-rose-200' :
            tier.index === 4 ? 'bg-pink-50 text-pink-950 border-pink-200' :
            'bg-stone-50 text-stone-900 border-stone-200'
          ]"
        >
          <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-2 min-w-0">
            <div class="flex items-center gap-1 sm:gap-1.5 font-bold text-xs sm:text-sm truncate min-w-0">
              <span class="text-sm sm:text-base shrink-0">{{ tier.icon }}</span>
              <span class="truncate">กิ่ง {{ tier.index }}: {{ tier.name }}</span>
            </div>
            <span
              class="px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-bold border shrink-0 whitespace-nowrap"
              :class="tier.index <= 2 ? 'bg-white/20 border-white/30 text-white' : 'bg-white border-slate-200 text-slate-700'"
            >
              {{ tier.minDonation > 0 ? `${tier.minDonation.toLocaleString()} บาท` : 'ทั่วไป' }}
            </span>
          </div>
          <p class="text-[9.5px] sm:text-xs opacity-90 leading-snug break-words">{{ tier.description }}</p>
        </div>
      </div>
    </div>

    <!-- All Wishes Gallery / Search & Filter Section -->
    <div class="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 lg:p-8 soft-purple-card shadow-sm min-w-0 overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="p-1.5 sm:p-2 rounded-xl bg-pink-50 text-pink-500 shrink-0">
              <Heart class="w-4 h-4 sm:w-5 sm:h-5 fill-pink-500/20" />
            </span>
            <h3 class="text-sm sm:text-lg md:text-xl font-bold text-slate-900 font-heading truncate">
              รวมคำอธิษฐานบนต้นไผ่ทั้งหมด (All Tanzaku Wishes)
            </h3>
          </div>
          <p class="text-[10px] sm:text-xs text-slate-500 pl-0 sm:pl-9 leading-relaxed break-words">
            คลิกที่การ์ดเพื่อขยายดูกระดาษตามระดับผู้สนับสนุน ชื่อผู้เขียน คำอธิษฐาน และเวลาที่บันทึก
          </p>
        </div>

        <!-- Search and Filter Inputs -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto min-w-0">
          <div class="relative w-full sm:w-60 md:w-72 min-w-0">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาชื่อผู้เขียน / คำอธิษฐาน..."
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-300 text-xs bg-slate-50/50 transition-colors"
            />
          </div>

          <!--
          <button
            @click="isWriteOpen = true"
            class="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>เขียนคำอธิษฐาน</span>
          </button>
          -->
        </div>
      </div>

      <!-- Quick Tier Filter Chips -->
      <div class="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar touch-pan-x max-w-full">
        <span class="text-[9.5px] sm:text-xs font-semibold text-slate-500 shrink-0 mr-0.5 sm:mr-1">กรองระดับกิ่ง:</span>
        <button
          type="button"
          @click="selectedTierFilter = 'All'"
          class="px-2.5 sm:px-3 py-1 rounded-xl text-[9.5px] sm:text-xs font-semibold transition-all cursor-pointer shrink-0 border active:scale-95 touch-manipulation"
          :class="selectedTierFilter === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
        >
          ทั้งหมด ({{ wishes.length }})
        </button>

        <button
          v-for="tier in TANABATA_TIERS"
          :key="`filter-${tier.index}`"
          type="button"
          @click="selectedTierFilter = tier.index"
          class="px-2 sm:px-2.5 py-1 rounded-xl text-[9.5px] sm:text-xs font-medium transition-all cursor-pointer shrink-0 border flex items-center gap-1 active:scale-95 touch-manipulation"
          :class="selectedTierFilter === tier.index ? 'bg-pink-500 text-white border-pink-500 font-bold shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
        >
          <span>{{ tier.icon }}</span>
          <span>กิ่ง {{ tier.index }}: {{ tier.name }}</span>
        </button>
      </div>

      <!-- Wishes Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5 min-w-0">
        <div
          v-for="w in filteredWishes"
          :key="w.id"
          @click="openInspect(w)"
          class="p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden min-w-0 touch-manipulation active:scale-98"
          :class="[
            w.branchIndex === 0 ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white border-amber-400/60 shadow-md ring-1 ring-amber-400/30' :
            w.branchIndex === 1 ? 'bg-gradient-to-br from-amber-900/90 via-yellow-950 to-stone-900 text-amber-50 border-amber-400/40' :
            w.branchIndex === 2 ? 'bg-slate-900 text-slate-100 border-slate-400/30' :
            w.branchIndex === 3 ? 'bg-rose-50/70 border-rose-200 hover:border-rose-300' :
            w.branchIndex === 4 ? 'bg-pink-50/70 border-pink-200 hover:border-pink-300' :
            'bg-stone-50 border-stone-200 hover:border-stone-300'
          ]"
        >
          <div class="min-w-0">
            <!-- Top Tag & Time -->
            <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 pb-1.5 sm:pb-2 border-b min-w-0" :class="w.branchIndex <= 2 ? 'border-white/10' : 'border-slate-900/5'">
              <!-- Tier Badge -->
              <span
                class="px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-bold shadow-2xs flex items-center gap-1 border min-w-0 truncate max-w-[65%] sm:max-w-[70%]"
                :class="[
                  w.branchIndex === 0 ? 'bg-amber-400 text-indigo-950 border-amber-300 font-black' :
                  w.branchIndex === 1 ? 'bg-yellow-400 text-amber-950 border-yellow-300' :
                  w.branchIndex === 2 ? 'bg-slate-300 text-slate-900 border-slate-400' :
                  w.branchIndex === 3 ? 'bg-rose-100 text-rose-700 border-rose-200' :
                  w.branchIndex === 4 ? 'bg-pink-100 text-pink-700 border-pink-200' :
                  'bg-stone-200 text-stone-700 border-stone-300'
                ]"
              >
                <span class="shrink-0">{{ getTierByBranchIndex(w.branchIndex).icon }}</span>
                <span class="truncate">กิ่ง {{ w.branchIndex }}: {{ getTierByBranchIndex(w.branchIndex).name }}</span>
              </span>

              <div class="flex items-center gap-1 text-[8.5px] sm:text-[10px] font-medium shrink-0 whitespace-nowrap text-slate-400">
                <Clock class="w-2.5 sm:w-3 h-2.5 sm:h-3 shrink-0" />
                <span>{{ w.timestamp }}</span>
              </div>
            </div>

            <!-- Wish Text -->
            <p
              class="text-xs sm:text-sm leading-relaxed font-medium my-1.5 sm:my-2 line-clamp-3 sm:line-clamp-4 break-words [overflow-wrap:anywhere]"
              :class="w.branchIndex <= 2 ? 'text-slate-100' : 'text-slate-800'"
            >
              "{{ w.wish }}"
            </p>
          </div>

          <!-- Bottom: Author Name & Blessings (3 Core Requirements shown) -->
          <div class="mt-2.5 sm:mt-4 pt-2 sm:pt-2.5 border-t flex items-center justify-between gap-2 min-w-0" :class="w.branchIndex <= 2 ? 'border-white/10' : 'border-slate-900/5'">
            <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[8.5px] sm:text-[10px] font-bold shadow-2xs border shrink-0"
                :class="w.branchIndex <= 2 ? 'bg-white/20 text-white border-white/30' : 'bg-white text-slate-700 border-slate-200/60'"
              >
                {{ w.author.charAt(0) }}
              </div>
              <span
                class="text-xs font-bold font-heading truncate max-w-[85px] sm:max-w-[130px] md:max-w-[160px]"
                :class="w.branchIndex <= 2 ? 'text-white' : 'text-slate-800'"
              >
                {{ w.author }}
              </span>
            </div>

            <div class="flex items-center gap-1 text-xs font-semibold group-hover:scale-105 transition-transform text-pink-400 shrink-0">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-pink-500 text-pink-500 shrink-0" />
              <span>{{ w.blessings }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tanzaku Inspection Modal (คลิกกระดาษแล้วขยายคำอธิษฐานขึ้นมาแสดง) -->
    <TanabataModal
      :isOpen="isInspectOpen"
      :wish="selectedWish"
      @close="isInspectOpen = false"
      @bless="handleBless"
    />

    <!-- Write Wish Modal (ช่องกรอกข้อมูลคำอธิษฐาน) -->
    <TanabataWriteModal
      :isOpen="isWriteOpen"
      @close="isWriteOpen = false"
      @addWish="handleAddWish"
    />
  </div>
</template>