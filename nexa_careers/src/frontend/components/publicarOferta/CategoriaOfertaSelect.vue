<template>
  <div>
    <label class="block text-gray-700 font-medium mb-2">
      Categoría
      <span class="text-gray-400 text-sm font-normal ml-1">(opcional)</span>
    </label>

    <div class="relative">
      <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        :disabled="cargando"
        class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none bg-white
               appearance-none pr-10 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors"
        :class="modelValue ? 'border-[#1b2a4a]' : 'border-gray-200'"
      >
        <option value="">
          {{ cargando ? 'Cargando categorías...' : '— Sin categoría —' }}
        </option>
        <!-- Las opciones se renderizan desde el array `categorias`.
             Estructura esperada por ítem: { id_categoria, categoria } -->
        <option
          v-for="cat in categorias"
          :key="cat.id_categoria"
          :value="cat.id_categoria"
        >
          {{ cat.categoria }}
        </option>
      </select>

      <!-- Icono flecha -->
      <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>

    <!-- Badge de categoría seleccionada -->
    <div v-if="categoriaSeleccionada" class="mt-2 flex items-center gap-2">
      <span class="text-xs font-semibold px-3 py-1 rounded-full bg-[#1b2a4a]/10 text-[#1b2a4a]">
        📂 {{ categoriaSeleccionada.categoria }}
      </span>
      <button
        type="button"
        @click="$emit('update:modelValue', '')"
        class="text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        ✕ quitar
      </button>
    </div>

    <p v-if="errorMsg" class="mt-1 text-xs text-red-500">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// TODO [INTEGRACIÓN]: importar el servicio que exponga listarCategorias()
// import { listarCategorias } from '@/services/cursoService.js'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' }
})
defineEmits(['update:modelValue'])

const categorias = ref([])
const cargando   = ref(false)
const errorMsg   = ref('')

const categoriaSeleccionada = computed(() =>
  categorias.value.find(c => String(c.id_categoria) === String(props.modelValue)) ?? null
)

onMounted(async () => {
  //INTEGRACIÓN: llamar a listarCategorias() y asignar el resultado a categorias.value
  
})
</script>