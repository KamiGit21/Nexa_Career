<template>
  <div v-if="curso" class="curso-card">
    <div class="curso-card__imagen">
      <img :src="curso.imagen || '/placeholder-curso.png'" :alt="curso.titulo" />
      <CursoEstadoBadge :estado="curso.estado" class="curso-card__badge" />
    </div>
    <div class="curso-card__body">
      <span class="curso-card__categoria">{{ curso.categoria }}</span>
      <h3 class="curso-card__titulo">{{ curso.titulo }}</h3>
      <p class="curso-card__desc">{{ curso.descripcion }}</p>
      <div class="curso-card__meta">
        <span>{{ curso.instructor }}</span>
        <span>{{ curso.duracion }}</span>
      </div>
    </div>
    <div class="curso-card__acciones">
      <button v-if="curso.estado === 'pendiente'"
        class="btn btn--aprobar"
        @click="$emit('cambiar-estado', { id: curso.id, nuevoEstado: 'aprobado' })">
        Aprobar
      </button>
      <button v-if="curso.estado !== 'rechazado'"
        class="btn btn--rechazar"
        @click="$emit('cambiar-estado', { id: curso.id, nuevoEstado: 'rechazado' })">
        Rechazar
      </button>
      <button v-if="curso.estado !== 'archivado'"
        class="btn btn--archivar"
        @click="$emit('cambiar-estado', { id: curso.id, nuevoEstado: 'archivado' })">
        Archivar
      </button>
    </div>
  </div>
</template>

<script>
import CursoEstadoBadge from '@/components/misCursos/CursoEstadoBadge.vue'
export default {
  name: 'GestionCursoCard',
  components: { CursoEstadoBadge },
  props: { curso: { type: Object, default: null } },
  emits: ['cambiar-estado']
}
</script>

<style scoped>
.curso-card { background:#fff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,.08); overflow:hidden; display:flex; flex-direction:column; transition:box-shadow .2s; }
.curso-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.14); }
.curso-card__imagen { position:relative; height:160px; background:#e5e7eb; }
.curso-card__imagen img { width:100%; height:100%; object-fit:cover; }
.curso-card__badge { position:absolute; top:10px; right:10px; }
.curso-card__body { padding:16px; flex:1; }
.curso-card__categoria { font-size:11px; font-weight:600; color:#6366f1; text-transform:uppercase; letter-spacing:.5px; }
.curso-card__titulo { margin:6px 0 8px; font-size:15px; font-weight:700; color:#1e293b; line-height:1.3; }
.curso-card__desc { font-size:13px; color:#64748b; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.curso-card__meta { display:flex; justify-content:space-between; font-size:12px; color:#94a3b8; margin-top:10px; }
.curso-card__acciones { display:flex; gap:8px; padding:12px 16px; border-top:1px solid #f1f5f9; }
.btn { flex:1; padding:7px 0; border:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; transition:opacity .2s; }
.btn:hover { opacity:.85; }
.btn--aprobar { background:#d1fae5; color:#065f46; }
.btn--rechazar { background:#fee2e2; color:#991b1b; }
.btn--archivar { background:#f1f5f9; color:#475569; }
</style>