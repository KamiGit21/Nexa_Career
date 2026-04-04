<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-7xl mx-auto px-6 py-10">

      <MisCursosHeader />

      <div v-if="loading" class="text-center py-20 text-gray-500">
        Cargando tus cursos...
      </div>

      <CursosVacio v-else-if="cursos.length === 0" />

      <CursoGrid v-else :cursos="cursos" />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listarCursosPorEstudiante, listarCursosPorEmpleador } from '../services/cursoService.js'
import MisCursosHeader from '../components/misCursos/MisCursosHeader.vue'
import CursoGrid from '../components/misCursos/CursoGrid.vue'
import CursosVacio from '../components/misCursos/CursosVacio.vue'

const router = useRouter()
const cursos = ref([])
const loading = ref(true)

onMounted(async () => {
  const sesion = JSON.parse(localStorage.getItem('sesion') || '{}')

  if (!sesion.rol || !sesion.id) {
    router.push('/login')
    return
  }

  try {
    let response

    if (sesion.rol === 'estudiante') {
      response = await listarCursosPorEstudiante(sesion.id)
    } else if (sesion.rol === 'empleador') {
      response = await listarCursosPorEmpleador(sesion.id)
    } else {
      router.push('/home')
      return
    }

    if (response.success) {
      cursos.value = response.data
    }
  } catch (error) {
    console.error('Error al cargar cursos:', error)
  } finally {
    loading.value = false
  }
})
</script>