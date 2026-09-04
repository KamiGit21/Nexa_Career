<template>
  <div class="flex-none w-72 md:w-80 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between p-6 m-2">
    <div>
      <div class="flex justify-between items-start mb-4">
        <span class="text-xs text-gray-400 font-medium">
          {{ formatFecha(curso.fecha_creacion || curso.fecha_inicio) }}
        </span>
      </div>

      <h3 class="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
        {{ curso.nombre_curso }}
      </h3>

      <p class="text-sm text-gray-600 line-clamp-3 mb-4">
        {{ curso.descripcion }}
      </p>
    </div>

    <div class="mt-4">
      <router-link 
        :to="`/cursos/${curso.id_curso || curso.id}`"
        class="block w-full text-center py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-[#b5943a] transition-colors duration-300"
      >
        Ver detalles del curso
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  curso: {
    type: Object,
    required: true
  }
})

const formatFecha = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
}
</script>