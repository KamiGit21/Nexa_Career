<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
    <table class="w-full text-sm">
      <thead class="bg-[#1e293b] text-white">
        <tr>
          <th class="p-4 text-left font-semibold">Empresa</th>
          <th class="p-4 text-left font-semibold">Correo</th>
          <th class="p-4 text-center font-semibold">Ofertas</th>
          <th class="p-4 text-center font-semibold">Cursos</th>
          <th class="p-4 text-center font-semibold">Estado</th>
          <th class="p-4 text-center font-semibold">Registro</th>
          <th class="p-4 text-center font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="emp in empleadores" :key="emp.id_empleador" class="hover:bg-gray-50 transition-colors">
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                {{ (emp.empresa || '?')[0].toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-slate-700">{{ emp.empresa }}</p>
                <p class="text-xs text-gray-400">ID #{{ emp.id_empleador }}</p>
              </div>
            </div>
          </td>
          <td class="p-4 text-xs text-gray-600">{{ emp.gmail }}</td>
          <td class="p-4 text-center font-semibold text-green-600">{{ emp.total_ofertas }}</td>
          <td class="p-4 text-center font-semibold text-amber-600">{{ emp.total_cursos }}</td>
          <td class="p-4 text-center"><UsuarioEstadoBadge :activo="emp.activo" /></td>
          <td class="p-4 text-center text-xs text-gray-400">{{ formatearFecha(emp.creado_en) }}</td>
          <td class="p-4 text-center">
            <div class="flex justify-center gap-2">
              <button @click="$emit('ver', emp)" class="px-3 py-1.5 bg-[#1b2a4a] text-white rounded-lg text-xs hover:bg-[#0f1a2e] transition">
                Ver detalle
              </button>
              <button
                v-if="emp.activo === 1"
                @click="$emit('bloquear', emp)"
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
    <div v-if="empleadores.length === 0" class="text-center py-12 text-gray-400">No se encontraron empleadores.</div>
  </div>
</template>

<script setup>
import UsuarioEstadoBadge from '../adminUsuarios/UsuarioEstadoBadge.vue'
defineProps({ empleadores: { type: Array, required: true } })
defineEmits(['ver', 'bloquear'])
const formatearFecha = (f) => {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>