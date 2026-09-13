<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles, Wind, Eye, Heart, Plus, Crown, Gem, Award, Flame } from 'lucide-vue-next';
import { TanabataWish, TanzakuColor } from '../types';
import { getTierByBranchIndex, getTreePaperStyle, TANABATA_TIERS } from '../utils/tanabataTiers';

const props = defineProps<{
  wishes: TanabataWish[];
  windIntensity?: 'gentle' | 'medium' | 'strong';
}>();

const emit = defineEmits<{
  (e: 'selectWish', wish: TanabataWish): void;
  (e: 'openWriteModal'): void;
}>();

const localWind = ref<'gentle' | 'medium' | 'strong'>(props.windIntensity || 'gentle');
const isGustActive = ref(false);
const showBranchLabels = ref(false);

const triggerWindGust = () => {
  isGustActive.value = true;
  setTimeout(() => {
    isGustActive.value = false;
  }, 3000);
};

// Assign positioning coordinates for branches & hang coordinates (Branch 0 top-left down to Branch 5 bottom-right)
const branchAnchors = [
  // Branch 0 (Top Left) - Top Supporter (>=2,000฿)
  { startX: 470, startY: 150, endX: 180, endY: 110, controlX: 320, controlY: 100, labelX: 140, labelY: 95 },
  // Branch 1 (Top Right) - Gold Fan (>= 500฿)
  { startX: 490, startY: 210, endX: 780, endY: 160, controlX: 640, controlY: 160, labelX: 800, labelY: 150 },
  // Branch 2 (Middle Left) - Silver Fan (>= 200฿)
  { startX: 475, startY: 330, endX: 140, endY: 280, controlX: 290, controlY: 270, labelX: 105, labelY: 265 },
  // Branch 3 (Middle Right) - Fan (>= 100฿)
  { startX: 495, startY: 420, endX: 820, endY: 370, controlX: 670, controlY: 360, labelX: 840, labelY: 360 },
  // Branch 4 (Lower Left) - Fan (>= 50฿)
  { startX: 480, startY: 530, endX: 190, endY: 490, controlX: 320, controlY: 480, labelX: 150, labelY: 480 },
  // Branch 5 (Lower Right) - General Public / No donate
  { startX: 500, startY: 620, endX: 790, endY: 580, controlX: 650, controlY: 570, labelX: 810, labelY: 575 }
];

const getWishCoordinates = (wish: TanabataWish, index: number) => {
  const branchIdx = Math.max(0, Math.min(5, Number(wish.branchIndex) || 0));
  const branch = branchAnchors[branchIdx];
  const t = (wish.hangPositionPercent || 50) / 100;

  // Quadratic Bezier Formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const x = Math.round(
    Math.pow(1 - t, 2) * branch.startX +
    2 * (1 - t) * t * branch.controlX +
    Math.pow(t, 2) * branch.endX
  );
  const y = Math.round(
    Math.pow(1 - t, 2) * branch.startY +
    2 * (1 - t) * t * branch.controlY +
    Math.pow(t, 2) * branch.endY
  );

  return { x, y, branchIdx };
};

// Dynamic animation class based on index & wind
const getSwayClass = (idx: number, branchIdx: number) => {
  if (isGustActive.value) return 'animate-sway-gust';
  if (localWind.value === 'strong') return 'animate-sway-gust';
  if ((idx + branchIdx) % 3 === 0) return 'animate-sway-1';
  if ((idx + branchIdx) % 3 === 1) return 'animate-sway-2';
  return 'animate-sway-3';
};
</script>

