<template>
  <div class="filtros-card">
    <label class="filtros-card__label">Filtrar por estado:</label>
    <select
      class="filtros-card__select"
      :value="estadoFiltro"
      @change="$emit('update:estadoFiltro', $event.target.value)"
    >
      <option value="todos">Todos los estados ({{ total }})</option>
      <option v-for="op in opciones" :key="op.value" :value="op.value">
        {{ op.label }} ({{ conteos[op.value] ?? 0 }})
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'GestionCursosFiltros',
  props: {
    estadoFiltro: { type: String, default: 'todos' },
    conteos:      { type: Object, default: () => ({}) }
  },
  emits: ['update:estadoFiltro'],
  data() {
    return {
      opciones: [
        { value: '1', label: 'Pendiente'  },
        { value: '2', label: 'Aprobado'   },
        { value: '3', label: 'Rechazado'  },
        { value: '4', label: 'Archivado'  }
      ]
    }
  },
  computed: {
    total() { return Object.values(this.conteos).reduce((a, b) => a + b, 0) }
  }
}
</script>

<style scoped>
.filtros-card { background:#fff; border:1px solid #e2e8f0; border-radius:10px; box-shadow:0 1px 4px rgba(0,0,0,.06); padding:16px 20px; display:flex; align-items:center; gap:16px; margin-bottom:24px; }
.filtros-card__label { font-size:14px; font-weight:600; color:#374151; white-space:nowrap; }
.filtros-card__select { flex:1; max-width:280px; appearance:none; background:#f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 12px center; border:1px solid #d1d5db; border-radius:8px; padding:8px 36px 8px 12px; font-size:14px; color:#374151; cursor:pointer; outline:none; }
.filtros-card__select:focus { border-color:#6366f1; }
</style>