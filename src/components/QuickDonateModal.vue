<script setup lang="ts">
import { ref } from 'vue';
import { X, Copy, Check, QrCode, Heart, ShieldCheck, CreditCard, Upload } from 'lucide-vue-next';
import { CampaignData, Donation } from '../types';

const props = defineProps<{
  isOpen: boolean;
  campaign: CampaignData;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addDonation', donation: Donation): void;
}>();

const amount = ref<number>(68);
const donorName = ref('');
const note = ref('');
const isAnonymous = ref(false);
const isSubmitted = ref(false);
const copiedAccount = ref(false);
const copiedPromptpay = ref(false);
const slipFileName = ref<string | null>(null);

const presetAmounts = [50, 68, 100, 136, 340, 500, 680, 1000];

const handleCopyAccount = () => {
  navigator.clipboard.writeText(props.campaign.bankAccountNumber);
  copiedAccount.value = true;
  setTimeout(() => { copiedAccount.value = false; }, 2000);
};

const handleCopyPromptpay = () => {
  navigator.clipboard.writeText(props.campaign.promptPayNumber.replace(/-/g, ''));
  copiedPromptpay.value = true;
  setTimeout(() => { copiedPromptpay.value = false; }, 2000);
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    slipFileName.value = target.files[0].name;
  }
};

