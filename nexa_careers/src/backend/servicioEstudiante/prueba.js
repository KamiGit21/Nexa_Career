import axios from 'axios';

const API_URL = 'http://localhost:3003/api/estudiantes';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Estudiantes...\n');

    // 1. POST: Registrar estudiante
    console.log('➡️ 1. Ejecutando POST: Registrando nuevo estudiante...');
    const postResponse = await axios.post(`${API_URL}/registrar`, { 
      nombre: 'Julio',
      apellido: 'Alvares',
      telefono: 1234566,
      gmail: 'juan@gmail.com',
      cv: 'ruta/al/cv.pdf',
      contrasena: 'secreta123',
      id_carrera: 1, // <- Ojo: Debe existir una carrera con ID 1 en tu DB
      descripcion: 'Estudiante apasionado por la tecnología',
      habilidades: 'Vue, Node, MySQL',
      educacion: 'Universidad Nacional',
      cuenta: 'julioAlvares'
    });
    const nuevoId = postResponse.data.id_estudiante;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');

    // 2. GET: Listar todos
    console.log('➡️ 2. Ejecutando GET: Solicitando todos los estudiantes...');
    const getResponse = await axios.get(API_URL);
    console.table(getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar por Cuenta
    console.log('➡️ 3. Ejecutando GET: Buscando por cuenta "juanperez99"...');
    const cuentaResponse = await axios.get(`${API_URL}/cuenta/juanperez99`);
    console.log('✅ Resultado:', cuentaResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. PUT: Actualizar perfil
    console.log(`➡️ 4. Ejecutando PUT: Actualizando perfil del ID ${nuevoId}...`);
    const putPerfilResponse = await axios.put(`${API_URL}/${nuevoId}/perfil`, {
      telefono: 87654321,
      gmail: 'juan.nuevo@gmail.com',
      cv: 'ruta/nueva/cv_v2.pdf',
      descripcion: 'Desarrollador Full Stack',
      educacion: 'Universidad Nacional - Titulado',
      habilidades: 'Vue, Node, MySQL, Docker'
    });
    console.log('✅ Resultado:', putPerfilResponse.data);
    console.log('--------------------------------------------------\n');

    // 5. PUT: Cambiar contraseña
    console.log(`➡️ 5. Ejecutando PUT: Cambiando contraseña del ID ${nuevoId}...`);
    const putPasswordResponse = await axios.put(`${API_URL}/${nuevoId}/contrasena`, {
      contrasena: 'nuevaClaveSuperSegura'
    });
    console.log('✅ Resultado:', putPasswordResponse.data);
    console.log('--------------------------------------------------\n');

    // 6. PUT: Cambiar estado
    console.log(`➡️ 6. Ejecutando PUT: Desactivando al estudiante ID ${nuevoId}...`);
    const putEstadoResponse = await axios.put(`${API_URL}/${nuevoId}/estado`, {
      activo: 0 // 0 = false, 1 = true
    });
    console.log('✅ Resultado:', putEstadoResponse.data);
    console.log('\n🎉 Todas las pruebas finalizaron con éxito.');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();