<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <div class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-[#1b2a4a] mb-6">Nueva Oferta</h1>

      <form @submit.prevent="crearOferta" class="bg-white rounded-2xl shadow p-8">
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
          <input v-model="form.fecha_apertura" type="date" :min="fechaHoyParaInput"
            class="w-full px-4 py-3 border rounded-xl focus:border-[#1b2a4a] outline-none">
        </div>

        <div class="flex gap-4">
          <button type="submit" :disabled="loading"
            class="bg-[#1b2a4a] text-white px-6 py-3 rounded-xl hover:bg-[#0f1a2e] disabled:opacity-50">
            {{ loading ? 'Creando...' : 'Publicar Oferta' }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { crearOferta as crearOfertaService } from '../services/ofertaService.js'

const router = useRouter()
const loading = ref(false)

const form = ref({
  oferta: '',
  descripcion: '',
  fecha_apertura: ''
})

const fechaHoyParaInput = computed(() => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
});

const crearOferta = async () => {
  if (form.value.fecha_apertura) {
    const seleccionada = new Date(form.value.fecha_apertura + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (seleccionada < hoy) {
      alert('❌ La fecha de apertura no puede ser anterior al día de hoy.');
      return;
    }
  }
  loading.value = true

  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))
    console.log('Sesión obtenida:', sesion)

    if (!sesion || sesion.rol !== 'empleador') {
      alert('Debes iniciar sesión como empleador')
      router.push('/inicio-sesion')
      return
    }

    const payload = {
      oferta: form.value.oferta,
      descripcion: form.value.descripcion,
      id_empleador: sesion.id,
      fecha_apertura: form.value.fecha_apertura || null
    }

    console.log('Enviando al backend:', payload)
    const response = await crearOfertaService(payload)
    console.log('Respuesta del backend:', response)

    if (response.success) {
      alert('¡Oferta creada exitosamente!')
      router.push('/mis-ofertas')
    } else {
      alert(response.message || 'Error al crear la oferta')
    }
  } catch (error) {
    console.error('Error al crear oferta:', error)
    alert('Error de conexión con el servidor: ' + (error.response?.data?.message || error.message))
  } finally {
    loading.value = false
  }
}
</script>