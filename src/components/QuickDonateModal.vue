<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { X, Copy, Check, QrCode, Heart, ShieldCheck, CreditCard, Upload, Loader2, RefreshCw } from 'lucide-vue-next';
import { CampaignData, Donation, DonationSheetPayload, ImagePayload } from '../types';
import { ProfanityFilter } from '../utils/profanityFilter';

const props = defineProps<{
  isOpen: boolean;
  campaign: CampaignData;
  sheetUrl?: string; // รองรับการส่ง sheetUrl ผ่าน props (ถ้ามี)
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addDonation', donation: Donation): void;
}>();

// กำหนด URL ของ Google Apps Script Web App (ใช้จาก props หรือค่าคงที่)
const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SPREADSHEET_URL || props.sheetUrl || '';
const GOOGLE_DRIVE_URL = import.meta.env.VITE_GOOGLE_DRIVE_URL || '';

const amount = ref<number>(68);
const donorName = ref('');
const note = ref('');
const isAnonymous = ref(false);
const isSubmitting = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref<string | null>(null);
const copiedAccount = ref(false);
const copiedPromptpay = ref(false);
const slipFile = ref<File | null>(null);
const isUploading = ref(false);
const responseMessage = ref('');
const uploadedImageUrl = ref('');

// --- ระบบตรวจสอบความเป็นมนุษย์ (Captcha & Honeypot) ---
const honeypot = ref(''); // ดักจับ Bot
const captchaNum1 = ref(0);
const captchaNum2 = ref(0);
const captchaInput = ref('');
const captchaError = ref(false);

const generateCaptcha = () => {
  captchaNum1.value = Math.floor(Math.random() * 9) + 1;
  captchaNum2.value = Math.floor(Math.random() * 9) + 1;
  captchaInput.value = '';
  captchaError.value = false;
};

// สุ่มโจทย์ใหม่ทุกครั้งที่ Modal เปิดขึ้นมา
watch(() => props.isOpen, (newVal) => {
  if (newVal) generateCaptcha();
});

onMounted(() => {
  generateCaptcha();
});
// ----------------------------------------------------

const presetAmounts = [50, 68, 100, 136, 204, 340, 500, 680, 1000];

const slipFileName = computed(() => {
  if (!slipFile.value) return '';
  return slipFile.value.name;
});

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
  //console.log("handleFileChange() called");
  //console.log("  e:", e);

  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    slipFile.value = target.files[0];
  }

  //console.log("handleFileChange() end");  
};

// ฟังก์ชันแปลงไฟล์เป็น Base64 (Promise)
const convertToBase64 = (file) => {
  //console.log("convertToBase64() called");
  //console.log("  file:", file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ฟังก์ชันหลักในการส่งข้อมูลไป Google Drive
const uploadSlip = async () => {
  //console.log("uploadSlip() called");

  if (!slipFile.value) return;

  isUploading.value = true;
  responseMessage.value = '';
  uploadedImageUrl.value = '';
  let result = '';

  try {
    // แปลงรูปภาพเป็น Base64 string
    const base64String = await convertToBase64(slipFile.value);

    // เตรียม Payload ข้อมูลที่จะส่งไป
    const payload = {
      fileName: `Slip_${Date.now()}_${slipFile.value.name}`,
      fileMimeType: slipFile.value.type,
      fileBase64: base64String,
      // คุณสามารถเพิ่มข้อมูลอื่นๆ เช่น ชื่อลูกค้า หรือ ยอดเงิน เข้าไปตรงนี้ได้ครับ
    };

    //console.log("  payload:", payload);
    
    const response = await fetch('/api/drives-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      
      body: JSON.stringify(payload)
    });

    //console.log("  response:", response);

    const resultResp = await response.json();

    if (resultResp.status === 'success') {
      responseMessage.value = 'อัปโหลดสลิปเรียบร้อยแล้ว!';
      result = resultResp.url; // นำ URL ที่ได้กลับมาเก็บเพื่อแสดงผลตรวจสอบ
      uploadedImageUrl.value = result;
    } else {
      responseMessage.value = 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ' + resultResp.message;
    }

  } catch (error) {
    responseMessage.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ หรือไฟล์มีขนาดใหญ่เกินไป';
    console.error(error);
  } finally {
    isUploading.value = false;
  }

  //console.log("uploadSlip() end");
  return uploadedImageUrl.value;
};

