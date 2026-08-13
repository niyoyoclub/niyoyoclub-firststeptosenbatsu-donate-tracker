<script setup lang="ts">
import { ref, computed } from 'vue';
import { Gift, Heart, Star, Award, Crown, Check, ChevronRight } from 'lucide-vue-next';
import { RewardTier } from '../types';

const props = defineProps<{
  rewardTiers: RewardTier[];
}>();

const emit = defineEmits<{
  (e: 'openDonateWithAmount', amount: number): void;
}>();

const calcAmount = ref<number>(1000);

const nextTier = computed(() => {
  return props.rewardTiers.find((t) => calcAmount.value < t.minAmount);
});

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Heart': return Heart;
    case 'Star': return Star;
    case 'Award': return Award;
    case 'Crown': return Crown;
    default: return Gift;
  }
};
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card" id="reward-calculator">
    <div class="flex items-center gap-2 mb-1">
      <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
        <Gift class="w-5 h-5" />
      </span>
      <h3 class="text-xl font-bold text-slate-900 font-heading">
        คำนวณของรางวัล & สิทธิพิเศษ (Perk Tier Calculator)
      </h3>
    </div>
    <p class="text-xs text-slate-500 mb-6 pl-9">
      พิมพ์จำนวนเงินที่คุณต้องการร่วมโดเนท เพื่อดูรายการของที่ระลึกทั้งหมดที่จะได้รับ
    </p>

    <!-- Calculator Input Box -->
    <div class="bg-gradient-to-r from-pink-50/60 to-purple-50/60 p-5 rounded-2xl border border-pink-100 mb-6">
      <label class="block text-xs font-semibold text-slate-700 mb-2">
        ทดลองใส่ยอดโดเนทของคุณ (บาท)
      </label>

      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div class="relative w-full sm:flex-1">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-pink-500 text-lg font-heading">
            ฿
          </span>
          <input
            type="number"
            min="1"
            v-model.number="calcAmount"
            class="w-full pl-10 pr-4 py-3 rounded-2xl border border-pink-200 focus:outline-none focus:border-pink-400 font-extrabold text-xl text-slate-800 bg-white shadow-xs"
          />
        </div>

        <button
          @click="emit('openDonateWithAmount', calcAmount)"
          class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-colors shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>โดเนทตามยอดนี้ (฿{{ (calcAmount || 0).toLocaleString() }})</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <p v-if="nextTier" class="text-xs text-slate-500 mt-2 font-medium">
        💡 อีกเพียง <span class="font-bold text-pink-600">฿{{ (nextTier.minAmount - (calcAmount || 0)).toLocaleString() }}</span> เพื่อปลดล็อกระดับขั้นถัดไป (<span class="font-semibold text-slate-700">{{ nextTier.title }}</span>)!
      </p>
    </div>

    <!-- Tier Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="tier in rewardTiers"
        :key="tier.title"
        class="p-5 rounded-2xl border transition-all"
        :class="[
          (calcAmount || 0) >= tier.minAmount
            ? 'bg-white border-pink-300 shadow-sm ring-1 ring-pink-100'
            : 'bg-slate-50/60 border-slate-200/80 opacity-60'
        ]"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="p-2 rounded-xl" :class="tier.badgeColor">
              <component :is="getIcon(tier.iconName)" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm font-heading">{{ tier.title }}</h4>
              <span class="text-xs text-slate-500">ขั้นต่ำ ฿{{ tier.minAmount.toLocaleString() }}</span>
            </div>
          </div>

          <span v-if="(calcAmount || 0) >= tier.minAmount" class="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 font-bold text-xs flex items-center gap-1">
            <Check class="w-3.5 h-3.5 text-pink-600" /> ปลดล็อกแล้ว!
          </span>
        </div>

        <ul class="space-y-2 mt-3 pt-3 border-t border-slate-100">
          <li v-for="(perk, i) in tier.perks" :key="i" class="text-xs text-slate-600 flex items-start gap-2">
            <span
              class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              :class="[(calcAmount || 0) >= tier.minAmount ? 'bg-pink-100 text-pink-600' : 'bg-slate-200 text-slate-500']"
            >
              ✓
            </span>
            <span>{{ perk }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
