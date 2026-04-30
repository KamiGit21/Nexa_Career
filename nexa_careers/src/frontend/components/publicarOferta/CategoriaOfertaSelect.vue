<template>
  <div>
    <label class="block text-gray-700 font-medium mb-2">
      Categoría(s)
      <span class="text-gray-400 text-sm font-normal ml-1">(opcional - puedes seleccionar varias)</span>
    </label>

    <!-- Lista de checkboxes para seleccionar múltiples categorías -->
    <div v-if="categorias.length > 0" class="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
      <label
        v-for="cat in categorias"
        :key="cat.id_categoria"
        class="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors"
      >
        <input
          type="checkbox"
          :value="String(cat.id_categoria)"
          :checked="isSelected(cat.id_categoria)"
          @change="toggleCategoria(cat.id_categoria)"
          class="w-4 h-4 text-[#1b2a4a] rounded border-gray-300 focus:ring-[#1b2a4a]"
        />
        <span class="text-sm text-gray-700">{{ cat.categoria }}</span>
      </label>
    </div>

    <!-- Estado de carga -->
    <div v-else-if="cargando" class="text-center py-4 text-gray-400 text-sm">
      Cargando categorías...
    </div>

    <!-- Sin categorías disponibles -->
    <div v-else class="text-center py-4 text-gray-400 text-sm">
      No hay categorías disponibles
    </div>

    <!-- Badges de categorías seleccionadas -->
    <div v-if="categoriasSeleccionadas.length > 0" class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="cat in categoriasSeleccionadas"
        :key="cat.id_categoria"
        class="text-xs font-semibold px-3 py-1 rounded-full bg-[#1b2a4a]/10 text-[#1b2a4a] flex items-center gap-1"
      >
        📂 {{ cat.categoria }}
        <button
          type="button"
          @click="quitarCategoria(cat.id_categoria)"
          class="ml-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          ✕
        </button>
      </span>
    </div>

    <p v-if="errorMsg" class="mt-1 text-xs text-red-500">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { listarCategorias } from '@/services/categoriaService.js'

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: () => [] }
})
const emit = defineEmits(['update:modelValue'])

const categorias = ref([])
const cargando   = ref(false)
const errorMsg   = ref('')

// Adaptar modelValue a array para mantener compatibilidad
const selectedIds = computed({
  get: () => {
    if (Array.isArray(props.modelValue)) return props.modelValue.map(String)
    if (props.modelValue) return [String(props.modelValue)]
    return []
  },
  set: (val) => emit('update:modelValue', val)
})

function isSelected(idCategoria) {
  return selectedIds.value.includes(String(idCategoria))
}

const categoriasSeleccionadas = computed(() => {
  const ids = selectedIds.value
  return categorias.value.filter(c => ids.includes(String(c.id_categoria)))
})

onMounted(async () => {
  cargando.value = true
  try {
    const response = await listarCategorias()
    if (response.success) {
      categorias.value = response.data || []
    } else {
      errorMsg.value = 'Error al cargar categorías'
    }
  } catch (e) {
    console.error('Error cargando categorías:', e)
    errorMsg.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
})

function toggleCategoria(id) {
  const ids = [...selectedIds.value]
  const strId = String(id)
  const index = ids.indexOf(strId)
  if (index === -1) {
    ids.push(strId)
  } else {
    ids.splice(index, 1)
  }
  selectedIds.value = ids
}

function quitarCategoria(id) {
  const ids = [...selectedIds.value]
  const strId = String(id)
  const index = ids.indexOf(strId)
  if (index !== -1) {
    ids.splice(index, 1)
  }
  selectedIds.value = ids
}
</script>
