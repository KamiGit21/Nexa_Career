// src/frontend/services/estudianteService.js
const API_URL = 'http://localhost:3000/api';

export const registrarEstudiante = async (data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en registrarEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEstudiantePorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEstudiantePorId:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEstudiantePorGmail = async (gmail) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/gmail/${encodeURIComponent(gmail)}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEstudiantePorGmail:', error);
    return { success: false, message: error.message };
  }
};

export const actualizarPerfilEstudiante = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/perfil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en actualizarPerfilEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const cambiarContrasenaEstudiante = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/contrasena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en cambiarContrasenaEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerPostulacionesPorEstudiante = async (id) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${id}/postulaciones`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerPostulacionesPorEstudiante:', error);
    return { success: false, message: error.message };
  }
};

// Subir CV
export const subirCV = async (idEstudiante, file) => {
  try {
    console.log('=== estudianteService.subirCV ===');
    console.log('ID Estudiante:', idEstudiante);
    console.log('Archivo:', file.name, file.type, file.size);
    
    const formData = new FormData();
    formData.append('cv', file);
    
    // Verificar el contenido del FormData
    for (let pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }
    
    const res = await fetch(`${API_URL}/estudiantes/${idEstudiante}/cv/upload`, {
      method: 'POST',
      body: formData
      // No incluir Content-Type, el navegador lo setea automáticamente
    });
    
    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error en subirCV:', error);
    return { success: false, message: error.message };
  }
};

// Obtener información del CV
export const obtenerInfoCV = async (idEstudiante) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${idEstudiante}/cv/info`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerInfoCV:', error);
    return { success: false, message: error.message };
  }
};

// Eliminar CV
export const eliminarCV = async (idEstudiante) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/${idEstudiante}/cv`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (error) {
    console.error('Error en eliminarCV:', error);
    return { success: false, message: error.message };
  }
};