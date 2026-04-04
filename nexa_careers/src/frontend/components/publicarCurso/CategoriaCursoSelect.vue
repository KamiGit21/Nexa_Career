<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Categoría <span class="text-gray-400 font-normal">(opcional)</span>
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="cargando"
      class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-[#f8fafc]
             focus:border-[#1b2a4a] outline-none transition text-sm text-gray-700
             disabled:opacity-50"
    >
      <option value="">
        {{ cargando ? 'Cargando categorías...' : 'Selecciona una categoría...' }}
      </option>
      <option
        v-for="cat in categorias"
        :key="cat.id_categoria"
        :value="cat.id_categoria"
      >
        {{ cat.categoria }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listarCategorias } from '@/services/cursoService.js'

defineProps({ modelValue: { type: [String, Number], default: '' } })
defineEmits(['update:modelValue'])

const categorias = ref([])
const cargando   = ref(false)

onMounted(async () => {
  cargando.value = true
  try {
    const response = await listarCategorias()
    if (response.success && response.data) {
      categorias.value = response.data
    }
  } catch (e) {
    console.error('Error al cargar categorías:', e)
  } finally {
    cargando.value = false
  }
})
</script>