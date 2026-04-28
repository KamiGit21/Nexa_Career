<template>
  <div
    class="flex min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e2937] flex items-center justify-center pt-12 pb-12">
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
            <input v-model="form.correo" type="email" placeholder="tu.nombre@ucb.edu.bo"
              class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/30 transition-all outline-none" />
          </div>

          <!-- Contraseña con icono dentro del campo -->
          <div class="relative">
            <label class="block text-sm font-medium text-gray-600 mb-2">Contraseña</label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
              class="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] focus:ring-2 focus:ring-[#b5943a]/30 transition-all outline-none pr-12" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-6 top-[42px] text-gray-400 hover:text-gray-600 transition-colors">
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908l3.42 3.42" />
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

          <button type="submit"
            class="w-full py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 transition-all mt-4">
            Iniciar Sesión
          </button>
        </form>

        <div class="text-center mt-8 text-sm text-gray-500 space-y-2">
          <p>
            ¿Olvidaste tu contraseña?
            <router-link to="/recuperar-password" class="text-[#b5943a] font-medium hover:underline">Recupérala aquí</router-link>
          </p>
        </div>

        <div class="text-center mt-8 text-sm text-gray-500 space-y-2">
          <p>
            ¿Eres estudiante?
            <router-link to="/registro-estudiante" class="text-[#b5943a] font-medium hover:underline">Regístrate
              aquí</router-link>
          </p>
          <p>
            ¿Eres empleador?
            <router-link to="/registro-empleador" class="text-[#b5943a] font-medium hover:underline">Regístrate como
              empresa</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { obtenerEmpleadorPorGmail } from '../services/empleadorService.js'
import { obtenerEstudiantePorGmail } from '../services/estudianteService.js'
import { obtenerSupervisorPorGmail } from '../services/supervisorService.js'
import { authState } from '../auth.js' 

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const form = ref({
  correo: '',
  password: '',
  rol: 'empleador'
})

const handleSubmit = async () => {
  if (!form.value.correo || !form.value.password) {
    alert('Por favor ingresa correo y contraseña')
    return
  }

  isLoading.value = true

  try {
    let response = null
    let userData = null

    if (form.value.rol === 'empleador') {
      response = await obtenerEmpleadorPorGmail(form.value.correo)
      if (response.success && response.data) {
        userData = response.data
        if (userData.contrasena === form.value.password && userData.activo === 1) {
          localStorage.setItem('sesion', JSON.stringify({
            rol: 'empleador',
            email: userData.gmail,
            id: userData.id_empleador,
            empresa: userData.empresa
          }))
          // AVISAR AL ESTADO GLOBAL
          authState.actualizarSesion()
          router.push('/mis-ofertas')
        } else if (userData.contrasena !== form.value.password) {
          alert('La contraseña ingresada es incorrecta')
        } else if (userData.activo === 0) {
          alert('La cuenta a la que intenta acceder está inactiva')
        }
      } else {
        alert('Empleador no encontrado')
      }
    }
    else if (form.value.rol === 'estudiante') {
      response = await obtenerEstudiantePorGmail(form.value.correo)
      if (response.success && response.data) {
        userData = response.data
        if (userData.contrasena === form.value.password && userData.activo === 1) {
          localStorage.setItem('sesion', JSON.stringify({
            rol: 'estudiante',
            email: userData.gmail,
            id: userData.id_estudiante,
            nombre: userData.nombre,
            apellido: userData.apellido
          }))
          // AVISAR AL ESTADO GLOBAL
          authState.actualizarSesion()
          router.push('/ofertas')
        } else if (userData.contrasena !== form.value.password) {
          alert('La contraseña ingresada es incorrecta')
        } else if (userData.activo === 0) {
          alert('La cuenta a la que intenta acceder está inactiva')
        }
      } else {
        alert('Estudiante no encontrado')
      }
    }
    else if (form.value.rol === 'supervisor') {
      response = await obtenerSupervisorPorGmail(form.value.correo)
      if (response.success && response.data) {
        userData = response.data
        if (userData.contrasena === form.value.password && userData.activo === 1) {
          localStorage.setItem('sesion', JSON.stringify({
            rol: 'supervisor',
            email: userData.gmail,
            id: userData.id_supervisor,
            nombre: userData.nombre
          }))
          // AVISAR AL ESTADO GLOBAL
          authState.actualizarSesion()
          router.push('/dashboard-supervisor')
        } else if (userData.contrasena !== form.value.password) {
          alert('La contraseña ingresada es incorrecta')
        } else if (userData.activo === 0) {
          alert('La cuenta a la que intenta acceder está inactiva')
        }
      } else {
        alert('Supervisor no encontrado')
      }
    }
  } catch (error) {
    console.error('Error en login:', error)
    alert('Error de conexión con el servidor')
  } finally {
    isLoading.value = false
  }
}
</script>