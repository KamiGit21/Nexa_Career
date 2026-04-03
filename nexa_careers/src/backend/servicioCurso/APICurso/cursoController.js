// src/backend/servicioCurso/APICurso/cursoController.js
import db from '../../api-gateway/db.js';

//1. Crear Curso por estudiante
export const registrarCursoEstudiante = async (req, res) => {
  const { curso, descripcion, id_estudiante, contacto } = req.body;

  try {
    const estado = 0; // 0 por defecto al crearse
    const tipoOfertante = 0; // 0 para estudiante, 1 para empleador
    const fechaSQL = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD

    // IMPORTANTE: En el SQL usamos 'id_empleador' para coincidir con tu BD
    const [result] = await db.query(
      `INSERT INTO curso (curso, descripcion, id_estudiante, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_estudiante, contacto, estado, tipoOfertante, fechaSQL]
    );
    res.status(201).json({ success: true, id_curso: result.insertId, message: 'Curso creada correctamente' });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};

//2. Crear Curso por empleador
export const registrarCursoEmpleador = async (req, res) => {
  const { curso, descripcion, id_empleador, contacto } = req.body;

  try {
    const estado = 0; // 0 por defecto al crearse
    const tipoOfertante = 1; // 1 para empleador, 0 para estudiante
    const fechaSQL = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD

    // IMPORTANTE: En el SQL usamos 'id_empleador' para coincidir con tu BD
    const [result] = await db.query(
      `INSERT INTO curso (curso, descripcion, id_empleador, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_empleador, contacto, estado, tipoOfertante, fechaSQL]
    );
    res.status(201).json({ success: true, id_curso: result.insertId, message: 'Curso creada correctamente' });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};

// 3. GET: Listar todas los cursos
export const listarCursos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM curso');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

// 4. GET: Listar solo los cursos disponibles para el estudiante (estado = 1)
export const listarCursosDisponibles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM curso WHERE estado = 1'); // Solo cursos con estado 1 (aceptados/disponibles)
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos disponibles:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

// 5. GET: Listar cursos publicados por un estudiante específico (tipo_ofertante = 0, para estudiante)
export const listarCursosPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM curso WHERE tipo_ofertante = 0 AND id_estudiante = ?', [id_estudiante]);
    // Siempre devolver 200, incluso si no hay cursos
    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del estudiante' });
  }
};

// 6. GET: Listar cursos publicados por un empleador específico (tipo_ofertante = 1, para empleador)
export const listarCursosPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM curso WHERE tipo_ofertante = 1 AND id_empleador = ?', [id_empleador]);
    // Siempre devolver 200, incluso si no hay cursos
    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del empleador' });
  }
};