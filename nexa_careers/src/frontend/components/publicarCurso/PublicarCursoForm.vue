<template>
  <form
    @submit.prevent="enviar"
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
  >
    <InfoPendiente />

    <NombreCursoInput v-model="form.curso" />
    <DescripcionCurso v-model="form.descripcion" />
    <!-- ojito que hay que descomentar esto para el 3 sprint-->
    <!-- <CategoriaCursoSelect v-model="form.categoria" /> -->
    <ContactoCurso v-model="form.contacto" />

    <p
      v-if="errorMsg"
      class="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl"
    >
      {{ errorMsg }}
    </p>

    <BotonesFormCurso :cargando="cargando" />
  </form>
</template>

<script setup>
import { ref } from 'vue'
import InfoPendiente        from './InfoPendiente.vue'
import NombreCursoInput     from './NombreCursoInput.vue'
import DescripcionCurso     from './DescripcionCurso.vue'
import CategoriaCursoSelect from './CategoriaCursoSelect.vue'
import ContactoCurso        from './ContactoCurso.vue'
import BotonesFormCurso     from './BotonesFormCurso.vue'
import {
  publicarCursoPorEstudiante,
  publicarCursoPorEmpleador
} from '@/services/cursoService.js'

const emit = defineEmits(['enviado'])

const cargando = ref(false)
const errorMsg = ref('')
const form = ref({ curso: '', descripcion: '', categoria: '', contacto: '' })

const enviar = async () => {
  errorMsg.value = ''

  if (!form.value.curso.trim()) {
    errorMsg.value = 'El nombre del curso es obligatorio.'
    return
  }
  if (!form.value.descripcion.trim()) {
    errorMsg.value = 'La descripción es obligatoria.'
    return
  }
  if (!form.value.contacto) {
    errorMsg.value = 'Agrega al menos un dato de contacto.'
    return
  }

  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (!sesion.id || !sesion.rol) {
    errorMsg.value = 'Debes iniciar sesión para publicar un curso.'
    return
  }

  cargando.value = true
  try {
    const payload = {
      curso:       form.value.curso,
      descripcion: form.value.descripcion,
      contacto:    form.value.contacto,
      ...(sesion.rol === 'estudiante'
        ? { id_estudiante: sesion.id }
        : { id_empleador:  sesion.id })
    }

    const fn = sesion.rol === 'estudiante'
      ? publicarCursoPorEstudiante
      : publicarCursoPorEmpleador

    const response = await fn(payload)

    if (response.success) {
      emit('enviado')
    } else {
      errorMsg.value = response.message || 'Error al publicar el curso.'
    }
  } catch {
    errorMsg.value = 'Error de conexión con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>