<template>
  <div class="min-h-screen w-full bg-[#1b2a4a] relative flex flex-col">
    <div class="absolute inset-0 bg-gradient-to-br from-[#1b2a4a] via-[#1e3060] to-[#1b2a4a] pointer-events-none" />
    <nav class="relative z-10 w-full flex items-center justify-end px-8 py-4 gap-12">
      <router-link to="/home" class="text-white text-[15px] hover:opacity-80 transition-opacity no-underline">Home</router-link>
      <router-link to="/registro-estudiante" class="text-white text-[15px] hover:opacity-80 no-underline">Registrarse</router-link>
      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="#1b2a4a" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#1b2a4a" />
        </svg>
      </div>
    </nav>

    <main class="relative z-10 flex-1 flex items-start justify-center px-4 pb-12 pt-4">
      <div class="w-full max-w-[630px] bg-white rounded-2xl shadow-2xl px-10 py-8">
        <h1 class="font-bold text-[#b5943a] text-[26px] text-center mb-6">Registro de Empleador</h1>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

          <div class="flex flex-col gap-1">
            <label for="empresa" class="text-[#333333] text-sm">Nombre de la Empresa:</label>
            <div class="flex items-center border border-[#cccccc] rounded-md px-3 py-2 bg-white focus-within:border-[#b5943a] transition-colors">
              <svg class="w-4 h-4 text-[#aaaaaa] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <input id="empresa" v-model="form.empresa" type="text" placeholder="Ej. Empresa S.A."
                class="flex-1 text-[#333333] text-sm bg-transparent outline-none border-none placeholder-[#aaaaaa]" />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label for="nombre" class="text-[#333333] text-sm">Nombre del Representante:</label>
              <input id="nombre" v-model="form.nombre" type="text" placeholder="Nombre"
                class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm bg-white outline-none focus:border-[#b5943a] transition-colors placeholder-[#aaaaaa]" />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="apellido" class="text-[#333333] text-sm">Apellido:</label>
              <input id="apellido" v-model="form.apellido" type="text" placeholder="Apellido"
                class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm bg-white outline-none focus:border-[#b5943a] transition-colors placeholder-[#aaaaaa]" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="correo" class="text-[#333333] text-sm">Correo electrónico institucional (@ucb.edu.bo):</label>
            <div class="flex items-center border border-[#cccccc] rounded-md px-3 py-2 bg-white focus-within:border-[#b5943a] transition-colors">
              <svg class="w-4 h-4 text-[#aaaaaa] mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input id="correo" v-model="form.correo" type="email" placeholder="empresa@ucb.edu.bo"
                class="flex-1 text-[#333333] text-sm bg-transparent outline-none border-none placeholder-[#aaaaaa]" />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label for="direccion" class="text-[#333333] text-sm">Dirección:</label>
              <input id="direccion" v-model="form.direccion" type="text" placeholder="Dirección"
                class="border border-[#cccccc] rounded-md px-3 py-2 text-[#333333] text-sm bg-white outline-none focus:border-[#b5943a] transition-colors placeholder-[#aaaaaa]" />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label for="telefono" class="text-[#333333] text-sm">Teléfono:</label>
              <div class="flex border border-[#cccccc] rounded-md overflow-hidden focus-within:border-[#b5943a] transition-colors">
                <div class="flex items-center justify-center px-3 py-2 bg-[#f5f5f5] border-r border-[#cccccc]">
                  <span class="text-[#555555] text-xs">+591</span>
                </div>
                <input id="telefono" v-model="form.telefono" type="tel" placeholder="Número"
                  class="flex-1 px-3 py-2 text-[#333333] text-sm bg-white outline-none border-none placeholder-[#aaaaaa]" />
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="sector" class="text-[#333333] text-sm">Sector / Rubro:</label>
            <div class="relative border border-[#cccccc] rounded-md bg-white focus-within:border-[#b5943a] transition-colors">
              <select id="sector" v-model="form.sector"
                class="w-full px-3 py-2 text-sm bg-transparent outline-none border-none appearance-none cursor-pointer"
                :style="{ color: form.sector ? '#333333' : '#aaaaaa' }">
                <option value="" disabled hidden>Seleccionar sector...</option>
                <option v-for="s in sectores" :key="s" :value="s" class="text-[#333333]">{{ s }}</option>
              </select>
              <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="descripcion" class="text-[#333333] text-sm">Descripción de la Empresa:</label>
            <div class="relative border border-[#cccccc] rounded-md bg-white focus-within:border-[#b5943a] transition-colors">
              <textarea id="descripcion" v-model="form.descripcion" rows="4" :maxlength="300"
                placeholder="Describe brevemente a qué se dedica tu empresa, su misión y valores..."
                class="w-full px-3 py-2 text-[#333333] text-sm bg-transparent outline-none border-none resize-none placeholder-[#aaaaaa]" />
              <div class="flex justify-end px-3 pb-2">
                <span class="text-[#aaaaaa] text-xs">{{ form.descripcion.length }} / 300</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="contrasena" class="text-[#333333] text-sm">Contraseña:</label>
            <div class="flex items-center border border-[#cccccc] rounded-md px-3 py-2 bg-white focus-within:border-[#b5943a] transition-colors">
              <input id="contrasena" v-model="form.contrasena" :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••" @input="calcularFuerza"
                class="flex-1 text-[#cccccc] text-lg bg-transparent outline-none border-none placeholder-[#cccccc]" />
              <button type="button" @click="showPassword = !showPassword" class="ml-2 text-[#aaaaaa] hover:text-[#555555] transition-colors flex-shrink-0">
                <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <div v-if="form.contrasena" class="flex flex-col gap-1 mt-1">
              <div class="flex gap-1">
                <div v-for="i in 4" :key="i" class="h-[4px] flex-1 rounded-full transition-colors duration-300"
                  :style="{ backgroundColor: i <= fuerza ? colorFuerza : '#e0e0e0' }" />
              </div>
              <div class="text-right text-xs" :style="{ color: colorFuerza }">{{ etiquetaFuerza }}</div>
            </div>
            <div class="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
              <div v-for="req in requisitos" :key="req.label" class="flex items-center gap-1">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: req.met ? '#06b500' : '#c0392b' }" />
                <span class="text-xs" :style="{ color: req.met ? '#06b500' : '#c0392b' }">{{ req.label }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label for="confirmar" class="text-[#333333] text-sm">Confirmar Contraseña:</label>
            <div class="flex items-center border border-[#cccccc] rounded-md px-3 py-2 bg-white focus-within:border-[#b5943a] transition-colors">
              <input id="confirmar" v-model="form.confirmar" type="password" placeholder="••••••••"
                class="flex-1 text-[#cccccc] text-lg bg-transparent outline-none border-none placeholder-[#cccccc]" />
            </div>
            <span v-if="form.confirmar && form.confirmar !== form.contrasena" class="text-[#c0392b] text-xs">Las contraseñas no coinciden</span>
          </div>

          <div v-if="errorMsg" class="px-3 py-2 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm text-center">{{ errorMsg }}</div>

          <div class="flex flex-col items-center gap-3 mt-2">
            <button type="submit" class="w-full max-w-[320px] bg-[#1b2a4a] hover:bg-[#243660] text-white font-bold text-[15px] py-3 px-8 rounded-lg transition-colors">Registrarse</button>
            <div class="flex items-center gap-2">
              <span class="text-[#444444] text-sm">¿Ya tienes una cuenta?</span>
              <router-link to="/login" class="text-[#b5943a] text-sm hover:underline">Inicia Sesión</router-link>
            </div>
            <router-link to="/registro-estudiante" class="w-full max-w-[430px] border border-[#1b2a4a] hover:bg-[#f5f7fa] text-[#1b2a4a] font-bold text-sm py-3 px-8 rounded-lg transition-colors text-center">Registro Como Estudiante</router-link>
          </div>
        </form>
      </div>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 z-40" />
    <div v-if="showModal" class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[640px] bg-white rounded-[15px] border border-[#002349] py-10 px-8 flex flex-col items-center gap-8 shadow-2xl">
      <p class="font-semibold text-[#06b500] text-[32px] text-center leading-tight">¡El usuario fue creado exitosamente!</p>
      <div class="flex gap-6 w-full justify-center">
        <router-link to="/home" class="flex-1 max-w-[240px] h-[56px] bg-[#002349] rounded-[12px] text-white text-[18px] font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center">Volver a Inicio</router-link>
        <router-link to="/login" class="flex-1 max-w-[240px] h-[56px] bg-[#002349] rounded-[12px] text-white text-[18px] font-semibold hover:bg-[#003366] transition-colors flex items-center justify-center">Iniciar Sesión</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistroEmpleador',
  data() {
    return {
      showModal: false, showPassword: false, errorMsg: '',
      fuerza: 0, colorFuerza: '#c0392b', etiquetaFuerza: 'Débil',
      form: { empresa: '', nombre: '', apellido: '', correo: '', direccion: '', telefono: '', sector: '', descripcion: '', contrasena: '', confirmar: '' },
      sectores: ['Tecnología', 'Salud', 'Educación', 'Finanzas', 'Manufactura', 'Comercio', 'Servicios', 'Construcción', 'Transporte', 'Otro']
    }
  },
  computed: {
    requisitos() {
      const p = this.form.contrasena
      return [
        { label: 'Al menos 12 caracteres', met: p.length >= 12 },
        { label: 'Una letra mayúscula', met: /[A-Z]/.test(p) },
        { label: 'Una letra minúscula', met: /[a-z]/.test(p) },
        { label: 'Un número y un símbolo', met: /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p) }
      ]
    }
  },
  methods: {
    calcularFuerza() {
      const n = this.requisitos.filter(r => r.met).length
      this.fuerza = n
      const map = { 0: ['#c0392b', 'Débil'], 1: ['#b5943a', 'Débil'], 2: ['#e67e22', 'Regular'], 3: ['#27ae60', 'Buena'], 4: ['#1abc9c', 'Fuerte'] }
      const [color, label] = map[n] || map[0]
      this.colorFuerza = color; this.etiquetaFuerza = label
    },
    handleSubmit() {
      this.errorMsg = ''
      const { empresa, nombre, apellido, correo, sector, contrasena, confirmar } = this.form
      if (!empresa || !nombre || !apellido || !correo || !sector || !contrasena || !confirmar) { this.errorMsg = 'Por favor completa todos los campos obligatorios.'; return }
      if (contrasena !== confirmar) { this.errorMsg = 'Las contraseñas no coinciden.'; return }
      // TODO: POST /api/empleadores  →  { empresa, nombre, apellido, gmail: correo, telefono, sector, descripcion, contrasena }
      this.showModal = true
    }
  }
}
</script>