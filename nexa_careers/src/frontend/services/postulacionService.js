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
  const { data } = await api.get(`/api/ofertantes/estudiante/${idEstudiante}/postulaciones`);
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

// Sacar el numero de postulaciones por oferta
export async function obtenerNumeroPostulacionesPorOferta(idOferta) {
  try {
    const { data } = await api.get(`/api/ofertantes/oferta/${idOferta}`);
    return data.data ? data.data.length : 0; 
  } catch (error) {
    // Si el backend devuelve 404 (No hay postulantes), retornamos 0
    if (error.response && error.response.status === 404) {
      return 0;
    }
    console.error(`Error obteniendo cantidad de postulaciones para oferta ${idOferta}:`, error);
    return 0;
  }
}

// Cambiar estado de la postulación 
export async function cambiarEstadoPostulacion(idPostulante, estado) {
  const { data } = await api.put(`/api/ofertantes/${idPostulante}/estado`, { estado });
  return data;
}