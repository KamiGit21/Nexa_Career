<template>
  <div class="min-h-screen bg-[#F5F0E8] p-8">
    <SupervisoresHeader
      :total="supervisores.length"
      v-model:busqueda="busqueda"
    />

    <div v-if="loading" class="text-center py-20 text-gray-500">Cargando supervisores...</div>

    <SupervisoresTabla
      v-else
      :supervisores="supervisoresFiltrados"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SupervisoresHeader from '../components/listaSupervisores/SupervisoresHeader.vue'
import SupervisoresTabla  from '../components/listaSupervisores/SupervisoresTabla.vue'
import { listarSupervisoresAdmin } from '../services/supervisorService.js'

const supervisores = ref([])
const loading      = ref(true)
const busqueda     = ref('')

const supervisoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return supervisores.value
  const q = busqueda.value.toLowerCase()
  return supervisores.value.filter(s =>
    `${s.nombre} ${s.apellido}`.toLowerCase().includes(q) ||
    s.gmail?.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  try {
    const res = await listarSupervisoresAdmin()
    if (res.success) supervisores.value = res.data
  } finally {
    loading.value = false
  }
})
</script>