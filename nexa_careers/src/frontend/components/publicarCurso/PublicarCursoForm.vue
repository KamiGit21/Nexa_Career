<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\components\publicarCurso\PublicarCursoForm.vue -->
<template>
  <form
    @submit.prevent="enviar"
    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
  >
    <InfoPendiente />

    <NombreCursoInput v-model="form.curso" />
    <DescripcionCurso v-model="form.descripcion" />
    <CategoriaCursoSelect v-model="form.categorias" />
    <ContactoCurso v-model="form.contacto" />

    <p
      v-if="errorMsg"
      class="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl"
    >
      {{ errorMsg }}
    </p>

    <BotonesFormCurso :cargando="cargando" :isEditing="isEditing" />
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InfoPendiente        from './InfoPendiente.vue'
import NombreCursoInput     from './NombreCursoInput.vue'
import DescripcionCurso     from './DescripcionCurso.vue'
import CategoriaCursoSelect from './CategoriaCursoSelect.vue'
import ContactoCurso        from './ContactoCurso.vue'
import BotonesFormCurso     from './BotonesFormCurso.vue'
import {
  publicarCursoPorEstudiante,
  publicarCursoPorEmpleador,
  actualizarCurso,
  obtenerCursoPorId
} from '@/services/cursoService.js'

const props = defineProps({
  cursoId: { type: Number, default: null }  // Si tiene ID, es modo edición
})
const emit = defineEmits(['enviado', 'cancelado'])

const cargando = ref(false)
const errorMsg = ref('')
const isEditing = ref(false)
const form = ref({ 
  curso: '', 
  descripcion: '', 
  categorias: [],  // Ahora es un array
  contacto: '' 
})

// Cargar datos si es modo edición
const cargarCursoParaEditar = async () => {
  if (!props.cursoId) return
  
  isEditing.value = true
  cargando.value = true
  
  try {
    const response = await obtenerCursoPorId(props.cursoId)
    if (response.success && response.data) {
      const curso = response.data
      form.value = {
        curso: curso.curso,
        descripcion: curso.descripcion,
        categorias: curso.categorias?.map(c => c.id_categoria) || [],
        contacto: curso.contacto
      }
    } else {
      errorMsg.value = 'No se pudo cargar el curso para editar'
    }
  } catch (error) {
    console.error('Error cargando curso:', error)
    errorMsg.value = 'Error al cargar los datos del curso'
  } finally {
    cargando.value = false
  }
}

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
      categorias:  form.value.categorias,  // Enviar array de IDs
      contacto:    form.value.contacto,
      ...(sesion.rol === 'estudiante'
        ? { id_estudiante: sesion.id }
        : { id_empleador:  sesion.id })
    }

    let response
    
    if (isEditing.value && props.cursoId) {
      // MODO EDICIÓN
      response = await actualizarCurso(props.cursoId, payload)
    } else {
      // MODO CREACIÓN
      const fn = sesion.rol === 'estudiante'
        ? publicarCursoPorEstudiante
        : publicarCursoPorEmpleador
      response = await fn(payload)
    }

    if (response.success) {
      emit('enviado')
    } else {
      errorMsg.value = response.message || 'Error al guardar el curso.'
    }
  } catch (error) {
    console.error('Error:', error)
    errorMsg.value = error.message || 'Error de conexión con el servidor.'
  } finally {
    cargando.value = false
  }
}

// Cargar datos si estamos editando
onMounted(() => {
  cargarCursoParaEditar()
})
</script>