<template>
  <div class="gestion-header">
    <div class="gestion-header__top">
      <h1 class="gestion-header__titulo">Gestión de Cursos</h1>
      <span class="gestion-header__contador">{{ total }} curso{{ total !== 1 ? 's' : '' }}</span>
    </div>
    <div class="gestion-header__buscador">
      <span>🔍</span>
      <input
        type="text"
        placeholder="Buscar curso por nombre o instructor..."
        :value="busqueda"
        @input="$emit('update:busqueda', $event.target.value)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'GestionCursosHeader',
  props: {
    busqueda: { type: String, default: '' },
    total:    { type: Number, default: 0 }
  },
  emits: ['update:busqueda']
}
</script>

<style scoped>
.gestion-header { background:#1e293b; padding:32px 24px; border-radius:12px; margin-bottom:24px; }
.gestion-header__top { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.gestion-header__titulo { font-size:24px; font-weight:700; color:#fff; margin:0; }
.gestion-header__contador { font-size:13px; color:#94a3b8; background:rgba(255,255,255,.08); padding:4px 12px; border-radius:20px; }
.gestion-header__buscador { display:flex; align-items:center; background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.15); border-radius:8px; padding:10px 16px; gap:10px; }
.gestion-header__buscador input { flex:1; background:transparent; border:none; outline:none; color:#fff; font-size:14px; }
.gestion-header__buscador input::placeholder { color:#94a3b8; }
</style>