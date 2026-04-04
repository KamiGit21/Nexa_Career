<template>
  <div class="min-h-screen bg-[#f8f5f0]">

    <!-- Breadcrumb - mismo patrón que DetalleOferta.vue -->
    <header class="bg-[#1b2a4a] py-4 px-8">
      <nav class="max-w-4xl mx-auto text-sm text-slate-400 flex items-center gap-2">
        <router-link to="/home" class="hover:text-white transition">Inicio</router-link>
        <span>/</span>
        <span class="text-white">Publicar Curso</span>
      </nav>
    </header>

    <div class="max-w-4xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-[#1b2a4a] mb-1">Publicar un Curso</h1>
      <p class="text-gray-500 mb-8">
        Comparte tus habilidades con la comunidad Nexa Careers.
      </p>

      <!-- :key fuerza el remontaje al publicar otro curso (reset limpio) -->
      <PublicarCursoForm :key="formKey" @enviado="onEnviado" />
    </div>

    <ConfirmacionCursoModal
      :visible="modalVisible"
      @cerrar="irInicio"
      @nuevo-curso="publicarOtro"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PublicarCursoForm      from '@/components/publicarCurso/PublicarCursoForm.vue'
import ConfirmacionCursoModal from '@/components/publicarCurso/ConfirmacionCursoModal.vue'

const router     = useRouter()
const modalVisible = ref(false)
const formKey    = ref(0)

const onEnviado  = () => { modalVisible.value = true }
const irInicio   = () => router.push('/home')
const publicarOtro = () => {
  modalVisible.value = false
  formKey.value++        // remonta el form → reset automático
}
</script>