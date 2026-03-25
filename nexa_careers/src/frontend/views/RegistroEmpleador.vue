<template>
  <div class="min-h-screen w-full bg-[#1b2a4a] relative flex flex-col">
    <div class="absolute inset-0 bg-gradient-to-br from-[#1b2a4a] via-[#1e3060] to-[#1b2a4a]" />
    
    <nav class="relative z-10 w-full flex items-center justify-end px-8 py-4 gap-12 text-white text-[15px]">
      <router-link to="/home" class="hover:opacity-80">Home</router-link>
      <router-link to="/registro-estudiante" class="hover:opacity-80">Registro Estudiante</router-link>
    </nav>

    <main class="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
      <div class="w-full max-w-[630px] bg-white rounded-2xl shadow-2xl px-10 py-8">
        <h1 class="font-bold text-[#b5943a] text-[26px] text-center mb-6">Registro de Empleador</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[#333333] text-sm">Nombre de la Empresa:</label>
            <input v-model="form.empresa" type="text" placeholder="Ej. Empresa S.A." 
                   class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="text-[#333333] text-sm">Nombre del Representante:</label>
              <input v-model="form.nombre" type="text" placeholder="Nombre" 
                     class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
            </div>
            <div class="flex-1">
              <label class="text-[#333333] text-sm">Apellido:</label>
              <input v-model="form.apellido" type="text" placeholder="Apellido" 
                     class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[#333333] text-sm">Correo institucional (@ucb.edu.bo):</label>
            <input v-model="form.correo" type="email" placeholder="empresa@ucb.edu.bo" 
                   class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label class="text-[#333333] text-sm">Dirección:</label>
              <input v-model="form.direccion" type="text" placeholder="Dirección" 
                     class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
            </div>
            <div class="flex-1">
              <label class="text-[#333333] text-sm">Teléfono:</label>
              <input v-model="form.telefono" type="tel" placeholder="Número" 
                     class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[#333333] text-sm">Sector / Rubro:</label>
            <select v-model="form.sector" class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm focus:border-[#b5943a]">
              <option value="">Seleccionar sector...</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Salud">Salud</option>
              <option value="Educación">Educación</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Manufactura">Manufactura</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div class="flex justify-center mt-4">
            <button type="submit" 
                    class="w-full max-w-[320px] bg-[#1b2a4a] hover:bg-[#243660] text-white font-bold py-3 rounded-lg transition-colors">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  empresa: '',
  nombre: '',
  apellido: '',
  correo: '',
  direccion: '',
  telefono: '',
  sector: ''
})

// TODO: POST /api/empleadores
const handleSubmit = () => {
  // Validación básica
  if (!form.value.empresa || !form.value.nombre || !form.value.correo) {
    alert('Por favor completa los campos obligatorios')
    return
  }
  alert('¡Empleador registrado exitosamente!')
  // Redirigir o mostrar modal según tu flujo
}
</script>