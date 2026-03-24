<template>
  <div class="bg-[#fffffd] w-full min-w-[1440px] min-h-[1751px] relative">
    <div class="absolute top-0 left-0 w-full h-[126px] bg-[#002349]" />
    <nav class="absolute top-0 left-0 w-full h-[126px] flex items-center">
      <div class="absolute top-12 left-[952px] text-[#d0b06d] text-[25px] cursor-pointer">Home</div>
      <div class="absolute top-12 left-[1089px] text-[#d0b06d] text-[25px] cursor-pointer">Registrarse</div>
      <div class="absolute top-7 left-[1334px] w-[70px] h-[70px] rounded-full bg-white flex items-center justify-center cursor-pointer">
        <svg width="40" height="40" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="17" r="9" stroke="#002349" stroke-width="2.5" fill="none" />
          <path d="M5 43C5 33.059 13.059 25 23 25C32.941 25 41 33.059 41 43" stroke="#002349" stroke-width="2.5" stroke-linecap="round" fill="none" />
        </svg>
      </div>
    </nav>
    <div class="absolute top-[126px] left-0 w-full h-[1625px] bg-gradient-to-br from-gray-700 to-gray-900" />

    <div class="absolute top-[205px] left-[150px] w-[1139px] bg-white rounded-[25px] pb-16">
      <h1 class="pt-[94px] text-center text-[#d0b06d] text-[50px] font-semibold">Registro de Supervisor</h1>

      <form @submit.prevent="handleSubmit" class="px-[91px] mt-8" novalidate>
        <div class="flex gap-8 mb-6">
          <div class="flex flex-col gap-3 w-1/2">
            <label for="nombre" class="text-[#002349] text-3xl">Nombre:</label>
            <input id="nombre" v-model="form.nombre" type="text" autocomplete="given-name"
              class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
          </div>
          <div class="flex flex-col gap-3 w-1/2">
            <label for="apellido" class="text-[#002349] text-3xl">Apellido:</label>
            <input id="apellido" v-model="form.apellido" type="text" autocomplete="family-name"
              class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
          </div>
        </div>

        <div class="flex flex-col gap-3 mb-6">
          <label for="correo" class="text-[#002349] text-3xl">Correo electrónico institucional (@ucb.edu.bo):</label>
          <input id="correo" v-model="form.correo" type="email" autocomplete="email"
            class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
        </div>

        <div class="flex gap-8 mb-6">
          <div class="flex flex-col gap-3 w-1/2">
            <label for="direccion" class="text-[#002349] text-3xl">Dirección:</label>
            <input id="direccion" v-model="form.direccion" type="text"
              class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
          </div>
          <div class="flex flex-col gap-3 w-1/2">
            <label for="telefono" class="text-[#002349] text-3xl">Teléfono:</label>
            <input id="telefono" v-model="form.telefono" type="tel"
              class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
          </div>
        </div>

        <div class="flex flex-col gap-3 mb-3">
          <label for="contrasena" class="text-[#002349] text-3xl">Contraseña:</label>
          <input id="contrasena" v-model="form.contrasena" type="password" @input="calcularFuerza"
            class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="flex-1 h-2.5 bg-[#d9d9d9] rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300" :style="{ width: porcentajeFuerza + '%', backgroundColor: colorFuerza }" />
          </div>
          <span class="text-[#545454] text-lg whitespace-nowrap">{{ etiquetaFuerza }}</span>
        </div>
        <ul class="mb-6 space-y-1 list-none text-xl">
          <li v-for="req in requisitos" :key="req.label" :class="req.met ? 'text-green-600' : 'text-[#db0000]'">{{ req.label }}</li>
        </ul>

        <div class="flex flex-col gap-3 mb-8">
          <label for="confirmar" class="text-[#002349] text-3xl">Confirmar Contraseña:</label>
          <input id="confirmar" v-model="form.confirmar" type="password"
            class="w-full h-[50px] rounded-[15px] border border-[#002349] px-3 text-[#002349] text-xl focus:outline-none focus:ring-2 focus:ring-[#002349]" />
          <p v-if="form.confirmar && form.confirmar !== form.contrasena" class="text-[#db0000] text-lg">Las contraseñas no coinciden.</p>
        </div>

        <div v-if="errorMsg" class="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-[15px] text-red-700 text-xl text-center">{{ errorMsg }}</div>

        <div class="flex justify-center mb-6">
          <button type="submit" class="w-[300px] h-[65px] bg-[#002349] rounded-[15px] text-[#d0b06d] text-[35px] font-semibold hover:bg-[#003366] transition-colors">Registrarse</button>
        </div>
        <p class="text-center text-3xl">
          <span class="text-black">¿Ya tienes una cuenta? </span>
          <router-link to="/login" class="text-[#3e9eff] underline">Inicia Sesión</router-link>
        </p>
      </form>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 z-40" />
    <div v-if="showModal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[770px] bg-neutral-100 rounded-[20px] z-50 p-10 text-center shadow-2xl">
      <p class="text-[#06b500] text-[40px] font-semibold mb-10">¡El supervisor fue creado exitosamente!</p>
      <div class="flex justify-center gap-8">
        <router-link to="/home" class="w-[267px] h-[65px] bg-[#002349] rounded-[15px] text-white text-[30px] font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center">Volver a Inicio</router-link>
        <router-link to="/login" class="w-[267px] h-[65px] bg-[#002349] rounded-[15px] text-white text-[30px] font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center">Iniciar Sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroSupervisor',
  data() {
    return {
      showModal: false, errorMsg: '',
      porcentajeFuerza: 0, colorFuerza: '#d9d9d9', etiquetaFuerza: 'Débil',
      form: { nombre: '', apellido: '', correo: '', direccion: '', telefono: '', contrasena: '', confirmar: '' }
    }
  },
  computed: {
    requisitos() {
      const p = this.form.contrasena
      return [
        { label: 'Al menos 12 caracteres', met: p.length >= 12 },
        { label: 'Una letra mayúscula', met: /[A-Z]/.test(p) },
        { label: 'Una letra minúscula', met: /[a-z]/.test(p) },
        { label: 'Un número', met: /[0-9]/.test(p) },
        { label: 'Un símbolo', met: /[^A-Za-z0-9]/.test(p) }
      ]
    }
  },
  methods: {
    calcularFuerza() {
      const n = this.requisitos.filter(r => r.met).length
      this.porcentajeFuerza = (n / 5) * 100
      if (n <= 1) { this.colorFuerza = '#db0000'; this.etiquetaFuerza = 'Débil' }
      else if (n <= 3) { this.colorFuerza = '#f59e0b'; this.etiquetaFuerza = 'Regular' }
      else { this.colorFuerza = '#22c55e'; this.etiquetaFuerza = 'Fuerte' }
    },
    handleSubmit() {
      this.errorMsg = ''
      const { nombre, apellido, correo, contrasena, confirmar } = this.form
      if (!nombre || !apellido || !correo || !contrasena || !confirmar) { this.errorMsg = 'Por favor completa todos los campos.'; return }
      if (contrasena !== confirmar) { this.errorMsg = 'Las contraseñas no coinciden.'; return }
      // TODO: POST /api/supervisores  →  { nombre, apellido, gmail: correo, telefono, contrasena }
      this.showModal = true
    }
  }
}
</script>