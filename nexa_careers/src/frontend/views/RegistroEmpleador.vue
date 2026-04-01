<template>
  <div>
  <navbar />
  <div class="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#0f172a] flex items-center justify-center p-6">
    <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div class="bg-[#1b2a4a] px-10 py-12 text-center">
        <div class="mx-auto w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6 text-5xl">🏢</div>
        <h1 class="text-white text-3xl font-bold">Registro de Empleador</h1>
        <p class="text-[#d0b06d] mt-2">Conecta tu empresa con talento UCB</p>
      </div>

      <div class="p-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="text-sm font-medium text-gray-600">Nombre de la Empresa</label>
            <input v-model="form.empresa" type="text" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" required />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="text-sm font-medium text-gray-600">Nombre del Representante</label>
              <input v-model="form.nombre" type="text" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" required />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Apellido</label>
              <input v-model="form.apellido" type="text" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" required />
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Correo institucional (@ucb.edu.bo)</label>
            <input v-model="form.correo" type="email" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" required />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <!-- <div>
              <label class="text-sm font-medium text-gray-600">Dirección</label>
              <input v-model="form.direccion" type="text" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div> -->
            <div>
              <label class="text-sm font-medium text-gray-600">Teléfono</label>
              <input v-model="form.telefono" type="tel" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
            </div>
          </div>

          <!-- Contraseña con fuerza -->
          <div>
            <label class="text-sm font-medium text-gray-600">Contraseña</label>
            <div class="relative">
              <input v-model="form.contrasena" :type="showPassword ? 'text' : 'password'" @input="calcularFuerza"
                     class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a] pr-12" required />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 19 3.732 16.057 2.458 12z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908l3.42 3.42" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" /></svg>
              </button>
            </div>

            <div class="flex items-center gap-3 mt-3">
              <div class="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full transition-all duration-300" :style="{ width: porcentajeFuerza + '%', backgroundColor: colorFuerza }"></div>
              </div>
              <span class="text-xs font-medium" :style="{ color: colorFuerza }">{{ etiquetaFuerza }}</span>
            </div>

            <ul class="mt-4 space-y-1 text-sm">
              <li v-for="req in requisitos" :key="req.label" :class="req.met ? 'text-green-600' : 'text-red-500'">{{ req.label }}</li>
            </ul>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-600">Confirmar Contraseña</label>
            <input v-model="form.confirmar" type="password" class="mt-2 w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#b5943a]" required />
          </div>

          <button type="submit" class="w-full py-4 bg-gradient-to-r from-[#1b2a4a] to-[#002349] text-white font-semibold rounded-2xl hover:brightness-110 mt-6">
            Registrarme como Empleador
          </button>
        </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registrarEmpleador } from '../services/empleadorService.js'
import navbar from '../components/layout/Navbar.vue'

const router = useRouter()

const showPassword = ref(false)
const porcentajeFuerza = ref(0)
const colorFuerza = ref('#db0000')
const etiquetaFuerza = ref('Débil')

const form = ref({
  empresa: '',
  nombre: '',
  apellido: '',
  correo: '',
  direccion: '',
  telefono: '',
  contrasena: '',
  confirmar: ''
})

const requisitos = ref([
  { label: 'Al menos 12 caracteres', met: false },
  { label: 'Una letra mayúscula', met: false },
  { label: 'Una letra minúscula', met: false },
  { label: 'Un número', met: false },
  { label: 'Un símbolo', met: false }
])

// esta funcion estaba vacia
const calcularFuerza = () => {
  const pwd = form.value.contrasena
  if (!pwd) {
    porcentajeFuerza.value = 0
    etiquetaFuerza.value = 'Débil'
    colorFuerza.value = '#db0000'
    return
  }
  
  const req = requisitos.value
  req[0].met = pwd.length >= 12
  req[1].met = /[A-Z]/.test(pwd)
  req[2].met = /[a-z]/.test(pwd)
  req[3].met = /[0-9]/.test(pwd)
  req[4].met = /[^A-Za-z0-9]/.test(pwd)
  
  const cumplidos = req.filter(r => r.met).length
  const porcentaje = (cumplidos / req.length) * 100
  porcentajeFuerza.value = porcentaje
  
  if (porcentaje <= 40) {
    etiquetaFuerza.value = 'Débil'
    colorFuerza.value = '#db0000'
  } else if (porcentaje <= 80) {
    etiquetaFuerza.value = 'Media'
    colorFuerza.value = '#f4b400'
  } else {
    etiquetaFuerza.value = 'Fuerte'
    colorFuerza.value = '#0f9d58'
  }
}

const handleSubmit = async () => {
  console.log('CLICK DETECTADO ')
  // Validación básica
  if (form.value.contrasena !== form.value.confirmar) {
    alert('Las contraseñas no coinciden ')
    return
  }

  try {
    const response = await registrarEmpleador({
      empresa: form.value.empresa,
      telefono: form.value.telefono,
      gmail: form.value.correo, // IMPORTANTE: backend espera "gmail"
      contrasena: form.value.contrasena
    })

    if (response.success) {
      alert('Registro exitoso 🚀')

      localStorage.setItem('sesion', JSON.stringify({
        rol: 'empleador',
        email: form.value.correo
      }))

      router.push('/mis-ofertas')
    } else {
      alert(response.message || 'Error al registrar ❌')
    }

  } catch (error) {
    console.error(error)
    alert('Error de conexión con el servidor ❌')
  }
}
</script>
