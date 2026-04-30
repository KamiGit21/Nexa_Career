<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <CategoriasHeader @nueva="modalVisible = true" />

    <CategoriasListado
      :categorias="categorias"
      :cargando="cargando"
    />

    <NuevaCategoriaModal
      :visible="modalVisible"
      :guardando="guardando"
      @cerrar="modalVisible = false"
      @guardada="registrarCategoria"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoriasHeader       from '@/components/gestionCategorias/CategoriasHeader.vue'
import CategoriasListado      from '@/components/gestionCategorias/CategoriasListado.vue'
import NuevaCategoriaModal    from '@/components/gestionCategorias/NuevaCategoriaModal.vue'
import { listarCategorias, registrarCategoria as registrarCategoriaService } from '@/services/cursoService.js'

const categorias = ref([])
const cargando = ref(true)
const guardando = ref(false)
const modalVisible = ref(false)

// Cargar categorías al montar el componente
const cargarCategorias = async () => {
  cargando.value = true
  try {
    const res = await listarCategorias()
    if (res.success) {
      categorias.value = res.data
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    cargando.value = false
  }
}

// Registrar una nueva categoría
const registrarCategoria = async (nombre) => {
  // Validar duplicado en frontend (case-insensitive)
  const existe = categorias.value.find(c => c.categoria?.toLowerCase() === nombre.toLowerCase())
  if (existe) {
    alert('Ya existe una categoría con ese nombre')
    return
  }
  
  guardando.value = true
  try {
    const res = await registrarCategoriaService(nombre)
    if (res.success) {
      await cargarCategorias()
      modalVisible.value = false
    } else {
      alert(res.message || 'Error al registrar categoría')
    }
  } catch (error) {
    console.error('Error al registrar categoría:', error)
    alert('Error al registrar categoría')
  } finally {
    guardando.value = false
  }
}

// Cargar categorías al iniciar
onMounted(() => {
  cargarCategorias()
})
</script>
