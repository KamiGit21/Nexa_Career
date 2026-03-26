<template>
  <div class="min-h-screen bg-[#f8f5f0]">
    <Navbar />

    <div class="max-w-3xl mx-auto px-6 py-12">
      <div class="bg-white rounded-3xl shadow-xl p-10">
        <h1 class="text-4xl font-bold text-center text-[#1b2a4a] mb-2">Nueva Oferta Laboral</h1>
        <p class="text-center text-gray-500">Crea una nueva oportunidad para estudiantes</p>

        <form @submit.prevent="handleSubmit" class="space-y-8 mt-10">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Título de la Oferta</label>
            <input v-model="form.titulo" type="text" placeholder="Ej. Desarrollador Full Stack Junior"
                   class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#b5943a]" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">Descripción</label>
            <textarea v-model="form.descripcion" rows="6" placeholder="Describe responsabilidades, requisitos y beneficios..."
                      class="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-[#b5943a]"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Categoría</label>
              <select v-model="form.categoriaId" class="w-full px-6 py-4 border border-gray-200 rounded-2xl">
                <option value="">Seleccionar categoría...</option>
                <option value="1">Tecnología</option>
                <option value="2">Marketing</option>
                <option value="3">Finanzas</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-2">Modalidad</label>
              <select v-model="form.modalidad" class="w-full px-6 py-4 border border-gray-200 rounded-2xl">
                <option value="">Seleccionar modalidad...</option>
                <option>Presencial</option>
                <option>Remoto</option>
                <option>Híbrido</option>
              </select>
            </div>
          </div>

          <button type="submit"
                  class="w-full py-5 bg-[#1b2a4a] text-white font-semibold rounded-2xl hover:bg-[#0f1a2e]">
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
  modalidad: ''
})

// TODO: POST /api/ofertas
const handleSubmit = () => {
  if (!form.value.titulo || !form.value.descripcion) {
    alert('Por favor completa título y descripción')
    return
  }
  alert('Oferta enviada al supervisor para revisión')
}
</script>