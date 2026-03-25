<template>
  <div class="bg-[#fffffd] overflow-hidden w-full min-w-[1440px] min-h-screen relative">
    <div class="absolute top-[98px] left-[624px] w-[816px] h-[806px] bg-gradient-to-br from-gray-600 to-gray-800" />
    <div class="absolute top-20 left-[199px] w-[571px] h-[902px] bg-[#fffffd] rotate-[-12.27deg]" />
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#002349]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center">
      <router-link to="/home" class="absolute top-12 left-[952px] text-[#d0b06d] text-[25px]">Home</router-link>
      <router-link to="/registro-estudiante" class="absolute top-12 left-[1089px] text-[#d0b06d] text-[25px]">Registrarse</router-link>
    </nav>

    <main>
      <h1 class="absolute top-[211px] left-[230px] text-[#d0b06d] text-[35px] font-semibold text-center">Inicio de Sesión</h1>
      <form @submit.prevent="handleSubmit" class="absolute top-[343px] left-[118px]">
        <div class="w-[573px] flex flex-col gap-2.5 mb-9">
          <label class="text-[#002349] text-[25px]">Correo electrónico institucional:</label>
          <input v-model="form.correo" type="email" class="ml-[5px] w-[550px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 text-[#002349]" />
        </div>
        <div class="w-[552px] flex flex-col gap-2.5 mb-9">
          <label class="text-[#002349] text-[25px]">Contraseña:</label>
          <input v-model="form.password" type="password" class="w-[550px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 text-[#002349]" />
        </div>
        <div class="flex flex-col gap-2.5 mb-9">
          <label class="text-[#002349] text-[25px] ml-[95px]">Selecciona tu rol:</label>
          <select v-model="form.rol" class="w-[427px] h-10 bg-white rounded-[15px] border border-[#002349] px-3 ml-[8px] text-[#002349]">
            <option value="estudiante">Estudiante</option>
            <option value="empleador">Empleador</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </div>
        <button type="submit" class="ml-[135px] w-[302px] h-[50px] bg-[#002349] rounded-[15px] text-[#d0b06d] text-3xl font-semibold hover:bg-[#003366]">
          Iniciar Sesión
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ correo: '', password: '', rol: 'estudiante' })

const handleSubmit = () => {
  // TODO: POST /api/auth/login
  localStorage.setItem('sesion', JSON.stringify({ rol: form.value.rol, email: form.value.correo }))
  const rutas = { estudiante: '/home', empleador: '/mis-ofertas', supervisor: '/home' }
  router.push(rutas[form.value.rol] || '/home')
}
</script>