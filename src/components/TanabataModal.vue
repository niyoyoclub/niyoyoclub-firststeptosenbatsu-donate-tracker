<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Sparkles, Heart, Clock, User, Share2, Check, Bell, Tag, Award, Crown, Gem } from 'lucide-vue-next';
import { TanabataWish } from '../types';
import { getTierByBranchIndex, getTreePaperStyle, TANABATA_TIERS } from '../utils/tanabataTiers';

const props = defineProps<{
  isOpen: boolean;
  wish: TanabataWish | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'bless', id: string): void;
}>();

const copied = ref(false);
const isBlessedJustNow = ref(false);

const tierInfo = computed(() => {
  if (!props.wish) return TANABATA_TIERS[5];
  return getTierByBranchIndex(props.wish.branchIndex);
});

const handleBless = () => {
  if (!props.wish) return;
  emit('bless', props.wish.id);
  isBlessedJustNow.value = true;
  setTimeout(() => {
    isBlessedJustNow.value = false;
  }, 1500);
};

const handleCopyWish = () => {
  if (!props.wish) return;
  const tierName = tierInfo.value.name;
  navigator.clipboard.writeText(`"${props.wish.wish}" — โดย ${props.wish.author} [${tierName} - Tanabata Wish for Niya 🎋]`);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <div
    v-if="isOpen && wish"
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md transition-all overflow-y-auto"
    @click.self="emit('close')"
  >
    <div
      class="rounded-2xl sm:rounded-3xl max-w-xs sm:max-w-sm md:max-w-md w-full max-h-[92dvh] overflow-y-auto p-3.5 sm:p-5 md:p-6 lg:p-8 shadow-2xl relative overflow-x-hidden transform transition-all border my-auto"
      :class="[
        wish.branchIndex === 0 ? 'bg-slate-950 border-amber-400/50 shadow-amber-500/20' :
        wish.branchIndex === 1 ? 'bg-amber-950/95 border-amber-400/50 shadow-amber-500/20 text-amber-50' :
        wish.branchIndex === 2 ? 'bg-slate-900 border-slate-400/40 shadow-sky-500/10' :
        wish.branchIndex === 3 ? 'bg-white border-pink-200' :
        wish.branchIndex === 4 ? 'bg-white border-rose-100' :
        'bg-stone-50 border-stone-200'
      ]"
    >
      <!-- Background Ambient Glows for higher tiers -->
      <div v-if="wish.branchIndex === 0" class="absolute inset-0 bg-radial from-amber-500/10 via-purple-500/5 to-transparent pointer-events-none" />
      <div v-if="wish.branchIndex === 1" class="absolute inset-0 bg-radial from-amber-400/10 via-yellow-600/5 to-transparent pointer-events-none" />

      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 md:top-5 md:right-5 p-1.5 sm:p-2 rounded-full transition-colors z-20 cursor-pointer active:scale-95 touch-manipulation"
        :class="wish.branchIndex <= 2 ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'"
        aria-label="Close"
      >
        <X class="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <!-- Tier Header Tag -->
      <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 pr-8 sm:pr-10 min-w-0">
        <!-- Tier Badge -->
        <span
          class="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border shadow-xs shrink-0"
          :class="[
            wish.branchIndex === 0 ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-white border-amber-300 animate-shimmer' :
            wish.branchIndex === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-50 border-amber-300' :
            wish.branchIndex === 2 ? 'bg-slate-700 text-slate-100 border-slate-500' :
            wish.branchIndex === 3 ? 'bg-rose-50 text-rose-600 border-rose-200' :
            wish.branchIndex === 4 ? 'bg-pink-50 text-pink-600 border-pink-200' :
            'bg-stone-100 text-stone-700 border-stone-200'
          ]"
        >
          <span>{{ tierInfo.icon }}</span>
          <span>กิ่งที่ {{ tierInfo.index }}: {{ tierInfo.name }}</span>
        </span>

        <span
          class="text-[10px] sm:text-xs font-medium truncate max-w-[170px] xs:max-w-none"
          :class="wish.branchIndex <= 2 ? 'text-slate-300' : 'text-slate-500'"
        >
          {{ wish.donationAmount ? `ยอดโดเนท ฿${wish.donationAmount.toLocaleString()}` : tierInfo.description }}
        </span>
      </div>

      <!-- Specific Enlarged Tanzaku Card Based on Tier -->

      <!-- TIER 0: DIAMOND SUPPORTER CARD -->
      <div
        v-if="wish.branchIndex === 0"
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-amber-300/80 bg-gradient-to-b from-indigo-50 via-pink-50 to-amber-50 shadow-2xl mb-3.5 sm:mb-5 diamond-glow text-indigo-950 overflow-hidden min-w-0"
      >
        <!-- Top String Hole & Golden Silk Cord Loop -->
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3.5 sm:w-4 md:w-5 h-5 sm:h-6 md:h-8 border-2 border-amber-400 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-md flex items-center justify-center">
            <div class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white shadow-xs" />
          </div>
        </div>

        <!-- Diamond Header Banner -->
        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-amber-300/40 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-indigo-900 truncate">
            <Gem class="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-indigo-800/80 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <!-- Main Wish Text -->
        <div class="my-2.5 sm:my-4 py-2 px-2.5 sm:px-3 rounded-xl bg-white/60 backdrop-blur-xs border border-amber-200/60 shadow-inner">
          <p class="text-xs sm:text-base md:text-lg font-bold leading-relaxed font-sans text-indigo-950 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <!-- Wisher Author Name -->
        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-amber-300/50 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div class="w-6 h-6 sm:w-8 md:w-9 sm:h-8 md:h-9 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 text-white shadow-md flex items-center justify-center text-[9px] sm:text-xs font-black shrink-0">
              🐱
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-amber-800 truncate">
                ผู้เขียนคำอธิษฐาน บอสแมวสายเปย์
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-black text-indigo-950 font-heading flex items-center gap-1 min-w-0">
                <span class="truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">{{ wish.author }}</span>
                <span class="text-[7px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 bg-amber-400 text-indigo-950 rounded font-bold shrink-0">VIP</span>
              </div>
            </div>
          </div>

          <!-- Blessings counter -->
          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-400/30 border border-amber-400 text-indigo-950 text-[9px] sm:text-xs font-black shadow-xs whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{{ wish.blessings }} พร Boss Meow</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TIER 1: GOLD SUPPORTER CARD -->
      <div
        v-else-if="wish.branchIndex === 1"
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-amber-400 bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-100 shadow-xl mb-3.5 sm:mb-5 text-amber-950 overflow-hidden min-w-0"
      >
        <!-- Top String Hole & Gold Cord Loop -->
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3 sm:w-3.5 md:w-4 h-5 sm:h-6 md:h-7 border-2 border-amber-500 rounded-full bg-amber-400 shadow-sm" />
        </div>

        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-amber-300/60 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-amber-900 truncate">
            <Crown class="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-amber-800/80 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <!-- Main Wish Text -->
        <div class="my-2.5 sm:my-4 py-2 px-2.5 sm:px-3 rounded-xl bg-white/70 border border-amber-200 shadow-xs">
          <p class="text-xs sm:text-base md:text-lg font-semibold leading-relaxed font-sans text-amber-950 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <!-- Wisher Author Name -->
        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-amber-300/60 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div class="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full bg-amber-500 text-white shadow-xs flex items-center justify-center text-[9px] sm:text-xs font-bold shrink-0">
              💖
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-amber-800 truncate">
                ผู้เขียนคำอธิษฐาน หัวใจเต็มร้อย
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-bold text-amber-950 font-heading truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <!-- Blessings counter -->
          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-amber-200 text-amber-900 text-[9px] sm:text-xs font-bold shadow-2xs border border-amber-300 whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{{ wish.blessings }} พรหัวใจ</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TIER 2: SILVER SUPPORTER CARD -->
      <div
        v-else-if="wish.branchIndex === 2"
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-slate-300 bg-gradient-to-b from-slate-50 via-sky-50 to-slate-100 shadow-lg mb-3.5 sm:mb-5 text-slate-900 overflow-hidden min-w-0"
      >
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3 sm:w-3.5 md:w-4 h-5 sm:h-6 md:h-7 border-2 border-slate-400 rounded-full bg-slate-300 shadow-sm" />
        </div>

        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-200 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-slate-700 truncate">
            <Award class="w-3 h-3 sm:w-4 sm:h-4 text-slate-600 shrink-0" />
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-slate-600 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <div class="my-2.5 sm:my-4 py-2 px-2.5 sm:px-3 rounded-xl bg-white/80 border border-slate-200">
          <p class="text-xs sm:text-base md:text-lg font-medium leading-relaxed font-sans text-slate-900 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div class="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full bg-slate-600 text-white shadow-xs flex items-center justify-center text-[9px] sm:text-xs font-bold shrink-0">
              🌸
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-500 truncate">
                ผู้เขียนคำอธิษฐาน ซากุระแรกแย้ม
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 font-heading truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-slate-200 text-slate-800 text-[9px] sm:text-xs font-bold shadow-2xs whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{{ wish.blessings }} พรซากุระ</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TIER 3: FAN > 100฿ SAKURA CARD -->
      <div
        v-else-if="wish.branchIndex === 3"
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-rose-300 bg-gradient-to-b from-rose-50 via-pink-50 to-rose-100 shadow-md mb-3.5 sm:mb-5 text-rose-950 overflow-hidden min-w-0"
      >
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3 sm:w-3.5 md:w-4 h-5 sm:h-6 md:h-7 border-2 border-rose-400 rounded-full bg-rose-300 shadow-sm" />
        </div>

        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-rose-200 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-rose-800 truncate">
            <span class="shrink-0">🌟</span>
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-rose-700/80 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <div class="my-2.5 sm:my-3">
          <p class="text-xs sm:text-base md:text-lg font-medium leading-relaxed font-sans text-rose-950 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-rose-200 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div class="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full bg-rose-500 text-white shadow-2xs flex items-center justify-center text-[9px] sm:text-xs font-bold shrink-0">
              🌟
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-semibold tracking-wider text-rose-700 truncate">
                ผู้เขียนคำอธิษฐาน ประกายดาว
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-bold text-rose-950 font-heading truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/80 text-rose-600 text-[9px] sm:text-xs font-bold shadow-2xs whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 shrink-0" />
              <span>{{ wish.blessings }} พรประกายดาว</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TIER 4: FAN > 1฿ HEART CARD -->
      <div
        v-else-if="wish.branchIndex === 4"
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-pink-200 bg-gradient-to-b from-pink-50 via-purple-50 to-sky-50 shadow-sm mb-3.5 sm:mb-5 text-slate-900 overflow-hidden min-w-0"
      >
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3 sm:w-3.5 md:w-4 h-5 sm:h-6 md:h-7 border-2 border-pink-400/80 rounded-full bg-pink-300/40 shadow-xs" />
        </div>

        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-200 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-pink-800 truncate">
            <Tag class="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 shrink-0" />
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <div class="my-2.5 sm:my-3">
          <p class="text-xs sm:text-base md:text-lg font-medium leading-relaxed font-sans text-slate-800 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div class="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full bg-pink-400 text-white shadow-2xs flex items-center justify-center text-[9px] sm:text-xs font-bold shrink-0">
              ✨
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-semibold tracking-wider text-slate-500 truncate">
                ผู้เขียนคำอธิษฐาน ละอองดารา
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 font-heading truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white text-pink-600 text-[9px] sm:text-xs font-bold shadow-2xs whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-pink-500 text-pink-500 shrink-0" />
              <span>{{ wish.blessings }} พรละอองดารา</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TIER 5: GENERAL PUBLIC / WASHI PAPER CARD -->
      <div
        v-else
        class="relative rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 lg:p-7 border-2 border-pink-200 bg-gradient-to-b from-pink-50 via-purple-50 to-sky-50 shadow-sm mb-3.5 sm:mb-5 text-slate-900 overflow-hidden min-w-0"
      >
        <div class="flex justify-center -mt-5 sm:-mt-8 mb-2 sm:mb-3">
          <div class="w-3 sm:w-3.5 md:w-4 h-5 sm:h-6 md:h-7 border-2 border-pink-400/80 rounded-full bg-pink-300/40 shadow-xs" />
        </div>

        <div class="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-slate-200 min-w-0">
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-pink-800 truncate">
            <Tag class="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 shrink-0" />
            <span class="truncate">{{ wish.category }}</span>
          </div>

          <div class="text-[9px] sm:text-[10px] md:text-[11px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
            <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <div class="my-2.5 sm:my-3">
          <p class="text-xs sm:text-base md:text-lg font-medium leading-relaxed font-sans text-slate-800 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            "{{ wish.wish }}"
          </p>
        </div>

        <div class="mt-3 sm:mt-4 pt-2 sm:pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 min-w-0">
          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div class="w-6 h-6 sm:w-7 md:w-8 sm:h-7 md:h-8 rounded-full bg-pink-400 text-white shadow-2xs flex items-center justify-center text-[9px] sm:text-xs font-bold shrink-0">
              ✨
            </div>
            <div class="min-w-0">
              <div class="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-semibold tracking-wider text-slate-500 truncate">
                ผู้เขียนคำอธิษฐาน ละอองดารา
              </div>
              <div class="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 font-heading truncate max-w-[80px] sm:max-w-[120px] md:max-w-[160px]">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white text-pink-600 text-[9px] sm:text-xs font-bold shadow-2xs whitespace-nowrap">
              <Heart class="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-pink-500 text-pink-500 shrink-0" />
              <span>{{ wish.blessings }} พรละอองดารา</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <!--
        <button
          @click="handleBless"
          class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden active:scale-98"
        >
          <Bell class="w-4 h-4" :class="{ 'animate-bounce': isBlessedJustNow }" />
          <span>{{ isBlessedJustNow ? 'ส่งพลังใจ & สั่นกระดิ่งสำเร็จ! 🎋' : 'สั่นกระดิ่งร่วมอธิษฐาน (+1)' }}</span>
        </button>
        -->

        <button
          @click="handleCopyWish"
          class="w-full p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 touch-manipulation"
          :class="wish.branchIndex <= 2 ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800'"
          title="คัดลอกคำอธิษฐาน"
        >
          <Check v-if="copied" class="w-4 h-4 text-green-500" />
          <Share2 v-else class="w-4 h-4" />
          <span>{{ copied ? 'คัดลอกคำอธิษฐานแล้ว' : 'แชร์คำอธิษฐาน' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>