<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles, Wind, Eye, Heart, Plus, Compass } from 'lucide-vue-next';
import { TanabataWish, TanzakuColor } from '../types';

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

const triggerWindGust = () => {
  isGustActive.value = true;
  setTimeout(() => {
    isGustActive.value = false;
  }, 3000);
};

// Map color to styling
const getColorClasses = (color: TanzakuColor) => {
  switch (color) {
    case 'pink':
      return {
        bg: 'bg-gradient-to-b from-pink-100 via-rose-100 to-pink-200',
        border: 'border-pink-300 hover:border-pink-400',
        text: 'text-pink-900',
        ribbon: 'bg-rose-400',
        string: '#f472b6',
        shadow: 'shadow-pink-500/20'
      };
    case 'blue':
      return {
        bg: 'bg-gradient-to-b from-sky-100 via-blue-100 to-indigo-100',
        border: 'border-sky-300 hover:border-sky-400',
        text: 'text-sky-950',
        ribbon: 'bg-sky-400',
        string: '#38bdf8',
        shadow: 'shadow-sky-500/20'
      };
    case 'yellow':
      return {
        bg: 'bg-gradient-to-b from-amber-100 via-yellow-100 to-amber-200',
        border: 'border-amber-300 hover:border-amber-400',
        text: 'text-amber-950',
        ribbon: 'bg-amber-400',
        string: '#f59e0b',
        shadow: 'shadow-amber-500/20'
      };
    case 'green':
      return {
        bg: 'bg-gradient-to-b from-emerald-100 via-teal-100 to-emerald-200',
        border: 'border-emerald-300 hover:border-emerald-400',
        text: 'text-emerald-950',
        ribbon: 'bg-emerald-400',
        string: '#10b981',
        shadow: 'shadow-emerald-500/20'
      };
    case 'purple':
      return {
        bg: 'bg-gradient-to-b from-purple-100 via-fuchsia-100 to-purple-200',
        border: 'border-purple-300 hover:border-purple-400',
        text: 'text-purple-950',
        ribbon: 'bg-purple-400',
        string: '#a855f7',
        shadow: 'shadow-purple-500/20'
      };
    case 'red':
      return {
        bg: 'bg-gradient-to-b from-red-100 via-rose-100 to-red-200',
        border: 'border-red-300 hover:border-red-400',
        text: 'text-red-950',
        ribbon: 'bg-rose-400',
        string: '#ef4444',
        shadow: 'shadow-red-500/20'
      };
    default:
      return {
        bg: 'bg-gradient-to-b from-pink-100 to-pink-200',
        border: 'border-pink-300 hover:border-pink-400',
        text: 'text-pink-900',
        ribbon: 'bg-rose-400',
        string: '#f472b6',
        shadow: 'shadow-pink-500/20'
      };
  }
};

// Assign positioning coordinates for branches & hang coordinates
const branchAnchors = [
  // Branch 0 (Top Left)
  { startX: 470, startY: 150, endX: 180, endY: 110, controlX: 320, controlY: 100 },
  // Branch 1 (Top Right)
  { startX: 490, startY: 210, endX: 780, endY: 160, controlX: 640, controlY: 160 },
  // Branch 2 (Middle Left)
  { startX: 475, startY: 330, endX: 140, endY: 280, controlX: 290, controlY: 270 },
  // Branch 3 (Middle Right)
  { startX: 495, startY: 420, endX: 820, endY: 370, controlX: 670, controlY: 360 },
  // Branch 4 (Lower Left)
  { startX: 480, startY: 530, endX: 190, endY: 490, controlX: 320, controlY: 480 },
  // Branch 5 (Lower Right)
  { startX: 500, startY: 620, endX: 790, endY: 580, controlX: 650, controlY: 570 }
];

