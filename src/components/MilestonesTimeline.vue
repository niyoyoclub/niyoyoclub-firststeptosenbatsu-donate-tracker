<script setup lang="ts">
import { Tv, Coffee, Sparkles, Trophy, CheckCircle2, Lock } from 'lucide-vue-next';
import { Milestone } from '../types';

defineProps<{
  milestones: Milestone[];
  currentTotal: number;
}>();

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Tv': return Tv;
    case 'Coffee': return Coffee;
    case 'Sparkles': return Sparkles;
    case 'Trophy': return Trophy;
    default: return Sparkles;
  }
};
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-purple-card">
    <div class="flex items-center gap-2 mb-1">
      <span class="p-2 rounded-xl bg-purple-50 text-purple-500">
        <Sparkles class="w-5 h-5" />
      </span>
      <h3 class="text-xl font-bold text-slate-900 font-heading">
        ไมล์สโตน & ปลดล็อกเป้าหมาย (Campaign Milestones)
      </h3>
    </div>
    <p class="text-xs text-slate-500 mb-6 pl-9">
      เป้าหมายกิจกรรมโปรโมตและสิทธิพิเศษเมื่อระดมทุนครบแต่ละขั้น
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="m in milestones"
        :key="m.id"
        class="p-5 rounded-2xl border transition-all"
        :class="[
          currentTotal >= m.amount
            ? 'bg-purple-50/40 border-purple-200/80 shadow-2xs'
            : 'bg-slate-50/50 border-slate-100 opacity-80'
        ]"
      >
        <div class="flex items-start justify-between gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              :class="[
                currentTotal >= m.amount
                  ? 'bg-purple-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-500'
              ]"
            >
              <component :is="getIcon(m.icon)" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm font-heading">{{ m.title }}</h4>
              <p class="text-xs text-slate-500 mt-0.5">{{ m.description }}</p>
            </div>
          </div>

          <span
            v-if="currentTotal >= m.amount"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 shrink-0"
          >
            <CheckCircle2 class="w-3.5 h-3.5 text-green-600" />
            <span>ปลดล็อกแล้ว!</span>
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-600 shrink-0"
          >
            <Lock class="w-3.5 h-3.5 text-slate-500" />
            <span>กำลังสะสม</span>
          </span>
        </div>

        <!-- Progress Bar for Milestone -->
        <div class="mt-3">
          <div class="flex justify-between items-center text-[11px] font-medium text-slate-500 mb-1">
            <span>เป้าหมาย ฿{{ m.amount.toLocaleString() }}</span>
            <span :class="{ 'text-purple-600 font-bold': currentTotal >= m.amount }">
              {{ Math.min(Math.round((currentTotal / m.amount) * 100), 100) }}%
            </span>
          </div>
          <div class="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="[currentTotal >= m.amount ? 'bg-purple-500' : 'bg-slate-400']"
              :style="{ width: `${Math.min(Math.round((currentTotal / m.amount) * 100), 100)}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
