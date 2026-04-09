<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
    <table class="w-full text-sm">
      <thead class="bg-[#1e293b] text-white">
        <tr>
          <th class="p-4 text-left font-semibold">Estudiante</th>
          <th class="p-4 text-left font-semibold">Carrera</th>
          <th class="p-4 text-left font-semibold">Correo</th>
          <th class="p-4 text-center font-semibold">Postulaciones</th>
          <th class="p-4 text-center font-semibold">Cursos</th>
          <th class="p-4 text-center font-semibold">Estado</th>
          <th class="p-4 text-center font-semibold">Registro</th>
          <th class="p-4 text-center font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr
          v-for="e in estudiantes"
          :key="e.id_estudiante"
          class="hover:bg-gray-50 transition-colors"
        >
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {{ iniciales(e.nombre, e.apellido) }}
              </div>
              <div>
                <p class="font-semibold text-slate-700">{{ e.nombre }} {{ e.apellido }}</p>
                <p class="text-xs text-gray-400">ID #{{ e.id_estudiante }}</p>
              </div>
            </div>
          </td>
          <td class="p-4 text-gray-600">{{ e.carrera || '—' }}</td>
          <td class="p-4 text-xs text-gray-600">{{ e.gmail }}</td>
          <td class="p-4 text-center font-semibold text-indigo-600">{{ e.total_postulaciones }}</td>
          <td class="p-4 text-center font-semibold text-amber-600">{{ e.total_cursos }}</td>
          <td class="p-4 text-center">
            <UsuarioEstadoBadge :activo="e.activo" />
          </td>
          <td class="p-4 text-center text-xs text-gray-400">{{ formatearFecha(e.creado_en) }}</td>
          <td class="p-4 text-center">
            <div class="flex justify-center gap-2">
              <button
                @click="$emit('ver', e)"
                class="px-3 py-1.5 bg-[#1b2a4a] text-white rounded-lg text-xs hover:bg-[#0f1a2e] transition"
              >
                Ver detalle
              </button>
              <button
                v-if="e.activo === 1"
                @click="$emit('bloquear', e)"
                class="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition"
              >
                Bloquear
              </button>
              <span v-else class="px-3 py-1.5 bg-gray-300 text-gray-500 rounded-lg text-xs">
                Bloqueado
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="estudiantes.length === 0" class="text-center py-12 text-gray-400">
      No se encontraron estudiantes.
    </div>
  </div>
</template>

<script setup>
import UsuarioEstadoBadge from '../adminUsuarios/UsuarioEstadoBadge.vue'

defineProps({
  estudiantes: { type: Array, required: true }
})
defineEmits(['ver', 'bloquear'])

const iniciales = (n = '', a = '') => `${n[0] || ''}${a[0] || ''}`.toUpperCase()

const formatearFecha = (f) => {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>