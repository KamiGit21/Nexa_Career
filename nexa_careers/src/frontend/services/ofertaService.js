import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000', // API Gateway
  headers: { 'Content-Type': 'application/json' },
})

/**
 * GET /api/ofertas
 * Respuesta: { success: true, data: Oferta[] }
 */
export async function listarOfertas() {
  const { data } = await api.get('/api/ofertas')
  return data // { success, data: [] }
}

/**
 * GET /api/ofertas/:id
 * Respuesta: { success: true, data: Oferta }
 */
export async function obtenerOfertaPorId(id) {
  const { data } = await api.get(`/api/ofertas/${id}`)
  return data // { success, data: {} }
}

/**
 * GET /api/ofertas/titulo/:oferta
 * Respuesta: { success: true, data: Oferta[] }
 */
export async function buscarOfertasPorTitulo(titulo) {
  const { data } = await api.get(`/api/ofertas/titulo/${encodeURIComponent(titulo)}`)
  return data
}

/**
 * POST /api/ofertas/crear
 * Body: { descripcion, fecha_apertura, oferta, id_empleador }
 * Respuesta: { success: true, id_oferta, message }
 */
export async function crearOferta(payload) {
  const { data } = await api.post('/api/ofertas/crear', payload)
  return data
}

/**
 * PUT /api/ofertas/:id/editar
 * Body: campos a actualizar
 * Respuesta: { success: true, message }
 */
export async function editarOferta(id, payload) {
  const { data } = await api.put(`/api/ofertas/${id}/editar`, payload)
  return data
}

/**
 * PUT /api/ofertas/:id/estado
 * Body: { estado, rechazo? }
 * Respuesta: { success: true, message }
 */
export async function cambiarEstadoOferta(id, estado, rechazo = '') {
  const { data } = await api.put(`/api/ofertas/${id}/estado`, { estado, rechazo })
  return data
}

/**
 * GET /api/ofertas/empleador/:id_empleador
 * Respuesta: { success: true, data: Oferta[] }
 */
export async function listarOfertasPorEmpleador(idEmpleador) {
  const { data } = await api.get(`/api/ofertas/empleador/${idEmpleador}`)
  return data
}