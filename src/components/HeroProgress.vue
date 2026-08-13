<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Heart, Trophy, Users, Vote, Clock, Sparkles, ChevronRight } from 'lucide-vue-next';
import { CampaignData } from '../types';

const props = defineProps<{
  campaign: CampaignData;
  totalAmount: number;
  totalDonors: number;
}>();

const emit = defineEmits<{
  (e: 'openDonate'): void;
  (e: 'scrollToCalculator'): void;
  (e: 'scrollToWish'): void;
}>();

const percentage = computed(() =>
  Math.min(Math.round((props.totalAmount / props.campaign.targetGoal) * 100), 100)
);

const totalVotes = computed(() =>
  Math.floor(props.totalAmount / props.campaign.votePrice)
);

const addOnVotes = computed(() => 
  Math.floor(props.totalAmount / props.campaign.votePrice / 5) * 10
);

const gTotalVotes = computed(() =>
  totalVotes.value + addOnVotes.value + props.campaign.startToken
);

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: any = null;

const updateTimer = () => {
  const now = new Date().getTime();
  const target = new Date(props.campaign.deadline).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timeLeft.value = { days, hours, minutes, seconds };
};

onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl soft-pink-card p-6 sm:p-8">
    <div class="absolute -right-12 -top-12 w-48 h-48 bg-pink-100/60 rounded-full blur-2xl pointer-events-none" />
    <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-100/60 rounded-full blur-2xl pointer-events-none" />

    <div class="relative z-10">
      <!-- Top Tag & Status -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-200/80 text-xs font-semibold">
          <Sparkles class="w-3.5 h-3.5 text-pink-500" />
          <span>โครงการระดมทุนเลือกตั้ง</span>
        </div>

        <div class="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>เหลืออีก {{ timeLeft.days }} วัน {{ timeLeft.hours }} ชม. {{ timeLeft.minutes }} นาที {{ timeLeft.seconds }} วินาที</span>
        </div>
      </div>

      <!-- Campaign Heading -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight mb-2">
          {{ campaign.title }}
        </h2>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {{ campaign.subtitle }}  ในการเลือกตั้งทั้วไปครั้งที่ 6 (General Election 2026) #BNK48CGM48_GE2026 มาร่วมสร้างรอยยิ้มและนำพาน้องนีญ่าก้าวสู่ตำแหน่งที่น้องใฝ่ฝันด้วยกัน!
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          ทบ Token จากผู้สนับสนุน 3 กิจกรรม 191 x 5 = 955 | Niya Busking Fancam 75 x 10 = 150 | ดันคลิป Tiktok Niya มีรายการ 19 x 10 = 190 ผู้สนับสนุนทบให้อีก 190 = 380 รวม <span class="text-xs font-bold text-slate-800">{{ props.campaign.startToken.toLocaleString() }}</span> Tokens
        </p>
      </div>

      <!-- Progress Bar Container -->
      <div class="bg-slate-50 border border-pink-100/60 rounded-2xl p-4 sm:p-5 mb-6">
        <div class="flex items-end justify-between gap-2 mb-2">
          <div>
            <span class="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-0.5">
              ยอดระดมทุนสะสม
            </span>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl sm:text-4xl font-extrabold text-pink-600 font-heading">
                ฿{{ totalAmount.toLocaleString() }}
              </span>
              <span class="text-sm text-slate-400 font-medium">
                / ฿{{ campaign.targetGoal.toLocaleString() }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <span class="inline-block px-3 py-1 rounded-full bg-pink-500 text-white font-bold text-base font-heading shadow-xs">
              {{ percentage }}%
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-200/70 h-4 rounded-full overflow-hidden p-0.5 relative">
          <div
            class="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 rounded-full transition-all duration-1000 ease-out relative"
            :style="{ width: `${percentage}%` }"
          >
            <div class="absolute right-1 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500 mt-2">
          <span>เริ่มต้น 0 ฿</span>
          <span>เป้าหมาย ฿{{ campaign.targetGoal.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Stat Cards Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-pink-100 shadow-xs flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
            <Vote class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">คะแนนโหวตโดยประมาณ {{ totalVotes.toLocaleString() }} ทบ {{ addOnVotes.toLocaleString() }}</div>
            <div class="text-base sm:text-lg font-bold text-slate-800 font-heading">
              {{ gTotalVotes.toLocaleString() }} <span class="text-xs font-normal text-slate-500">Tokens</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-3.5 sm:p-4 border border-purple-100 shadow-xs flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <Users class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">จำนวนผู้ร่วมโดเนท</div>
            <div class="text-base sm:text-lg font-bold text-slate-800 font-heading">
              {{ totalDonors }} <span class="text-xs font-normal text-slate-500">คน</span>
            </div>
          </div>
        </div>

        <div class="col-span-2 sm:col-span-1 bg-white rounded-2xl p-3.5 sm:p-4 border border-blue-100 shadow-xs flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Trophy class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-slate-500 font-medium">เป้าหมายอันดับ</div>
            <div class="text-base sm:text-lg font-bold text-slate-800 font-heading">
              13th หรือ Senbatsu
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <button
          @click="emit('openDonate')"
          class="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Heart class="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          <span>ร่วมโดเนทเข้าโครงการ</span>
          <ChevronRight class="w-4 h-4 opacity-75" />
        </button>

        <!--
        <button
          @click="emit('scrollToCalculator')"
          class="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles class="w-4 h-4 text-pink-500" />
          <span>คำนวณของรางวัล</span>
        </button>-->

        <!--
        <button
          @click="emit('scrollToWish')"
          class="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-purple-200 text-slate-700 hover:text-purple-600 hover:bg-purple-50/50 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart class="w-4 h-4 text-purple-500" />
          <span>เขียนคำอวยพร</span>
        </button>-->
      </div>
    </div>
  </div>
</template>
