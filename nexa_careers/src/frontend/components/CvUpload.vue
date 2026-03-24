<template>
  <div class="w-full">
    <div v-if="!cvActual"
      class="w-full border-2 border-dashed rounded-lg bg-[#FAFAF8] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors"
      :class="isDragging ? 'border-[#b5943a] bg-yellow-50' : 'border-[#002349] hover:bg-blue-50'"
      @click="$refs.cvInput.click()" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
      <svg class="w-10 h-10 text-[#002349]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
      </svg>
      <div class="text-center">
        <p class="text-sm font-semibold text-[#002349]">Arrastra tu CV aquí o haz clic para seleccionar</p>
        <p class="text-xs text-gray-400 mt-1">PDF o DOC · Máx. 5 MB</p>
      </div>
      <button type="button" class="px-5 py-2 bg-[#002349] text-white text-sm rounded-md hover:bg-[#003366] transition-colors">Seleccionar archivo</button>
    </div>

    <div v-else class="w-full border border-[#002349] rounded-lg bg-[#FAFAF8] p-5">
      <div class="flex items-center gap-4">
        <div class="flex-shrink-0 w-12 h-14 bg-[#E8EEF6] rounded flex flex-col items-center justify-center">
          <svg class="w-6 h-6 text-[#002349]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-[9px] font-bold text-red-600 uppercase">{{ extension }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-[#002349] truncate">{{ cvActual.nombre }}</p>
          <p class="text-xs text-gray-500 mt-0.5">{{ cvActual.tamanio }} · Subido el {{ cvActual.fecha }}</p>
          <div class="flex items-center gap-1 mt-1">
            <div class="w-2 h-2 rounded-full bg-green-500" />
            <span class="text-xs text-green-600 font-medium">Archivo cargado correctamente</span>
          </div>
        </div>
        <div class="flex flex-col gap-2 flex-shrink-0">
          <button type="button" @click="$refs.cvInput.click()" class="px-4 py-1.5 text-xs bg-[#002349] text-white rounded-md hover:bg-[#003366] transition-colors text-center">Reemplazar</button>
          <button type="button" @click="eliminar" class="px-4 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-center">Eliminar</button>
        </div>
      </div>
    </div>

    <input ref="cvInput" type="file" accept=".pdf,.doc,.docx" class="hidden" @change="handleChange" />
    <p v-if="errorMsg" class="mt-2 text-xs text-red-600">{{ errorMsg }}</p>
  </div>
</template>

<script>
export default {
  name: 'CvUpload',
  props: { cvInicial: { type: Object, default: null } },
  emits: ['update:cv'],
  data() { return { isDragging: false, errorMsg: '', cvActual: this.cvInicial || null } },
  computed: {
    extension() { return this.cvActual ? this.cvActual.nombre.split('.').pop().toUpperCase() : '' }
  },
  methods: {
    handleDrop(e) { this.isDragging = false; const f = e.dataTransfer.files[0]; if (f) this.procesar(f) },
    handleChange(e) { const f = e.target.files[0]; if (f) this.procesar(f); e.target.value = '' },
    procesar(file) {
      this.errorMsg = ''
      const tipos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!tipos.includes(file.type)) { this.errorMsg = 'Solo se permiten archivos PDF o DOC/DOCX.'; return }
      if (file.size > 5 * 1024 * 1024) { this.errorMsg = 'El archivo supera el límite de 5 MB.'; return }
      const tamanio = file.size > 1024 * 1024 ? (file.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(file.size / 1024) + ' KB'
      const fecha = new Date().toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })
      this.cvActual = { nombre: file.name, tamanio, fecha, file }
      this.$emit('update:cv', this.cvActual)
    },
    eliminar() { this.cvActual = null; this.$emit('update:cv', null) }
  }
}
</script>