<template>
  <div class="bg-[#fffffd] w-full min-w-[1440px] min-h-[1751px] relative">
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#002349]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center">
      <router-link to="/home" class="absolute top-12 left-[952px] text-[#d0b06d] text-[25px]">Home</router-link>
      <router-link to="/registro-estudiante" class="absolute top-12 left-[1089px] text-[#d0b06d] text-[25px]">Registro Estudiante</router-link>
    </nav>

    <div class="absolute top-[126px] left-0 w-full h-[1625px] bg-gradient-to-br from-gray-700 to-gray-900" />

    <div class="absolute top-[205px] left-[150px] w-[1139px] bg-white rounded-[25px] pb-16">
      <h1 class="pt-[94px] text-center text-[#d0b06d] text-[50px] font-semibold">Registro de Supervisor</h1>

      <form @submit.prevent="handleSubmit" class="px-[91px] mt-8" novalidate>
        <div class="flex gap-8 mb-6">
          <div class="flex-1">
            <label class="text-[#002349] text-3xl">Nombre:</label>
            <input v-model="form.nombre" class="w-full h-[50px] rounded-[15px] border border-[#002349] px-4 text-xl" />
          </div>
          <div class="flex-1">
            <label class="text-[#002349] text-3xl">Apellido:</label>
            <input v-model="form.apellido" class="w-full h-[50px] rounded-[15px] border border-[#002349] px-4 text-xl" />
          </div>
        </div>

        <div class="mb-6">
          <label class="text-[#002349] text-3xl">Correo institucional (@ucb.edu.bo):</label>
          <input v-model="form.correo" type="email" class="w-full h-[50px] rounded-[15px] border border-[#002349] px-4 text-xl" />
        </div>

        <div class="flex gap-8 mb-6">
          <div class="flex-1">
            <label class="text-[#002349] text-3xl">Dirección:</label>
            <input v-model="form.direccion" class="w-full h-[50px] rounded-[15px] border border-[#002349] px-4 text-xl" />
          </div>
          <div class="flex-1">
            <label class="text-[#002349] text-3xl">Teléfono:</label>
            <input v-model="form.telefono" type="tel" class="w-full h-[50px] rounded-[15px] border border-[#002349] px-4 text-xl" />
          </div>
        </div>

        <div class="flex justify-center mt-8">
          <button type="submit" 
                  class="w-[300px] h-[65px] bg-[#002349] rounded-[15px] text-[#d0b06d] text-[35px] font-semibold">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  nombre: '',
  apellido: '',
  correo: '',
  direccion: '',
  telefono: ''
})

// TODO: POST /api/supervisores
const handleSubmit = () => {
  if (!form.value.nombre || !form.value.apellido || !form.value.correo) {
    alert('Por favor completa los campos obligatorios')
    return
  }
  alert('¡Supervisor registrado exitosamente!')
}
</script>