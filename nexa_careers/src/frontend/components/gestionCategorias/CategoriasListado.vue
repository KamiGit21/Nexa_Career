<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-5 h-full">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-sm font-bold text-slate-700">Categorías existentes</h2>
      <span class="text-xs text-slate-400">{{ categorias.length }} categorías registradas</span>
    </div>

    <!-- Pestañas -->
    <div class="flex gap-1 mb-3 bg-slate-100 rounded-xl p-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="tabActiva = tab.value"
        :class="[
          'flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors',
          tabActiva === tab.value
            ? 'bg-white text-slate-700 shadow-sm'
            : 'text-slate-400 hover:text-slate-600'
        ]"
      >
        {{ tab.label }}
        <span class="ml-1 tabular-nums">({{ tab.count }})</span>
      </button>
    </div>

    <CategoriasSearchBar v-model="busqueda" />

    <div v-if="cargando" class="text-center py-10 text-slate-400 text-sm">
      Cargando categorías...
    </div>

    <div v-else-if="filtradas.length === 0" class="text-center py-10 text-slate-400 text-sm">
      No se encontraron categorías.
    </div>

    <div v-else class="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
      <CategoriaItem
        v-for="cat in filtradas"
        :key="cat.id_categoria"
        :categoria="cat"
        @archivar="$emit('archivar', $event)"
        @desarchivar="$emit('desarchivar', $event)"
        @editar="$emit('editar', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CategoriasSearchBar from './CategoriasSearchBar.vue'
import CategoriaItem from './CategoriaItem.vue'

const props = defineProps({
  categorias: { type: Array,   default: () => [] },
  cargando:   { type: Boolean, default: false },
})
defineEmits(['editar', 'archivar', 'desarchivar'])

const busqueda   = ref('')
const tabActiva  = ref('activas')

const activas    = computed(() => props.categorias.filter(c => c.estado !== 0))
const archivadas = computed(() => props.categorias.filter(c => c.estado === 0))

const tabs = computed(() => [
  { value: 'activas',    label: 'Activas',    count: activas.value.length },
  { value: 'archivadas', label: 'Archivadas', count: archivadas.value.length },
])

const enTab = computed(() =>
  tabActiva.value === 'activas' ? activas.value : archivadas.value
)

const filtradas = computed(() =>
  enTab.value.filter(c =>
    c.categoria?.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)
</script>