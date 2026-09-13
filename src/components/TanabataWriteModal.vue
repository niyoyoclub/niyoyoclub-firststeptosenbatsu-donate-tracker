<script setup lang="ts">
import { ref, computed } from 'vue';
import { X, Sparkles, Send, Tag, Heart, Palette, Gem, Crown, Award, Coins } from 'lucide-vue-next';
import { TanabataWish, TanzakuColor } from '../types';
import { getBranchIndexFromAmount, getTierByBranchIndex, TANABATA_TIERS } from '../utils/tanabataTiers';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addWish', wish: TanabataWish): void;
}>();

const author = ref('');
const wishText = ref('');
const donationAmount = ref<number>(0);
const selectedColor = ref<TanzakuColor>('pink');
const category = ref('ความฝัน & เซ็มบัตสึ 🌟');
const pattern = ref<'cherry' | 'stars' | 'bamboo' | 'plain'>('cherry');
const isSuccess = ref(false);

const donationPresets = [
  { label: 'ทั่วไป (0฿)', value: 0, icon: '🎋' },
  { label: '50฿ (Fan >1฿)', value: 50, icon: '💖' },
  { label: '200฿ (Fan >100฿)', value: 200, icon: '🌸' },
  { label: '999฿ (Silver)', value: 999, icon: '✨' },
  { label: '2,500฿ (Gold)', value: 2500, icon: '👑' },
  { label: '5,555฿ (Diamond)', value: 5555, icon: '💎' }
];

const computedBranchIndex = computed(() => {
  return getBranchIndexFromAmount(donationAmount.value);
});

const currentTier = computed(() => {
  return getTierByBranchIndex(computedBranchIndex.value);
});

