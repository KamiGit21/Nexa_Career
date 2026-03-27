<template>
  <div class="min-h-screen bg-[#1e293b] pb-10">
    <nav class="bg-[#1e293b] text-white px-8 py-4 flex justify-between items-center border-b border-slate-700">
      <div class="flex items-center gap-4 cursor-pointer" @click="$router.back()">
        <span class="text-yellow-500 font-bold">←</span>
        <span class="text-sm font-medium">Mis Ofertas / Editar</span>
      </div>
      <div class="flex gap-8 items-center text-sm">
        <a href="/home" class="hover:text-yellow-500">Home</a>
        <a href="/mis-ofertas" class="text-yellow-500 border-b-2 border-yellow-500">Mis Ofertas</a>
        <div class="w-8 h-8 bg-slate-400 rounded-md flex items-center justify-center">
          <span class="text-xs italic">Nexa</span>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[#b89b4d]">Editar Oferta Laboral</h1>
          <div class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1 rounded-full mt-2 text-sm font-medium">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            Estado actual: Activa
          </div>
        </div>

        <form @submit.prevent="saveChanges" class="space-y-8">
          
          <!--<div>
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Imagen de la oferta</h3>
            <div class="flex gap-6 items-center">
              <div class="relative w-48 h-32 bg-slate-200 rounded-lg overflow-hidden border border-gray-300">
                <img :src="imagenOferta" alt="Preview" class="w-full h-full object-cover" />
                <div class="absolute bottom-0 bg-black/50 w-full text-[10px] text-white py-1 px-2">imagen_oferta_backend.jpg</div>
              </div>
              <div class="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                <div class="text-yellow-600 text-3xl mb-1">📤</div>
                <p class="text-sm font-bold text-slate-700">Cambiar imagen</p>
                <p class="text-[10px] text-gray-400">Arrastra o haz clic para subir<br>PNG, JPG • Máx. 2 MB • 1200x600 px</p>
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button type="button" class="bg-[#1e293b] text-white px-6 py-1.5 rounded text-sm font-medium">Cambiar</button>
              <button type="button" class="border border-red-200 text-red-500 px-6 py-1.5 rounded text-sm font-medium hover:bg-red-50">Eliminar</button>
              <span class="text-[10px] text-gray-400 self-center">Sin imagen se mostrará un banner genérico.</span>
            </div>
          </div>
        -->

          <hr class="border-gray-100">

          <div>
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Información básica</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Título de la oferta:</label>
                <input type="text" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Descripción de la oferta:</label>
                <textarea rows="4" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-yellow-500 outline-none resize-none"> </textarea>
                <div class="text-right text-[10px] text-gray-400 mt-1">184 / 500</div>
              </div>
            </div>
          </div>

          <!--<div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Categoría:</label>
              <select class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none">
                <option>Tecnología</option>
                <option>Diseño</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Modalidad:</label>
              <select class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none">
                <option>Presencial</option>
                <option>Remoto</option>
              </select>
            </div>
          </div>

          <div>
            <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Requisitos y habilidades</h3>
            <div class="mb-4">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Habilidades requeridas:</label>
              <div class="w-full border border-slate-300 rounded-lg p-2 flex flex-wrap gap-2 items-center">
                <span v-for="skill in ['Node.js', 'Express', 'PostgreSQL', 'REST']" :key="skill" class="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium border border-blue-100 flex items-center gap-1">
                  {{ skill }} <button class="hover:text-red-500">×</button>
                </span>
                <input type="text" placeholder="+ Agregar..." class="outline-none text-xs p-1 flex-1">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nivel educativo mínimo:</label>
                <select class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none">
                  <option>Universidad (cursando)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Carrera preferida:</label>
                <input type="text" value="Ing. de Sistemas / Software" class="w-full border border-slate-300 rounded-lg p-2.5 text-sm outline-none">
              </div>
            </div>
          </div>
        -->

          <div class="grid grid-cols-3 gap-6">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de apertura:</label>
              <div class="relative">
                <input type="date" class="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none">
                <span class="absolute left-3 top-2.5 text-slate-400">📅</span>
              </div>
            </div>
            <!--<div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Fecha de cierre:</label>
              <div class="relative">
                <input type="text" value="30 / 04 / 2026" class="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none">
                <span class="absolute left-3 top-2.5 text-slate-400">📅</span>
              </div>
            </div>
            
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Correo de contacto:</label>
              <div class="relative">
                <input type="email" value="rrhh@nexacareers.bo" class="w-full border border-slate-300 rounded-lg p-2.5 pl-9 text-sm outline-none">
                <span class="absolute left-3 top-2.5 text-slate-400">✉️</span>
              </div>
            </div>-->
          </div>

          <div class="pt-4">
            <h3 class="text-xs font-bold text-slate-700 uppercase mb-2 tracking-tighter">Estado de la oferta</h3>
            <p class="text-[10px] text-gray-400 mb-4">Cambiar el estado afecta la visibilidad de la oferta para los estudiantes.</p>
            <div class="flex gap-8">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" checked class="accent-[#1e293b] w-4 h-4">
                <span class="text-sm font-semibold text-slate-700">Activa</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="status" class="accent-[#1e293b] w-4 h-4">
                <span class="text-sm font-semibold text-slate-700 text-gray-400">Cerrada</span>
              </label>
            </div>
          </div>

          <div class="flex justify-center gap-4 pt-6">
            <button type="submit" class="bg-[#1e293b] text-white px-12 py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all">
              Guardar Cambios
            </button>
            <button type="button" href="#" class="border-2 border-slate-700 text-slate-700 px-12 py-3 rounded-lg font-bold hover:bg-slate-50 transition-all">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
//import imagenOferta from '../assets/images/imagen-oferta.png';
const router = useRouter();

const saveChanges = () => {
  alert("¡Cambios guardados con éxito!");
  router.push('/ofertas');
};
</script>