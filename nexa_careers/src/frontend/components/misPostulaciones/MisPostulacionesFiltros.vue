<template>
  <div class="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 mb-10">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <input
          type="text"
          v-model="searchQuery"
          @input="onSearch"
          placeholder="🔍 Cargo, empresa o palabra clave"
          class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D1B16D] focus:border-[#D1B16D] outline-none transition"
        />
      </div>

      <div class="relative min-w-[200px]">
        <select
          v-model="selectedStatus"
          @change="onFilterChange"
          class="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D1B16D] focus:border-[#D1B16D] outline-none transition appearance-none bg-white text-gray-700"
        >
          <option value="">Todos los Estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Seleccionado">Seleccionado</option>
          <option value="No seleccionado">No seleccionado</option>
        </select>
        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
          ▼
        </span>
      </div>

      <button
        @click="onSearch"
        class="bg-[#D1B16D] text-[#002349] font-bold px-8 py-3 rounded-xl hover:bg-[#c0a260] transition shadow-md"
      >
        Buscar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search', 'filter']);

const searchQuery = ref('');
const selectedStatus = ref('');

const onSearch = () => {
  emit('search', searchQuery.value);
};

const onFilterChange = () => {
  emit('filter', selectedStatus.value);
};
</script>