const getWishCoordinates = (wish: TanabataWish, index: number) => {
  const branchIdx = wish.branchIndex % branchAnchors.length;
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
const getSwayClass = (idx: number) => {
  if (isGustActive.value) return 'animate-sway-gust';
  if (localWind.value === 'strong') return 'animate-sway-gust';
  if (idx % 3 === 0) return 'animate-sway-1';
  if (idx % 3 === 1) return 'animate-sway-2';
  return 'animate-sway-3';
};
</script>

<template>
  <div class="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-700/40 select-none">
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
      <div class="absolute top-12 left-16 flex items-center gap-2 opacity-80 animate-float-gentle">
        <div class="w-3.5 h-3.5 bg-sky-200 rounded-full blur-[1px] shadow-[0_0_12px_#38bdf8]" />
        <span class="text-[10px] text-sky-200/80 font-serif tracking-widest hidden sm:inline">織姫 (Vega)</span>
      </div>
      <div class="absolute top-20 right-20 flex items-center gap-2 opacity-80 animate-float-gentle" style="animation-delay: 1.5s;">
        <span class="text-[10px] text-amber-200/80 font-serif tracking-widest hidden sm:inline">彦星 (Altair)</span>
        <div class="w-3.5 h-3.5 bg-amber-200 rounded-full blur-[1px] shadow-[0_0_12px_#f59e0b]" />
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
            class="w-3 h-1.5 rounded-full shadow-xs"
            :class="leaf % 2 === 0 ? 'bg-emerald-400/80' : 'bg-pink-300/80'"
          />
        </div>
      </div>
    </div>

    <!-- Top Canvas Overlay Controls -->
    <div class="relative z-20 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-slate-950/70 to-transparent">
      <!-- Title Badge -->
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 backdrop-blur-md">
          🎋
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base sm:text-lg font-bold text-white font-heading tracking-tight">
              ต้นไผ่อธิษฐานทานาบาตะ (Tanabata Sasatake)
            </h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
              คลิกที่กระดาษเพื่ออ่าน
            </span>
          </div>
          <p class="text-xs text-slate-300">
            มีคำอธิษฐานแขวนอยู่ทั้งหมด {{ wishes.length }} แผ่น • ปลิวไหวตามสายลม
          </p>
        </div>
      </div>

      <!-- Wind & Action Tools -->
      <div class="flex items-center gap-2">
        <!-- Wind Gust Trigger -->
        <button
          @click="triggerWindGust"
          class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          title="เรียกสายลมพัดกระดาษ"
        >
          <Wind class="w-4 h-4 text-sky-300" :class="{ 'animate-spin': isGustActive }" />
          <span>{{ isGustActive ? 'สายลมพัดแรง! 🍃' : 'เรียกสายลม 💨' }}</span>
        </button>

        <!-- Write Wish CTA -->
        <!--
        <button
          @click="emit('openWriteModal')"
          class="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>เขียนคำอธิษฐาน</span>
        </button>
        -->
      </div>
    </div>

    <!-- Main Interactive Stage (Bamboo Tree & Hanging Tanzaku Strips) -->
    <div class="relative z-10 w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <!-- SVG Bamboo Tree Canvas -->
      <svg
        viewBox="0 0 1000 800"
        class="w-full h-full max-h-[720px] object-contain drop-shadow-2xl"
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

          <!-- Leaf Cluster Definition -->
          <g class="" id="leaf-cluster">
            <path d="M0,0 Q25,-12 60,-5 Q25,8 0,0" fill="#10b981" opacity="0.9" />
            <path d="M5,-2 Q35,-25 75,-15 Q40,-2 5,-2" fill="#34d399" opacity="0.85" />
            <path d="M0,2 Q30,18 70,12 Q35,4 0,2" fill="#059669" opacity="0.95" />
            <path d="M-5,0 Q20,-30 55,-22 Q25,-10 -5,0" fill="#6ee7b7" opacity="0.8" />
          </g>

          <g class="" id="leaf-cluster-left">
            <path d="M0,0 Q-25,-12 -60,-5 Q-25,8 0,0" fill="#10b981" opacity="0.9" />
            <path d="M-5,-2 Q-35,-25 -75,-15 Q-40,-2 -5,-2" fill="#34d399" opacity="0.85" />
            <path d="M0,2 Q-30,18 -70,12 Q-35,4 0,2" fill="#059669" opacity="0.95" />
            <path d="M5,0 Q-20,-30 -55,-22 Q-25,-10 5,0" fill="#6ee7b7" opacity="0.8" />
          </g>
        </defs>

        <!-- Main Bamboo Trunk -->
        <g class="">
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

          <!-- Segment 6: Top tip -->
          <path d="M480,150 Q491,40 505,10 Q495,60 498,150 Z" fill="url(#bambooStalk)" />
        </g>

        <!-- Branches extending outward -->
        <!-- Branch 0: Top Left -->
        <path class="animate-branch" d="M480,150 Q320,100 180,110" stroke="url(#bambooBranch)" stroke-width="7" fill="none" stroke-linecap="round" />
        <use class="animate-branch" href="#leaf-cluster-left" x="180" y="110" transform="rotate(-15 180 110)" />
        <use class="animate-branch" href="#leaf-cluster-left" x="270" y="105" transform="rotate(5 270 105)" />

        <!-- Branch 1: Top Right -->
        <path class="animate-branch" d="M490,210 Q640,160 780,160" stroke="url(#bambooBranch)" stroke-width="7" fill="none" stroke-linecap="round" />
        <use class="animate-branch" href="#leaf-cluster" x="780" y="160" transform="rotate(10 780 160)" />
        <use class="animate-branch" href="#leaf-cluster" x="660" y="170" transform="rotate(-10 660 170)" />

        <!-- Branch 2: Middle Left -->
        <path class="animate-branch" d="M475,330 Q290,270 140,280" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
        <use href="#leaf-cluster-left" x="140" y="280" transform="rotate(10 140 280)" />
        <use href="#leaf-cluster-left" x="250" y="275" transform="rotate(-12 250 275)" />

        <!-- Branch 3: Middle Right -->
        <path class="animate-branch" d="M495,420 Q670,360 820,370" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
        <use class="animate-branch" href="#leaf-cluster" x="820" y="370" transform="rotate(15 820 370)" />
        <use class="animate-branch" href="#leaf-cluster" x="690" y="380" transform="rotate(-5 690 380)" />

        <!-- Branch 4: Lower Left -->
        <path class="animate-branch" d="M480,530 Q320,480 190,490" stroke="url(#bambooBranch)" stroke-width="9" fill="none" stroke-linecap="round" />
        <use class="animate-branch" href="#leaf-cluster-left" x="190" y="490" transform="rotate(-5 190 490)" />
        <use class="animate-branch" href="#leaf-cluster-left" x="300" y="495" transform="rotate(15 300 495)" />

        <!-- Branch 5: Lower Right -->
        <path class="animate-branch" d="M500,620 Q650,570 790,580" stroke="url(#bambooBranch)" stroke-width="8" fill="none" stroke-linecap="round" />
        <use class="animate-branch" href="#leaf-cluster" x="790" y="580" transform="rotate(10 790 580)" />
        <use class="animate-branch" href="#leaf-cluster" x="660" y="585" transform="rotate(-15 660 585)" />

        <!-- Top Bamboo Foliage Leaves Crown -->
        <use href="#leaf-cluster" x="505" y="20" transform="rotate(-30 505 20)" />
        <use href="#leaf-cluster-left" x="495" y="30" transform="rotate(25 495 30)" />
        <use href="#leaf-cluster" x="510" y="60" transform="rotate(45 510 60)" />
        <use href="#leaf-cluster-left" x="485" y="70" transform="rotate(-40 485 70)" />

        <!-- Traditional Tanabata Paper Ornaments (Paper Ring Streamer & Origami) -->
        <!-- Origami Crane / Star on Left Branch -->
        <polygon points="260,110 270,95 285,110 270,125" fill="#fcd34d" opacity="0.85" />
        <!-- Origami Star on Right Branch -->
        <polygon points="710,165 720,150 735,165 720,180" fill="#f472b6" opacity="0.85" />
      </svg>

      <!-- Absolute Placed Interactive Tanzaku Wish Papers hanging by Strings -->
      <div
        v-for="(wish, idx) in wishes"
        :key="wish.id"
        class="absolute cursor-pointer transition-transform duration-300"
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
            class="w-[1.5px] h-6 sm:h-8"
            :style="{ backgroundColor: getColorClasses(wish.color).string }"
          />
          <!-- Knot Loop -->
          <div
            class="w-2.5 h-2.5 rounded-full border border-white/60 -mt-1 shadow-xs"
            :style="{ backgroundColor: getColorClasses(wish.color).string }"
          />
        </div>

        <!-- The Swaying Tanzaku Paper Strip -->
        <div
          class="relative w-20 sm:w-24 rounded-lg p-2.5 border text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
          :class="[
            getColorClasses(wish.color).bg,
            getColorClasses(wish.color).border,
            getColorClasses(wish.color).shadow,
            getSwayClass(idx)
          ]"
        >
          <!-- Top String Hole -->
          <div class="w-1.5 h-1.5 rounded-full bg-slate-900/20 mx-auto -mt-1 mb-1" />

          <!-- Category Icon / Tag -->
          <div class="text-[9px] font-bold tracking-tight opacity-75 truncate mb-1" :class="getColorClasses(wish.color).text">
            {{ wish.category.split(' ')[0] }}
          </div>

          <!-- Wish text preview (Thai / Japanese calligraphy feeling) -->
          <div class="min-h-[50px] sm:min-h-[60px] flex items-center justify-center">
            <p
              class="text-[10px] sm:text-[11px] font-medium leading-snug line-clamp-3 text-slate-800 break-words"
            >
              {{ wish.wish }}
            </p>
          </div>

          <!-- Wisher Author Name -->
          <div class="mt-1.5 pt-1 border-t border-slate-900/10 flex items-center justify-center gap-1">
            <span class="text-[9px] font-bold text-slate-700 truncate max-w-[65px]">
              {{ wish.author }}
            </span>
          </div>

          <!-- Bottom Ribbon Accent -->
          <div
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-md opacity-80"
            :class="getColorClasses(wish.color).ribbon"
          />

          <!-- Hover Hint Badge -->
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] whitespace-nowrap shadow-md z-30 pointer-events-none">
            <Eye class="w-3 h-3 text-pink-400" />
            <span>คลิกเพื่ออ่าน</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Canvas Note & Tips -->
    <div class="relative z-20 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-300">
      <div class="flex items-center gap-2">
        <Sparkles class="w-4 h-4 text-pink-400" />
        <span>🎋 ตามธรรมเนียมทานาบาตะ กระดาษ 5 สีสื่อถึงความปรารถนา ปัญญา ความซื่อสัตย์ และความเจริญรุ่งเรือง</span>
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
