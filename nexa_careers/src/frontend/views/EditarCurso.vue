<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <header class="bg-[#1b2a4a] py-4 px-8">
      <nav class="max-w-4xl mx-auto text-sm text-slate-400 flex items-center gap-2">
        <span class="hover:text-white transition cursor-pointer" @click="$router.push('/mis-cursos')">
          Mis Cursos
        </span>
        <span>/</span>
        <span class="text-white">Editar Curso</span>
      </nav>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-[#1b2a4a] mb-1">Editar Curso</h1>
      <p class="text-gray-500 mb-8">
        Modifica los datos del curso. Los cambios quedarán pendientes de revisión.
      </p>

      <!-- integración paara mostrar mensaje de guardado exitoso, esto lo hace quien haga la integración, cambia a esto guardado.value = true y luego setTimeout(() => guardado.value = false, 4000)
     hacer guardado.value = true y luego setTimeout(() => guardado.value = false, 4000)

<div v-if="guardado"
  class="mb-6 px-5 py-4 bg-green-50 border border-green-200 rounded-xl
         flex items-center gap-3 text-green-700 text-sm font-semibold">
  ✅ Cambios guardados correctamente
</div>
-->

      <div v-if="cargando" class="text-center py-20 text-gray-500">
        Cargando curso...
      </div>

      <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <CursoEditarForm
          :curso="curso"
          :descripcion="descripcion"
          :contacto="contacto"
          :fecha-creacion="fechaCreacion"
          :estado="estado"
          :guardando="guardando"
          :guardado="guardado"
          :error="error"
          @guardar="onGuardar"
          @cancelar="$router.push('/mis-cursos')"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import CursoEditarForm from '../components/misCursos/CursoEditarForm.vue'

const route = useRoute()

// integración: cargar con obtenerCursoPorId
const cargando     = ref(false)
const guardando    = ref(false)
const guardado     = ref(false)
const error        = ref('')

//integración: poner los valores desde la respuesta del servicio
const curso        = ref('')
const descripcion  = ref('')
const contacto     = ref('')
const fechaCreacion = ref('')
const estado       = ref(0)

const onGuardar = (form) => {
  //integración de guardado aqui
  console.log('Datos a guardar:', { id: route.params.id, ...form })
}
</script>