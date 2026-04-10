// src/backend/servicioCurso/APICurso/cursoController.js
import db from '../../api-gateway/db.js';

//1. Crear Curso por estudiante
export const registrarCursoEstudiante = async (req, res) => {
  const { curso, descripcion, id_estudiante, contacto } = req.body;

  try {
    const estado = 0;
    const tipoOfertante = 0;
    const fechaSQL = new Date().toISOString().slice(0, 10);

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
    const estado = 0;
    const tipoOfertante = 1;
    const fechaSQL = new Date().toISOString().slice(0, 10);

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

// 3. GET: Listar todas los cursos — con nombre del publicador para el catálogo
export const listarCursos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.*,
        CASE
          WHEN c.tipo_ofertante = 0 THEN CONCAT(e.nombre, ' ', e.apellido)
          WHEN c.tipo_ofertante = 1 THEN emp.empresa
          ELSE '—'
        END AS nombre_publicador,
        CASE
          WHEN c.tipo_ofertante = 0 THEN 'estudiante'
          WHEN c.tipo_ofertante = 1 THEN 'empleador'
          ELSE 'desconocido'
        END AS tipo_publicador
      FROM curso c
      LEFT JOIN estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

// 4. GET: Listar solo los cursos disponibles (estado = 1) — con nombre del publicador
export const listarCursosDisponibles = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        c.*,
        CASE
          WHEN c.tipo_ofertante = 0 THEN CONCAT(e.nombre, ' ', e.apellido)
          WHEN c.tipo_ofertante = 1 THEN emp.empresa
          ELSE '—'
        END AS nombre_publicador,
        CASE
          WHEN c.tipo_ofertante = 0 THEN 'estudiante'
          WHEN c.tipo_ofertante = 1 THEN 'empleador'
          ELSE 'desconocido'
        END AS tipo_publicador
      FROM curso c
      LEFT JOIN estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 1
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos disponibles:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

// 5. GET: Listar cursos publicados por un estudiante específico
export const listarCursosPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM curso WHERE tipo_ofertante = 0 AND id_estudiante = ?',
      [id_estudiante]
    );
    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del estudiante' });
  }
};

// 6. GET: Listar cursos publicados por un empleador específico
export const listarCursosPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM curso WHERE tipo_ofertante = 1 AND id_empleador = ?',
      [id_empleador]
    );
    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del empleador' });
  }
};

// 7. GET: Obtener un curso por su ID — con datos completos del publicador
export const obtenerCursoPorId = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT
        c.*,
        CASE
          WHEN c.tipo_ofertante = 0 THEN CONCAT(e.nombre, ' ', e.apellido)
          WHEN c.tipo_ofertante = 1 THEN emp.empresa
          ELSE '—'
        END AS nombre_publicador,
        CASE
          WHEN c.tipo_ofertante = 0 THEN 'estudiante'
          WHEN c.tipo_ofertante = 1 THEN 'empleador'
          ELSE 'desconocido'
        END AS tipo_publicador
      FROM curso c
      LEFT JOIN estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.id_curso = ?`,
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
  const { id_curso } = req.params;
  const { estado } = req.body; // 1=aceptado, 2=rechazado, 3=archivado
  try {
    await db.query('UPDATE curso SET estado = ? WHERE id_curso = ?', [estado, id_curso]);
    res.status(200).json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

// GET: Cursos pendientes (estado = 0) con nombre del publicador
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

// Obtener curso por paginación
export const obtenerCursosPaginacion = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

// Obtener curso por paginación por estado
export const obtenerCursosPaginacionPorEstado = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso WHERE estado = ? LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

// Obtener curso por paginación filtrado por fecha_creacion
export const obtenerCursosPaginacionPorFecha = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

// Obtener curso por paginación filtrado por fecha_creacion y estado
export const obtenerCursosPaginacionPorEstadoYFecha = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso WHERE estado = ? ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};