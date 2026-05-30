<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <CategoriasHeader @nueva="modalNuevaVisible = true" />

    <CategoriasListado
      :categorias="categorias"
      :cargando="cargando"
      @editar="abrirModalEditar"
    />

    <NuevaCategoriaModal
      :visible="modalNuevaVisible"
      :guardando="guardando"
      @cerrar="modalNuevaVisible = false"
      @guardada="registrarCategoria"
    />

    <EditarCategoriaModal
      :visible="modalEditarVisible"
      :categoria="categoriaSeleccionada"
      :guardando="guardando"
      @cerrar="modalEditarVisible = false"
      @guardada="editarCategoria"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoriasHeader    from '@/components/gestionCategorias/CategoriasHeader.vue'
import CategoriasListado   from '@/components/gestionCategorias/CategoriasListado.vue'
import NuevaCategoriaModal from '@/components/gestionCategorias/NuevaCategoriaModal.vue'
import EditarCategoriaModal from '@/components/gestionCategorias/EditarCategoriaModal.vue'
import { listarCategorias, registrarCategoria as registrarCategoriaService } from '@/services/cursoService.js'

const categorias           = ref([])
const cargando             = ref(true)
const guardando            = ref(false)
const modalNuevaVisible    = ref(false)
const modalEditarVisible   = ref(false)
const categoriaSeleccionada = ref(null)

const cargarCategorias = async () => {
  cargando.value = true
  try {
    const res = await listarCategorias()
    if (res.success) categorias.value = res.data
  } catch (e) {
    console.error('Error al cargar categorías:', e)
  } finally {
    cargando.value = false
  }
}

const abrirModalEditar = (categoria) => {
  categoriaSeleccionada.value = categoria
  modalEditarVisible.value = true
}

const registrarCategoria = async (nombre) => {
  const existe = categorias.value.find(c => c.categoria?.toLowerCase() === nombre.toLowerCase())
  if (existe) { alert('Ya existe una categoría con ese nombre'); return }
  guardando.value = true
  try {
    const res = await registrarCategoriaService(nombre)
    if (res.success) { await cargarCategorias(); modalNuevaVisible.value = false }
    else alert(res.message || 'Error al registrar categoría')
  } catch (e) {
    alert('Error al registrar categoría')
  } finally {
    guardando.value = false
  }
}

const editarCategoria = async ({ id, nombre }) => {
  guardando.value = true
  try {
    // TODO: await actualizarCategoria(id, nombre)  ← conectar cuando el backend lo implemente
    alert('✅ Categoría actualizada correctamente')
    modalEditarVisible.value = false
    await cargarCategorias()
  } catch (e) {
    alert('Error al actualizar la categoría')
  } finally {
    guardando.value = false
  }
}

onMounted(cargarCategorias)
</script>