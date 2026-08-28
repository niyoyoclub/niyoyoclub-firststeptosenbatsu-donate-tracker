<script setup lang="ts">
import { ref } from 'vue';
import { X, Sparkles, Heart, Clock, User, Share2, Check, Bell, Tag } from 'lucide-vue-next';
import { TanabataWish } from '../types';

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
  navigator.clipboard.writeText(`"${props.wish.wish}" — โดย ${props.wish.author} (Tanabata Wish for Niya 🎋)`);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

const getColorDetails = (color: string) => {
  switch (color) {
    case 'pink':
      return {
        bg: 'from-pink-100 via-rose-50 to-pink-200',
        border: 'border-pink-300',
        text: 'text-pink-900',
        badge: 'bg-pink-100 text-pink-700 border-pink-200',
        accent: '#f472b6',
        label: 'กระดาษสีชมพูซากุระ (Sakura Pink)'
      };
    case 'blue':
      return {
        bg: 'from-sky-100 via-blue-50 to-indigo-100',
        border: 'border-sky-300',
        text: 'text-sky-950',
        badge: 'bg-sky-100 text-sky-700 border-sky-200',
        accent: '#38bdf8',
        label: 'กระดาษสีฟ้าทางช้างเผือก (Amanogawa Blue)'
      };
    case 'yellow':
      return {
        bg: 'from-amber-100 via-yellow-50 to-amber-200',
        border: 'border-amber-300',
        text: 'text-amber-950',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        accent: '#f59e0b',
        label: 'กระดาษสีเหลืองประกายดาว (Starlight Gold)'
      };
    case 'green':
      return {
        bg: 'from-emerald-100 via-teal-50 to-emerald-200',
        border: 'border-emerald-300',
        text: 'text-emerald-950',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        accent: '#10b981',
        label: 'กระดาษสีเขียวใบไผ่ (Bamboo Mint)'
      };
    case 'purple':
      return {
        bg: 'from-purple-100 via-fuchsia-50 to-purple-200',
        border: 'border-purple-300',
        text: 'text-purple-950',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        accent: '#a855f7',
        label: 'กระดาษสีม่วงยามสนธยา (Twilight Violet)'
      };
    case 'red':
      return {
        bg: 'from-red-100 via-rose-50 to-red-200',
        border: 'border-red-300',
        text: 'text-red-950',
        badge: 'bg-red-100 text-red-800 border-red-200',
        accent: '#ef4444',
        label: 'กระดาษสีแดงมงคล (Aka Red)'
      };
    default:
      return {
        bg: 'from-pink-100 via-rose-50 to-pink-200',
        border: 'border-pink-300',
        text: 'text-pink-900',
        badge: 'bg-pink-100 text-pink-700 border-pink-200',
        accent: '#f472b6',
        label: 'กระดาษทังซาขุ (Tanzaku)'
      };
  }
};
</script>

<template>
  <div
    v-if="isOpen && wish"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md transition-all"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative overflow-hidden transform transition-all animate-float-gentle"
    >
      <!-- Background subtle Japanese pattern & gold foil specks -->
      <div class="absolute -right-16 -top-16 w-44 h-44 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 w-44 h-44 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors z-20 cursor-pointer"
        aria-label="Close"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Top Header Tag -->
      <div class="flex items-center gap-2 mb-4">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-200">
          <Sparkles class="w-3.5 h-3.5 text-pink-500" />
          <span>七夕短冊 (Tanabata Wish Paper)</span>
        </span>
        <span class="text-xs text-slate-400">
          {{ getColorDetails(wish.color).label }}
        </span>
      </div>

      <!-- Traditional Tanzaku Paper Card Container -->
      <div
        class="relative rounded-2xl p-6 sm:p-7 border-2 shadow-inner bg-gradient-to-b mb-5"
        :class="[getColorDetails(wish.color).bg, getColorDetails(wish.color).border]"
      >
        <!-- Top string loop visualization -->
        <div class="flex justify-center -mt-9 mb-4">
          <div class="w-4 h-7 border-2 border-red-400/80 rounded-full bg-red-500/20 shadow-xs" />
        </div>

        <!-- Gold Star Embellishment -->
        <div class="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-900/10">
          <div class="flex items-center gap-1.5 text-xs font-medium" :class="getColorDetails(wish.color).text">
            <Tag class="w-3.5 h-3.5 opacity-70" />
            <span>{{ wish.category }}</span>
          </div>

          <div class="text-[11px] font-medium opacity-75 flex items-center gap-1" :class="getColorDetails(wish.color).text">
            <Clock class="w-3.5 h-3.5" />
            <span>{{ wish.timestamp }}</span>
          </div>
        </div>

        <!-- Main Wish Text (The core required field) -->
        <div class="my-4">
          <p class="text-base sm:text-lg font-medium leading-relaxed font-sans text-slate-800 tracking-normal whitespace-pre-wrap">
            "{{ wish.wish }}"
          </p>
        </div>

        <!-- Author / Wisher Name (The core required field) -->
        <div class="mt-6 pt-3 border-t border-slate-900/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/80 border border-slate-200/80 shadow-2xs flex items-center justify-center text-xs font-bold text-slate-700">
              {{ wish.author.charAt(0) }}
            </div>
            <div>
              <div class="text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                ผู้เขียนคำอธิษฐาน
              </div>
              <div class="text-sm font-bold text-slate-900 font-heading">
                {{ wish.author }}
              </div>
            </div>
          </div>

          <!-- Blessings counter -->
          <div class="text-right">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 text-pink-600 text-xs font-bold shadow-2xs">
              <Heart class="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
              <span>{{ wish.blessings }} พร</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <!--
        <button
          @click="handleBless"
          class="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
        >
          <Bell class="w-4 h-4" :class="{ 'animate-bounce': isBlessedJustNow }" />
          <span>{{ isBlessedJustNow ? 'ส่งพลังใจ & สั่นกระดิ่งสำเร็จ! 🎋' : 'สั่นกระดิ่งร่วมอธิษฐาน (+1)' }}</span>
        </button>
        -->

        <button
          @click="handleCopyWish"
          class="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          title="คัดลอกคำอธิษฐาน"
        >
          <Check v-if="copied" class="w-4 h-4 text-green-600" />
          <Share2 v-else class="w-4 h-4" />
          <span class="hidden sm:inline">{{ copied ? 'คัดลอกแล้ว' : 'แชร์' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
