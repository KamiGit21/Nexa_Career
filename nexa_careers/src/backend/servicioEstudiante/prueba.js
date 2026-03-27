import axios from 'axios';

const API_URL = 'http://localhost:3000/api/estudiantes';

async function ejecutarPruebas() {
  try {
    console.log('⏳ Iniciando pruebas del microservicio de Estudiantes...\n');

    // 1. POST: Registrar estudiante
    console.log('➡️ 1. Ejecutando POST: Registrando nuevo estudiante...');
    const postResponse = await axios.post(`${API_URL}/registrar`, { 
      nombre: 'Natalia',
      apellido: 'Urrutia',
      telefono: 7753452,
      gmail: 'nati@ucb.edu.bo',
      cv: 'https://www.linkedin.com',
      contrasena: 'password123',
      id_carrera: 2, 
      descripcion: 'Estudiante apasionado por la tecnología y el desarrollo de software.',
      habilidades: 'Vue, Node, MySQL, Docker, Git, CI/CD, AWS, Python, Java',
      educacion: 'Universidad Catolica, Instituto Americano, Curso de seguridad y redes',
    });
    const nuevoId = postResponse.data.id_estudiante;
    console.log('✅ Resultado:', postResponse.data);
    console.log('--------------------------------------------------\n');

    // 2. GET: Listar todos
    console.log('➡️ 2. Ejecutando GET: Solicitando todos los estudiantes...');
    const getResponse = await axios.get(API_URL);
    console.table(getResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 3. GET: Buscar por gmail
    console.log('➡️ 3. Ejecutando GET: Buscando por gmail "nati@ucb.edu.bo"...');
    const cuentaResponse = await axios.get(`${API_URL}/gmail/nati@ucb.edu.bo`);
    console.log('✅ Resultado:', cuentaResponse.data.data);
    console.log('--------------------------------------------------\n');

    // 4. PUT: Actualizar perfil
    console.log(`➡️ 4. Ejecutando PUT: Actualizando perfil del ID ${nuevoId}...`);
    const putPerfilResponse = await axios.put(`${API_URL}/${nuevoId}/perfil`, {
      telefono: 87654321,
      gmail: 'juan.nuevo@ucb.edu.bo',
      cv: 'https://www.linkedin.com/in/juan-nuevo',
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