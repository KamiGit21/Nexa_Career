// src/frontend/services/ofertaService.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // API Gateway
  headers: { 'Content-Type': 'application/json' },
})

export async function listarOfertas() {
  const { data } = await api.get('/api/ofertas')
  return data
}

export async function obtenerOfertaPorId(id) {
  const { data } = await api.get(`/api/ofertas/${id}`)
  return data
}

export async function obtenerTitulo(id) {
  const { data } = await api.get(`/api/ofertas/${id}`)
  return data.data.oferta
}

export async function buscarOfertasPorTitulo(titulo) {
  const { data } = await api.get(`/api/ofertas/titulo/${encodeURIComponent(titulo)}`)
  return data
}

export async function crearOferta(payload) {
  const { data } = await api.post('/api/ofertas/crear', payload)
  return data
}

export async function editarOferta(id, payload) {
  const { data } = await api.put(`/api/ofertas/${id}/editar`, payload)
  return data
}

export async function cambiarEstadoOferta(id, estado, rechazo = '') {
  const { data } = await api.put(`/api/ofertas/${id}/estado`, { estado, rechazo })
  return data
}

export async function darDeBajaOferta(id) {
  const { data } = await api.put(`/api/ofertas/${id}/archivar`)
  return data
}

export async function listarOfertasPorEmpleador(idEmpleador) {
  const { data } = await api.get(`/api/ofertas/empleador/${idEmpleador}`)
  return data
}

export async function buscarOfertasPorEmpleadorConFiltro(idEmpleador, termino, estado = null) {
  let url = `/api/ofertas/empleador/${idEmpleador}/buscar?q=${encodeURIComponent(termino || '')}`;
  if (estado !== null && estado !== '') {
    url += `&estado=${estado}`;
  }
  const { data } = await api.get(url);
  return data;
}

export async function listarOfertasPaginadasPorEstado(pagina, estado, size = 15) {
  const { data } = await api.get(`/api/ofertas/pagina/${pagina}/size/${size}/estado/${estado}`);
  return data;
}

export async function contarOfertasPorEstado(estado = 1) {
  const { data } = await api.get('/api/ofertas')
  return (data.data || []).filter(o => o.estado === estado).length
}

export async function obtenerOfertasPaginacionOrdenada(pagina) {
  const { data } = await api.get(`/api/ofertas/pagina/${pagina}/apertura/`)
  return data
}

export async function obtenerOfertasPaginacionPorEstadoYFecha(pagina, estado, size = 15) {
  const { data } = await api.get(`/api/ofertas/pagina/${pagina}/size/${size}/apertura/abajo/estado/${estado}`);
  return data;
}

export async function buscarOfertasPaginadas(pagina, estado, size = 15, titulo = '', orden = 'reciente') {
  const { data } = await api.get(`/api/ofertas/titulo/${encodeURIComponent(titulo)}/pagina/${pagina}/size/${size}`);
  return data;
}

export async function buscarOfertasAvanzado(filtros) {
  const params = {
    pagina: filtros.pagina || 1,
    size: filtros.size || 15,
    q: filtros.titulo,
    empresa: filtros.empleador,
    modalidad: filtros.modalidad,
    sort: filtros.orden || 'desc'
  };

  const { data } = await api.get('/api/ofertas/busqueda', { params });
  return data;
}

export const actualizarVencimientos = async () => {
  try {
    const { data } = await api.patch('/api/ofertas/vencidas');
    return data;
  } catch (error) {
    console.error('Error al actualizar vencimientos:', error);
    return { success: false, message: error.message };
  }
};


export default {
  listarOfertas,
  obtenerOfertaPorId,
  obtenerTitulo,
  buscarOfertasPorTitulo,
  crearOferta,
  editarOferta,
  cambiarEstadoOferta,
  darDeBajaOferta,
  listarOfertasPorEmpleador,
  listarOfertasPaginadasPorEstado,
  contarOfertasPorEstado,
  obtenerOfertasPaginacionOrdenada,
  obtenerOfertasPaginacionPorEstadoYFecha,
  actualizarVencimientos
}