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
      @bloquear="abrirModalBloqueo"
      @desbloquear="abrirModalDesbloqueo"
    />

    <!-- Modal Bloqueo con motivo -->
    <ConfirmarBloqueoModal
      :visible="modalBloqueoVisible"
      tipo-usuario="Supervisor"
      :nombre-usuario="`${usuarioABloquear?.nombre} ${usuarioABloquear?.apellido}`"
      :id-usuario="usuarioABloquear?.id_supervisor"
      @cerrar="modalBloqueoVisible = false"
      @confirmar="confirmarBloqueo"
    />

    <!-- Modal Desbloqueo -->
    <DesbloquearSupervisorModal
      :visible="modalDesbloqueoVisible"
      :supervisor="usuarioADesbloquear"
      @cerrar="modalDesbloqueoVisible = false"
      @desbloqueado="onDesbloqueado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SupervisoresHeader from '../components/listaSupervisores/SupervisoresHeader.vue'
import SupervisoresTabla  from '../components/listaSupervisores/SupervisoresTabla.vue'
import ConfirmarBloqueoModal from '../components/modals/ConfirmarBloqueoModal.vue'
import DesbloquearSupervisorModal from '../components/modals/DesbloquearSupervisorModal.vue'
import { listarSupervisoresAdmin, bloquearSupervisor, desbloquearSupervisor } from '../services/supervisorService.js'

const supervisores = ref([])
const loading      = ref(true)
const busqueda     = ref('')
const modalBloqueoVisible = ref(false)
const usuarioABloquear = ref(null)
const modalDesbloqueoVisible = ref(false)
const usuarioADesbloquear = ref(null)

const supervisoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return supervisores.value
  const q = busqueda.value.toLowerCase()
  return supervisores.value.filter(s =>
    `${s.nombre} ${s.apellido}`.toLowerCase().includes(q) ||
    s.gmail?.toLowerCase().includes(q)
  )
})

const abrirModalBloqueo = (usuario) => {
  usuarioABloquear.value = usuario
  modalBloqueoVisible.value = true
}

const abrirModalDesbloqueo = (usuario) => {
  usuarioADesbloquear.value = usuario
  modalDesbloqueoVisible.value = true
}

const confirmarBloqueo = async ({ id, motivo }) => {
  const res = await bloquearSupervisor(id, motivo || 'Sin motivo especificado')
  if (res.success) {
    alert('Supervisor bloqueado correctamente')
    await cargarSupervisores()
  } else {
    alert('Error al bloquear: ' + res.message)
  }
  modalBloqueoVisible.value = false
  usuarioABloquear.value = null
}

const onDesbloqueado = async () => {
  if (!usuarioADesbloquear.value?.id_supervisor) {
    alert('Error: ID de supervisor no encontrado')
    return
  }
  const res = await desbloquearSupervisor(usuarioADesbloquear.value.id_supervisor)
  if (res.success) {
    alert('Supervisor desbloqueado correctamente')
    await cargarSupervisores()
  } else {
    alert('Error al desbloquear: ' + res.message)
  }
  modalDesbloqueoVisible.value = false
  usuarioADesbloquear.value = null
}

const cargarSupervisores = async () => {
  try {
    const res = await listarSupervisoresAdmin()
    if (res.success) supervisores.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(cargarSupervisores)

</script>
