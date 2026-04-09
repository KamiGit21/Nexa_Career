import axios from 'axios';

// Apuntamos al API Gateway
const API_URL = 'http://localhost:3000/api/ofertas/crear';

// Array de objetos formateado exactamente como lo pide tu req.body
const ofertasMock = [
  { oferta: 'Software Engineer II', descripcion: '¿Te apasiona construir grandes productos? Buscamos talento para nuestro equipo.', fecha_apertura: '2025-05-15', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Senior Data Analyst', descripcion: 'Lidera nuestros esfuerzos de análisis y toma de decisiones basadas en datos.', fecha_apertura: '2025-06-01', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Product Manager', descripcion: 'Únete para cambiar la forma en que trabaja la gente. Buscamos un PM creativo.', fecha_apertura: '2025-06-12', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'UX/UI Designer', descripcion: 'Buscamos diseñador para asegurar la mejor experiencia. Se requiere portafolio.', fecha_apertura: '2025-06-25', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Frontend Developer (Vue.js)', descripcion: 'Necesitamos un frontend developer avanzado para optimizar nuestra interfaz.', fecha_apertura: '2025-07-01', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Backend Developer (Node.js)', descripcion: 'Únete al equipo backend. Aprende de los mejores en la industria.', fecha_apertura: '2025-07-10', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'DevOps Engineer', descripcion: 'Optimiza nuestra infraestructura y flujos de trabajo de CI/CD. Excelentes beneficios.', fecha_apertura: '2025-07-18', id_empleador: 1, modalidad: 'Remoto' },
  { oferta: 'Marketing Specialist', descripcion: 'Crea y ejecuta campañas multicanal para nuestra diversa línea de productos.', fecha_apertura: '2025-07-28', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'Financial Accountant', descripcion: 'Supervisa informes financieros y cumplimiento. Experiencia en software requerida.', fecha_apertura: '2025-08-01', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Sales Executive', descripcion: 'Identifica oportunidades de mercado y define la hoja de ruta de ventas.', fecha_apertura: '2025-08-11', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Cloud Architect', descripcion: 'Diseña e implementa soluciones en AWS para mejorar nuestra eficiencia operativa.', fecha_apertura: '2025-08-28', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'Project Manager', descripcion: 'Supervisa el desarrollo e implementación de nuevas plataformas digitales.', fecha_apertura: '2025-09-01', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Copywriter', descripcion: 'Crea contenido atractivo para nuestro sitio web, blog y redes sociales.', fecha_apertura: '2025-09-09', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Digital Marketing Lead', descripcion: 'Impulsa nuestra estrategia y ejecuta campañas efectivas de marketing digital.', fecha_apertura: '2025-09-17', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'Data Scientist', descripcion: 'Analiza conjuntos de datos y desarrolla modelos de aprendizaje automático.', fecha_apertura: '2025-09-25', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Full Stack Engineer', descripcion: 'Construye y mantén nuestra aplicación web utilizando tecnologías modernas.', fecha_apertura: '2025-10-01', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'QA Automation Tester', descripcion: 'Automatiza nuestros flujos de trabajo de prueba y asegura la calidad.', fecha_apertura: '2025-10-08', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Scrum Master', descripcion: 'Facilita nuestros equipos de desarrollo y promueve mejores prácticas ágiles.', fecha_apertura: '2025-10-16', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Content Strategist', descripcion: 'Desarrolla y ejecuta nuestra estrategia de contenido para aumentar el tráfico.', fecha_apertura: '2025-10-25', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Operations Manager', descripcion: 'Supervisa nuestros equipos operativos diarios y asegura operaciones eficientes.', fecha_apertura: '2025-11-01', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Business Development Rep', descripcion: 'Únete a nuestro equipo de ventas y genera nuevos leads calificados.', fecha_apertura: '2025-11-08', id_empleador: 1, modalidad: 'Remoto' },
  { oferta: 'Graphic Artist', descripcion: 'Crea conceptos visuales atractivos para una variedad de proyectos de diseño.', fecha_apertura: '2025-11-16', id_empleador: 2, modalidad: 'Presencial' },
  { oferta: 'Recruiter', descripcion: 'Busca y recluta talento de alto nivel para nuestros proyectos internos.', fecha_apertura: '2025-11-23', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Customer Success Lead', descripcion: 'Gestiona nuestro equipo de éxito del cliente y aumenta la retención.', fecha_apertura: '2025-12-01', id_empleador: 1, modalidad: 'Remoto' },
  { oferta: 'Supply Chain Analyst', descripcion: 'Analiza y optimiza nuestros flujos de trabajo de cadena de suministro.', fecha_apertura: '2025-12-08', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'AI/ML Research Scientist', descripcion: 'Investiga nuevas tecnologías y lidera la innovación en IA de la empresa.', fecha_apertura: '2025-12-16', id_empleador: 3, modalidad: 'Presencial' },
  { oferta: 'Legal Counsel', descripcion: 'Asesoramiento legal para contratos corporativos y cumplimiento normativo.', fecha_apertura: '2025-12-23', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Administrative Assistant', descripcion: 'Apoyo administrativo general, gestión de agenda y atención a clientes.', fecha_apertura: '2026-01-01', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Social Media Coordinator', descripcion: 'Gestiona comunidades en línea y modera el contenido de nuestras redes.', fecha_apertura: '2026-01-08', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Senior DevOps Manager', descripcion: 'Lidera el equipo de infraestructura cloud y optimización de servidores.', fecha_apertura: '2026-01-16', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Product Designer', descripcion: 'Redefine la experiencia de usuario resolviendo problemas complejos de diseño.', fecha_apertura: '2026-01-23', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Operations Lead', descripcion: 'Asegura la seguridad y eficiencia de las operaciones en planta.', fecha_apertura: '2026-02-01', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Lead Software Engineer', descripcion: 'Ayuda a construir el sistema de automatización de próxima generación.', fecha_apertura: '2026-02-08', id_empleador: 3, modalidad: 'Presencial' },
  { oferta: 'Entry-Level Developer', descripcion: 'Programa de entrada para desarrolladores junior. No se requiere experiencia.', fecha_apertura: '2026-02-16', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Social Media Manager', descripcion: 'Usa datos y análisis para impulsar campañas en líneas de productos innovadoras.', fecha_apertura: '2026-02-23', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Research Scientist', descripcion: 'Investiga e identifica nuevas oportunidades de mercado tecnológico.', fecha_apertura: '2026-03-01', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'Simulation Technician', descripcion: 'Asegura que los sistemas de simulación funcionen de manera óptima y segura.', fecha_apertura: '2026-03-08', id_empleador: 3, modalidad: 'Presencial' },
  { oferta: 'Cloud Computing Intern', descripcion: 'Obtén experiencia práctica en computación en la nube y análisis de datos.', fecha_apertura: '2026-03-16', id_empleador: 1, modalidad: 'Remoto' },
  { oferta: 'Junior Software Engineer', descripcion: 'Buscamos un ingeniero de software apasionado para construir nueva tecnología.', fecha_apertura: '2026-03-23', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'Content Writer', descripcion: 'Comparte nuestra historia y conecta con clientes a través de artículos.', fecha_apertura: '2026-04-01', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'QA Tester', descripcion: 'Asegura que nuestros productos cumplan con los más altos estándares de calidad.', fecha_apertura: '2026-04-08', id_empleador: 3, modalidad: 'Presencial' },
  { oferta: 'Junior UX Designer', descripcion: 'Estudio creativo busca artista para crear conceptos visuales atractivos.', fecha_apertura: '2026-04-16', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Junior Accountant', descripcion: 'Apoya a nuestro equipo financiero, prepara estados financieros y reportes.', fecha_apertura: '2026-04-23', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Coordinator', descripcion: 'Asegura que la planta esté funcionando a su máximo rendimiento operativo.', fecha_apertura: '2026-05-01', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'Junior Recruiter', descripcion: 'Ayúdanos a crecer nuestro equipo de ingeniería atrayendo talento top.', fecha_apertura: '2026-05-08', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Junior Product Manager', descripcion: 'Realiza investigaciones de mercado y define requisitos de nuevos productos.', fecha_apertura: '2026-05-16', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Technician I', descripcion: '¿Eres un técnico hábil? Únete para mantener nuestra tecnología funcionando.', fecha_apertura: '2026-05-23', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Floor Admin Assistant', descripcion: 'Asistente para asegurar la seguridad y eficiencia de las operaciones diarias.', fecha_apertura: '2026-06-01', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'QA Automation Tester', descripcion: 'Automatiza procesos de prueba y asegura la fiabilidad de nuestros productos.', fecha_apertura: '2026-06-08', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Junior Data Analyst', descripcion: 'Aprende a usar datos y análisis para resolver problemas complejos.', fecha_apertura: '2026-06-16', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Software Eng Intern', descripcion: 'Pasantía en desarrollo de software con posibilidad de contratación fija.', fecha_apertura: '2026-06-23', id_empleador: 1, modalidad: 'Híbrido' },
  { oferta: 'Lead Java Developer', descripcion: 'Desarrollador Java Senior para liderar el equipo de arquitectura de microservicios.', fecha_apertura: '2026-07-01', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Junior UI Designer', descripcion: 'Diseñador de interfaces junior para maquetación y prototipado rápido.', fecha_apertura: '2026-07-08', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Lead Data Analyst', descripcion: 'Lidera el análisis predictivo para la nueva plataforma digital de seguros.', fecha_apertura: '2026-07-16', id_empleador: 3, modalidad: 'Presencial' },
  { oferta: 'Junior Marketing Manager', descripcion: 'Crea y ejecuta campañas multicanal con enfoque en métricas de conversión.', fecha_apertura: '2026-07-23', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Lead QA Tester', descripcion: 'Dirige el equipo de aseguramiento de calidad y pruebas automatizadas E2E.', fecha_apertura: '2026-08-01', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Junior DevOps Engineer', descripcion: 'Apoya en la implementación de pipelines de despliegue continuo en AWS.', fecha_apertura: '2026-08-08', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'Especialista en Ciberseguridad', descripcion: 'Protege nuestra infraestructura de red y datos confidenciales contra amenazas.', fecha_apertura: '2026-08-15', id_empleador: 1, modalidad: 'Remoto' },
  { oferta: 'Desarrollador iOS Senior', descripcion: 'Construye la próxima generación de nuestra aplicación móvil insignia para Apple.', fecha_apertura: '2026-08-22', id_empleador: 2, modalidad: 'Remoto' },
  { oferta: 'Desarrollador Android Senior', descripcion: 'Lidera el equipo móvil de Android creando interfaces fluidas y rápidas.', fecha_apertura: '2026-08-29', id_empleador: 3, modalidad: 'Híbrido' },
  { oferta: 'Ingeniero de Datos', descripcion: 'Diseña y construye tuberías de datos robustas y escalables para analítica.', fecha_apertura: '2026-09-05', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Diseñador Gráfico Jr', descripcion: 'Crea banners, posts y material visual para nuestras campañas publicitarias.', fecha_apertura: '2026-09-12', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Traductor Técnico', descripcion: 'Traduce manuales y documentación técnica de software del inglés al español.', fecha_apertura: '2026-09-19', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Soporte Técnico Nivel 2', descripcion: 'Brinda asistencia técnica avanzada a clientes corporativos y resolución de tickets.', fecha_apertura: '2026-09-26', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Admin Sistemas Linux', descripcion: 'Mantenimiento, configuración y optimización de nuestros servidores en Linux.', fecha_apertura: '2026-10-03', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Asesor de Ventas B2B', descripcion: 'Venta de soluciones tecnológicas a nivel corporativo con atractivas comisiones.', fecha_apertura: '2026-10-10', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Redactor SEO', descripcion: 'Redacción de artículos optimizados para buscadores para nuestro blog corporativo.', fecha_apertura: '2026-10-17', id_empleador: 1, modalidad: 'Presencial' },
  { oferta: 'Analista de Riesgos', descripcion: 'Evalúa y mitiga riesgos financieros asociados a nuevos proyectos de expansión.', fecha_apertura: '2026-10-24', id_empleador: 2, modalidad: 'Híbrido' },
  { oferta: 'Auditor de Calidad ISO', descripcion: 'Asegura el cumplimiento de las normativas de calidad ISO 9001 en los procesos.', fecha_apertura: '2026-10-31', id_empleador: 3, modalidad: 'Remoto' },
  { oferta: 'Director RRHH', descripcion: 'Lidera la estrategia de cultura, compensaciones y talento de toda la organización.', fecha_apertura: '2026-11-07', id_empleador: 1, modalidad: 'Presencial' }
];

async function ejecutarInsercionPorAPI() {
  console.log('🚀 Iniciando inserción masiva a través de la API...\n');
  
  let exitosas = 0;
  let fallidas = 0;

  // Usamos un ciclo for...of para hacer las peticiones secuencialmente y no saturar el servidor
  for (let i = 0; i < ofertasMock.length; i++) {
    const oferta = ofertasMock[i];
    
    try {
      // Hacemos el POST exacto como lo haría el frontend
      await axios.post(API_URL, oferta);
      exitosas++;
      console.log(`✅ [${i + 1}/70] Creada exitosamente: ${oferta.oferta}`);
    } catch (error) {
      fallidas++;
      const msjError = error.response ? error.response.data.message : error.message;
      console.error(`❌ [${i + 1}/70] Error al crear "${oferta.oferta}":`, msjError);
    }
  }

  console.log('\n=============================================');
  console.log(`🎉 Proceso completado.`);
  console.log(`✅ Ofertas insertadas: ${exitosas}`);
  console.log(`❌ Ofertas fallidas: ${fallidas}`);
  console.log('=============================================');
}

ejecutarInsercionPorAPI();