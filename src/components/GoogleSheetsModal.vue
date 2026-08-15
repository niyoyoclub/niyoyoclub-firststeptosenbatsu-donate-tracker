<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { X, Table, RefreshCw, Check, AlertCircle, HelpCircle } from 'lucide-vue-next';
import { parseCSVDonations } from '../utils/storage';
import { Donation, CampaignData } from '../types';

const props = defineProps<{
  isOpen: boolean;
  currentSheetUrl?: string;
  campaign: CampaignData;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'importDonations', donations: Donation[], sheetUrl: string): void;  
  (e: 'callbackLastSync'): void;
}>();

const sheetUrl = ref(
  props.currentSheetUrl ||
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQjjo3Gd1VwUWxVHYEy01Rar9ueGqpxeiQtpRR-Q9U1IxD5ew15gf0YQ0KPtyGAbj8XAKO8JXLm_RjF/pub?gid=0&single=true&output=csv'
);

// ตัวแปรสำหรับ Auto Fetch
const isAutoFetchEnabled = ref(true);
let autoFetchInterval: number | null = null;

const isLoading = ref(false);
const error = ref<string | null>(null);
const successCount = ref<number | null>(null);

const handleFetchCSV = async (isSilent = false) => {
  if (!sheetUrl.value.trim()) return;

  // ถ้าเป็นการดึงอัตโนมัติ ไม่ต้องสั่งสั่งปิด Modal หรือเคลียร์ state ให้รบกวนผู้ใช้
  if (!isSilent) {
    isLoading.value = true;
    error.value = null;
    successCount.value = null;
  }

  try {
    const proxyUrl = '/api/sheets-proxy';
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      throw new Error(`ไม่สามารถดึงข้อมูลได้ (Status: ${res.status})`);
    }

    const csvText = await res.text();
    const newDonations = parseCSVDonations(csvText);

    if (newDonations.length === 0) {
      if (!isSilent) error.value = 'ดึงข้อมูลสำเร็จแต่ไม่พบรายการโดเนทในรูปแบบ CSV';
    } else {
      if (!isSilent) successCount.value = newDonations.length;
      emit('importDonations', newDonations, sheetUrl.value);

      if (!isSilent) {
        setTimeout(() => {
          emit('close');
        }, 1500);
      }
    }
  } catch (err: any) {
    console.error(err);
    if (!isSilent) {
      error.value = err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google Sheet';
    }
  } finally {
    if (!isSilent) {
      isLoading.value = false;
    }
    emit('callbackLastSync');
  }
};

// ฟังก์ชันสำหรับจัดการ Interval
const startAutoFetch = () => {
  stopAutoFetch();
  if (isAutoFetchEnabled.value) {
    // 60,000 ms = 1 นาที
    autoFetchInterval = window.setInterval(() => {
      handleFetchCSV(true);
    },  props.campaign.refreshEveryMinutes * 60 * 1000);
  }
};

const stopAutoFetch = () => {
  if (autoFetchInterval !== null) {
    clearInterval(autoFetchInterval);
    autoFetchInterval = null;
  }
};

// เคลียร์ Interval เมื่อ Component ถูกลบ
onUnmounted(() => {
  stopAutoFetch();
});

// เริ่มทำงาน Interval เมื่อเริ่มเปิด
onMounted(() => {
  handleFetchCSV(true);
  startAutoFetch();
});

// สลับการทำงานถ้าผู้ใช้ปิด/เปิด Auto Fetch
watch(isAutoFetchEnabled, (newVal) => {
  if (newVal) {
    startAutoFetch();
  } else {
    stopAutoFetch();
  }
});

const refresh = () => {
  stopAutoFetch();
  handleFetchCSV(true);
  startAutoFetch();
};

defineExpose({
  refresh
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto relative">
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <X class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-2 mb-1">
        <span class="p-2 rounded-xl bg-purple-50 text-purple-600">
          <Table class="w-5 h-5" />
        </span>
        <h3 class="text-xl font-bold text-slate-900 font-heading">
          เชื่อมต่อ Google Sheets Live Data
        </h3>
      </div>
      <p class="text-xs text-slate-500 mb-6 pl-9">
        ดึงข้อมูลสเปรดชีตการโดเนทอัตโนมัติด้วย CSV Link
      </p>

      <form @submit.prevent="handleFetchCSV" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">
            Google Sheet URL หรือ CSV Export Link
          </label>
          <input
            type="url"
            required
            v-model="sheetUrl"
            placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-400 text-xs text-slate-800 bg-slate-50/50"
          />
        </div>

        <div v-if="error" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0 text-rose-500" />
          <span>{{ error }}</span>
        </div>

        <div v-if="successCount !== null" class="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-center gap-2">
          <Check class="w-4 h-4 shrink-0 text-green-600" />
          <span>นำเข้าข้อมูลเรียบร้อยแล้ว {{ successCount }} รายการ!</span>
        </div>

        <div class="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs text-slate-600 space-y-2">
          <div class="font-bold text-slate-800 flex items-center gap-1">
            <HelpCircle class="w-3.5 h-3.5 text-purple-600" />
            <span>วิธีเปิดเผย Google Sheet เป็น CSV:</span>
          </div>
          <ol class="list-decimal pl-4 space-y-1">
            <li>เปิดสเปรดชีตของคุณใน Google Sheets</li>
            <li>ไปที่ <span class="font-semibold text-slate-800">File → Share → Publish to web</span></li>
            <li>เลือกแผนงานที่ต้องการ และเปลี่ยนรูปแบบเป็น <span class="font-semibold text-slate-800">Comma-separated values (.csv)</span></li>
            <li>คัดลอก ลิงก์ที่ได้มาวางในช่องด้านบนนี้</li>
          </ol>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !sheetUrl.trim()"
          class="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw v-if="isLoading" class="w-4 h-4 animate-spin" />
          <span>{{ isLoading ? 'กำลังโหลดข้อมูล...' : 'ซิงค์ข้อมูลสเปรดชีตทันที' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
