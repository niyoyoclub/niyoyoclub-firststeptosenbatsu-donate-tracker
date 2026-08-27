<script setup lang="ts">
import { ref, computed } from 'vue';
import { Sparkles, Heart, Plus, Search, Filter, Wind, Bell, Clock, User, Compass } from 'lucide-vue-next';
import { TanabataWish, CampaignData, TanzakuColor } from '../types';
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
}>();

const selectedWish = ref<TanabataWish | null>(null);
const isInspectOpen = ref(false);
const isWriteOpen = ref(false);

const searchQuery = ref('');
const selectedCategory = ref('All');
const selectedColorFilter = ref<'All' | TanzakuColor>('All');

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
    if (selectedColorFilter.value !== 'All' && w.color !== selectedColorFilter.value) return false;
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
</script>

<template>
  <div class="space-y-8 sm:space-y-10">
    <!-- Top Hero Banner for Tanabata Festival -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 sm:p-10 shadow-xl border border-indigo-800/40">
      <!-- Decorative background stars and aura -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles class="w-4 h-4 text-pink-300" />
          <span>七夕祭り • Tanabata Festival 2026</span>
        </div>

        <h2 class="text-2xl sm:text-4xl font-bold font-heading tracking-tight mb-3 text-white leading-tight">
          ลานอธิษฐานทานาบาตะเพื่อ {{ campaign.candidateName }} 🎋
        </h2>

        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
          เทศกาลแห่งดวงดาวโอริฮิเมะและฮิโกโบชิ ร่วมผูกกระดาษทังซาขุ (Tanzaku) บนกิ่งไผ่
          ส่งแรงใจและความปรารถนาให้ลอยไปตามสายลม พานีย่าก้าวสู่ Senbatsu อย่างงดงาม ✨
        </p>

        <div class="flex flex-wrap items-center gap-3">
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
            @click="emit('navigateToDonation')"
            class="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Heart class="w-4 h-4 text-pink-400 fill-pink-400" />
            <span>กลับสู่หน้าโดเนท</span>
          </button>
        </div>
      </div>
    </div>

    <!-- The Interactive Bamboo Tree (ต้นไผ่และกระดาษคำอธิษฐานปลิวไหวตามลม) -->
    <TanabataBambooTree
      :wishes="wishes"
      @selectWish="openInspect"
      @openWriteModal="isWriteOpen = true"
    />

    <!-- Cultural Guide: Meanings of 5 Colors Tanzaku -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 soft-purple-card">
      <div class="flex items-center gap-2 mb-1">
        <span class="p-2 rounded-xl bg-purple-50 text-purple-500">
          <Sparkles class="w-5 h-5" />
        </span>
        <h3 class="text-xl font-bold text-slate-900 font-heading">
          ความหมายของสีกระดาษทังซาขุทั้ง 5 (Five Colors of Tanabata)
        </h3>
      </div>
      <p class="text-xs text-slate-500 mb-6 pl-9">
        ประเพณีโบราณอิงตามธาตุทั้ง 5 เลือกสีที่ตรงกับความตั้งใจของคุณ
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div
          v-for="item in colorMeanings"
          :key="item.name"
          class="p-4 rounded-2xl border transition-all flex items-start gap-3"
          :class="item.bg"
        >
          <div class="w-3.5 h-3.5 rounded-full mt-1 shrink-0 shadow-xs border border-white" />
          <div>
            <h4 class="font-bold text-xs font-heading">{{ item.name }}</h4>
            <p class="text-xs opacity-90 mt-0.5">{{ item.meaning }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- All Wishes Gallery / Search & Filter Section -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
              <Heart class="w-5 h-5 fill-pink-500/20" />
            </span>
            <h3 class="text-xl font-bold text-slate-900 font-heading">
              รวมคำอธิษฐานบนต้นไผ่ทั้งหมด (All Tanzaku Wishes)
            </h3>
          </div>
          <p class="text-xs text-slate-500 pl-9">
            คลิกที่การ์ดเพื่อขยายดูชื่อผู้เขียน คำอธิษฐาน และเวลาที่บันทึก
          </p>
        </div>

        <!-- Search input -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div class="relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาชื่อผู้เขียน / คำอธิษฐาน..."
              class="pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-300 text-xs w-full sm:w-56 bg-slate-50/50"
            />
          </div>
          <!-- disable
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

      <!-- Wishes Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="w in filteredWishes"
          :key="w.id"
          @click="openInspect(w)"
          class="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
          :class="[
            w.color === 'pink' ? 'bg-pink-50/50 border-pink-200 hover:border-pink-300' :
            w.color === 'blue' ? 'bg-sky-50/50 border-sky-200 hover:border-sky-300' :
            w.color === 'yellow' ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300' :
            w.color === 'green' ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300' :
            w.color === 'purple' ? 'bg-purple-50/50 border-purple-200 hover:border-purple-300' :
            'bg-rose-50/50 border-rose-200 hover:border-rose-300'
          ]"
        >
          <div>
            <!-- Top Tag & Time -->
            <div class="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-900/5">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 text-slate-700 shadow-2xs">
                {{ w.category }}
              </span>

              <div class="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Clock class="w-3 h-3" />
                <span>{{ w.timestamp }}</span>
              </div>
            </div>

            <!-- Wish Text -->
            <p class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium my-2 line-clamp-4">
              "{{ w.wish }}"
            </p>
          </div>

          <!-- Bottom: Author Name & Blessings (3 Core Requirements shown) -->
          <div class="mt-4 pt-3 border-t border-slate-900/5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-700 shadow-2xs border border-slate-200/60">
                {{ w.author.charAt(0) }}
              </div>
              <span class="text-xs font-bold text-slate-800 font-heading">
                {{ w.author }}
              </span>
            </div>

            <div class="flex items-center gap-1 text-xs text-pink-600 font-semibold group-hover:scale-105 transition-transform">
              <Heart class="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
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
