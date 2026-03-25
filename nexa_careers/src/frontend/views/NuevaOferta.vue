<template>
  <div class="bg-[#F5F0E8] w-full min-w-[1440px] min-h-screen">
    <div class="w-full h-[64px] bg-[#1b2a4a] flex items-center px-8">
      <router-link to="/mis-ofertas" class="text-[#d0b06d] text-[18px]">Mis Ofertas</router-link>
    </div>

    <div class="mx-auto max-w-[860px] my-10 bg-white rounded-[14px] shadow-sm pb-10">
      <div class="px-12 pt-10">
        <h1 class="text-center text-[#b5943a] text-[28px] font-bold mb-1">Nueva Oferta Laboral</h1>
        <p class="text-center text-gray-400 text-sm mb-8">Completa todos los campos para publicar tu oferta.</p>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Imagen -->
          <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Imagen de la Oferta</p>
            <div class="w-full h-[110px] border border-dashed border-[#1b2a4a] rounded-lg flex flex-col items-center justify-center gap-2 bg-[#FAFAF8] cursor-pointer hover:bg-[#f0f0e8]"
                 @click="$refs.imgInput.click()">
              <svg class="w-8 h-8 text-[#b5943a]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-[#1b2a4a]">Arrastra o haz clic para subir imagen</span>
            </div>
            <input ref="imgInput" type="file" accept="image/*" class="hidden" />
          </div>

          <!-- Información Básica -->
          <div>
            <p class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Información Básica</p>
            <input v-model="form.titulo" placeholder="Título de la oferta" maxlength="80"
                   class="w-full h-11 border border-[#1b2a4a] bg-[#FAFAF8] px-4 rounded-md text-sm" />
            <textarea v-model="form.descripcion" rows="5" maxlength="500" placeholder="Descripción del puesto..."
                      class="w-full mt-4 border border-[#1b2a4a] bg-[#FAFAF8] px-4 py-3 rounded-md text-sm"></textarea>
          </div>

          <!-- Categoría y Modalidad -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Categoría</label>
              <select v-model="form.categoriaId" class="w-full h-11 border border-[#1b2a4a] bg-[#FAFAF8] px-4 rounded-md">
                <option value="">Seleccionar categoría...</option>
                <option value="1">Tecnología</option>
                <option value="2">Marketing</option>
                <option value="3">Finanzas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Tipo de empleo</label>
              <select v-model="form.tipoEmpleo" class="w-full h-11 border border-[#1b2a4a] bg-[#FAFAF8] px-4 rounded-md">
                <option value="">Seleccionar...</option>
                <option>Tiempo completo</option>
                <option>Medio tiempo</option>
                <option>Prácticas profesionales</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Modalidad</label>
              <select v-model="form.modalidad" class="w-full h-11 border border-[#1b2a4a] bg-[#FAFAF8] px-4 rounded-md">
                <option value="">Seleccionar...</option>
                <option>Presencial</option>
                <option>Remoto</option>
                <option>Híbrido</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Fecha de cierre</label>
              <input v-model="form.fechaCierre" type="date" 
                     class="w-full h-11 border border-[#1b2a4a] bg-[#FAFAF8] px-4 rounded-md" />
            </div>
          </div>

          <button type="submit"
                  class="w-full h-[52px] bg-[#1b2a4a] text-white text-lg font-semibold rounded-[8px] hover:bg-[#0f1a2e]">
            Publicar Oferta
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  titulo: '',
  descripcion: '',
  categoriaId: '',
  tipoEmpleo: '',
  modalidad: '',
  fechaCierre: ''
})

// TODO: POST /api/ofertas
const handleSubmit = () => {
  if (!form.value.titulo || !form.value.descripcion) {
    alert('Por favor completa los campos obligatorios')
    return
  }
  alert('¡Oferta publicada exitosamente! Pendiente de revisión por supervisor.')
}
</script>