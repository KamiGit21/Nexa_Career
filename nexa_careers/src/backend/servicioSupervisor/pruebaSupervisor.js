import axios from 'axios';

// Apuntamos directo al microservicio de supervisores en el puerto 3005
const API_URL = 'http://localhost:3005/api/supervisores';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Supervisores...\n');

    // 1. POST: Registrar supervisor
    console.log('➡️ 1. Ejecutando POST: Registrando nuevo supervisor...');
    const postResponse = await axios.post(`${API_URL}/registrar`, {
      nombre: 'Carlos Administrador',
      telefono: 65432100,
      gmail: 'carlos.jefe@nexacareers.com',
      contrasena: 'claveAdmin123'
    });
    const nuevoId = postResponse.data.id_supervisor;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');

    // 2. GET: Listar todos
    console.log('➡️ 2. Ejecutando GET: Solicitando todos los supervisores...');
    const getResponse = await axios.get(API_URL);
    console.table(getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar por gmail
    console.log('➡️ 3. Ejecutando GET: Buscando por gmail "carlos.admin@nexacareers.com"...');
    const emailResponse = await axios.get(`${API_URL}/gmail/carlos.admin@nexacareers.com`);
    console.log('✅ Resultado:', emailResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. PUT: Actualizar perfil
    console.log(`➡️ 4. Ejecutando PUT: Actualizando perfil del ID ${nuevoId}...`);
    const putPerfilResponse = await axios.put(`${API_URL}/${nuevoId}/perfil`, {
      nombre: 'Carlos Admin Principal',
      telefono: 77778888,
      gmail: 'carlos.jefe@nexacareers.com'
    });
    console.log('✅ Resultado:', putPerfilResponse.data);
    console.log('--------------------------------------------------\n');

    // 5. PUT: Cambiar contraseña
    console.log(`➡️ 5. Ejecutando PUT: Cambiando contraseña del ID ${nuevoId}...`);
    const putPasswordResponse = await axios.put(`${API_URL}/${nuevoId}/contrasena`, {
      contrasena: 'nuevaClaveSuperSegura456'
    });
    console.log('✅ Resultado:', putPasswordResponse.data);
    console.log('--------------------------------------------------\n');

    // 6. PUT: Cambiar estado
    console.log(`➡️ 6. Ejecutando PUT: Desactivando al supervisor ID ${nuevoId}...`);
    const putEstadoResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      activo: 0 // Lo pasamos a inactivo
    });
    console.log('✅ Resultado:', putEstadoResponse.data);

    // 7. PUT: Bloquear usuario (el supervisor que acabamos de crear)
    console.log(`➡️ 7. Ejecutando PUT: Bloqueando al supervisor ID ${nuevoId}...`);
    const putBloquearResponse = await axios.put(`${API_URL}/1/bloquear`, {
      tipo_usuario: 'supervisor',
      id_usuario: nuevoId,
      motivo: 'Prueba de bloqueo desde test'
    });
    console.log('✅ Resultado:', putBloquearResponse.data);
    console.log('--------------------------------------------------\n');

    // 8. GET: Listar usuarios bloqueados
    console.log('➡️ 8. Ejecutando GET: Listando usuarios bloqueados...');
    const getBloqueadosResponse = await axios.get(`${API_URL}/bloqueados`);
    console.log('✅ Resultado:', getBloqueadosResponse.data);
    console.log('--------------------------------------------------\n');

    // 9. PUT: Desbloquear usuario
    console.log(`➡️ 9. Ejecutando PUT: Desbloqueando al supervisor ID ${nuevoId}...`);
    const putDesbloquearResponse = await axios.put(`${API_URL}/1/desbloquear`, {
      tipo_usuario: 'supervisor',
      id_usuario: nuevoId
    });
    console.log('✅ Resultado:', putDesbloquearResponse.data);
    console.log('--------------------------------------------------\n');

    console.log('\n🎉 Todas las pruebas del supervisor finalizaron con éxito.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();