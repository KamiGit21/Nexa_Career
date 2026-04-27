<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\components\publicarCurso\CategoriaCursoSelect.vue -->
<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Categorías <span class="text-gray-400 font-normal">(puedes seleccionar varias)</span>
    </label>
    
    <div v-if="cargando" class="text-sm text-gray-400 py-2">
      Cargando categorías...
    </div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2 border border-gray-200 rounded-xl p-3 bg-[#f8fafc] max-h-48 overflow-y-auto">
      <label
        v-for="cat in categorias"
        :key="cat.id_categoria"
        class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition"
      >
        <input
          type="checkbox"
          :value="cat.id_categoria"
          :checked="estaSeleccionada(cat.id_categoria)"
          @change="toggleCategoria(cat.id_categoria)"
          class="form-checkbox text-[#1b2a4a] rounded focus:ring-[#1b2a4a] w-4 h-4"
        />
        <span class="text-sm text-gray-700">{{ cat.categoria }}</span>
      </label>
    </div>
    
    <!-- Mostrar categorías seleccionadas como chips -->
    <div v-if="categoriasSeleccionadas.length > 0" class="flex flex-wrap gap-2 mt-3">
      <span
        v-for="catId in categoriasSeleccionadas"
        :key="catId"
        class="inline-flex items-center gap-1 px-2 py-1 bg-[#1b2a4a]/10 text-[#1b2a4a] rounded-full text-xs"
      >
        {{ getNombreCategoria(catId) }}
        <button type="button" @click="toggleCategoria(catId)" class="hover:text-red-500 ml-1">×</button>
      </span>
    </div>
    
    <p v-else class="text-xs text-gray-400 mt-2">
      Selecciona una o más categorías para tu curso
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { listarCategorias } from '@/services/cursoService.js'

const props = defineProps({ 
  modelValue: { type: Array, default: () => [] }  // Ahora es un array de IDs
})
const emit = defineEmits(['update:modelValue'])

const categorias = ref([])
const cargando = ref(false)
const categoriasSeleccionadas = ref([])

const getNombreCategoria = (id) => {
  const cat = categorias.value.find(c => c.id_categoria === id)
  return cat ? cat.categoria : ''
}

const estaSeleccionada = (id) => {
  return categoriasSeleccionadas.value.includes(id)
}

const toggleCategoria = (id) => {
  const index = categoriasSeleccionadas.value.indexOf(id)
  if (index === -1) {
    categoriasSeleccionadas.value.push(id)
  } else {
    categoriasSeleccionadas.value.splice(index, 1)
  }
  emit('update:modelValue', [...categoriasSeleccionadas.value])
}

// Sincronizar con el prop externo
watch(() => props.modelValue, (nuevoValor) => {
  if (JSON.stringify(categoriasSeleccionadas.value) !== JSON.stringify(nuevoValor)) {
    categoriasSeleccionadas.value = [...(nuevoValor || [])]
  }
}, { immediate: true })

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