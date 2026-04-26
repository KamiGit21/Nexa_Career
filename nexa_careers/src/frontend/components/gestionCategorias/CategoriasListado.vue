<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-5 h-full">
    <div class="flex justify-between items-center mb-1">
      <h2 class="text-sm font-bold text-slate-700">Categorías existentes</h2>
      <span class="text-xs text-slate-400">{{ categorias.length }} categorías registradas</span>
    </div>

    <CategoriasSearchBar v-model="busqueda" />

    <div v-if="cargando" class="text-center py-10 text-slate-400 text-sm">
      Cargando categorías...
    </div>

    <div v-else-if="filtradas.length === 0" class="text-center py-10 text-slate-400 text-sm">
      No se encontraron categorías.
    </div>

    <div v-else class="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
      <CategoriaItem
        v-for="cat in filtradas"
        :key="cat.id_categoria"
        :categoria="cat"
        @eliminar="$emit('eliminar', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CategoriasSearchBar from './CategoriasSearchBar.vue'
import CategoriaItem from './CategoriaItem.vue'

const props = defineProps({
  categorias: { type: Array, default: () => [] },
  cargando:   { type: Boolean, default: false },
})
defineEmits(['eliminar'])

const busqueda = ref('')

const filtradas = computed(() =>
  props.categorias.filter(c =>
    c.categoria?.toLowerCase().includes(busqueda.value.toLowerCase())
  )
)
</script>