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

//Actualizar curso (edición)
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

export const buscarCursosEstudiante = async (idEstudiante, termino) => {
  try {
    const res = await fetch(`${API_URL}/cursos/estudiante/${idEstudiante}/cursos/buscar?q=${encodeURIComponent(termino)}`)
    return await res.json()
  } catch (error) {
    console.error('Error en buscarCursosEstudiante:', error)
    return { success: false, message: error.message }
  }
}

export const buscarCursosEmpleador = async (idEmpleador, termino) => {
  try {
    const res = await fetch(`${API_URL}/cursos/empleador/${idEmpleador}/cursos/buscar?q=${encodeURIComponent(termino)}`)
    return await res.json()
  } catch (error) {
    console.error('Error en buscarCursosEmpleador:', error)
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

// Registrar una nueva categoría
export const registrarCategoria = async (categoria) => {
  try {
    const res = await fetch(`${API_URL}/categorias/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoria })
    })
    return await res.json()
  } catch (error) {
    console.error('Error en registrarCategoria:', error)
    return { success: false, message: error.message }
  }
}

// Eliminar una categoría, por ahora no se esta usando
export const eliminarCategoria = async (id) => {
  try {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'DELETE'
    })
    return await res.json()
  } catch (error) {
    console.error('Error en eliminarCategoria:', error)
    return { success: false, message: error.message }
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

export const listarTodosCursosPaginados = async (pagina = 1, size = 15) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}`);
    return await res.json();
  } catch (error) {
    console.error('Error en listarTodosCursosPaginados:', error);
    return { success: false, message: error.message };
  }
};

export const listarCursosPaginadosPorFecha = async (pagina, size, direccion) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}/fecha/${direccion}`);
    return await res.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const listarCursosPaginadosPorEstado = async (pagina = 1, size = 15, estado) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}/estado/${estado}`);
    return await res.json();
  } catch (error) {
    console.error('Error en listarCursosPublicosPaginados:', error);
    return { success: false, message: error.message };
  }
};

export const listarCursosPublicosPaginadosPorFechaPorEstado = async (pagina, size, direccion, estado) => {
  try {
    const res = await fetch(`${API_URL}/cursos/pagina/${pagina}/size/${size}/fecha/${direccion}/estado/${estado}`);
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

//Integración API con opción a dar de baj
export const archivarCurso = async (idCurso) => {
  try {
    const response = await fetch(`${API_URL}/cursos/${idCurso}/archivar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    return data  // Se espera { success: true } o { success: false, message: '...' }
  } catch (error) {
    console.error('Error en archivarCurso:', error)
    return { success: false, message: 'Error de conexión' }
  }
};

export const desarchivarCurso = async (idCurso) => {
  try {
    const response = await fetch(`${API_URL}/cursos/${idCurso}/desarchivar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.error('Error en desarchivarCurso:', error)
    return { success: false, message: 'Error de conexión' }
  }
}
