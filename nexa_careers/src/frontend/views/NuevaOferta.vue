<template>
  <div class="bg-[#F5F0E8] w-full min-w-[1440px] min-h-screen">
    <div class="w-full h-[64px] bg-[#1b2a4a] flex items-center px-8 sticky top-0 z-10">
      <div class="ml-auto flex items-center gap-10">
        <router-link to="/home" class="text-[#d0b06d] text-[18px] no-underline cursor-pointer">Home</router-link>
        <router-link to="/mis-ofertas" class="text-[#d0b06d] text-[18px] font-semibold no-underline cursor-pointer">Mis Ofertas</router-link>
        <router-link to="/login" class="text-white text-[18px] no-underline cursor-pointer">Mi Cuenta</router-link>
        <div class="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 46 46" fill="none">
            <circle cx="23" cy="17" r="9" stroke="#1b2a4a" stroke-width="2.5" fill="none" />
            <path d="M5 43C5 33.059 13.059 25 23 25C32.941 25 41 33.059 41 43" stroke="#1b2a4a" stroke-width="2.5" stroke-linecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </div>

    <div class="w-full bg-white border-b border-gray-200 px-8 py-3 flex items-center gap-2 text-sm">
      <router-link to="/mis-ofertas" class="text-[#d0b06d] cursor-pointer hover:underline no-underline">Mis Ofertas</router-link>
      <span class="text-gray-400">/</span>
      <span class="text-[#1b2a4a] font-medium">Nueva Oferta</span>
    </div>

    <div class="mx-auto max-w-[860px] my-10 bg-white rounded-[14px] shadow-sm pb-10">
      <div class="px-12 pt-10">
        <h1 class="text-center text-[#b5943a] text-[28px] font-bold mb-1">Nueva Oferta Laboral</h1>
        <p class="text-center text-gray-400 text-sm mb-6">Completa todos los campos para publicar tu oferta.</p>
        <hr class="border-gray-200 mb-8" />

        <form @submit.prevent="handleSubmit" novalidate>

          <!-- Imagen -->
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Imagen de la Oferta</p>
          <div class="w-full h-[110px] border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#FAFAF8] mb-6 hover:bg-blue-50 transition-colors"
            :class="imagenNombre ? 'border-green-400' : 'border-[#1b2a4a]'"
            @click="$refs.imgInput.click()" @dragover.prevent @drop.prevent="handleImgDrop">
            <svg class="w-7 h-7 text-[#b5943a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span v-if="!imagenNombre" class="text-sm font-medium text-[#1b2a4a]">Arrastra o haz clic para subir imagen</span>
            <span v-else class="text-sm font-medium text-green-700">{{ imagenNombre }}</span>
            <span class="text-xs text-gray-400">PNG, JPG · Máx. 2 MB</span>
          </div>
          <input ref="imgInput" type="file" accept="image/*" class="hidden" @change="handleImgChange" />

          <hr class="border-gray-200 mb-6" />
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Información Básica</p>

          <div class="flex flex-col gap-2 mb-5">
            <label class="text-sm text-gray-700">Título de la oferta: <span class="text-red-500">*</span></label>
            <input v-model="form.titulo" type="text" placeholder="Ej. Desarrollador Backend..." :maxlength="80"
              class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b5943a]" />
            <span class="text-right text-xs text-gray-400">{{ form.titulo.length }} / 80</span>
          </div>

          <div class="flex flex-col gap-2 mb-5">
            <label class="text-sm text-gray-700">Descripción de la oferta: <span class="text-red-500">*</span></label>
            <textarea v-model="form.descripcion" rows="5" :maxlength="500" placeholder="Describe el puesto..."
              class="w-full rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b5943a] resize-y" />
            <span class="text-right text-xs text-gray-400">{{ form.descripcion.length }} / 500</span>
          </div>

          <hr class="border-gray-200 mb-6" />
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Categoría y Modalidad</p>

          <div class="grid grid-cols-2 gap-5 mb-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Categoría: <span class="text-red-500">*</span></label>
              <select v-model="form.categoriaId" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none">
                <option value="">Seleccionar...</option>
                <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Tipo de empleo: <span class="text-red-500">*</span></label>
              <select v-model="form.tipoEmpleo" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none">
                <option value="">Seleccionar...</option>
                <option>Tiempo completo</option><option>Medio tiempo</option>
                <option>Prácticas profesionales</option><option>Freelance</option><option>Pasantía</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-5 mb-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Modalidad: <span class="text-red-500">*</span></label>
              <select v-model="form.modalidad" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none">
                <option value="">Seleccionar...</option>
                <option>Presencial</option><option>Remoto</option><option>Híbrido</option><option>A convenir</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Experiencia requerida:</label>
              <select v-model="form.experiencia" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none">
                <option value="">Sin especificar</option>
                <option>Sin experiencia</option><option>6 meses</option><option>1 año</option><option>2 años</option><option>3+ años</option>
              </select>
            </div>
          </div>

          <hr class="border-gray-200 mb-6" />
          <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Fecha y Contacto</p>

          <div class="grid grid-cols-2 gap-5 mb-5">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Fecha de apertura: <span class="text-red-500">*</span></label>
              <input v-model="form.fechaApertura" type="date" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-gray-700">Fecha de cierre: <span class="text-red-500">*</span></label>
              <input v-model="form.fechaCierre" type="date" class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-3 text-sm focus:outline-none" />
              <span v-if="errorFecha" class="text-xs text-red-500">{{ errorFecha }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2 mb-5">
            <label class="text-sm text-gray-700">Correo de contacto: <span class="text-red-500">*</span></label>
            <input v-model="form.correoContacto" type="email" placeholder="correo@empresa.com"
              class="w-full h-[40px] rounded-md border border-[#1b2a4a] bg-[#FAFAF8] px-4 text-sm focus:outline-none" />
          </div>

          <p class="text-xs text-gray-400 mb-8"><span class="text-red-500">*</span> Campos obligatorios</p>
          <hr class="border-gray-200 mb-6" />

          <div v-if="successMsg" class="mb-4 px-4 py-3 bg-green-50 border border-green-300 rounded-md text-green-700 text-sm text-center">{{ successMsg }}</div>
          <div v-if="errorMsg" class="mb-4 px-4 py-3 bg-red-50 border border-red-300 rounded-md text-red-700 text-sm text-center">{{ errorMsg }}</div>

          <div class="flex justify-center gap-6">
            <button type="submit" class="w-[200px] h-[46px] bg-[#1b2a4a] rounded-[7px] text-white text-sm font-bold hover:bg-[#243660] transition-colors">Publicar Oferta</button>
            <router-link to="/mis-ofertas" class="w-[200px] h-[46px] border-2 border-[#1b2a4a] rounded-[7px] text-[#1b2a4a] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center no-underline">Cancelar</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NuevaOferta',
  data() {
    return {
      imagenNombre: '', successMsg: '', errorMsg: '',
      form: { titulo: '', descripcion: '', categoriaId: '', tipoEmpleo: '', modalidad: '', experiencia: '', fechaApertura: '', fechaCierre: '', correoContacto: '' },
      // TODO: GET /api/categorias
      categorias: [
        { id: 1, nombre: 'Tecnología' }, { id: 2, nombre: 'Marketing' }, { id: 3, nombre: 'Finanzas' },
        { id: 4, nombre: 'Diseño' }, { id: 5, nombre: 'Administración' }, { id: 6, nombre: 'Ingeniería' },
        { id: 7, nombre: 'Salud' }, { id: 8, nombre: 'Educación' }, { id: 9, nombre: 'Otro' }
      ]
    }
  },
  computed: {
    errorFecha() {
      if (!this.form.fechaCierre || !this.form.fechaApertura) return ''
      if (this.form.fechaCierre <= this.form.fechaApertura) return 'La fecha de cierre debe ser posterior a la de apertura.'
      return ''
    }
  },
  methods: {
    handleImgChange(e) { const f = e.target.files[0]; if (f) this.imagenNombre = f.name },
    handleImgDrop(e) { const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('image/')) this.imagenNombre = f.name },
    handleSubmit() {
      this.successMsg = ''; this.errorMsg = ''
      const { titulo, descripcion, categoriaId, tipoEmpleo, modalidad, fechaApertura, fechaCierre, correoContacto } = this.form
      if (!titulo || !descripcion || !categoriaId || !tipoEmpleo || !modalidad || !fechaApertura || !fechaCierre || !correoContacto) { this.errorMsg = 'Por favor completa todos los campos obligatorios.'; return }
      if (this.errorFecha) { this.errorMsg = this.errorFecha; return }
      // TODO: POST /api/ofertas  →  { descripcion, fecha_apertura: fechaApertura, id_empleador, estado: 0, id_categoria: categoriaId }
      this.successMsg = '¡Oferta publicada exitosamente! Está pendiente de revisión por el supervisor.'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>