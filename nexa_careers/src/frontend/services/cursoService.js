// C:\xampp\htdocs\Nexa_Career\nexa_careers\src\frontend\services\cursoService.js
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

// NUEVA: Actualizar curso (para edición)
export const actualizarCurso = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/cursos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  } catch (error) {
    console.error('Error en actualizarCurso:', error)
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
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error en listarCursosPorEmpleador:', error)
    return { success: false, message: error.message }
  }
}

export const listarCategorias = async () => {
  try {
    const res = await fetch(`${API_URL}/categorias`)
    const data = await res.json()
    if (data.success !== undefined) {
      return data
    }
    return { success: true, data: data }
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

export const listarCursosPublicosPaginados = async (pagina = 1, size = 15) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}/estado/1`);
    return await res.json();
  } catch (error) {
    console.error('Error en listarCursosPublicosPaginados:', error);
    return { success: false, message: error.message };
  }
};

export const listarCursosPublicosPaginadosPorFecha = async (pagina, size, direccion) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}/fecha/${direccion}/estado/1`);
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const buscarCursosAvanzado = async (filtros) => {
  try {
    const params = new URLSearchParams(filtros).toString();
    const res = await fetch(`${API_URL}/cursos/busqueda/avanzada?${params}`);
    return await res.json();
  } catch (error) {
    console.error('Error en buscarCursosAvanzado:', error);
    return { success: false, message: error.message };
  }
};