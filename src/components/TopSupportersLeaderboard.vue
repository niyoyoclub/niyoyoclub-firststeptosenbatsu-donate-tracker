<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
            <Trophy class="w-5 h-5" />
          </span>
          <h3 class="text-xl font-bold text-slate-900 font-heading">
            ตารางอันดับ Top Supporters
          </h3>
        </div>
        <p class="text-xs text-slate-500 pl-9">
          แสดงรายชื่อผู้สนับสนุนยอดรวมสูงสุด 10 อันดับ
        </p>
      </div>
    </div>

    <!-- Top 3 Podium Cards -->
    <div v-if="topSupporters.length >= 3" class="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6 items-end">
      
      <!-- 2nd Place -->
      <div class="bg-slate-50/80 hover:bg-pink-50/30 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center transition-all order-1">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center mx-auto mb-2 shadow-2xs">
          🥈
        </div>
        <div class="text-xs sm:text-sm font-bold text-slate-800 font-heading truncate" :title="topSupporters[1].supporterName">
          {{ topSupporters[1].supporterName }}
        </div>
        <div class="text-xs sm:text-sm font-bold text-pink-600 font-mono mt-0.5">
          ฿{{ formatMoney(topSupporters[1].totalDonated) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5 font-medium">อันดับ 2 ( {{ getPercentOfTotal(topSupporters[1].totalDonated) }}% )</div>
      </div>

      <!-- 1st Place (Highlight) -->
      <div class="bg-pink-50/70 border-2 border-pink-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs relative order-2 -translate-y-2">
        <span class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
          TOP SUPPORTER
        </span>
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-pink-200 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center mx-auto mb-2 shadow-xs">
          🥇
        </div>
        <div class="text-sm sm:text-base font-bold text-slate-900 font-heading truncate" :title="topSupporters[0].supporterName">
          {{ topSupporters[0].supporterName }}
        </div>
        <div class="text-sm sm:text-lg font-bold text-pink-600 font-mono mt-0.5">
          ฿{{ formatMoney(topSupporters[0].totalDonated) }}
        </div>
        <div class="text-[10px] text-pink-600/80 font-semibold mt-0.5">อันดับ 1 ( {{ getPercentOfTotal(topSupporters[0].totalDonated) }}% )</div>
      </div>

      <!-- 3rd Place -->
      <div class="bg-slate-50/80 hover:bg-pink-50/30 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-center transition-all order-3">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center mx-auto mb-2 shadow-2xs">
          🥉
        </div>
        <div class="text-xs sm:text-sm font-bold text-slate-800 font-heading truncate" :title="topSupporters[2].supporterName">
          {{ topSupporters[2].supporterName }}
        </div>
        <div class="text-xs sm:text-sm font-bold text-pink-600 font-mono mt-0.5">
          ฿{{ formatMoney(topSupporters[2].totalDonated) }}
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5 font-medium">อันดับ 3 ( {{ getPercentOfTotal(topSupporters[2].totalDonated) }}% )</div>        
      </div>

    </div>

    <!-- Rest of Top Supporters List (Rank 4-10) -->
    <div class="space-y-2">
      <div 
        v-for="item in topSupporters.slice(3, 10)" 
        :key="item.rank"
        class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 hover:bg-pink-50/40 border border-slate-100 hover:border-pink-200/80 transition-all"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 font-bold text-xs text-slate-600 shadow-2xs">
            #{{ item.rank }}
          </div>

          <div>
            <div class="text-xs sm:text-sm font-bold text-slate-800 font-heading">
              {{ item.supporterName }}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">
              สมทบ {{ item.transactionCount }} ครั้ง • ล่าสุด {{ item.lastDonated }}
            </div>
          </div>
        </div>

        <div class="text-right shrink-0">
          <div class="text-xs sm:text-sm font-bold text-pink-600 font-mono">
            ฿{{ formatMoney(item.totalDonated) }}
          </div>
          <div class="text-[10px] text-slate-400 font-medium mt-0.5">
            {{ getPercentOfTotal(item.totalDonated) }}% จากยอดรวม
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Trophy } from 'lucide-vue-next';
import { Donation } from '../types';

const props = defineProps<{  
  donations: Donation[];  
  totalAmount: number;
}>();

const topSupporters = computed(() => {   
  const map = new Map<string, { total: number; count: number; lastDate: string; name: string }>();

  for (const t of props.donations) {
    if (t.verified !== true) continue;
    const name = t.donorName.trim();
    const key = name.toLowerCase();

    if (!map.has(key)) {
      map.set(key, { total: t.amount, count: 1, lastDate: t.timestamp, name });
    } else {
      const item = map.get(key)!;
      item.total += t.amount;
      item.count += 1;
      if (new Date(t.timestamp) > new Date(item.lastDate)) {
        item.lastDate = t.timestamp;
      }
    }
  }

  const sorted = Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .map((item, index) => ({
      supporterName: item.name,
      totalDonated: item.total,
      transactionCount: item.count,
      lastDonated: item.lastDate,
      rank: index + 1,
    }));

  return sorted;
});

function formatMoney(val: number): string {
  return new Intl.NumberFormat('th-TH').format(val);
}

function getPercentOfTotal(amount: number): string {
  if (props.totalAmount <= 0) return '0';
  return ((amount / props.totalAmount) * 100).toFixed(1);
}
</script>