const handleSubmit = async () => {
  //console.log("handleSubmit() called");

  const filter = new ProfanityFilter();
  // ตรวจสอบก่อนส่งข้อมูล
  if (filter.hasProfanity(donorName.value) || filter.hasProfanity(note.value)) {
    errorMessage.value = 'กรุณาใช้ข้อความที่สุภาพและไม่มีคำหยาบคาย';
    return;
  }

  // 2. ตรวจสอบผลลัพธ์ Math Captcha
  const expectedAnswer = captchaNum1.value + captchaNum2.value;
  if (parseInt(captchaInput.value, 10) !== expectedAnswer) {
    captchaError.value = true;
    errorMessage.value = 'คำตอบยืนยันตัวตนไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
    generateCaptcha();
    return;
  }

  if (isSubmitting.value || !amount.value || amount.value <= 0) return;
  if (slipFile.value) {
    errorMessage.value = 'กรุณาแนบสลิปการโอน';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = null;

  let tier: 'tier-normal' | 'tier-silver' | 'tier-gold' | 'tier-diamond' = 'tier-normal';
  if (amount.value >= 5000) tier = 'tier-diamond';
  else if (amount.value >= 2000) tier = 'tier-gold';
  else if (amount.value >= 500) tier = 'tier-silver';

  // upload slip to google drive
  //const slipUrl = await uploadSlip();
  // แปลงรูปภาพเป็น Base64 string
  const base64String = await convertToBase64(slipFile.value);

  // เตรียม Payload ข้อมูลที่จะส่งไป
  const imgPayload: ImagePayload = {
    fileName: `Slip_${Date.now()}_${slipFile.value.name}`,
    fileMimeType: slipFile.value.type,
    fileBase64: base64String,
    // คุณสามารถเพิ่มข้อมูลอื่นๆ เช่น ชื่อลูกค้า หรือ ยอดเงิน เข้าไปตรงนี้ได้ครับ
  };

  //console.log("  payload:", payload);

  const newDonation: Donation = {
    id: `don-${Date.now()}`,
    donorName: isAnonymous.value ? 'ผู้ไม่ประสงค์ออกนาม' : (donorName.value.trim() || 'แฟนคลับผู้ใจดี'),
    amount: Number(amount.value),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    note: note.value.trim() || undefined,
    isAnonymous: isAnonymous.value,
    tier,
    verified: false,
    slipUrl: '',
  };

  console.log('newDonation:', newDonation);

  try {

    const sheetPayload: DonationSheetPayload = {
      donationPayload: newDonation,
      imagePayload: imgPayload,
    };
    // 1. ส่งข้อมูลขึ้น Google Sheet
    await postDonationToGoogleSheet('/api/sheets-proxy', sheetPayload);

    // 2. อัปเดต State ฝั่ง Local/Parent
    emit('addDonation', newDonation);
    isSubmitted.value = true;

    // 3. ปิด Modal และ Reset ฟอร์ม
    setTimeout(() => {
      isSubmitted.value = false;
      donorName.value = '';
      note.value = '';
      isAnonymous.value = false;
      slipFile.value = null;
      generateCaptcha();
      emit('close');
    }, 1800);
  } catch (err) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง';
  } finally {
    isSubmitting.value = false;
  }

  //console.log("handleSubmit() end");
};

/**
 * ฟังก์ชันส่งข้อมูลไปยัง Google Apps Script Web App
 * ใช้ Content-Type เป็น text/plain เพื่อเลี่ยง CORS Preflight Request
 */
