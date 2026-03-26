<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#0f172a] flex items-center justify-center p-6">
    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-[#1b2a4a] to-[#002349] px-10 py-12 text-center">
        <div class="mx-auto w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-5xl">
          🏢
        </div>
        <h1 class="text-white text-3xl font-bold">Registro de Empleador</h1>
        <p class="text-[#d0b06d] mt-2">Conecta tu empresa con talento UCB</p>
      </div>

      <div class="p-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombre de la Empresa</label>
            <input v-model="form.empresa" type="text" placeholder="Ej. Empresa S.A."
                   class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Nombre del Representante</label>
              <input v-model="form.nombre" type="text" placeholder="Nombre"
                     class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Apellido</label>
              <input v-model="form.apellido" type="text" placeholder="Apellido"
                     class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Correo institucional (@ucb.edu.bo)</label>
            <input v-model="form.correo" type="email" placeholder="empresa@ucb.edu.bo"
                   class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="Dirección"
                     class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="+591 71234567"
                     class="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div>
          </div>

          <!-- Sector / Rubro - Limpio (sin hardcode) -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Sector / Rubro</label>
            <select v-model="form.sector" 
                    class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all">
              <option value="">Seleccionar sector...</option>
              <!-- Las opciones se cargarán desde el backend -->
            </select>
          </div>

          <button type="submit"
                  class="w-full py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 transition-all mt-6">
            Registrarse como Empleador
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const form = ref({
  empresa: '',
  nombre: '',
  apellido: '',
  correo: '',
  direccion: '',
  telefono: '',
  sector: ''
})

const sectores = ref([])   // Se llenará desde backend

// TODO: GET /api/sectores (o /api/categorias)
const cargarSectores = async () => {
  try {
    // const res = await fetch('/api/sectores')
    // sectores.value = await res.json()
    
    // Temporal mientras no tengas el endpoint
    sectores.value = ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Manufactura', 'Otro']
  } catch (e) {
    console.error('Error al cargar sectores', e)
  }
}

const handleSubmit = () => {
  if (!form.value.empresa || !form.value.nombre || !form.value.correo) {
    alert('Por favor completa los campos obligatorios')
    return
  }
  // TODO: POST /api/empleadores
  alert('¡Empleador registrado exitosamente!')
}

onMounted(cargarSectores)
</script>