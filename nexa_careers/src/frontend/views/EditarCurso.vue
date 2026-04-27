<!-- C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\views\EditarCurso.vue -->
<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <header class="bg-[#1b2a4a] py-4 px-8">
      <nav class="max-w-4xl mx-auto text-sm text-slate-400 flex items-center gap-2">
        <router-link to="/home" class="hover:text-white transition">Inicio</router-link>
        <span>/</span>
        <router-link :to="rutaMisCursos" class="hover:text-white transition">Mis Cursos</router-link>
        <span>/</span>
        <span class="text-white">Editar Curso</span>
      </nav>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-[#1b2a4a] mb-1">Editar Curso</h1>
      <p class="text-gray-500 mb-8">
        Modifica la información de tu curso
      </p>

      <div v-if="errorCarga" class="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p class="text-red-600">{{ errorCarga }}</p>
        <button 
          @click="router.back()"
          class="mt-3 px-4 py-2 bg-gray-200 rounded-lg text-sm"
        >
          Volver atrás
        </button>
      </div>

      <PublicarCursoForm 
        v-else
        :cursoId="cursoId"
        @enviado="onActualizado"
      />
    </div>

    <ConfirmacionModal
      :visible="modalVisible"
      titulo="¡Curso actualizado!"
      mensaje="Tu curso ha sido actualizado correctamente."
      @cerrar="irAMisCursos"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicarCursoForm from '@/components/publicarCurso/PublicarCursoForm.vue'
import ConfirmacionModal from '@/components/publicarCurso/ConfirmacionCursoModal.vue'

const route = useRoute()
const router = useRouter()
const cursoId = computed(() => parseInt(route.params.id))
const modalVisible = ref(false)
const errorCarga = ref('')

// Determinar ruta de "Mis Cursos" según el rol del usuario
const rutaMisCursos = computed(() => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')
  if (sesion.rol === 'empleador') {
    return '/mis-cursos-empleador'
  } else if (sesion.rol === 'estudiante') {
    return '/mis-cursos'
  }
  return '/home'
})

const onActualizado = () => {
  modalVisible.value = true
}

const irAMisCursos = () => {
  modalVisible.value = false
  router.push(rutaMisCursos.value)
}
</script>