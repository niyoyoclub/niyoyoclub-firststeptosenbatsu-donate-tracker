<script setup lang="ts">
import { Award, Sparkles, Trophy, Heart } from 'lucide-vue-next';

const props = defineProps<{
  totalAmount: number;
}>();
</script>

<template>
  <!-- Tier Badges -->
  <span v-if="props.totalAmount >= 5000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
    <Sparkles class="w-3 h-3 text-purple-500" /> Diamond Fan
  </span>
  <span v-else-if="props.totalAmount >= 2000" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
    <Trophy class="w-3 h-3 text-yellow-500" /> Gold Fan
  </span>
  <span v-else-if="props.totalAmount >= 500" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">
    <Award class="w-3 h-3 text-green-500" /> Silver Fan
  </span>
  <span v-else class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
    <Heart class="w-3 h-3 text-pink-400" /> Fan
  </span>
</template>