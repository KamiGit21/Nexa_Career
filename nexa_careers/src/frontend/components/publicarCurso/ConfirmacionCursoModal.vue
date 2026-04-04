<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      @click.self="$emit('cerrar')"
    >
      <div class="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center space-y-5">

        <!-- Ícono -->
        <div class="mx-auto w-20 h-20 rounded-full bg-[#1b2a4a]/10
                    flex items-center justify-center text-5xl">
          🎓
        </div>

        <!-- Título -->
        <div>
          <h2 class="text-2xl font-bold text-[#1b2a4a]">¡Curso publicado!</h2>
          <p class="mt-2 text-gray-500 text-sm">
            Tu curso fue enviado correctamente y está en revisión.
          </p>
        </div>

        <!-- Badge estado -->
        <span class="inline-block px-4 py-2 bg-amber-100 text-amber-800
                     text-xs font-semibold rounded-full tracking-wide">
          ⏳ Pendiente de revisión
        </span>

        <p class="text-xs text-gray-400 leading-relaxed">
          Un supervisor aprobará tu publicación antes de que sea visible
          para otros estudiantes de la plataforma.
        </p>

        <!-- Acciones -->
        <div class="flex flex-col gap-3 pt-2">
          <button
            @click="$emit('nuevo-curso')"
            class="w-full py-3 bg-[#1b2a4a] text-[#d0b06d] rounded-xl
                   font-semibold hover:bg-[#0f1a2e] transition"
          >
            Publicar otro curso
          </button>
          <button
            @click="$emit('cerrar')"
            class="w-full py-3 border border-gray-200 rounded-xl
                   text-gray-600 hover:bg-gray-50 transition"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({ visible: { type: Boolean, default: false } })
defineEmits(['cerrar', 'nuevo-curso'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active  { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to      { opacity: 0; }
</style>