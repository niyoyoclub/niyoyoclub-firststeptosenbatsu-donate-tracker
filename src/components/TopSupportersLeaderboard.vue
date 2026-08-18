<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      
      <!-- Leaderboard Header -->
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
          แสดง Top Supports
        </p>
      </div>

      <!-- Top 3 Podium Cards -->
      <div v-if="topSupporters.length >= 3" class="grid grid-cols-3 gap-2 sm:gap-4 mb-6 items-end">
        
        <!-- 2nd Place -->
        <div class="bg-slate-50 border-2 border-[#1e293b] rounded-2xl p-2.5 sm:p-4 text-center shadow-[3px_3px_0px_#1e293b] relative order-1">
          <div class="w-7 h-7 sm:w-9 sm:h-9 bg-slate-300 text-slate-900 border border-[#1e293b] rounded-full font-black text-xs sm:text-sm flex items-center justify-center mx-auto mb-1.5 shadow-sm">
            🥈 2
          </div>
          <div class="text-xs sm:text-sm font-extrabold text-[#1e293b] truncate" :title="topSupporters[1].supporterName">
            {{ topSupporters[1].supporterName }}
          </div>
          <div class="text-xs sm:text-base font-extrabold text-emerald-600 font-mono mt-1">
            ฿{{ formatMoney(topSupporters[1].totalDonated) }}
          </div>
        </div>

        <!-- 1st Place (Gold) -->
        <div class="bg-amber-100 border-3 border-[#1e293b] rounded-2xl p-3 sm:p-5 text-center shadow-[4px_4px_0px_#1e293b] relative order-2 -translate-y-2">
          <div class="w-9 h-9 sm:w-11 sm:h-11 bg-amber-400 text-amber-950 border-2 border-[#1e293b] rounded-full font-black text-sm sm:text-base flex items-center justify-center mx-auto mb-2 shadow-md animate-bounce">
            🥇 1
          </div>
          <div class="text-sm sm:text-base font-black text-[#1e293b] truncate" :title="topSupporters[0].supporterName">
            {{ topSupporters[0].supporterName }}
          </div>
          <div class="text-sm sm:text-xl font-black text-emerald-700 font-mono mt-1">
            ฿{{ formatMoney(topSupporters[0].totalDonated) }}
          </div>
          <div class="text-[10px] text-amber-900 font-bold uppercase mt-0.5">TOP SUPPORTER</div>
        </div>

        <!-- 3rd Place -->
        <div class="bg-amber-50/80 border-2 border-[#1e293b] rounded-2xl p-2.5 sm:p-4 text-center shadow-[3px_3px_0px_#1e293b] relative order-3">
          <div class="w-7 h-7 sm:w-9 sm:h-9 bg-amber-700 text-amber-100 border border-[#1e293b] rounded-full font-black text-xs sm:text-sm flex items-center justify-center mx-auto mb-1.5 shadow-sm">
            🥉 3
          </div>
          <div class="text-xs sm:text-sm font-extrabold text-[#1e293b] truncate" :title="topSupporters[2].supporterName">
            {{ topSupporters[2].supporterName }}
          </div>
          <div class="text-xs sm:text-base font-extrabold text-emerald-600 font-mono mt-1">
            ฿{{ formatMoney(topSupporters[2].totalDonated) }}
          </div>
        </div>

      </div>

      <!-- Rest of Top Supporters List -->
      <div class="divide-y divide-slate-200">
        <div 
          v-for="item in topSupporters.slice(3, 10)" 
          :key="item.rank"
          class="py-2.5 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors rounded-xl"
        >
          <div class="flex items-center gap-3">
            <span class="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 font-bold text-xs text-slate-700 flex items-center justify-center font-mono">
              {{ item.rank }}
            </span>

            <div>
              <div class="text-xs sm:text-sm font-extrabold text-[#1e293b]">
                {{ item.supporterName }}
              </div>
              <div class="text-[10px] text-slate-400">
                สมทบ {{ item.transactionCount }} ครั้ง • ล่าสุด {{ item.lastDonated }}
              </div>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xs sm:text-sm font-extrabold text-emerald-600 font-mono">
              ฿{{ formatMoney(item.totalDonated) }}
            </div>
            <div class="text-[10px] text-slate-500 font-mono">
              {{ getPercentOfTotal(item.totalDonated) }}% จากยอดรวม
            </div>
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
