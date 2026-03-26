<template>
  <div>
    <navbar />
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#0f172a] flex items-center justify-center p-6">
    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
      
      <!-- Header -->
      <div class="h-2 bg-gradient-to-r from-[#b5943a] to-[#d0b06d]"></div>
      <div class="px-10 pt-10 pb-6 text-center">
        <div class="mx-auto w-20 h-20 bg-[#f8f1e3] rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-inner">
          🎓
        </div>
        <h1 class="text-3xl font-bold text-[#1b2a4a]">Registro de Estudiante</h1>
        <p class="text-gray-500 mt-2">Comienza tu camino profesional con Nexa Careers</p>
      </div>

      <div class="px-10 pb-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="text-sm font-medium text-gray-600">Nombre</label>
              <input v-model="form.nombre" type="text" placeholder="María" 
                     class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Apellido</label>
              <input v-model="form.apellido" type="text" placeholder="Gonzales" 
                     class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Correo Institucional</label>
            <input v-model="form.correo" type="email" placeholder="maria.gonzales@ucb.edu.bo"
                   class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="text-sm font-medium text-gray-600">Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="La Paz, Bolivia"
                     class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="+591 71234567"
                     class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/20 transition-all" />
            </div>
          </div>

          <button 
            type="submit"
            class="w-full py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-lg mt-6">
            Registrarme como Estudiante
          </button>
        </form>
      </div>

      <div class="text-center pb-8 text-sm text-gray-500">
        ¿Ya tienes cuenta? 
        <router-link to="/login" class="text-[#b5943a] font-medium hover:underline">Inicia sesión</router-link>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'

const form = ref({
  nombre: '',
  apellido: '',
  correo: '',
  direccion: '',
  telefono: ''
})

const handleSubmit = () => {
  if (!form.value.nombre || !form.value.apellido || !form.value.correo) {
    alert('Por favor completa los campos obligatorios')
    return
  }
  // TODO: POST /api/estudiantes
  alert('¡Estudiante registrado exitosamente!')
}
</script>