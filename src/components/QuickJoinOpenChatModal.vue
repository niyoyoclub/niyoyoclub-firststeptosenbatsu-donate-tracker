<script setup lang="ts">
import { ref } from 'vue';
import { X, Copy, Check, QrCode, Heart, ShieldCheck, CreditCard, Upload, MessageCircle, ExternalLink } from 'lucide-vue-next';
import { CampaignData, Donation } from '../types';

const props = defineProps<{
  isOpen: boolean;
  campaign: CampaignData;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const openChatUrl = ref('https://line.me/ti/g2/hfQvhsWKm0DCpXR7YZyQ9C4Gd7gk01DBm2Qitg');
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

      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
            <Heart class="w-5 h-5 fill-pink-500/20" />
          </span>
          <h3 class="text-xl font-bold text-slate-900 font-heading">
            เข้าร่วมคอมมูนิตี้ Niyoyo Club
          </h3>
        </div>
        <p class="text-xs text-slate-500 mb-6 pl-9">
          เข้าร่วมชุมชนแฟนคลับ เพื่อติดตามความเคลื่อนไหว! ข่าวสารต่างๆ เกี่ยวกับ {{ campaign.candidateName }}
        </p>

        <!-- OPC QR Code -->
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-3">
        <!-- QR Code Open Chat Niyoyo Club -->
        <div class="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            
            <!-- จัดให้อยู่ตรงกลางด้วย flex justify-center -->
            <div class="flex justify-center mb-4">
            <img
                src="/assets/opc_qr_code.jpg"
                alt="Open Chat QR Code"
                class="w-40 h-40 rounded-lg object-cover border border-slate-200/60 shadow-xs"
            />
            </div>
        
            <div class="flex items-center gap-1.5 mb-2 text-xs font-medium text-slate-400">
            <a 
                :href="openChatUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-600 border-2 border-[#1e293b] rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#1e293b] active:translate-y-0.5 transition-all"
            >
                <MessageCircle class="w-4 h-4" />
                <span>Join our community!</span>
                <ExternalLink class="w-3 h-3 ml-auto" />
            </a>
            </div>
        </div>
        </div>

        
        <button
            type="button"
            @click="emit('close')"
            class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
            <X class="w-4 h-4" />
            <span>ปิด</span>
        </button>
      </div>
    </div>
  </div>
</template>
