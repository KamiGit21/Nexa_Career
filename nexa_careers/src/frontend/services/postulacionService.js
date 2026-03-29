import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * GET /api/estudiantes/:id/postulaciones
 * Respuesta: { success: true, data: Postulacion[] }
 */
export async function obtenerPostulaciones(idEstudiante) {
  const { data } = await api.get(`/api/estudiantes/${idEstudiante}/postulaciones`)
  return data
}

/**
 * POST /api/estudiantes/:id/postulaciones
 * Body: { id_oferta }
 * Respuesta: { success: true, message }
 */
export async function postularAOferta(idEstudiante, idOferta) {
  const { data } = await api.post(`/api/estudiantes/${idEstudiante}/postulaciones`, {
    id_oferta: idOferta,
  })
  return data
}

//nuevooo para lista postulantes------------------------------------------------
// Agregar al final del archivo
export async function obtenerPostulantesPorOferta(idOferta) {
  const { data } = await api.get(`/api/ofertas/${idOferta}/postulantes`);
  return data;
}