const handleSubmit = () => {
  if (!amount.value || amount.value <= 0) return;

  let tier: 'tier-normal' | 'tier-silver' | 'tier-gold' | 'tier-diamond' = 'tier-normal';
  if (amount.value >= 5000) tier = 'tier-diamond';
  else if (amount.value >= 2000) tier = 'tier-gold';
  else if (amount.value >= 500) tier = 'tier-silver';

  const newDonation: Donation = {
    id: `don-${Date.now()}`,
    donorName: isAnonymous.value ? 'ผู้ไม่ประสงค์ออกนาม' : (donorName.value.trim() || 'แฟนคลับผู้ใจดี'),
    amount: Number(amount.value),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    note: note.value.trim() || undefined,
    isAnonymous: isAnonymous.value,
    tier,
    verified: true
  };

  emit('addDonation', newDonation);
  isSubmitted.value = true;

  setTimeout(() => {
    isSubmitted.value = false;
    donorName.value = '';
    note.value = '';
    isAnonymous.value = false;
    slipFileName.value = null;
    emit('close');
  }, 1800);
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto relative">
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <X class="w-5 h-5" />
      </button>

      <div v-if="isSubmitted" class="py-12 text-center flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Heart class="w-8 h-8 fill-pink-500" />
        </div>
        <h3 class="text-xl font-bold text-slate-800 font-heading mb-2">ขอบคุณสำหรับการโดเนท! 💖</h3>
        <p class="text-sm text-slate-600">
          ยอดโดเนทจำนวน <span class="font-bold text-pink-600">฿{{ amount.toLocaleString() }}</span> ได้ถูกนำเข้าสู่ระบบเรียบร้อยแล้ว
        </p>
      </div>

      <div v-else>
        <div class="flex items-center gap-2 mb-1">
          <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
            <Heart class="w-5 h-5 fill-pink-500/20" />
          </span>
          <h3 class="text-xl font-bold text-slate-900 font-heading">
            ร่วมโดเนทเพื่อ {{ campaign.candidateName }}
          </h3>
        </div>
        <p class="text-xs text-slate-500 mb-6 pl-9">
          ช่องทางโอนเงินอย่างเป็นทางการของโครงการ
        </p>

        <!-- Payment Info -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-3">
          <!-- PromptPay -->
          <!--<div class="flex items-center justify-between p-3 bg-white rounded-xl border border-pink-100/70">
            <div>
              <div class="text-xs text-slate-400 font-medium flex items-center gap-1">
                <QrCode class="w-3.5 h-3.5 text-pink-500" />
                <span>พร้อมเพย์ (PromptPay)</span>
              </div>
              <div class="text-base font-bold text-slate-800 font-heading">
                {{ campaign.promptPayNumber }}
              </div>
            </div>
            <button
              @click="handleCopyPromptpay"
              class="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check v-if="copiedPromptpay" class="w-3.5 h-3.5 text-green-600" />
              <Copy v-else class="w-3.5 h-3.5" />
              <span>{{ copiedPromptpay ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
            </button>
          </div>-->

          <!-- Bank Account -->
          <div class="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <!-- Header: Bank Name -->
            <div class="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-400">
              <CreditCard class="w-4 h-4 text-purple-500" />
              <span>{{ campaign.bankName }}</span>
            </div>

            <!-- Main Content -->
            <div class="flex items-center justify-between gap-3">
              <!-- Left: Account Details -->
              <div class="space-y-0.5 min-w-0">
                <div class="text-base font-bold text-slate-800 font-heading tracking-wide truncate">
                  {{ campaign.bankAccountNumber }}
                </div>
                <div class="text-xs text-slate-500 truncate">
                  {{ campaign.bankAccountName }}
                </div>
              </div>

              <!-- Right: QR Code & Copy Button Group -->
              <div class="flex items-center gap-2.5 shrink-0">
                <img
                  src="/assets/bank_qr_code.jpg"
                  alt="Bank QR Code"
                  class="w-20 h-20 rounded-lg object-cover border border-slate-200/60 shadow-xs"
                />
                <button
                  @click="handleCopyAccount"
                  class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Check v-if="copiedAccount" class="w-3.5 h-3.5 text-green-600" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  <span>{{ copiedAccount ? 'คัดลอกแล้ว' : 'คัดลอก' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">
              เลือกจำนวนเงิน (บาท)
            </label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button
                v-for="preset in presetAmounts"
                :key="preset"
                type="button"
                @click="amount = preset"
                class="py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                :class="[
                  amount === preset
                    ? 'bg-pink-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-600'
                ]"
              >
                ฿{{ preset.toLocaleString() }}
              </button>
            </div>

            <div class="relative mt-2">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                ฿
              </span>
              <input
                type="number"
                min="1"
                v-model.number="amount"
                placeholder="ระบุจำนวนเงิน..."
                class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm font-semibold text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block text-xs font-semibold text-slate-700">
                ชื่อผู้ร่วมโดเนท
              </label>
              <label class="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="isAnonymous"
                  class="rounded border-slate-300 text-pink-500 focus:ring-pink-400"
                />
                <span>ไม่ประสงค์ออกนาม</span>
              </label>
            </div>
            <input
              v-if="!isAnonymous"
              type="text"
              v-model="donorName"
              placeholder="เช่น แมวน้อยของนีญ่า, NiyaFC_Bangkok"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความฝากถึงนีญ่า (Optional)
            </label>
            <input
              type="text"
              v-model="note"
              placeholder="ส่งกำลังใจให้นีญ่า เช่น สู้ๆ ติดเซ็มให้ได้นะ!"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm text-slate-800 bg-slate-50/50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              แนบสลิปการโอน (เพื่อบันทึกยอด)
            </label>
            <div class="relative border-2 border-dashed border-pink-100 hover:border-pink-300 rounded-2xl p-3 text-center bg-pink-50/30 transition-colors cursor-pointer">
              <Upload class="w-5 h-5 text-pink-400 mx-auto mb-1" />
              <span class="text-xs text-slate-500 block">
                {{ slipFileName || 'คลิกเพื่อเลือกไฟล์สลิป หรือลากไฟล์มาวางที่นี่' }}
              </span>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="hidden"
                id="slip-upload-vue"
              />
              <label htmlFor="slip-upload-vue" class="absolute inset-0 cursor-pointer" />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <ShieldCheck class="w-4 h-4" />
            <span>ยืนยันการโอนโดเนท ฿{{ (amount || 0).toLocaleString() }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
