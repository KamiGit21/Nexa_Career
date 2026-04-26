<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <div class="max-w-4xl mx-auto px-6 py-10">
      <div class="flex items-center gap-4 mb-6">
        <button @click="$router.back()" class="text-[#1b2a4a] hover:text-[#b89b4d] transition-colors">← Volver</button>
        <h1 class="text-3xl font-bold text-[#1b2a4a]">Editar Oferta</h1>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">Cargando...</div>

      <form v-else @submit.prevent="actualizarOferta" class="bg-white rounded-2xl shadow p-8 space-y-5">

        <div>
          <label class="block text-gray-700 font-medium mb-2">Título de la oferta *</label>
          <input v-model="form.oferta" type="text" required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1b2a4a] outline-none" />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Descripción *</label>
          <textarea v-model="form.descripcion" rows="6" required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1b2a4a] outline-none"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-2">Modalidad *</label>
          <select v-model="form.modalidad" required
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1b2a4a] outline-none bg-white">
            <option value="" disabled>Selecciona una modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <!-- ✅ Selector de categoría -->
        <CategoriaOfertaSelect v-model="form.id_categoria" />

        <div>
          <label class="block text-gray-700 font-medium mb-2">Fecha de apertura (opcional)</label>
          <input v-model="form.fecha_apertura" type="date" :min="fechaHoyParaInput"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1b2a4a] outline-none" />
        </div>

        <div v-if="form.estado === 2" class="p-4 bg-red-50 border border-red-100 rounded-xl">
          <label class="block text-gray-700 font-medium mb-2">Motivo de rechazo</label>
          <textarea v-model="form.rechazo" rows="3"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[#1b2a4a] outline-none"></textarea>
        </div>

        <div class="flex gap-4 pt-2">
          <button type="submit" :disabled="saving"
            class="bg-[#1b2a4a] text-white px-6 py-3 rounded-xl hover:bg-[#0f1a2e] disabled:opacity-50 transition-colors">
            {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
          </button>
          <button type="button" @click="$router.back()"
            class="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { obtenerOfertaPorId, editarOferta } from '../services/ofertaService.js'
import CategoriaOfertaSelect from '../components/publicarOferta/CategoriaOfertaSelect.vue'

const router  = useRouter()
const route   = useRoute()
const loading = ref(true)
const saving  = ref(false)

const form = ref({
  oferta: '', descripcion: '', modalidad: '',
  fecha_apertura: '', estado: 0, rechazo: '', id_categoria: ''
})

const fechaHoyParaInput = computed(() => {
  const hoy = new Date()
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
})

onMounted(async () => {
  try {
    const sesion = JSON.parse(localStorage.getItem('sesion'))
    if (!sesion || sesion.rol !== 'empleador') { router.push('/login'); return }

    const response = await obtenerOfertaPorId(route.params.ofertaId)
    if (response.success) {
      const o = response.data
      form.value = {
        oferta:         o.oferta,
        descripcion:    o.descripcion || '',
        modalidad:      o.modalidad || '',
        fecha_apertura: o.fecha_apertura ? o.fecha_apertura.split('T')[0] : '',
        estado:         o.estado,
        rechazo:        o.rechazo || '',
        id_categoria:   o.id_categoria ? String(o.id_categoria) : ''
      }
    } else {
      alert('No se encontró la oferta'); router.push('/mis-ofertas')
    }
  } catch { alert('Error al cargar los datos de la oferta'); router.push('/mis-ofertas') }
  finally { loading.value = false }
})

const actualizarOferta = async () => {
  if (form.value.fecha_apertura) {
    const sel = new Date(form.value.fecha_apertura + 'T00:00:00')
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    if (sel < hoy) { alert('❌ La fecha de apertura no puede ser anterior al día de hoy.'); return }
  }
  saving.value = true
  try {
    const payload = {
      oferta:        form.value.oferta,
      descripcion:   form.value.descripcion,
      modalidad:     form.value.modalidad,
      fecha_apertura:form.value.fecha_apertura || null,
      rechazo:       form.value.estado === 2 ? form.value.rechazo : '',
      id_categoria:  form.value.id_categoria || null
    }
    const response = await editarOferta(route.params.ofertaId, payload)
    if (response.success) { alert('¡Oferta actualizada exitosamente!'); router.push('/mis-ofertas') }
    else { alert(response.message || 'Error al actualizar la oferta') }
  } catch { alert('Error de conexión con el servidor') }
  finally { saving.value = false }
}
</script>