// src/frontend/services/cursoService.js
const API_URL = 'http://localhost:3000/api'

export const publicarCursoPorEstudiante = async (data) => {
  try {
    const res = await fetch(`${API_URL}/cursos/registrarPorEstudiante`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (error) {
    console.error('Error en publicarCursoPorEstudiante:', error)
    return { success: false, message: error.message }
  }
}

export const publicarCursoPorEmpleador = async (data) => {
  try {
    const res = await fetch(`${API_URL}/cursos/registrarPorEmpleador`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (error) {
    console.error('Error en publicarCursoPorEmpleador:', error)
    return { success: false, message: error.message }
  }
}

export const listarCursosPorEstudiante = async (id) => {
  try {
    const res = await fetch(`${API_URL}/cursos/estudiante/${id}`)
    return await res.json()
  } catch (error) {
    console.error('Error en listarCursosPorEstudiante:', error)
    return { success: false, message: error.message }
  }
}

export const listarCursosPorEmpleador = async (id) => {
  try {
    const res = await fetch(`${API_URL}/cursos/empleador/${id}`)
    return await res.json()
  } catch (error) {
    console.error('Error en listarCursosPorEmpleador:', error)
    return { success: false, message: error.message }
  }
}

// Obtiene las categorías de la tabla `categoria` via GET /api/categorias
export const listarCategorias = async () => {
  try {
    const res = await fetch(`${API_URL}/categorias`)
    return await res.json()
  } catch (error) {
    console.error('Error en listarCategorias:', error)
    return { success: false, data: [] }
  }
}

export const listarCursosPublicos = async () => {
  try {
    const res = await fetch(`${API_URL}/cursos/listarDisponibles`)
    return await res.json()
  } catch (error) {
    console.error('Error en listarCursosPublicos:', error)
    return { success: false, message: error.message }
  }
}

export const obtenerCursoPorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/cursos/${id}`)
    return await res.json()
  } catch (error) {
    console.error('Error en obtenerCursoPorId:', error)
    return { success: false, message: error.message }
  }
}