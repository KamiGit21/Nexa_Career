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

// 7. GET: Obtener un curso por su ID
export const obtenerCursoPorId = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM curso WHERE id_curso = ?', 
      [id_curso]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener curso por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el curso' });
  }
};

// PATCH: Cambiar estado de un curso
export const cambiarEstadoCurso = async (req, res) => {
  const { id_curso } = req.params
  const { estado } = req.body // 1=aceptado, 2=rechazado, 3=archivado
  try {
    await db.query('UPDATE curso SET estado = ? WHERE id_curso = ?', [estado, id_curso])
    res.status(200).json({ success: true, message: 'Estado actualizado' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado' })
  }
};

export const listarCursosPendientes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.id_curso,
        c.curso,
        c.descripcion,
        c.contacto,
        c.estado,
        c.fecha_creacion,
        c.tipo_ofertante,
        CASE
          WHEN c.tipo_ofertante = 0 THEN CONCAT(e.nombre, ' ', e.apellido)
          WHEN c.tipo_ofertante = 1 THEN emp.empresa
          ELSE '—'
        END AS nombre_publicador
      FROM curso c
      LEFT JOIN estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 0
      ORDER BY c.fecha_creacion DESC
    `);
 
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarCursosPendientes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};