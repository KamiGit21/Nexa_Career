<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e2937] flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
      
      <!-- Header -->
      <div class="bg-[#1b2a4a] px-10 py-12 text-center">
        <div class="mx-auto w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
          <span class="text-4xl">🔑</span>
        </div>
        <h1 class="text-white text-3xl font-bold">Bienvenido de nuevo</h1>
        <p class="text-[#d0b06d] mt-2">Inicia sesión para continuar</p>
      </div>

      <!-- Formulario -->
      <div class="p-10">
        <form @submit.prevent="handleSubmit" class="space-y-7">
          
          <!-- Correo -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Correo institucional</label>
            <input 
              v-model="form.correo" 
              type="email" 
              placeholder="tu.nombre@ucb.edu.bo"
              class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/30 transition-all outline-none"
            />
          </div>

          <!-- Contraseña con icono dentro del campo -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-600 mb-2">Contraseña</label>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/30 transition-all outline-none pr-12"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-6 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908l3.42 3.42" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
              </svg>
            </button>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Rol</label>
            <select v-model="form.rol" 
                    class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/30 transition-all">
              <option value="estudiante">Estudiante</option>
              <option value="empleador">Empleador</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <button 
            type="submit"
            class="w-full py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 transition-all mt-4">
            Iniciar Sesión
          </button>
        </form>

        <div class="text-center mt-8 text-sm text-gray-500">
          ¿No tienes cuenta? 
          <router-link to="/registro-estudiante" class="text-[#b5943a] font-medium hover:underline">Regístrate aquí</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)

const form = ref({
  correo: '',
  password: '',
  rol: 'estudiante'
})

const handleSubmit = () => {
  if (!form.value.correo || !form.value.password) {
    alert('Por favor ingresa correo y contraseña')
    return
  }

  // TODO: POST /api/auth/login
  localStorage.setItem('sesion', JSON.stringify({ 
    rol: form.value.rol, 
    email: form.value.correo 
  }))

  const rutas = {
    estudiante: '/home',
    empleador: '/mis-ofertas',
    supervisor: '/home'
  }

  router.push(rutas[form.value.rol] || '/home')
}
</script>