const colorOptions: { key: TanzakuColor; label: string; bg: string; border: string; text: string; hex: string }[] = [
  { key: 'pink', label: 'ชมพู (Sakura)', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-600', hex: '#f472b6' },
  { key: 'blue', label: 'ฟ้า (Amanogawa)', bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-600', hex: '#38bdf8' },
  { key: 'yellow', label: 'ทอง (Starlight)', bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-600', hex: '#f59e0b' },
  { key: 'green', label: 'เขียว (Bamboo)', bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-600', hex: '#10b981' },
  { key: 'purple', label: 'ม่วง (Twilight)', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-600', hex: '#a855f7' },
  { key: 'red', label: 'แดง (Aka)', bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-600', hex: '#f43f5e' }
];

const categoryOptions = [
  'ความฝัน & เซ็มบัตสึ 🌟',
  'สุขภาพ & ความแข็งแรง 🌿',
  'ความสุข & รอยยิ้ม 💖',
  'คำอธิษฐานถึงดวงดาว 🌌',
  'เป้าหมายโครงการ 🎯',
  'พรจากแฟนคลับ 🌸'
];

const presetTemplates = [
  'ขอให้นีย่าได้ติด Senbatsu สมดั่งความตั้งใจและส่องประกายสว่างไสวที่สุด! 🌟',
  'ขอให้นีย่ามีรอยยิ้มในทุกๆ วัน ทานข้าวอร่อย สุขภาพแข็งแรงเสมอ 💖',
  'ขอให้ความพยายามทั้งหมดของนีย่าผลิดอกออกผลสวยงาม พวกเราจะคอยซัพพอร์ตเสมอ! 🎋',
  'ขอให้ยอดโดเนททะลุเป้าหมาย พานีย่าไปสู่จุดที่ฝันไว้ด้วยกัน ✨'
];

const handleUsePreset = (template: string) => {
  wishText.value = template;
};

const handleSubmit = () => {
  if (!wishText.value.trim()) return;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

  const branchIndex = computedBranchIndex.value;
  const hangPositionPercent = Math.floor(Math.random() * 60) + 20;

  const newWish: TanabataWish = {
    id: `tb-${Date.now()}`,
    author: author.value.trim() || 'แฟนคลับผู้อธิษฐาน 🎋',
    wish: wishText.value.trim(),
    timestamp: formattedTime,
    color: selectedColor.value,
    category: category.value,
    branchIndex,
    donationAmount: donationAmount.value,
    hangPositionPercent,
    blessings: 1,
    pattern: pattern.value
  };

  emit('addWish', newWish);
  isSuccess.value = true;

  setTimeout(() => {
    isSuccess.value = false;
    author.value = '';
    wishText.value = '';
    donationAmount.value = 0;
    emit('close');
  }, 1600);
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-pink-100 max-h-[92vh] overflow-y-auto relative"
    >
      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Success State -->
      <div v-if="isSuccess" class="py-12 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Sparkles class="w-8 h-8 text-pink-500" />
        </div>
        <h3 class="text-xl font-bold text-slate-800 font-heading mb-2">
          ผูกคำอธิษฐานขึ้นกิ่งที่ {{ computedBranchIndex }} ({{ currentTier.name }}) แล้ว! 🎋
        </h3>
        <p class="text-sm text-slate-600">
          คำอธิษฐานของคุณกำลังโบกสะบัดไปตามสายลมเพื่อส่งพลังใจให้นีย่า ✨
        </p>
      </div>

      <!-- Form Content -->
      <div v-else>
        <!-- Modal Header -->
        <div class="flex items-center gap-2 mb-1">
          <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
            <Sparkles class="w-5 h-5" />
          </span>
          <h3 class="text-xl font-bold text-slate-900 font-heading">
            เขียนกระดาษทังซาขุ (Write a Tanabata Wish)
          </h3>
        </div>
        <p class="text-xs text-slate-500 mb-4 pl-9">
          เขียนความปรารถนาและส่งกำลังใจให้นีย่า เพื่อแขวนไว้บนกิ่งไผ่ทานาบาตะตามระดับผู้สนับสนุน
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Wisher's Name (Required Field 1) -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              1. ชื่อผู้เขียนคำอธิษฐาน (Wisher Name)
            </label>
            <input
              type="text"
              v-model="author"
              placeholder="เช่น น้องส้มส้ม, NiyaFC, หรือไม่ใส่เพื่อใช้นามแฝง"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-xs sm:text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <!-- Donation Amount Selector & Live Branch Tier Preview -->
          <div class="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-pink-50/40 to-purple-50/50 border border-amber-200/70 shadow-2xs">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Coins class="w-4 h-4 text-amber-500" />
                <span>ระบุยอดร่วมสนับสนุน / โดเนท (บาท)</span>
              </label>

              <!-- Live Tier Indicator Badge -->
              <span
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border shadow-2xs"
                :class="[
                  computedBranchIndex === 0 ? 'bg-amber-400 text-indigo-950 border-amber-300 font-black animate-pulse' :
                  computedBranchIndex === 1 ? 'bg-yellow-400 text-amber-950 border-yellow-300' :
                  computedBranchIndex === 2 ? 'bg-slate-300 text-slate-900 border-slate-400' :
                  computedBranchIndex === 3 ? 'bg-rose-400 text-white border-rose-300' :
                  computedBranchIndex === 4 ? 'bg-pink-400 text-white border-pink-300' :
                  'bg-stone-200 text-stone-800 border-stone-300'
                ]"
              >
                <span>{{ currentTier.icon }}</span>
                <span>กิ่ง {{ computedBranchIndex }}: {{ currentTier.name }}</span>
              </span>
            </div>

            <!-- Amount Input and Quick Preset Chips -->
            <div class="flex items-center gap-2 mb-2.5">
              <div class="relative flex-1">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">฿</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  v-model.number="donationAmount"
                  placeholder="0"
                  class="w-full pl-7 pr-3 py-2 rounded-xl border border-amber-300/80 bg-white font-bold text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <span class="text-xs text-slate-500 font-medium">บาท</span>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              <button
                v-for="p in donationPresets"
                :key="p.value"
                type="button"
                @click="donationAmount = p.value"
                class="py-1 px-1.5 rounded-lg border text-[10.5px] font-semibold flex items-center justify-center gap-0.5 transition-all cursor-pointer"
                :class="donationAmount === p.value ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-xs' : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200'"
              >
                <span>{{ p.icon }}</span>
                <span>{{ p.value > 0 ? `${p.value}฿` : '0฿' }}</span>
              </button>
            </div>

            <div class="mt-2 text-[10.5px] text-amber-900/80 flex items-center gap-1">
              <Sparkles class="w-3 h-3 text-amber-500 shrink-0" />
              <span>
                {{ currentTier.description }} (กระดาษอวยพรจะถูกจัดวางที่กิ่ง {{ computedBranchIndex }})
              </span>
            </div>
          </div>

          <!-- Color & Category Picker -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Palette class="w-3.5 h-3.5 text-pink-500" />
                <span>สีกระดาษทังซาขุ</span>
              </label>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="c in colorOptions"
                  :key="c.key"
                  type="button"
                  @click="selectedColor = c.key"
                  class="py-1.5 px-2 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  :class="[
                    selectedColor === c.key
                      ? `${c.bg} ${c.border} ring-2 ring-pink-300 font-bold shadow-xs`
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  ]"
                >
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: c.hex }" />
                  <span>{{ c.key }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag class="w-3.5 h-3.5 text-purple-500" />
                <span>หมวดหมู่คำอธิษฐาน</span>
              </label>
              <select
                v-model="category"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:border-pink-400 text-slate-700"
              >
                <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <!-- Wish Message (Required Field 2) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-700">
                2. คำอธิษฐานของคุณถึงนีย่า (Wish Message) *
              </label>
              <span class="text-[11px] text-slate-400">
                {{ wishText.length }} / 300
              </span>
            </div>
            <textarea
              required
              rows="3"
              maxlength="300"
              v-model="wishText"
              placeholder="พิมพ์คำอวยพรหรือความในใจที่คุณอยากส่งถึงดวงดาวเพื่อให้นีย่า..."
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-xs sm:text-sm text-slate-800 bg-slate-50/50 resize-none leading-relaxed"
            />
          </div>

          <!-- Preset Templates -->
          <div>
            <label class="block text-[11px] font-medium text-slate-500 mb-1.5">
              💡 ข้อความตัวอย่างด่วน (คลิกเพื่อเลือกใช้):
            </label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="(tpl, idx) in presetTemplates"
                :key="idx"
                type="button"
                @click="handleUsePreset(tpl)"
                class="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100/80 border border-pink-100 text-[11px] text-pink-700 text-left transition-colors cursor-pointer"
              >
                {{ tpl.substring(0, 32) }}...
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!wishText.trim()"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Send class="w-4 h-4" />
            <span>แขวนคำอธิษฐานบนกิ่งที่ {{ computedBranchIndex }} ({{ currentTier.name }}) 🎋</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
