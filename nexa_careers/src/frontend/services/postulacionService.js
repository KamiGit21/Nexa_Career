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
  const { data } = await api.get(`/api/ofertantes/estudiante/${idEstudiante}`);
  return data
}

/**
 * POST /api/estudiantes/:id/postulaciones
 * Body: { id_oferta }
 * Respuesta: { success: true, message }
 */
export async function postularAOferta(idEstudiante, idOferta) {
  const { data } = await api.post(`/api/ofertantes/postular`, {
    id_oferta: idOferta,
    id_estudiante: idEstudiante
  })
  return data
}

//nuevooo para lista postulantes------------------------------------------------
// Agregar al final del archivo
export async function obtenerPostulantesPorOferta(idOferta) {
  const { data } = await api.get(`/api/ofertantes/oferta/${idOferta}`);
  return data;
}


//Numero de postulaciones por oferta
export async function obtenerNumeroPostulacionesPorOferta(idOferta) {
  const { data } = await api.get(`/api/ofertantes/oferta/${idOferta}`);
  return data.data.length; // Retorna el número de postulaciones para la oferta
}