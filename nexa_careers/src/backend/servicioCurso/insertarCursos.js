import axios from 'axios';

// Apuntamos al API Gateway para el microservicio de cursos
const API_URL = 'http://localhost:3000/api/cursos';

// --- 1. GENERACIÓN DINÁMICA DE CURSOS DE ESTUDIANTES (33 en total) ---
const materiasEstudiante = ['Programación en Python', 'Cálculo Diferencial', 'Álgebra Lineal', 'Física Mecánica', 'Bases de Datos', 'Redes VLSM', 'Inglés Técnico', 'Diseño UI/UX', 'Marketing Digital', 'Economía Básica', 'Desarrollo Web'];
const nivelesEstudiante = ['Básico', 'Intermedio', 'Avanzado'];

const cursosEstudiantesMock = [];
let indexEstudiante = 0;

for (const materia of materiasEstudiante) {
  for (const nivel of nivelesEstudiante) {
    cursosEstudiantesMock.push({
      curso: `Grupo de Estudio: ${materia} (${nivel})`,
      descripcion: `Sesiones de repaso y tutoría entre compañeros para dominar los conceptos de ${materia} a nivel ${nivel.toLowerCase()}. Preparación para exámenes y proyectos.`,
      // Reparte equitativamente los IDs 1, 2 y 3
      id_estudiante: (indexEstudiante % 3) + 1, 
      contacto: `estudiante${(indexEstudiante % 3) + 1}@ucb.edu.bo`
    });
    indexEstudiante++;
  }
}

// --- 2. GENERACIÓN DINÁMICA DE CURSOS DE EMPLEADORES (33 en total) ---
const materiasEmpleador = ['Liderazgo Ágil', 'Framework Scrum', 'Arquitectura AWS', 'Ciberseguridad', 'Ventas B2B', 'Atención al Cliente', 'Gestión de Proyectos', 'Inteligencia Artificial', 'Cultura DevOps', 'Análisis en Power BI', 'Excel Financiero'];
const enfoquesEmpleador = ['Corporativo', 'Bootcamp Acelerado', 'Certificación Oficial'];

const cursosEmpleadoresMock = [];
let indexEmpleador = 0;

for (const materia of materiasEmpleador) {
  for (const enfoque of enfoquesEmpleador) {
    cursosEmpleadoresMock.push({
      curso: `${materia} - ${enfoque}`,
      descripcion: `Capacitación profesional en ${materia} con un enfoque ${enfoque.toLowerCase()}. Diseñado para potenciar las habilidades técnicas y blandas requeridas en la industria actual.`,
      // Reparte equitativamente los IDs 1, 2 y 3
      id_empleador: (indexEmpleador % 3) + 1,
      contacto: `capacitacion@empresa${(indexEmpleador % 3) + 1}.com`
    });
    indexEmpleador++;
  }
}

// --- 3. FUNCIÓN PARA ENVIAR TODO A LA API ---
async function ejecutarInsercionPorAPI() {
  console.log('🚀 Iniciando inserción masiva de 66 Cursos a través de la API...\n');
  
  let exitosas = 0;
  let fallidas = 0;

  // Procesamos los 33 de estudiantes
  console.log('--- Insertando 33 Cursos de Estudiantes ---');
  for (let i = 0; i < cursosEstudiantesMock.length; i++) {
    const cursoData = cursosEstudiantesMock[i];
    try {
      await axios.post(`${API_URL}/registrarPorEstudiante`, cursoData);
      exitosas++;
      console.log(`✅ [Estudiante] Creado: ${cursoData.curso}`);
    } catch (error) {
      fallidas++;
      const msjError = error.response ? error.response.data.message : error.message;
      console.error(`❌ Error en "${cursoData.curso}":`, msjError);
    }
  }

  console.log('\n--- Insertando 33 Cursos de Empleadores ---');
  // Procesamos los 33 de empleadores
  for (let i = 0; i < cursosEmpleadoresMock.length; i++) {
    const cursoData = cursosEmpleadoresMock[i];
    try {
      await axios.post(`${API_URL}/registrarPorEmpleador`, cursoData);
      exitosas++;
      console.log(`✅ [Empleador] Creado: ${cursoData.curso}`);
    } catch (error) {
      fallidas++;
      const msjError = error.response ? error.response.data.message : error.message;
      console.error(`❌ Error en "${cursoData.curso}":`, msjError);
    }
  }

  console.log('\n=============================================');
  console.log(`🎉 Proceso completado.`);
  console.log(`✅ Cursos insertados: ${exitosas} (33 Estudiantes, 33 Empleadores)`);
  console.log(`❌ Cursos fallidos: ${fallidas}`);
  console.log('=============================================');
}

// Ejecutamos el script
ejecutarInsercionPorAPI();