// src/frontend/services/empleadorService.js
const API_URL = 'http://localhost:3000/api';

export const registrarEmpleador = async (data) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en registrarEmpleador:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEmpleadorPorId = async (id) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEmpleadorPorId:', error);
    return { success: false, message: error.message };
  }
};

export const obtenerEmpleadorPorGmail = async (gmail) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/gmail/${encodeURIComponent(gmail)}`);
    return await res.json();
  } catch (error) {
    console.error('Error en obtenerEmpleadorPorGmail:', error);
    return { success: false, message: error.message };
  }
};

export const actualizarPerfilEmpleador = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/${id}/perfil`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en actualizarPerfilEmpleador:', error);
    return { success: false, message: error.message };
  }
};

export const cambiarContrasenaEmpleador = async (id, data) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/${id}/contrasena`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    console.error('Error en cambiarContrasenaEmpleador:', error);
    return { success: false, message: error.message };
  }
};

export const cambiarEstadoEmpleador = async (id, activo) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo })
    });
    return await res.json();
  } catch (error) {
    console.error('Error en cambiarEstadoEmpleador:', error);
    return { success: false, message: error.message };
  }
};