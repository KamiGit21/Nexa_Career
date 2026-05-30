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
  // INTEGRACION AQUI
  cargando.value = false
}

const registrarCategoria = async (nombre) => {
  const existe = categorias.value.find(c => c.categoria?.toLowerCase() === nombre.toLowerCase())
  if (existe) { alert('Ya existe una categoría con ese nombre'); return }
  guardando.value = true
  // INTEGRACION AQUI
  guardando.value = false
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
  // INTEGRACION AQUI
  procesando.value = false
}

onMounted(cargarCategorias)
</script>