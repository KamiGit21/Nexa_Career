import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cursos/';

async function ejecutarPruebas() {
    try {
        console.log('⏳ Iniciando pruebas del microservicio de Cursos...\n');
        
        // 1. POST: Registrar curso de estudiante
        console.log('➡️ 1. Ejecutando POST: Registrando nuevo curso de estudiante...');
        const postResponse = await axios.post(`${API_URL}registrarPorEstudiante`, {
            curso: 'Curso de Frontend con React',
            descripcion: 'Aprende sobre Frontend usando React para crear tus paginas web.',
            id_estudiante: '1', // Asegúrate de que este ID exista en tu base de datos
            contacto: 'cursitos@gmail.com'     
        });
        const nuevoId = postResponse.data.id_curso;
        console.log('✅ Resultado:', postResponse.data);
        console.log('--------------------------------------------------\n');

        // 2. POST: Registrar curso de empleador
        console.log('➡️ 2. Ejecutando POST: Registrando nuevo curso de empleador...');
        const postResponse2 = await axios.post(`${API_URL}registrarPorEmpleador`, {
            curso: 'Criptomonedas, el futuro hoy',
            descripcion: 'Aprende sobre criptomonedas y su impacto en el futuro.',
            id_empleador: '1', // Asegúrate de que este ID exista en tu base de datos
            contacto: 'correoSerioINC@gmail.com'     
        });
        const nuevoId2 = postResponse2.data.id_curso;
        console.log('✅ Resultado:', postResponse2.data);
        console.log('--------------------------------------------------\n');

        // 3. GET: Listar todos
        console.log('➡️ 2. Ejecutando GET: Solicitando todos los cursos...');
        const getResponse = await axios.get(API_URL);
        console.table(getResponse.data.data);
        console.log('--------------------------------------------------\n');
    }catch (error) {
    console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
  }
}

ejecutarPruebas();