<template>
  <div class="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-700/40 select-none">
    <!-- Starry & Twilight Night Background Canvas -->
    <div class="absolute inset-0 tanabata-night-sky">
      <!-- Milky Way River (Amanogawa) stream glow -->
      <div class="absolute inset-0 opacity-40 bg-gradient-to-tr from-indigo-950 via-purple-900/40 to-blue-900/30 blur-2xl" />

      <!-- Glowing Stardust & Twinkling Constellations -->
      <div
        v-for="i in 35"
        :key="`star-${i}`"
        class="absolute rounded-full bg-white animate-twinkle"
        :style="{
          width: `${(i % 3) + 1.5}px`,
          height: `${(i % 3) + 1.5}px`,
          top: `${(i * 19) % 95}%`,
          left: `${(i * 27) % 98}%`,
          animationDelay: `${(i * 0.35) % 4}s`,
          animationDuration: `${2 + (i % 3)}s`
        }"
      />

      <!-- Altair & Vega (Orihime & Hikoboshi) Feature Stars -->
      <div class="absolute top-16 sm:top-24 md:top-28 lg:top-32 left-4 sm:left-10 md:left-16 lg:left-24 flex items-center gap-1.5 sm:gap-2 opacity-80 animate-float-gentle">
        <div class="w-2 sm:w-2.5 md:w-3.5 h-2 sm:h-2.5 md:h-3.5 bg-sky-200 rounded-full blur-[1px] shadow-[0_0_12px_#38bdf8]" />
        <span class="text-[9px] sm:text-[10px] text-sky-200/80 font-serif tracking-widest hidden sm:inline">織姫 (Vega)</span>
      </div>
      <div class="absolute top-20 sm:top-30 md:top-36 lg:top-40 right-4 sm:right-10 md:right-16 lg:right-20 flex items-center gap-1.5 sm:gap-2 opacity-80 animate-float-gentle" style="animation-delay: 1.5s;">
        <span class="text-[9px] sm:text-[10px] text-amber-200/80 font-serif tracking-widest hidden sm:inline">彦星 (Altair)</span>
        <div class="w-2 sm:w-2.5 md:w-3.5 h-2 sm:h-2.5 md:h-3.5 bg-amber-200 rounded-full blur-[1px] shadow-[0_0_12px_#f59e0b]" />
      </div>

      <!-- Flowing Wind Trails (สายลมพัดผ่าน) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          v-for="w in 6"
          :key="`wind-line-${w}`"
          class="absolute h-0.5 rounded-full bg-gradient-to-r from-transparent via-sky-300/40 to-transparent animate-wind-line"
          :style="{
            top: `${15 + w * 13}%`,
            width: `${250 + w * 60}px`,
            animationDuration: `${isGustActive ? 2.5 : 5.5 + w * 1.2}s`,
            animationDelay: `${w * 0.9}s`
          }"
        />
      </div>

      <!-- Falling Bamboo Leaves & Cherry Petals floating across the breeze -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          v-for="leaf in 8"
          :key="`leaf-${leaf}`"
          class="absolute opacity-80"
          :style="{
            top: `${(leaf * 11) % 50}%`,
            left: `${(leaf * 14) % 60}%`,
            animation: `leaf-flutter ${isGustActive ? 4 : 8 + leaf * 1.5}s linear infinite`,
            animationDelay: `${leaf * 1.2}s`
          }"
        >
          <div
            class="w-2.5 sm:w-3 h-1 sm:h-1.5 rounded-full shadow-xs"
            :class="leaf % 2 === 0 ? 'bg-emerald-400/80' : 'bg-pink-300/80'"
          />
        </div>
      </div>
    </div>

    <!-- Top Canvas Overlay Controls -->
    <div class="relative z-20 p-2.5 sm:p-4 lg:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-transparent">
      <!-- Title Badge -->
      <div class="flex items-center gap-2 sm:gap-2.5 min-w-0 w-full sm:w-auto">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 backdrop-blur-md shrink-0 text-sm sm:text-base lg:text-lg">
          🎋
        </div>
        <div class="min-w-0 flex-1 sm:flex-initial">
          <div class="flex flex-wrap items-center gap-1 sm:gap-2">
            <h3 class="text-xs sm:text-base lg:text-lg font-bold text-white font-heading tracking-tight truncate">
              ต้นไผ่อธิษฐาน 6 ระดับผู้สนับสนุน (Tanabata Sasatake)
            </h3>
            <span class="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30 shrink-0">
              ลดหลั่นตามยอดโดเนท
            </span>
          </div>
          <p class="text-[10px] sm:text-xs text-slate-300 truncate mt-0.5">
            กิ่งบนสุด: 🐱 (>=2k) • กิ่งกลาง: 💖 / 🌸 / ✨ • กิ่งล่าง: 🌟 / 🎋 ทั่วไป
          </p>
        </div>
      </div>

      <!-- Wind & Action Tools -->
      <div class="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <!-- Toggle Branch Markers -->
        <!--
        <button
          @click="showBranchLabels = !showBranchLabels"
          class="px-2.5 py-1.5 rounded-xl border text-[11px] font-medium backdrop-blur-md transition-all cursor-pointer"
          :class="showBranchLabels ? 'bg-indigo-500/30 border-indigo-400/50 text-indigo-200' : 'bg-white/10 border-white/20 text-slate-300 hover:bg-white/20'"
        >
          <span>🏷️ {{ showBranchLabels ? 'ซ่อนป้ายกิ่ง' : 'แสดงป้ายกิ่ง' }}</span>
        </button>
        -->

        <!-- Wind Gust Trigger -->
        <button
          @click="triggerWindGust"
          class="w-full sm:w-auto justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 touch-manipulation"
          title="เรียกสายลมพัดกระดาษ"
        >
          <Wind class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300 shrink-0" :class="{ 'animate-spin': isGustActive }" />
          <span>{{ isGustActive ? 'สายลมพัดแรง! 🍃' : 'เรียกสายลม 💨' }}</span>
        </button>

        <!-- Write Wish CTA -->
        <!--
        <button
          @click="emit('openWriteModal')"
          class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>เขียนคำอธิษฐาน</span>
        </button>
        -->
      </div>
    </div>

    <!-- 6 Tiers Quick Indicator Bar -->
    <!--
    <div class="relative z-20 px-4 py-2 bg-slate-900/60 backdrop-blur-sm border-y border-white/10 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1">
        <span>ลำดับกิ่งไผ่:</span>
      </span>
      <div
        v-for="tier in TANABATA_TIERS"
        :key="tier.index"
        class="px-2.5 py-0.5 rounded-lg shrink-0 flex items-center gap-1 border"
        :class="[
          tier.index === 0 ? 'bg-amber-400/20 border-amber-400/50 text-amber-200' :
          tier.index === 1 ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-200' :
          tier.index === 2 ? 'bg-slate-300/20 border-slate-300/50 text-slate-200' :
          tier.index === 3 ? 'bg-rose-400/20 border-rose-400/50 text-rose-200' :
          tier.index === 4 ? 'bg-pink-400/20 border-pink-400/50 text-pink-200' :
          'bg-stone-500/20 border-stone-400/40 text-stone-300'
        ]"
      >
        <span>{{ tier.icon }}</span>
        <span class="font-bold">กิ่ง {{ tier.index }}: {{ tier.name }}</span>
        <span class="text-[9px] opacity-75">({{ tier.minDonation > 0 ? `>${tier.minDonation}฿` : 'Free' }})</span>
      </div>
    </div>
    -->

    <!-- Main Interactive Stage (Bamboo Tree & Hanging Tanzaku Strips) -->
    <div class="relative z-10 w-full overflow-x-auto no-scrollbar touch-pan-x py-1 sm:py-2">
      <div class="relative min-w-[580px] sm:min-w-[720px] md:min-w-[840px] lg:min-w-full max-w-[1000px] mx-auto aspect-[1000/800] flex items-center justify-center">
        <!-- SVG Bamboo Tree Canvas -->
        <svg
          viewBox="0 0 1000 800"
          class="w-full h-full object-contain drop-shadow-2xl"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <!-- Bamboo Stalk Gradient -->
            <linearGradient id="bambooStalk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#064e3b" />
              <stop offset="30%" stop-color="#047857" />
              <stop offset="70%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#065f46" />
            </linearGradient>

            <!-- Bamboo Joint Gradient -->
            <linearGradient id="bambooJoint" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#022c22" />
              <stop offset="50%" stop-color="#34d399" />
              <stop offset="100%" stop-color="#022c22" />
            </linearGradient>

            <!-- Branch Green Gradient -->
            <linearGradient id="bambooBranch" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#059669" />
              <stop offset="100%" stop-color="#34d399" />
            </linearGradient>

            <!-- Gold Leaf Branch Accent for Tier 0 & 1 -->
            <linearGradient id="goldBranchGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="50%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#34d399" />
            </linearGradient>

            <!-- Leaf Cluster Definition -->
            <g id="leaf-cluster">
              <path d="M0,0 Q25,-12 60,-5 Q25,8 0,0" fill="#10b981" opacity="0.9" />
              <path d="M5,-2 Q35,-25 75,-15 Q40,-2 5,-2" fill="#34d399" opacity="0.85" />
              <path d="M0,2 Q30,18 70,12 Q35,4 0,2" fill="#059669" opacity="0.95" />
              <path d="M-5,0 Q20,-30 55,-22 Q25,-10 -5,0" fill="#6ee7b7" opacity="0.8" />
            </g>

            <g id="leaf-cluster-left">
              <path d="M0,0 Q-25,-12 -60,-5 Q-25,8 0,0" fill="#10b981" opacity="0.9" />
              <path d="M-5,-2 Q-35,-25 -75,-15 Q-40,-2 -5,-2" fill="#34d399" opacity="0.85" />
              <path d="M0,2 Q-30,18 -70,12 Q-35,4 0,2" fill="#059669" opacity="0.95" />
              <path d="M5,0 Q-20,-30 -55,-22 Q-25,-10 5,0" fill="#6ee7b7" opacity="0.8" />
            </g>
          </defs>

          <!-- Main Bamboo Trunk -->
          <g class="animate-branch">
            <!-- Trunk Segments -->
            <!-- Segment 1: Bottom -->
            <rect x="474" y="650" width="34" height="150" fill="url(#bambooStalk)" rx="4" />
            <ellipse cx="491" cy="650" rx="19" ry="5" fill="url(#bambooJoint)" />

            <!-- Segment 2 -->
            <rect x="475" y="510" width="32" height="142" fill="url(#bambooStalk)" rx="4" />
            <ellipse cx="491" cy="510" rx="18" ry="5" fill="url(#bambooJoint)" />

            <!-- Segment 3 -->
            <rect x="476" y="380" width="30" height="132" fill="url(#bambooStalk)" rx="4" />
            <ellipse cx="491" cy="380" rx="17" ry="4.5" fill="url(#bambooJoint)" />

            <!-- Segment 4 -->
            <rect x="477" y="260" width="28" height="122" fill="url(#bambooStalk)" rx="4" />
            <ellipse cx="491" cy="260" rx="16" ry="4" fill="url(#bambooJoint)" />

            <!-- Segment 5 -->
            <rect x="479" y="150" width="24" height="112" fill="url(#bambooStalk)" rx="4" />
            <ellipse cx="491" cy="150" rx="14" ry="3.5" fill="url(#bambooJoint)" />

            <!-- Segment 6: Top tip with Golden Star topper -->
            <path d="M480,150 Q491,40 505,10 Q495,60 498,150 Z" fill="url(#bambooStalk)" />
            <!-- Star topper on bamboo apex -->
            <polygon points="505,3 508,12 517,12 510,18 513,27 505,21 497,27 500,18 493,12 502,12" fill="#fbbf24" filter="drop-shadow(0 0 6px #f59e0b)" />
          </g>

          <!-- Branches extending outward with distinctive tiers -->
          <!-- Branch 0: Top Left (Diamond Fan >5,000฿) -->
          <path class="animate-branch" d="M480,150 Q320,100 180,110" stroke="url(#goldBranchGlow)" stroke-width="8" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 4px rgba(251,191,36,0.5))" />
          <use class="animate-branch" href="#leaf-cluster-left" x="180" y="110" transform="rotate(-15 180 110)" />
          <use class="animate-branch" href="#leaf-cluster-left" x="270" y="105" transform="rotate(5 270 105)" />

          <!-- Branch 1: Top Right (Gold Fan >2,000฿) -->
          <path class="animate-branch" d="M490,210 Q640,160 780,160" stroke="url(#goldBranchGlow)" stroke-width="8" fill="none" stroke-linecap="round" filter="drop-shadow(0 0 4px rgba(245,158,11,0.4))" />
          <use class="animate-branch" href="#leaf-cluster" x="780" y="160" transform="rotate(10 780 160)" />
          <use class="animate-branch" href="#leaf-cluster" x="660" y="170" transform="rotate(-10 660 170)" />

          <!-- Branch 2: Middle Left (Silver Fan >500฿) -->
          <path class="animate-branch" d="M475,330 Q290,270 140,280" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
          <use class="animate-branch" href="#leaf-cluster-left" x="140" y="280" transform="rotate(10 140 280)" />
          <use class="animate-branch" href="#leaf-cluster-left" x="250" y="275" transform="rotate(-12 250 275)" />

          <!-- Branch 3: Middle Right (Fan >100฿) -->
          <path class="animate-branch" d="M495,420 Q670,360 820,370" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
          <use class="animate-branch" href="#leaf-cluster" x="820" y="370" transform="rotate(15 820 370)" />
          <use class="animate-branch" href="#leaf-cluster" x="690" y="380" transform="rotate(-5 690 380)" />

          <!-- Branch 4: Lower Left (Fan >1฿) -->
          <path class="animate-branch" d="M480,530 Q320,480 190,490" stroke="url(#bambooBranch)" stroke-width="9" fill="none" stroke-linecap="round" />
          <use class="animate-branch" href="#leaf-cluster-left" x="190" y="490" transform="rotate(-5 190 490)" />
          <use class="animate-branch" href="#leaf-cluster-left" x="300" y="495" transform="rotate(15 300 495)" />

          <!-- Branch 5: Lower Right (General / Free) -->
          <path class="animate-branch" d="M500,620 Q650,570 790,580" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
          <use class="animate-branch" href="#leaf-cluster" x="790" y="580" transform="rotate(10 790 580)" />
          <use class="animate-branch" href="#leaf-cluster" x="660" y="585" transform="rotate(-15 660 585)" />

          <!-- Top Bamboo Foliage Leaves Crown -->
          <use class="animate-branch" href="#leaf-cluster" x="505" y="20" transform="rotate(-30 505 20)" />
          <use class="animate-branch" href="#leaf-cluster-left" x="495" y="30" transform="rotate(25 495 30)" />
          <use class="animate-branch" href="#leaf-cluster" x="510" y="60" transform="rotate(45 510 60)" />
          <use class="animate-branch" href="#leaf-cluster-left" x="485" y="70" transform="rotate(-40 485 70)" />
        </svg>

        <!-- Visual Branch Labels on the Tree (if enabled) -->
        <div v-if="showBranchLabels" class="absolute inset-0 pointer-events-none">
          <div
            v-for="tier in TANABATA_TIERS"
            :key="`label-${tier.index}`"
            class="absolute transform -translate-y-1/2 transition-opacity duration-300"
            :style="{
              left: `${(branchAnchors[tier.index].labelX / 1000) * 100}%`,
              top: `${(branchAnchors[tier.index].labelY / 800) * 100}%`,
              transform: tier.index % 2 === 0 ? 'translate(-100%, -50%)' : 'translate(0%, -50%)'
            }"
          >
            <div
              class="px-1.5 sm:px-2 py-0.5 rounded-md backdrop-blur-md text-[9px] sm:text-[10px] font-bold shadow-md flex items-center gap-1 border"
              :class="[
                tier.index === 0 ? 'bg-amber-500/30 border-amber-300/70 text-amber-200 shadow-amber-500/20' :
                tier.index === 1 ? 'bg-yellow-500/30 border-yellow-300/70 text-yellow-200 shadow-yellow-500/20' :
                tier.index === 2 ? 'bg-slate-400/30 border-slate-300/70 text-slate-200 shadow-slate-500/20' :
                tier.index === 3 ? 'bg-rose-500/30 border-rose-300/70 text-rose-200 shadow-rose-500/20' :
                tier.index === 4 ? 'bg-pink-500/30 border-pink-300/70 text-pink-200 shadow-pink-500/20' :
                'bg-stone-700/40 border-stone-400/50 text-stone-300'
              ]"
            >
              <span>{{ tier.icon }}</span>
              <span>กิ่ง {{ tier.index }}: {{ tier.name }}</span>
            </div>
          </div>
        </div>

        <!-- Absolute Placed Interactive Tanzaku Wish Papers hanging by Strings -->
        <div
          v-for="(wish, idx) in wishes"
          :key="wish.id"
          class="absolute cursor-pointer transition-transform duration-300 touch-manipulation active:scale-95"
          :style="{
            left: `${(getWishCoordinates(wish, idx).x / 1000) * 100}%`,
            top: `${(getWishCoordinates(wish, idx).y / 800) * 100}%`,
            transform: 'translate(-50%, 0)'
          }"
          @click="emit('selectWish', wish)"
        >
          <!-- The Hanging String from Bamboo Branch -->
          <div class="flex flex-col items-center">
            <div
              class="w-[1px] sm:w-[1.5px] h-4 sm:h-5 md:h-6 lg:h-7"
              :style="{ backgroundColor: getTreePaperStyle(wish.branchIndex).stringColor }"
            />
            <!-- Knot Loop with jewel/metallic topper for higher tiers -->
            <div
              class="w-1.5 sm:w-2 md:w-2.5 h-1.5 sm:h-2 md:h-2.5 rounded-full border border-white/80 -mt-1 shadow-xs flex items-center justify-center text-[5px] sm:text-[6px]"
              :class="getTreePaperStyle(wish.branchIndex).knotColor"
            />
          </div>

          <!-- The Swaying Tanzaku Paper Strip with distinct Tier Designs -->
          <!-- Tier 0: Diamond Fan (Holographic + Glow + Shimmer) -->
          <div
            v-if="wish.branchIndex === 0"
            class="relative w-[78px] sm:w-22 md:w-24 lg:w-28 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border sm:border-2 border-amber-300/90 diamond-glow animate-shimmer"
            :class="[
              'bg-gradient-to-b from-indigo-100/95 via-pink-100/95 to-amber-100/95 shadow-xl',
              getSwayClass(idx, wish.branchIndex)
            ]"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-900/40 mx-auto -mt-1 mb-0.5 sm:mb-1 shadow-inner" />

            <!-- Diamond VIP Badge -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-black tracking-wider bg-gradient-to-r from-amber-400 via-pink-500 to-indigo-500 text-white shadow-xs">
                🐱 Boss Meow
              </span>
            </div>

            <!-- Wish preview text -->
            <div class="min-h-[36px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[56px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-bold leading-tight sm:leading-snug line-clamp-3 text-indigo-950 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-amber-300/60 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-black text-indigo-900 truncate max-w-[55px] sm:max-w-[65px] md:max-w-[75px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Gold Silk Tassel & Crystal Bell on bottom -->
            <div class="absolute -bottom-2.5 sm:-bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div class="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-amber-400 shadow-xs border border-white" />
              <div class="w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-b bg-gradient-to-b from-amber-400 via-pink-500 to-purple-600" />
            </div>

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-300 text-[9px] sm:text-[10px] font-bold whitespace-nowrap shadow-md z-30 pointer-events-none border border-amber-400/40">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-300" />
              <span>🐱 คลิกเพื่ออ่าน</span>
            </div>
          </div>

          <!-- Tier 1: Gold Fan (Imperial Gold Leaf + Gold Foil) -->
          <div
            v-else-if="wish.branchIndex === 1"
            class="relative w-[74px] sm:w-20 md:w-22 lg:w-26 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border sm:border-2 border-amber-400 bg-gradient-to-b from-amber-100/95 via-yellow-50/95 to-amber-200/95 shadow-[0_0_12px_rgba(245,158,11,0.35)]"
            :class="getSwayClass(idx, wish.branchIndex)"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-900/40 mx-auto -mt-1 mb-0.5 sm:mb-1" />

            <!-- Gold Fan Badge -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold tracking-tight bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-50 shadow-2xs">
                💖 Heartbeat
              </span>
            </div>

            <!-- Wish text preview -->
            <div class="min-h-[36px] sm:min-h-[44px] md:min-h-[48px] lg:min-h-[56px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-semibold leading-tight sm:leading-snug line-clamp-3 text-amber-950 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-amber-300/50 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-bold text-amber-900 truncate max-w-[50px] sm:max-w-[60px] md:max-w-[70px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Gold Tassel -->
            <div class="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-2.5 sm:w-3.5 h-1.5 sm:h-2 rounded-b bg-gradient-to-b from-amber-400 to-yellow-600 shadow-xs" />

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-yellow-300 text-[9px] sm:text-[10px] font-semibold whitespace-nowrap shadow-md z-30 pointer-events-none">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-yellow-300" />
              <span>💖 คลิกเพื่ออ่าน</span>
            </div>
          </div>

          <!-- Tier 2: Silver Fan (Platinum / Silver Luster) -->
          <div
            v-else-if="wish.branchIndex === 2"
            class="relative w-[70px] sm:w-19 md:w-21 lg:w-24 rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border sm:border-2 border-slate-300 bg-gradient-to-b from-slate-100/95 via-sky-50/95 to-slate-200/95 shadow-md"
            :class="getSwayClass(idx, wish.branchIndex)"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-700/30 mx-auto -mt-1 mb-0.5 sm:mb-1" />

            <!-- Silver Fan Badge -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold bg-slate-600 text-white shadow-2xs">
                🌸 Whisper
              </span>
            </div>

            <!-- Wish text preview -->
            <div class="min-h-[34px] sm:min-h-[40px] md:min-h-[46px] lg:min-h-[52px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-medium leading-tight sm:leading-snug line-clamp-3 text-slate-900 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-slate-300 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-bold text-slate-800 truncate max-w-[48px] sm:max-w-[58px] md:max-w-[68px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Silver Tassel -->
            <div class="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-2 sm:w-3 h-1 sm:h-1.5 rounded-b bg-slate-400" />

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-200 text-[9px] sm:text-[10px] whitespace-nowrap shadow-md z-30 pointer-events-none">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-slate-300" />
              <span>🌸 คลิกเพื่ออ่าน</span>
            </div>
          </div>

          <!-- Tier 3: Fan > 100฿ (Sakura Supporter Paper) -->
          <div
            v-else-if="wish.branchIndex === 3"
            class="relative w-[70px] sm:w-19 md:w-21 lg:w-24 rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-rose-300 bg-gradient-to-b from-rose-50/95 via-pink-100/95 to-rose-100/95 shadow-md shadow-pink-500/20"
            :class="getSwayClass(idx, wish.branchIndex)"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-rose-900/20 mx-auto -mt-1 mb-0.5 sm:mb-1" />

            <!-- Sakura Supporter Badge -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-bold bg-rose-500 text-white shadow-2xs">
                ✨ Blessing
              </span>
            </div>

            <!-- Wish text preview -->
            <div class="min-h-[34px] sm:min-h-[40px] md:min-h-[46px] lg:min-h-[52px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-medium leading-tight sm:leading-snug line-clamp-3 text-rose-950 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-rose-200 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-bold text-rose-800 truncate max-w-[48px] sm:max-w-[58px] md:max-w-[68px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Sakura Ribbon -->
            <div class="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-2.5 sm:w-3.5 h-1 sm:h-1.5 rounded-b-md bg-rose-400 opacity-80" />

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] sm:text-[10px] whitespace-nowrap shadow-md z-30 pointer-events-none">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-pink-400" />
              <span>✨ คลิกเพื่ออ่าน</span>
            </div>
          </div>

          <!-- Tier 4: Fan > 1฿ (Sweet Heart Supporter Paper) -->
          <div
            v-else-if="wish.branchIndex === 4"
            class="relative w-[66px] sm:w-18 md:w-20 lg:w-23 rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-pink-200 bg-gradient-to-b from-pink-50/95 via-purple-50/95 to-sky-50/95 shadow-sm"
            :class="getSwayClass(idx, wish.branchIndex)"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-slate-900/20 mx-auto -mt-1 mb-0.5 sm:mb-1" />

            <!-- Heart Fan Badge -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-medium bg-pink-400 text-white">
                🌟 Stardust
              </span>
            </div>

            <!-- Wish text preview -->
            <div class="min-h-[32px] sm:min-h-[38px] md:min-h-[44px] lg:min-h-[50px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[10.5px] font-medium leading-tight sm:leading-snug line-clamp-3 text-slate-800 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-slate-200 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-bold text-slate-700 truncate max-w-[45px] sm:max-w-[55px] md:max-w-[65px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Heart Ribbon -->
            <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 sm:w-2.5 h-1 rounded-b bg-pink-300 opacity-80" />

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] sm:text-[10px] whitespace-nowrap shadow-md z-30 pointer-events-none">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-pink-400" />
              <span>🌟 คลิกเพื่ออ่าน</span>
            </div>
          </div>

          <!-- Tier 5: General Public / Non-donate (Traditional Washi Paper) -->
          <div
            v-else
            class="relative w-[66px] sm:w-18 md:w-20 lg:w-23 rounded-md sm:rounded-lg p-1 sm:p-1.5 md:p-2 text-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-amber-200/80 washi-paper-bg shadow-xs"
            :class="getSwayClass(idx, wish.branchIndex)"
          >
            <!-- Top String Hole -->
            <div class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-stone-900/20 mx-auto -mt-1 mb-0.5 sm:mb-1" />

            <!-- General Tag -->
            <div class="mb-0.5 sm:mb-1 flex items-center justify-center">
              <span class="px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[6.5px] sm:text-[7.5px] md:text-[8px] font-medium bg-emerald-700 text-emerald-50">
                🎋 ทั่วไป
              </span>
            </div>

            <!-- Wish text preview -->
            <div class="min-h-[32px] sm:min-h-[38px] md:min-h-[44px] lg:min-h-[50px] flex items-center justify-center">
              <p class="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[10.5px] font-serif leading-tight sm:leading-snug line-clamp-3 text-stone-800 break-words [overflow-wrap:anywhere]">
                {{ wish.wish }}
              </p>
            </div>

            <!-- Wisher Author Name -->
            <div class="mt-0.5 sm:mt-1 pt-0.5 sm:pt-1 border-t border-stone-200 flex items-center justify-center gap-1">
              <span class="text-[7.5px] sm:text-[8px] md:text-[9px] font-medium text-stone-700 truncate max-w-[45px] sm:max-w-[55px] md:max-w-[65px]">
                {{ wish.author }}
              </span>
            </div>

            <!-- Minimalist Tassel -->
            <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 sm:w-2.5 h-1 rounded-b bg-stone-300 opacity-75" />

            <!-- Hover Hint Badge -->
            <div class="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[9px] sm:text-[10px] whitespace-nowrap shadow-md z-30 pointer-events-none">
              <Eye class="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
              <span>🎋 คลิกเพื่ออ่าน</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Canvas Note & Tips -->
    <div class="relative z-20 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-950/85 backdrop-blur-md border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs text-slate-300 text-center sm:text-left">
      <div class="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
        <Sparkles class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400 shrink-0" />
        <span class="leading-tight">🎋 ยอดโดเนทจะจัดวางคำอธิษฐานตามระดับกิ่งไผ่และรูปแบบกระดาษที่วิจิตรงดงามยิ่งขึ้น</span>
      </div>

      <div class="flex items-center gap-3">
        <!--
        <button
          @click="emit('openWriteModal')"
          class="text-pink-400 hover:text-pink-300 font-semibold underline flex items-center gap-1 cursor-pointer"
        >
          <span>+ แขวนคำอธิษฐานของคุณ</span>
        </button>
        -->
      </div>
    </div>
  </div>
</template>