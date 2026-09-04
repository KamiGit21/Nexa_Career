<template>
  <div class="relative" ref="contenedor">

    <FiltroPorFechaBoton
      :etiqueta="etiquetaActiva"
      :activo="hayFiltroActivo"
      :abierto="abierto"
      @click="abierto = !abierto"
    />

    <div v-if="abierto"
      class="absolute z-50 mt-2 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 min-w-[280px]"
    >
      <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Acceso rápido</p>
      <FiltroPorFechaPresets
        :seleccionado="modelValue.preset"
        :opciones="presetsOpciones"
        @seleccionar="seleccionarPreset"
      />

      <hr class="my-4 border-gray-100" />

      <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Rango personalizado</p>
      <FiltroPorFechaRango
        :desde="modelValue.desde"
        :hasta="modelValue.hasta"
        @update:desde="val => actualizarRango('desde', val)"
        @update:hasta="val => actualizarRango('hasta', val)"
      />

      <button v-if="hayFiltroActivo" @click="limpiar"
        :disabled="limpiando"
        :class="[
          'mt-4 w-full text-center text-xs transition-colors',
          limpiando ? 'text-gray-300 cursor-not-allowed' : 'text-red-400 hover:text-red-600'
        ]"
      >
        {{ limpiando ? 'Limpiando...' : 'Limpiar filtro ✕' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import FiltroPorFechaBoton   from './FiltroPorFechaBoton.vue'
import FiltroPorFechaPresets from './FiltroPorFechaPresets.vue'
import FiltroPorFechaRango   from './FiltroPorFechaRango.vue'

const props = defineProps({
  modelValue:     { type: Object, default: () => ({ preset: '', desde: '', hasta: '' }) },
  presetsOpciones: { type: Array,  default: null }
})
const emit = defineEmits(['update:modelValue'])

const abierto    = ref(false)
const contenedor = ref(null)
const limpiando  = ref(false)

const nombresPreset   = { dia: 'Publicados hoy', semana: 'Última semana', mes: 'Último mes' }
const hayFiltroActivo = computed(() => !!props.modelValue.preset || !!props.modelValue.desde || !!props.modelValue.hasta)
const etiquetaActiva  = computed(() => {
  if (props.modelValue.preset) {
    const match = props.presetsOpciones?.find(o => o.valor === props.modelValue.preset)
    return match?.etiqueta ?? nombresPreset[props.modelValue.preset] ?? props.modelValue.preset
  }
  if (props.modelValue.desde && props.modelValue.hasta) return `${props.modelValue.desde} → ${props.modelValue.hasta}`
  if (props.modelValue.desde) return `Desde ${props.modelValue.desde}`
  if (props.modelValue.hasta) return `Hasta ${props.modelValue.hasta}`
  return 'Fecha'
})

const seleccionarPreset = (valor) => {
  emit('update:modelValue', { preset: props.modelValue.preset === valor ? '' : valor, desde: '', hasta: '' })
  abierto.value = false
}
const actualizarRango = (campo, valor) => {
  emit('update:modelValue', { ...props.modelValue, preset: '', [campo]: valor })
}

const limpiar = () => {
  limpiando.value = true
  setTimeout(() => {
    emit('update:modelValue', { preset: '', desde: '', hasta: '' })
    abierto.value  = false
    limpiando.value = false
  }, 400)
}

const cerrarAlClickFuera = (e) => {
  if (contenedor.value && !contenedor.value.contains(e.target)) abierto.value = false
}
onMounted(() => document.addEventListener('mousedown', cerrarAlClickFuera))
onBeforeUnmount(() => document.removeEventListener('mousedown', cerrarAlClickFuera))
</script>