<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <CategoriasHeader @nueva="modalVisible = true" />

    <CategoriasListado
      :categorias="categorias"
      :cargando="cargando"
      @eliminar="categoriaAEliminar = $event"
    />

    <NuevaCategoriaModal
      :visible="modalVisible"
      :guardando="guardando"
      @cerrar="modalVisible = false"
      @guardada="(nombre) => { $emit('registrar', nombre); modalVisible = false }"
    />

    <EliminarCategoriaModal
      :categoria="categoriaAEliminar"
      @cancelar="categoriaAEliminar = null"
      @confirmar="$emit('eliminar', categoriaAEliminar); categoriaAEliminar = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CategoriasHeader       from '@/components/gestionCategorias/CategoriasHeader.vue'
import CategoriasListado      from '@/components/gestionCategorias/CategoriasListado.vue'
import NuevaCategoriaModal    from '@/components/gestionCategorias/NuevaCategoriaModal.vue'
import EliminarCategoriaModal from '@/components/gestionCategorias/EliminarCategoriaModal.vue'

defineProps({
  categorias: { type: Array,   default: () => [] },
  cargando:   { type: Boolean, default: false },
  guardando:  { type: Boolean, default: false },
})

defineEmits(['registrar', 'eliminar'])

const modalVisible       = ref(false)
const categoriaAEliminar = ref(null)
</script>