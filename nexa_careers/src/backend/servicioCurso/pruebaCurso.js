import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cursos/';

async function ejecutarPruebas() {
    try {
        console.log('⏳ Iniciando pruebas del microservicio de Cursos...\n');

        /*
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
        console.log('➡️ 3. Ejecutando GET: Solicitando todos los cursos...');
        const getResponse = await axios.get(API_URL);
        console.table(getResponse.data.data);
        console.log('--------------------------------------------------\n');

        // 4. GET: Listar cursos disponibles
        console.log('➡️ 4. Ejecutando GET: Solicitando cursos disponibles...');
        const getResponseDisponibles = await axios.get(`${API_URL}listarDisponibles`);
        console.table(getResponseDisponibles.data.data);
        console.log('--------------------------------------------------\n');

        // 5. GET: Listar cursos por estudiante
        console.log('➡️ 5. Ejecutando GET: Solicitando cursos por estudiante (id_estudiante=1)...');
        const getResponsePorEstudiante = await axios.get(`${API_URL}estudiante/1`);
        console.table(getResponsePorEstudiante.data.data);
        console.log('--------------------------------------------------\n');

        // 6. GET: Listar cursos por empleador
        console.log('➡️ 6. Ejecutando GET: Solicitando cursos por empleador (id_empleador=1)...');
        const getResponsePorEmpleador = await axios.get(`${API_URL}empleador/1`);
        console.table(getResponsePorEmpleador.data.data);
        console.log('--------------------------------------------------\n');
        */

        // 7. GET: Listar cursos paginacion
        console.log('➡️ 7. Ejecutando GET: Solicitando cursos por paginacion...');
        const getResponsePaginacion = await axios.get(`${API_URL}pagina/1`);
        console.table(getResponsePaginacion.data.data);
        console.log('--------------------------------------------------\n');

        // 8. GET: Listar cursos paginacion por estado
        console.log('➡️ 8. Ejecutando GET: Solicitando cursos por paginacion y estado 0');
        const getResponsePaginacionEstado = await axios.get(`${API_URL}pagina/1/estado/0`);
        console.table(getResponsePaginacionEstado.data.data);
        console.log('--------------------------------------------------\n');

        // 9. GET: Listar cursos paginacion por fecha
        console.log('➡️ 9. Ejecutando GET: Solicitando cursos por paginacion y fecha');
        const getResponsePaginacionFecha = await axios.get(`${API_URL}pagina/1/fecha`);
        console.table(getResponsePaginacionFecha.data.data);
        console.log('--------------------------------------------------\n');

        // 10. GET: Listar cursos paginacion por fecha y estado
        console.log('➡️ 10. Ejecutando GET: Solicitando cursos por paginacion, fecha y estado 0');
        const getResponsePaginacionFechaEstado = await axios.get(`${API_URL}pagina/1/fecha/estado/0`);
        console.table(getResponsePaginacionFechaEstado.data.data);
        console.log('--------------------------------------------------\n');

        
        console.log('Pruebas completadas exitosamente.');
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.response ? error.response.data : error.message);
    }
}

ejecutarPruebas();

