<template>
  <div
    class="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
    @click="$emit('click-detalle', oferta.id_oferta)"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="w-12 h-12 bg-[#1b2a4a]/10 rounded-lg flex items-center justify-center text-2xl">
        💼
      </div>
      <div class="flex flex-col items-end gap-1">
        <span v-if="!mostrarEstado && esNueva" class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
          Nueva
        </span>
        <template v-if="mostrarEstado">
          <span :class="['text-[10px] font-bold px-2 py-1 rounded-full', estadoConfig.bg, estadoConfig.text]">
            {{ estadoConfig.label }}
          </span>
        </template>
      </div>
    </div>

    <h2 class="text-lg font-bold text-[#1b2a4a] hover:text-[#b89b4d] transition-colors">
      {{ oferta.oferta }}
    </h2>

    <p v-if="oferta.nombre_empleador || oferta.nombre_empresa" class="text-xs text-[#b5943a] font-semibold mt-1">
      🏢 {{ oferta.nombre_empleador || oferta.nombre_empresa }}
    </p>

    <p class="text-sm text-gray-500 line-clamp-3 my-3">
      {{ oferta.descripcion || 'Sin descripción' }}
    </p>

    <div class="flex justify-between items-center pt-4 border-t border-gray-100">
      <span class="text-xs text-gray-400">{{ fechaFormateada }}</span>
      <span class="text-[#1b2a4a] font-bold text-sm hover:underline">Ver detalle →</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  oferta: Object,
  mostrarEstado: { type: Boolean, default: false }
})

const ESTADOS = {
  0: { label: 'Pendiente', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  1: { label: 'Aprobada',  bg: 'bg-green-100',  text: 'text-green-800'  },
  2: { label: 'Rechazada', bg: 'bg-red-100',    text: 'text-red-800'    },
  3: { label: 'Archivada', bg: 'bg-gray-100',   text: 'text-gray-500'   },
  4: { label: 'Vencida',   bg: 'bg-red-100',    text: 'text-red-800'    },
}

const estadoConfig = computed(() => ESTADOS[props.oferta.estado] ?? ESTADOS[0])

const esVencida = computed(() =>
  props.oferta.estado === 1 &&
  !!props.oferta.fecha_apertura &&
  new Date(props.oferta.fecha_apertura) < new Date()
)

const fechaFormateada = computed(() => {
  if (!props.oferta.fecha_apertura) return 'Fecha no especificada'
  return new Date(props.oferta.fecha_apertura).toLocaleDateString('es-ES')
})

const esNueva = computed(() => {
  if (!props.oferta.fecha_apertura) return false
  const diffDias = Math.floor((new Date() - new Date(props.oferta.fecha_apertura)) / (1000 * 60 * 60 * 24))
  return diffDias <= 7
})
</script>