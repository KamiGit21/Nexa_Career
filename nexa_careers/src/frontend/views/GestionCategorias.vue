<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <CategoriasHeader @nueva="modalVisible = true" />

    <CategoriasListado
      :categorias="categorias"
      :cargando="cargando"
      @archivar="abrirModalArchivar"
      @desarchivar="abrirModalDesarchivar"
    />

    <NuevaCategoriaModal
      :visible="modalVisible"
      :guardando="guardando"
      @cerrar="modalVisible = false"
      @guardada="registrarCategoria"
    />

    <ArchivarCategoriaModal
      :visible="modalArchivarVisible"
      :categoria="categoriaSeleccionada"
      :es-archivar="accionEsArchivar"
      :procesando="procesando"
      @cancelar="cerrarModalArchivar"
      @confirmar="confirmarArchivar"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CategoriasHeader       from '@/components/gestionCategorias/CategoriasHeader.vue'
import CategoriasListado      from '@/components/gestionCategorias/CategoriasListado.vue'
import NuevaCategoriaModal    from '@/components/gestionCategorias/NuevaCategoriaModal.vue'
import ArchivarCategoriaModal from '@/components/gestionCategorias/ArchivarCategoriaModal.vue'
import { registrarCategoria as apiRegistrarCategoria, listarCategoriasCompleto, cambiarEstadoCategoria } from '@/services/categoriaService.js'

const categorias            = ref([])
const cargando              = ref(false)
const guardando             = ref(false)
const procesando            = ref(false)
const modalVisible          = ref(false)
const modalArchivarVisible  = ref(false)
const categoriaSeleccionada = ref(null)
const accionEsArchivar      = ref(true)

const cargarCategorias = async () => {
  cargando.value = true
  try {
    const response = await listarCategoriasCompleto()
    if (response.success) {
      categorias.value = response.data || []
    } else {
      alert('Error al cargar las categorías: ' + response.message)
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
    alert('Error al cargar las categorías')
  } finally {
    cargando.value = false
  }
}

const registrarCategoria = async (nombre) => {
  const existe = categorias.value.find(c => c.categoria?.toLowerCase() === nombre.toLowerCase())
  if (existe) { alert('Ya existe una categoría con ese nombre'); return }
  guardando.value = true
  try {
    const response = await apiRegistrarCategoria({ categoria: nombre })
    if (response.success) {
      modalVisible.value = false
      await cargarCategorias()
      alert('Categoría registrada correctamente')
    } else {
      alert('Error al registrar: ' + response.message)
    }
  } catch (error) {
    console.error('Error al registrar categoría:', error)
    alert('Error al registrar la categoría')
  } finally {
    guardando.value = false
  }
}

const abrirModalArchivar = (categoria) => {
  categoriaSeleccionada.value = categoria
  accionEsArchivar.value      = true
  modalArchivarVisible.value  = true
}

const abrirModalDesarchivar = (categoria) => {
  categoriaSeleccionada.value = categoria
  accionEsArchivar.value      = false
  modalArchivarVisible.value  = true
}

const cerrarModalArchivar = () => {
  modalArchivarVisible.value  = false
  categoriaSeleccionada.value = null
}

const confirmarArchivar = async (categoria) => {
  procesando.value = true
  try {
    const nuevoEstado = accionEsArchivar.value ? 0 : 1
    const response = await cambiarEstadoCategoria(categoria.id_categoria, nuevoEstado)
    if (response.success) {
      cerrarModalArchivar()
      await cargarCategorias()
      alert(response.message || 'Categoría actualizada correctamente')
    } else {
      alert('Error: ' + response.message)
    }
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    alert('Error al actualizar la categoría')
  } finally {
    procesando.value = false
  }
}

onMounted(cargarCategorias)
</script>