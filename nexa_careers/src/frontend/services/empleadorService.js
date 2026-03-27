export const registrarEmpleador = async (data) => {
  try {
    const res = await fetch('http://localhost:3000/api/empleadores/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (error) {
    console.error('Error en service:', error);
    return { success: false };
  }
};