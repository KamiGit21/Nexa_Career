<template>
  <Transition name="modal-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
      style="background: rgba(15,23,42,0.85)"
      @click.self="$emit('cerrar')"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="flex flex-col items-center pt-10 pb-6 px-8">

          <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <rect x="9" y="18" width="20" height="15" rx="3.5" stroke="#16a34a" stroke-width="2.2"/>
              <path d="M13 18C13 11 25 11 25 16" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round"/>
              <circle cx="19" cy="25" r="2.5" fill="#16a34a"/>
              <rect x="17.8" y="25" width="2.4" height="4.5" rx="1.2" fill="#16a34a"/>
            </svg>
          </div>

          <h2 class="text-lg font-semibold text-slate-800 mb-5">Desbloquear estudiante</h2>

          <DesbloquearUsuarioCard :estudiante="estudiante" class="mb-6" />

          <p class="text-sm text-slate-500 text-center leading-relaxed mb-4">
            ¿Estás seguro de que deseas desbloquear a esta cuenta? El usuario podrá
            volver a acceder y operar en la plataforma.
          </p>

          <div class="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 mb-6">
            <p class="text-xs text-green-700 text-center">El cambio de estado aplica de inmediato.</p>
          </div>

          <DesbloquearBotones
            :cargando="desbloqueando"
            @cancelar="$emit('cerrar')"
            @confirmar="ejecutarDesbloqueo"
          />

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch }          from 'vue'
import DesbloquearUsuarioCard  from './DesbloquearUsuarioCard.vue'
import DesbloquearBotones      from './DesbloquearBotones.vue'

const props = defineProps({
  visible:    { type: Boolean, default: false },
  estudiante: { type: Object,  default: null  }
})

const emit = defineEmits(['cerrar', 'desbloqueado'])

const desbloqueando = ref(false)

const ejecutarDesbloqueo = async () => {
  desbloqueando.value = true
  try {
    const res = await fetch(
      `http://localhost:3000/api/estudiantes/${props.estudiante?.id_estudiante}/estado`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: 1 })
      }
    )
    const data = await res.json()
    if (data.success) {
      emit('desbloqueado')
    } else {
      alert('Error al desbloquear: ' + data.message)
    }
  } catch (e) {
    alert('Error de conexión al intentar desbloquear')
  } finally {
    desbloqueando.value = false
    emit('cerrar')
  }
}

watch(() => props.visible, (val) => {
  if (!val) desbloqueando.value = false
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }
</style>