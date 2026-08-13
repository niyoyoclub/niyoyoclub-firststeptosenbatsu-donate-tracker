<script setup lang="ts">
import { ref, computed } from 'vue';
import { MessageSquare, Heart, Send } from 'lucide-vue-next';
import { WishMessage } from '../types';

const props = defineProps<{
  wishes: WishMessage[];
}>();

const emit = defineEmits<{
  (e: 'addWish', wish: WishMessage): void;
  (e: 'likeWish', id: string): void;
}>();

const author = ref('');
const message = ref('');
const tag = ref('ส่งกำลังใจ ✨');
const selectedTagFilter = ref('All');

const tags = ['ส่งกำลังใจ ✨', 'เป้าหมาย Senbatsu 🌟', 'รักนีย่า 💗', 'พรจากแฟนคลับ 🌸'];
const colors = [
  'bg-pink-100 text-pink-600 border-pink-200',
  'bg-purple-100 text-purple-600 border-purple-200',
  'bg-rose-100 text-rose-600 border-rose-200',
  'bg-blue-100 text-blue-600 border-blue-200'
];

const handleSubmit = () => {
  if (!message.value.trim()) return;

  const newWish: WishMessage = {
    id: `wish-${Date.now()}`,
    author: author.value.trim() || 'แฟนคลับนิรนาม 💖',
    message: message.value.trim(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    likes: 1,
    tag: tag.value,
    avatarColor: colors[Math.floor(Math.random() * colors.length)]
  };

  emit('addWish', newWish);
  message.value = '';
  author.value = '';
};

const filteredWishes = computed(() => {
  if (selectedTagFilter.value === 'All') return props.wishes;
  return props.wishes.filter((w) => w.tag === selectedTagFilter.value);
});
</script>

<template>
  <div class="bg-white rounded-3xl p-6 sm:p-8 soft-pink-card" id="wish-wall">
    <div class="flex items-center gap-2 mb-1">
      <span class="p-2 rounded-xl bg-pink-50 text-pink-500">
        <MessageSquare class="w-5 h-5" />
      </span>
      <h3 class="text-xl font-bold text-slate-900 font-heading">
        กำแพงความรัก & คำอวยพร (Wish & Encouragement Wall)
      </h3>
    </div>
    <p class="text-xs text-slate-500 mb-6 pl-9">
      ส่งข้อความให้กำลังใจนีย่า เพื่อเป็นพลังใจสู้ศึกงานเลือกตั้ง
    </p>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 mb-6 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">ชื่อของคุณ</label>
          <input
            type="text"
            placeholder="เช่น น้องส้มสดใส, P'Korn"
            v-model="author"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300 bg-white"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">หมวดหมู่ข้อความ</label>
          <select
            v-model="tag"
            class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300 bg-white text-slate-700"
          >
            <option v-for="t in tags" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">ข้อความอวยพรนีย่า</label>
        <textarea
          rows="2"
          placeholder="พิมพ์คำอวยพรหรือข้อความให้กำลังใจนีย่าที่นี่..."
          v-model="message"
          class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-pink-300 bg-white resize-none"
        />
      </div>

      <button
        type="submit"
        :disabled="!message.trim()"
        class="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 ml-auto cursor-pointer"
      >
        <Send class="w-3.5 h-3.5" />
        <span>โพสต์ข้อความอวยพร</span>
      </button>
    </form>

    <!-- Tag Filters -->
    <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
      <button
        @click="selectedTagFilter = 'All'"
        class="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer"
        :class="[selectedTagFilter === 'All' ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-pink-50']"
      >
        ทั้งหมด ({{ wishes.length }})
      </button>
      <button
        v-for="t in tags"
        :key="t"
        @click="selectedTagFilter = t"
        class="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer"
        :class="[selectedTagFilter === t ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-pink-50']"
      >
        {{ t }}
      </button>
    </div>

    <!-- Messages Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="w in filteredWishes"
        :key="w.id"
        class="p-4 rounded-2xl bg-white border border-slate-100 hover:border-pink-200 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" :class="w.avatarColor">
                {{ w.author.charAt(0) }}
              </div>
              <div>
                <h4 class="font-bold text-slate-800 text-xs font-heading">{{ w.author }}</h4>
                <span class="text-[10px] text-slate-400">{{ w.timestamp }}</span>
              </div>
            </div>

            <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-pink-50 text-pink-600 border border-pink-100">
              {{ w.tag }}
            </span>
          </div>

          <p class="text-xs text-slate-700 leading-relaxed my-2 bg-slate-50/60 p-3 rounded-xl">
            "{{ w.message }}"
          </p>
        </div>

        <div class="flex items-center justify-end mt-2">
          <button
            @click="emit('likeWish', w.id)"
            class="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-600 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Heart class="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>{{ w.likes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
