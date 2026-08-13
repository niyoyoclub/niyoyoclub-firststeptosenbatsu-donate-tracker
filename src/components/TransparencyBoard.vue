<script setup lang="ts">
import { ShieldCheck, CheckCircle, Info } from 'lucide-vue-next';
import { ExpenseCategory } from '../types';

defineProps<{
  expenses: ExpenseCategory[];
  totalAmount: number;
}>();
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-blue-card">
    <div class="flex items-center gap-2 mb-1">
      <span class="p-2 rounded-xl bg-blue-50 text-blue-500">
        <ShieldCheck class="w-5 h-5" />
      </span>
      <h3 class="text-xl font-bold text-slate-900 font-heading">
        ความโปร่งใสการจัดสรรเงิน (Fund Allocation & Transparency)
      </h3>
    </div>
    <p class="text-xs text-slate-500 mb-6 pl-9">
      รายงานการประมาณการใช้จ่ายงบประมาณอย่างตรงไปตรงมาเพื่อประโยชน์สูงสุดของนีย่า
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <!-- Allocation Categories -->
      <div class="space-y-3">
        <div
          v-for="exp in expenses"
          :key="exp.category"
          class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
        >
          <div class="flex justify-between items-center text-xs mb-1.5">
            <span class="font-bold text-slate-800 font-heading">{{ exp.category }}</span>
            <span class="font-extrabold text-blue-600 font-heading">
              {{ exp.percentage }}% (~฿{{ Math.round((totalAmount * exp.percentage) / 100).toLocaleString() }})
            </span>
          </div>

          <div class="w-full bg-slate-200/70 h-2.5 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="exp.color"
              :style="{ width: `${exp.percentage}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Guarantee Box -->
      <div class="bg-gradient-to-br from-blue-50/60 to-purple-50/60 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-center gap-2 text-blue-700 font-bold text-sm font-heading mb-2">
            <CheckCircle class="w-4 h-4 text-blue-600" />
            <span>การรับประกันความโปร่งใส 100%</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed space-y-2">
            1. ทุกยอดโอนเข้าบัญชีโครงการจะมีสลิปและรายการอัปเดตในตารางโปรเจกต์อย่างต่อเนื่อง<br />
            2. ใบเสร็จค่าซื้อตั๋วโหวต และค่าเช่าสื่อป้ายโฆษณาจะถูกนำมาโพสต์ชี้แจงภายหลังจบโครงการ<br />
            3. เงินคงเหลือทั้งหมดหลังจบโครงการจะถูกสมทบเข้าสู่กองทุนถัดไปของนีย่า
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-blue-200/60 flex items-center gap-2 text-[11px] text-slate-500">
          <Info class="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>ดูแลและตรวจสอบโดยทีมงานบ้านแฟนคลับ Niya General Election Support Team</span>
        </div>
      </div>
    </div>
  </div>
</template>
