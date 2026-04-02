import axios from 'axios';

// Apuntamos directo al microservicio para probar su funcionamiento interno
const API_URL = 'http://localhost:3000/api/empleadores/';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Empleadores...\n');

    
    // 1. POST: Registrar empleador
    console.log('➡️ 1. Ejecutando POST: Registrando nuevo empleador...');
    const postResponse = await axios.post(`${API_URL}registrar`, { 
      empresa: 'Tech Solutions LLC',
      telefono: 12345678,
      gmail: 'contactoAEAE@techsolutions.com',
      contrasena: 'admin123aaa'
    });
    const nuevoId = postResponse.data.id_empleador;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');
    
    
    // 2. GET: Listar todos
    console.log('➡️ 2. Ejecutando GET: Solicitando todos los empleadores...');
    const getResponse = await axios.get(API_URL);
    console.table(getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar por gmail
    console.log('➡️ 3. Ejecutando GET: Buscando por gmail "contacto@techsolutions.com"...');
    const emailResponse = await axios.get(`${API_URL}/gmail/contacto@techsolutions.com`);
    console.log('✅ Resultado:', emailResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. PUT: Actualizar perfil
    console.log(`➡️ 4. Ejecutando PUT: Actualizando perfil del ID ${nuevoId}...`);
    const putPerfilResponse = await axios.put(`${API_URL}/${nuevoId}/perfil`, {
      empresa: 'Tech Solutions Global',
      telefono: 87654321,
      gmail: 'rh@techsolutions.com'
    });
    console.log('✅ Resultado:', putPerfilResponse.data);
    console.log('--------------------------------------------------\n');

    // 5. PUT: Cambiar contraseña
    console.log(`➡️ 5. Ejecutando PUT: Cambiando contraseña del ID ${nuevoId}...`);
    const putPasswordResponse = await axios.put(`${API_URL}/${nuevoId}/contrasena`, {
      contrasena: 'nuevaClaveSegura2026'
    });
    console.log('✅ Resultado:', putPasswordResponse.data);
    console.log('--------------------------------------------------\n');

    // 6. PUT: Cambiar estado
    console.log(`➡️ 6. Ejecutando PUT: Desactivando al empleador ID ${nuevoId}...`);
    const putEstadoResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      activo: 0 
    });
    console.log('✅ Resultado:', putEstadoResponse.data);
    console.log('\n🎉 Todas las pruebas del empleador finalizaron con éxito.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();