<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Heart, Trophy, Users, Vote, Clock, Sparkles, ChevronRight } from 'lucide-vue-next';
import { CampaignData, Milestone } from '../types';
import img1 from '/assets/niya_profile.png';
import img2 from '/assets/niya_profile_2.jpg';

const props = defineProps<{
  campaign: CampaignData;
  milestones: Milestone[];
  totalAmount: number;
  totalDonors: number;
}>();

const emit = defineEmits<{
  (e: 'openDonate'): void;
  (e: 'scrollToCalculator'): void;
  (e: 'scrollToWish'): void;
  (e: 'openChatOpen'): void;
}>();

const percentage = computed(() =>
  Math.min(Math.round((props.totalAmount / props.campaign.targetGoal) * 100), 100)
);

const totalVotes = computed(() =>
  Math.floor(props.totalAmount / props.campaign.votePrice)
);

function findMatchMilestoneTokenBonus(amt:number) {
  for (let i = props.milestones.length - 1; i >= 0; i--) {
    if (amt >= props.milestones[i].amount) {
      props.campaign.currentBonusToken = props.milestones[i].tokenBonus;
      return props.milestones[i].tokenBonus;
    }
  }

  props.campaign.currentBonusToken = 0;
  return 0;
};

const addOnVotes = computed(() => {
  let result = Math.floor(props.totalAmount / props.campaign.votePrice / 5) * 10;
  
  if (result > props.campaign.maxAddonToken) {
    result = props.campaign.maxAddonToken;
  }

  return result;
});

const gTotalVotes = computed(() =>
  totalVotes.value
   + addOnVotes.value
   + props.campaign.startToken
   + findMatchMilestoneTokenBonus(props.totalAmount)
);

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const timeVoteLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
let timerInterval: any = null;

const updateTimer = () => {
  const now = new Date().getTime();
  let target = new Date(props.campaign.deadline).getTime();
  let diff = Math.max(0, target - now);

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timeLeft.value = { days, hours, minutes, seconds };

  target = new Date(props.campaign.endVote).getTime();
  diff = Math.max(0, target - now);

  days = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds = Math.floor((diff % (1000 * 60)) / 1000);

  timeVoteLeft.value = { days, hours, minutes, seconds };
};

onMounted(() => {
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
  startSlide();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  stopSlide();
});

// 1. กำหนดรายการรูปภาพที่ต้องการนำมาแสดงสไลด์
const images = ref([
  img1,
  img2
])

const currentIndex = ref(0)
let timer = null

// 2. ตั้งเวลาสลับรูปภาพ (หน่วยเป็นมิลลิวินาที เช่น 5000 = 5 วินาที)
const SLIDE_INTERVAL = 5000

const startSlide = () => {
  if (images.value.length <= 1) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }, SLIDE_INTERVAL)
}

const stopSlide = () => {
  if (timer) clearInterval(timer)
}

