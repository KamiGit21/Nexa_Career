<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <Navbar />
    
    <div class="max-w-4xl mx-auto px-6 py-10">
      <div class="flex items-center gap-4 mb-6">
        <button @click="$router.back()" class="text-[#1b2a4a] hover:text-[#b89b4d]">
          ← Volver
        </button>
        <h1 class="text-3xl font-bold text-[#1b2a4a]">Editar Oferta</h1>
      </div>
      
      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando...</div>
      
      <form v-else @submit.prevent="actualizarOferta" class="bg-white rounded-2xl shadow p-8">
        <div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2">Título de la oferta *</label>
          <input v-model="form.oferta" type="text" required
                 class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none">
        </div>

        <div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2">Descripción *</label>
          <textarea v-model="form.descripcion" rows="6" required
                    class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none"></textarea>
        </div>

        <div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2">Fecha de apertura (opcional)</label>
          <input v-model="form.fecha_apertura" type="date"
                 class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none">
        </div>

        <!--<div class="mb-5">
          <label class="block text-gray-700 font-medium mb-2">Estado</label>
          <select v-model="form.estado" 
                  class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none">
            <option :value="0">Pendiente</option>
            <option :value="1">Aprobada</option>
            <option :value="2">Rechazada</option>
          </select>
        </div>-->

        <div v-if="form.estado === 2" class="mb-5">
          <label class="block text-gray-700 font-medium mb-2">Motivo de rechazo</label>
          <textarea v-model="form.rechazo" rows="3"
                    class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none"></textarea>
        </div>

        <div class="flex gap-4">
          <button type="submit" :disabled="saving"
                  class="bg-[#1b2a4a] text-white px-6 py-3 rounded-xl hover:bg-[#0f1a2e] disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button type="button" @click="$router.back()"
                  class="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { obtenerOfertaPorId, editarOferta } from '../services/ofertaService.js'
// import Navbar from '@/components/layout/Navbar.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const saving = ref(false)

const form = ref({
  oferta: '',
  descripcion: '',
  fecha_apertura: '',
  estado: 0,
  rechazo: ''
})

onMounted(async () => {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))
    if (!sesion || sesion.rol !== 'empleador') {
      router.push('/inicio-sesion')
      return
    }
    
    const ofertaId = route.params.ofertaId
    console.log('Cargando oferta ID:', ofertaId)
    
    const response = await obtenerOfertaPorId(ofertaId)
    console.log('Respuesta:', response)
    
    if (response.success) {
      const oferta = response.data
      form.value = {
        oferta: oferta.oferta,
        descripcion: oferta.descripcion || '',
        fecha_apertura: oferta.fecha_apertura ? oferta.fecha_apertura.split('T')[0] : '',
        estado: oferta.estado,
        rechazo: oferta.rechazo || ''
      }
    } else {
      alert('No se encontró la oferta')
      router.push('/mis-ofertas')
    }
  } catch (error) {
    console.error('Error al cargar oferta:', error)
    alert('Error al cargar los datos de la oferta')
    router.push('/mis-ofertas')
  } finally {
    loading.value = false
  }
})

const actualizarOferta = async () => {
  saving.value = true
  
  try {
    const ofertaId = route.params.ofertaId
    
    const payload = {
      oferta: form.value.oferta,
      descripcion: form.value.descripcion,
      fecha_apertura: form.value.fecha_apertura || null,
      rechazo: form.value.estado === 2 ? form.value.rechazo : ''
    }
    
    console.log('Enviando actualización:', payload)
    const response = await editarOferta(ofertaId, payload)
    console.log('Respuesta:', response)
    
    if (response.success) {
      alert('¡Oferta actualizada exitosamente!')
      router.push('/mis-ofertas')
    } else {
      alert(response.message || 'Error al actualizar la oferta')
    }
  } catch (error) {
    console.error('Error al actualizar:', error)
    alert('Error de conexión con el servidor')
  } finally {
    saving.value = false
  }
}
</script>