async function postDonationToGoogleSheet(url: string, donation: DonationSheetPayload): Promise<boolean> {
  //console.log("postDonationToGoogleSheet() called");
  //console.log("  url:", url);
  //console.log("  donation:", donation);

  let result = false;

  if (!url || url.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
    console.warn('⚠️ Google Apps Script URL ยังไม่ได้ถูกตั้งค่า');
    return true; // ไม่บล็อก Flow ถ้ายังไม่ได้เซ็ต URL
  }

  try {

    const payload = JSON.stringify(donation);

    const response = await fetch(url, {
      method: 'POST',      
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: payload,      
    });

    //console.log("  response:", response);


    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    result = true;
  } catch (error) {
    console.error('Failed to post donation to Google Sheet:', error);
    // กรณีใช้ redirect/cors กับ Google Apps Script บางเวอร์ชัน response อาจ throw แต่ข้อมูลเข้าแล้ว
    result = false;
  }

  //console.log("postDonationToGoogleSheet() end");
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto relative">
      <button
        @click="emit('close')"
        :disabled="isSubmitting"
        class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
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
          <!-- Bank Account -->
          <div class="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <div class="flex justify-center mb-4 w-full">
              <img
                src="/assets/bank_qr_code.jpg"
                alt="Bank QR Code"
                class="w-40 h-40 rounded-lg object-cover border border-slate-200/60 shadow-xs"
              />
            </div>

            <div class="flex items-center justify-between gap-3">
              <div class="space-y-0.5 min-w-0">
                <div class="text-base font-bold text-slate-800 font-heading tracking-wide truncate">
                  <span class="text-green-500">{{ campaign.bankName }}</span>
                </div>
                <div class="text-base font-bold text-slate-800 font-heading tracking-wide truncate">
                  <span class="text-green-800">{{ campaign.bankAccountNumber }}</span>
                </div>
                <div class="text-base font-bold text-slate-800 font-heading tracking-wide truncate">
                  <span class="text-green-800">{{ campaign.bankAccountName }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5 shrink-0">
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
          <!-- Honeypot Field (Bot Trap) -->
          <div class="hidden" aria-hidden="true">
            <label for="website-check">Leave empty</label>
            <input id="website-check" type="text" v-model="honeypot" tabindex="-1" autocomplete="off" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-2">
              เลือกจำนวนเงิน (บาท)
            </label>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <button
                v-for="preset in presetAmounts"
                :key="preset"
                type="button"
                :disabled="isSubmitting"
                @click="amount = preset"
                class="py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
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
                :disabled="isSubmitting"
                v-model.number="amount"
                placeholder="ระบุจำนวนเงิน..."
                class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm font-semibold text-slate-800 bg-slate-50/50 disabled:opacity-50"
                required
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
                  :disabled="isSubmitting"
                  v-model="isAnonymous"
                  class="rounded border-slate-300 text-pink-500 focus:ring-pink-400 disabled:opacity-50"
                />
                <span>ไม่ประสงค์ออกนาม</span>
              </label>
            </div>
            <input
              v-if="!isAnonymous"
              type="text"
              :disabled="isSubmitting"
              v-model="donorName"
              placeholder="เช่น แมวน้อยของนีญ่า, NiyaFC_Bangkok"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm text-slate-800 bg-slate-50/50 disabled:opacity-50"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความฝากถึงนีญ่า (Optional)
            </label>
            <input
              type="text"
              :disabled="isSubmitting"
              v-model="note"
              placeholder="ส่งกำลังใจให้นีญ่า เช่น สู้ๆ ติดเซ็มให้ได้นะ!"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm text-slate-800 bg-slate-50/50 disabled:opacity-50"
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
                :disabled="isSubmitting"
                @change="handleFileChange"
                class="hidden"
                id="slip-upload-vue"
              />
              <label for="slip-upload-vue" class="absolute inset-0 cursor-pointer" />
            </div>
          </div>

          <!-- Human Verification (Math Challenge) -->
          <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <label class="block text-xs font-semibold text-slate-700">
              ยืนยันว่าคุณไม่ใช้บอท (Security Check)
            </label>
            <div class="flex items-center gap-2">
              <div class="px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 tracking-wider">
                {{ captchaNum1 }} + {{ captchaNum2 }} = ?
              </div>
              <input
                type="number"
                v-model="captchaInput"
                placeholder="ตอบคำถาม..."
                class="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-pink-400 text-sm font-semibold text-slate-800 bg-white"
                :class="{ 'border-rose-400 ring-1 ring-rose-300': captchaError }"
                required
              />
              <button
                type="button"
                @click="generateCaptcha"
                class="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                title="เปลี่ยนโจทย์"
              >
                <RefreshCw class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="errorMessage" class="text-xs text-rose-500 font-medium">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            <ShieldCheck v-else class="w-4 h-4" />
            <span>{{ isSubmitting ? 'กำลังบันทึกข้อมูล...' : `ยืนยันการโอนโดเนท ฿${(amount || 0).toLocaleString()}` }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>