const setCurrentIndex = (index) => {
  currentIndex.value = index
  // รีเซ็ต Timer เมื่อผู้ใช้คลิกเลือกรูปเอง
  stopSlide()
  startSlide()
}
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
          <span>โครงการระดมทุนเลือกตั้งเพื่อ {{ campaign.candidateName }}</span>
        </div>

        <div v-if="timeLeft.seconds > 0" class="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>เริ่มโหวตในอีก {{ timeLeft.days }} วัน {{ timeLeft.hours }} ชม. {{ timeLeft.minutes }} นาที {{ timeLeft.seconds }} วินาที</span>
        </div>
        <div v-else class="flex items-center gap-1.5 text-xs text-slate-500 bg-yellow-50 px-3 py-1 rounded-full border border-slate-100">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>เริ่มโหวตแล้ว</span>
        </div>
        <div v-if="timeVoteLeft.seconds > 0" class="flex items-center gap-1.5 text-xs text-slate-500 bg-red-50 px-3 py-1 rounded-full border border-slate-100">
          <Clock class="w-3.5 h-3.5 text-slate-400" />          
          <span>ปิดการโหวตในอีก {{ timeVoteLeft.days }} วัน {{ timeVoteLeft.hours }} ชม. {{ timeVoteLeft.minutes }} นาที {{ timeVoteLeft.seconds }} วินาที</span>
        </div>
        <div v-else class="flex items-center gap-1.5 text-xs text-slate-500 bg-red-200 px-3 py-1 rounded-full border border-slate-100">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>ปิดโหวตแล้ว</span>
        </div>
      </div>

      <!-- Campaign Heading -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <!-- Column 1: ข้อความรายละเอียด -->
      <div class="space-y-3">
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight">
          {{ campaign.title }}
        </h2>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {{ campaign.subtitle }} ในการเลือกตั้งทั้วไปครั้งที่ 6 (General Election 2026) #BNK48CGM48_GE2026 มาร่วมสร้างรอยยิ้มและนำพาน้องนีญ่าก้าวสู่ตำแหน่งที่น้องใฝ่ฝันด้วยกัน!
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          <span class="font-bold">กิจกรรมที่ 1</span>
          บ้านใหม่น้องนีญ่า ทบ token ตามจำนวนสมาชิกใน open chat x 5 สิ้นสุดวันที่ 30 Jun 2026 23:59 น. มีจำนวนสมาชิก 191 คน ได้ 191 x 5 = 955 Tokens
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          <span class="font-bold">กิจกรรมที่ 2</span>
          ส่งลิ้งค์แฟนแคมน้องนีญ่า จำนวนลิ้งค์ 75 ลิ้งค์ ทบลิ้งค์ละ 10 Tokens สิ้นสุด 31 Jul 26 20:00 ได้ 75 x 10 = 750 Tokens
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          <span class="font-bold">กิจกรรมที่ 3</span>
          ดันคลิป Tiktok น้องนีญ่า จำนวนลิ้งค์ 19 รายการ ทบรายการละ 10 Tokens สิ้นสุด 10 Aug 26 18:00 ได้ 19 x 10 = 190 Tokens ผู้สนับสนุนทบให้อีก 190 Tokens = 380 Tokens
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          <span class="font-bold">จากกิจกรรม 3 ผู้สนับสนุนทบ Token รวม {{ props.campaign.startToken.toLocaleString() }} Tokens</span>
        </p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">          
          และ ทุกๆ การซื้อ 5 Tokens ผู้สนับสนุนจะทบให้อีก 10 Tokens ทบสูงสุด 6,000 Tokens
        </p>
      </div>

      <!-- Column 2: Image Carousel Slider -->
      <div class="relative w-full h-150 sm:h-150 overflow-hidden rounded-2xl shadow-md group">
        <!-- รูปภาพพร้อม Effect Fade Transition -->
        <transition-group name="fade" tag="div" class="w-full h-full relative">
          <div 
            v-for="(img, index) in images" 
            :key="img"
            v-show="currentIndex === index"
            class="absolute inset-0 w-full h-full"
          >
            <img 
              :src="img" 
              alt="Campaign Image" 
              class="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </transition-group>

        <!-- จุดบอกตำแหน่งรูปภาพ (Indicators) -->
        <div v-if="images.length > 1" class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          <button
            v-for="(_, index) in images"
            :key="index"
            @click="setCurrentIndex(index)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>
      </div>
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
            <div class="text-xs text-slate-500 font-medium">คะแนนโหวตโดยประมาณ {{ totalVotes.toLocaleString() }} ทบ {{ addOnVotes.toLocaleString() }} โบนัส {{ props.campaign.currentBonusToken.toLocaleString() }}</div>
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
      <!--
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <div>
          <button
            @click="emit('openChatOpen')"
            class="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart class="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>เข้าร่วมชุมชน</span>
            <ChevronRight class="w-4 h-4 opacity-75" />
          </button>
          <div class="flex justify-center items-center">
            <img
              src="/assets/opc_qr_code.jpg"
              alt="Open Chat QR Code"
              class="w-50 h-50 sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <button
            @click="emit('openDonate')"
            class="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart class="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>แจ้งการโดเนทเข้าโครงการ</span>
            <ChevronRight class="w-4 h-4 opacity-75" />
          </button>
          <div class="flex justify-center items-center">
            <img
              src="/assets/bank_qr_code.jpg"
              alt="Bank QR Code"
              class="w-50 h-50 sm:w-auto px-5 py-3.5 rounded-2xl bg-white border border-pink-200 text-slate-700 hover:text-pink-600 hover:bg-pink-50/50 transition-all text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            />
          </div>
        </div>
-->
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
      <!--
      </div>
      -->
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        <!-- Column 1: Open Chat -->
        <div class="flex flex-col items-center justify-center gap-3 w-full">
          <button
            @click="emit('openChatOpen')"
            class="w-full max-w-xs px-6 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart class="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>เข้าร่วมชุมชน</span>
            <ChevronRight class="w-4 h-4 opacity-75" />
          </button>
          <img
            src="/assets/opc_qr_code.jpg"
            alt="Open Chat QR Code"
            class="w-48 h-48 object-contain rounded-2xl bg-white border border-pink-200 p-2 shadow-xs"
          />
          <div class="justify-center items-center text-center text-xs text-slate-500 font-medium">
            <span class="text-rose-500" >ติดตามข่าวสาร อัพเดทล่าสุด ของ</span><br/>
            <span class="text-rose-600">{{ campaign.candidateName }}</span><br/>
            <span class="text-rose-700">{{ campaign.title }}</span>
          </div>
        </div>

        <!-- Column 2: Donation -->
        <div class="flex flex-col items-center justify-center gap-3 w-full">
          <button
            @click="emit('openDonate')"
            class="w-full max-w-xs px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart class="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>แจ้งการโดเนท (ส่งสลิป)</span>
            <ChevronRight class="w-4 h-4 opacity-75" />
          </button>
          <img
            src="/assets/bank_qr_code.jpg"
            alt="Bank QR Code"
            class="w-48 h-48 object-contain rounded-2xl bg-white border border-pink-200 p-2 shadow-xs"
          />
          <div class="justify-center items-center text-center text-xs text-slate-500 font-medium">
            <span class="text-green-500 font-bold" >{{ campaign.bankName }}</span><br/>
            <span class="text-green-600 font-bold">{{ campaign.bankAccountName }}</span><br/>
            <span class="text-green-800 font-bold">{{ campaign.bankAccountNumber }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>