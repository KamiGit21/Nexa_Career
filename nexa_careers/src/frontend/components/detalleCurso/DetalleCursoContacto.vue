<template>
  <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-5">

    <h2 class="text-lg font-bold text-[#1b2a4a] mb-1">Contactar al ofertante</h2>
    <p class="text-xs text-gray-400 mb-4">Información provista por el ofertante:</p>

    <!-- Sin contacto -->
    <div v-if="!tieneContacto" class="text-center py-6 text-gray-400 bg-gray-50 rounded-xl">
      <p class="text-2xl mb-2">📭</p>
      <p class="text-sm">El ofertante no ha provisto información de contacto.</p>
    </div>

    <!-- Lista de contactos -->
    <div v-else class="flex flex-col gap-3">

      <a
        v-if="curso.contacto_email"
        :href="`mailto:${curso.contacto_email}`"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors group"
      >
        <span class="w-9 h-9 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
          @
        </span>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Correo</p>
          <p class="text-sm font-semibold text-green-700 group-hover:underline leading-tight">
            {{ curso.contacto_email }}
          </p>
        </div>
      </a>

      <a
        v-if="curso.contacto_telefono"
        :href="`tel:${curso.contacto_telefono}`"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
      >
        <span class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm flex-shrink-0">
          📞
        </span>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">Teléfono</p>
          <p class="text-sm font-semibold text-blue-700 group-hover:underline leading-tight">
            {{ curso.contacto_telefono }}
          </p>
        </div>
      </a>

      <a
        v-if="curso.contacto_linkedin"
        :href="curso.contacto_linkedin"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group"
      >
        <span class="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
          in
        </span>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">LinkedIn</p>
          <p class="text-sm font-semibold text-indigo-700 group-hover:underline leading-tight">
            Ver perfil →
          </p>
        </div>
      </a>

      <div
        v-if="curso.contacto_plataforma && curso.contacto_valor"
        class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-amber-50"
      >
        <span class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-sm flex-shrink-0">
          💬
        </span>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide leading-tight">
            {{ curso.contacto_plataforma }}
          </p>
          <p class="text-sm font-semibold text-gray-700 leading-tight">
            {{ curso.contacto_valor }}
          </p>
        </div>
      </div>

    </div>

    <p class="text-xs text-gray-400 italic mt-4 leading-relaxed">
      Contáctate directamente con el ofertante para coordinar horarios y modalidad.
    </p>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  curso: { type: Object, required: true }
})

const tieneContacto = computed(() =>
  props.curso.contacto_email     ||
  props.curso.contacto_telefono  ||
  props.curso.contacto_linkedin  ||
  (props.curso.contacto_plataforma && props.curso.contacto_valor)
)
</script>