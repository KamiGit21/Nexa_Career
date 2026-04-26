const API_URL = 'http://localhost:3000/api';

export const enviarCodigoAEstudiante = async (correo, codigo) => {
  try {
    const res = await fetch(`${API_URL}/estudiantes/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo })
    });
    return await res.json();
  } catch (error) {
    console.error('Error en enviarCodigoAEstudiante:', error);
    return { success: false, message: error.message };
  }
};

export const enviarCodigoAEmpleador = async (correo, codigo) => {
  try {
    const res = await fetch(`${API_URL}/empleadores/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo })
    });
    return await res.json();
  } catch (error) {
    console.error('Error en enviarCodigoAEmpleador:', error);
    return { success: false, message: error.message };
  }
};

export const enviarCodigoASupervisor = async (correo, codigo) => {
  try {
    const res = await fetch(`${API_URL}/supervisores/enviar-codigo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, codigo })
    });
    return await res.json();
  } catch (error) {
    console.error('Error en enviarCodigoASupervisor:', error);
    return { success: false, message: error.message };
  }
};