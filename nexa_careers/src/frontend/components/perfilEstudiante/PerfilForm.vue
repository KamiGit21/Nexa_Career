<template>
  <div class="flex flex-col lg:flex-row gap-8">
    
    <aside class="w-full lg:w-1/3 space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 w-full text-left">Foto de perfil</h3>
        <AvatarUpload />
        <!--<p class="text-[10px] text-gray-400 mt-4 text-center leading-relaxed">
          Sube una foto profesional.<br>PNG o JPG, Máx 2MB.
        </p>
        -->
      </div>

      <!--
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Estado de cuenta</h3>
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-600">Visible para empresas</span>
            <ToggleSwitch />
          </div>
        </div>
        
        <hr class="border-gray-50">

        <div>
          <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Documentos</h3>
          <div class="group border-2 border-dashed border-gray-100 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer bg-slate-50">
            <div class="text-center">
              <span class="text-xl">📄</span>
              <p class="text-[10px] font-bold text-slate-500 mt-1 uppercase">Mi_CV_Actualizado.pdf</p>
              <button class="text-[9px] text-blue-500 font-bold mt-2 hover:underline">REEMPLAZAR ARCHIVO</button>
            </div>
          </div>
        </div>
      </div>
      -->
    </aside>

    <section class="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <form @submit.prevent="guardar" class="space-y-8">
        
        <div>
          <div class="flex items-center gap-2 mb-6">
            <span class="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm">👤</span>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-tight">Información de contacto</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Nombre" placeholder="Juan" />
            <InputField label="Apellido" placeholder="Medrano" />
            <InputField label="Correo institucional" placeholder="jperez@u.edu.bo" />
            <InputField label="Teléfono" placeholder="+591 70000000" />
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-6 pt-4">
            <span class="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-sm">🎓</span>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-tight">Carrera y Profesional</h3>
          </div>
          
          <div class="space-y-6">
            <InputField label="Carrera universitaria" placeholder="Ingeniería de Sistemas" />
            <TextAreaField 
              label="Resumen profesional" 
              placeholder="Desarrollador con pasión por el backend y la seguridad informática..."
              class="min-h-[120px]"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center gap-2 mb-6 pt-4">
            <span class="p-1.5 bg-red-50 text-red-600 rounded-lg text-sm">🔒</span>
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-tight">Cambio de contraseña</h3>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PasswordField label="Nueva contraseña" />
            <InputField label="Confirmar contraseña" type="password" placeholder="********" />
          </div>
        </div>

        <div class="pt-10 flex items-center justify-end gap-4 border-t border-gray-50">
          <button 
            type="button" 
            @click="$router.back()"
            class="px-6 py-2.5 text-xs font-bold text-gray-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
          >
            Descartar cambios
          </button>
          <SaveButton class="px-10 py-3 bg-[#1e293b] text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 hover:bg-slate-800 transition-all" />
        </div>
      </form>
    </section>

    <SuccessModal :visible="showSuccess" @close="showSuccess = false" />
    <ErrorModal :visible="showError" @close="showError = false" @retry="guardar" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AvatarUpload from "./AvatarUpload.vue";
import InputField from "./InputField.vue";
import TextAreaField from "./TextAreaField.vue";
import PasswordField from "./PasswordField.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import SaveButton from "./SaveButton.vue";
import SuccessModal from "./modals/SuccessModal.vue";
import ErrorModal from "./modals/ErrorModal.vue";

const showSuccess = ref(false);
const showError = ref(false);

const guardar = async () => {
  try {
    showSuccess.value = true;
  } catch {
    showError.value = true;
  }
};
</script>