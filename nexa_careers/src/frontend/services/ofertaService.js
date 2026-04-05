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
  return data.data.oferta // Retorna solo el título de la oferta
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

export async function listarOfertasPorEmpleador(idEmpleador) {
  const { data } = await api.get(`/api/ofertas/empleador/${idEmpleador}`)
  return data
}

//export default para que las importaciones con default funcionennnn
export default {
  listarOfertas,
  obtenerOfertaPorId,
  buscarOfertasPorTitulo,
  crearOferta,
  editarOferta,
  cambiarEstadoOferta,
  listarOfertasPorEmpleador
}