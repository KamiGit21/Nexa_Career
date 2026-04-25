<template>
  <form @submit.prevent="$emit('guardar', form)" class="space-y-6">

    <InfoPendiente />

    <NombreCursoInput v-model="form.curso" />
    <DescripcionCurso v-model="form.descripcion" />
    <ContactoCurso    v-model="form.contacto" />

    <CursoInfoReadonly
      :fecha-creacion="fechaCreacion"
      :estado="estado"
    />

    <!-- Mensaje confirmación -->
    <div
      v-if="guardado"
      class="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium"
    >
      ✅ Cambios guardados correctamente
    </div>

    <p v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
      {{ error }}
    </p>

    <div class="flex gap-4 pt-2">
      <button
        type="submit"
        :disabled="guardando"
        class="flex-1 py-3 bg-[#1b2a4a] text-white font-semibold rounded-xl hover:bg-[#0f1a2e] disabled:opacity-50 transition"
      >
        {{ guardando ? 'Guardando...' : 'Confirmar cambios' }}
      </button>
      <button
        type="button"
        @click="$emit('cancelar')"
        class="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition text-gray-700"
      >
        Cancelar
      </button>
    </div>

    <p class="text-center text-xs text-gray-400">Aplica para Estudiante y Empleador</p>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import InfoPendiente    from '../publicarCurso/InfoPendiente.vue'
import NombreCursoInput from '../publicarCurso/NombreCursoInput.vue'
import DescripcionCurso from '../publicarCurso/DescripcionCurso.vue'
import ContactoCurso    from '../publicarCurso/ContactoCurso.vue'
import CursoInfoReadonly from './CursoInfoReadonly.vue'

const props = defineProps({
  curso:        { type: String,  default: ''  },
  descripcion:  { type: String,  default: ''  },
  contacto:     { type: String,  default: ''  },
  fechaCreacion:{ type: String,  default: ''  },
  estado:       { type: Number,  default: 0   },
  guardando:    { type: Boolean, default: false },
  guardado:     { type: Boolean, default: false },
  error:        { type: String,  default: ''  }
})

defineEmits(['guardar', 'cancelar'])

const form = ref({
  curso:       props.curso,
  descripcion: props.descripcion,
  contacto:    props.contacto
})

watch(() => [props.curso, props.descripcion, props.contacto], ([c, d, ct]) => {
  form.value = { curso: c, descripcion: d, contacto: ct }
})
</script>