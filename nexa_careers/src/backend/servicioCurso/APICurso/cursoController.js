import db from './db.js';

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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
    `);

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria
      
      WHERE cc.id_curso = ? AND cat.estado = 1
      ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 1
    `);

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria AND cat.estado = 1 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos disponibles:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};

export const listarCursosPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM curso.curso WHERE tipo_ofertante = 0 AND id_estudiante = ?',
      [id_estudiante]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria AND cat.estado = 1 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del estudiante' });
  }
};

// listarcursospublicadosporestudiante
export const listarCursosPublicadosPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.tipo_ofertante = 0 
        AND c.id_estudiante = ? 
        AND c.estado = 1
      ORDER BY c.fecha_creacion DESC`,
      [id_estudiante]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos publicados del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos publicados del estudiante' });
  }
};

export const listarCursosPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM curso.curso WHERE tipo_ofertante = 1 AND id_empleador = ?',
      [id_empleador]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria AND cat.estado = 1 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al listar cursos del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos del empleador' });
  }
};

// listarcursospublicadosporempleador
export const listarCursosPublicadosPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.tipo_ofertante = 1 
        AND c.id_empleador = ? 
        AND c.estado = 1
      ORDER BY c.fecha_creacion DESC`,
      [id_empleador]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos publicados del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos publicados del empleador' });
  }
};

export const cambiarEstadoCurso = async (req, res) => {
  const { id_curso } = req.params;
  const { estado, rechazo } = req.body;
  try {
    let query = 'UPDATE curso.curso SET estado = ?';
    const values = [estado];
    if (rechazo !== undefined) {
      query += ', rechazo = ?';
      values.push(rechazo);
    }
    query += ' WHERE id_curso = ?';
    values.push(id_curso);

    await db.query(query, values);
    res.status(200).json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    console.error('Error en cambiarEstadoCurso:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 0
      ORDER BY c.fecha_creacion DESC
    `);
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarCursosPendientes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerCursosPaginacion = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso');
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso LIMIT ? OFFSET ?',
      [limite, offset]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows , paginas: totalPaginas});
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const obtenerCursosPaginacionPorEstado = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size);
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso WHERE estado = ?', [estado]);
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso WHERE estado = ? LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const obtenerCursosPaginacionPorFechaDesendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15; 
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso');
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso ORDER BY fecha_creacion DESC, id_curso DESC LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas});
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const obtenerCursosPaginacionPorFechaAscendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso');
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso ORDER BY fecha_creacion ASC, id_curso ASC LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const obtenerCursosPaginacionPorEstadoYFechaDescendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso WHERE estado = ?', [estado]);
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso WHERE estado = ? ORDER BY fecha_creacion DESC, id_curso DESC LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const obtenerCursosPaginacionPorEstadoYFechaAscendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM curso.curso WHERE estado = ?', [estado]);
    const totalCursos = countResult[0].total;
    const totalPaginas = Math.ceil(totalCursos / limite);

    const [rows] = await db.query(
      'SELECT * FROM curso.curso WHERE estado = ? ORDER BY fecha_creacion ASC, id_curso ASC LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas });
  } catch (error) {
    console.error('Error al obtener cursos paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar los cursos' });
  }
};

export const agregarCategoriaACurso = async (req, res) => {
  const { id_curso } = req.params;
  const { id_categoria } = req.body;
  if (!id_categoria) return res.status(400).json({ success: false, message: 'id_categoria requerido' });
  try {
    const [exists] = await db.query('SELECT 1 FROM categoria_curso.categoria_curso WHERE id_curso = ? AND id_categoria = ?', [id_curso, id_categoria]);
    if (exists.length > 0) {
      return res.status(409).json({ success: false, message: 'Relación ya existe' });
    }
    const [result] = await db.query('INSERT INTO categoria_curso.categoria_curso (id_categoria, id_curso) VALUES (?, ?)', [id_categoria, id_curso]);
    res.status(201).json({ success: true, id_categoria_curso: result.insertId, message: 'Categoría agregada correctamente' });
  } catch (error) {
    console.error('Error al agregar categoría a curso:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const quitarCategoriaDeCurso = async (req, res) => {
  const { id_curso, id_categoria } = req.params;
  try {
    const [result] = await db.query('DELETE FROM categoria_curso.categoria_curso WHERE id_curso = ? AND id_categoria = ?', [id_curso, id_categoria]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Relación no encontrada' });
    }
    res.status(200).json({ success: true, message: 'Categoría removida correctamente' });
  } catch (error) {
    console.error('Error al quitar categoría de curso:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const listarCategoriasDeCurso = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
      FROM categoria_curso.categoria_curso cc 
      JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
      WHERE cc.id_curso = ? 
      AND cat.estado = 1 
      ORDER BY cat.categoria
    `, [id_curso]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar categorías del curso:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const syncCategoriasCurso = async (id_curso, categorias) => {
  if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
    return;
  }
  await db.query('DELETE FROM categoria_curso.categoria_curso WHERE id_curso = ?', [id_curso]);
  
  for (const id_categoria of categorias) {
    await db.query(
      'INSERT INTO categoria_curso.categoria_curso (id_categoria, id_curso) VALUES (?, ?)',
      [id_categoria, id_curso]
    );
  }
};

export const registrarCursoEstudiante = async (req, res) => {
  const { curso, descripcion, id_estudiante, contacto, categorias } = req.body;

  try {
    const estado = 0;
    const tipoOfertante = 0;
    const fechaSQL = new Date().toISOString().slice(0, 10);

    const [result] = await db.query(
      `INSERT INTO curso.curso (curso, descripcion, id_estudiante, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_estudiante, contacto, estado, tipoOfertante, fechaSQL]
    );

    const id_curso = result.insertId;

    if (categorias && Array.isArray(categorias) && categorias.length > 0) {
      await syncCategoriasCurso(id_curso, categorias);
    }

    res.status(201).json({ success: true, id_curso: id_curso, message: 'Curso creado correctamente' });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};

export const registrarCursoEmpleador = async (req, res) => {
  const { curso, descripcion, id_empleador, contacto, categorias } = req.body;

  try {
    const estado = 0;
    const tipoOfertante = 1;
    const fechaSQL = new Date().toISOString().slice(0, 10);

    const [result] = await db.query(
      `INSERT INTO curso.curso (curso, descripcion, id_empleador, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_empleador, contacto, estado, tipoOfertante, fechaSQL]
    );

    const id_curso = result.insertId;

    if (categorias && Array.isArray(categorias) && categorias.length > 0) {
      await syncCategoriasCurso(id_curso, categorias);
    }

    res.status(201).json({ success: true, id_curso: id_curso, message: 'Curso creado correctamente' });
  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};

export const actualizarCurso = async (req, res) => {
  const { id_curso } = req.params;
  const { curso, descripcion, contacto, categorias } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE curso.curso SET curso = ?, descripcion = ?, contacto = ? WHERE id_curso = ?`,
      [curso, descripcion, contacto, id_curso]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }

    if (categorias !== undefined) {
      await syncCategoriasCurso(id_curso, categorias);
    }

    res.status(200).json({ success: true, message: 'Curso actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({ success: false, message: 'Error interno al actualizar el curso' });
  }
};

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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.id_curso = ?`,
      [id_curso]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }

    const [categoriasRows] = await db.query(`
      SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
      FROM categoria_curso.categoria_curso cc 
      JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
      WHERE cc.id_curso = ?
      ORDER BY cat.categoria
    `, [id_curso]);

    const cursoData = rows[0];
    cursoData.categorias = categoriasRows;

    res.status(200).json({ success: true, data: cursoData });
  } catch (error) {
    console.error('Error al obtener curso por ID:', error);
    res.status(500).json({ success: false, message: 'Error al obtener el curso' });
  }
};

export const buscarCursosPublicosAvanzado = async (req, res) => {
  try {
    const { pagina = 1, size = 15, q = '', categoria = 'Todos', orden = 'reciente' } = req.query;
    const limite = parseInt(size);
    const offset = (parseInt(pagina) - 1) * limite;

    let queryBase = `
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 1
    `;
    const params = [];

    if (q && q.trim() !== '') {
      const searchPattern = `%${q}%`;
      queryBase += ` AND (
        c.curso LIKE ? OR 
        e.nombre LIKE ? OR 
        e.apellido LIKE ? OR 
        emp.empresa LIKE ?
      )`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (categoria !== 'Todos') {
      // Agrega condición para filtrar por categoría
      queryBase += `
        AND EXISTS (
          SELECT 1 FROM categoria_curso.categoria_curso cc
          JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria
          WHERE cc.id_curso = c.id_curso AND cat.categoria = ?
        )`;
      params.push(categoria);
    }

    const [countResult] = await db.query(`SELECT COUNT(*) as total ${queryBase}`, params);
    const totalPaginas = Math.ceil(countResult[0].total / limite);
    let orderBy = " ORDER BY c.fecha_creacion DESC"; 
    if (orden === 'antiguo') orderBy = " ORDER BY c.fecha_creacion ASC";
    if (orden === 'titulo') orderBy = " ORDER BY c.curso ASC";

    const queryFinal = `
      SELECT 
        c.*,
        CASE
          WHEN c.tipo_ofertante = 0 THEN CONCAT(e.nombre, ' ', e.apellido)
          WHEN c.tipo_ofertante = 1 THEN emp.empresa
          ELSE 'Nexa User'
        END AS nombre_publicador,
        CASE
          WHEN c.tipo_ofertante = 0 THEN 'estudiante'
          WHEN c.tipo_ofertante = 1 THEN 'empleador'
          ELSE 'desconocido'
        END AS tipo_publicador
      ${queryBase} ${orderBy} LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(queryFinal, [...params, limite, offset]);

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria
        FROM categoria_curso.categoria_curso cc
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

export const archivarCurso = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_curso, estado FROM curso.curso WHERE id_curso = ?',
      [id_curso]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });
    }

    if (rows[0].estado === 3) {
      return res.status(400).json({ success: false, message: 'El curso ya está archivado' });
    }

    await db.query(
      'UPDATE curso.curso SET estado = 3 WHERE id_curso = ?',
      [id_curso]
    );

    return res.status(200).json({
      success: true,
      message: 'Curso archivado correctamente',
      data: { id_curso: parseInt(id_curso), estado: 3 }
    });
  } catch (error) {
    console.error('Error al archivar curso:', error);
    return res.status(500).json({ success: false, message: 'Error interno al archivar el curso' });
  }
};

export const desarchivarCurso = async (req, res) => {
  const { id_curso } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id_curso, estado FROM curso.curso WHERE id_curso = ?',
      [id_curso]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Curso no encontrado' });

    if (rows[0].estado !== 3)
      return res.status(400).json({ success: false, message: 'El curso no está archivado' });

    await db.query(
      'UPDATE curso.curso SET estado = 0 WHERE id_curso = ?',
      [id_curso]
    );

    return res.status(200).json({
      success: true,
      message: 'Curso desarchivado correctamente. Queda pendiente de revisión.',
      data: { id_curso: parseInt(id_curso), estado: 0 }
    });
  } catch (error) {
    console.error('Error al desarchivar curso:', error);
    return res.status(500).json({ success: false, message: 'Error interno al desarchivar el curso' });
  }
};

export const buscarCursosPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  const { q } = req.query;
  
  if (!id_estudiante || isNaN(id_estudiante)) {
    return res.status(400).json({ success: false, message: 'ID de estudiante inválido' });
  }
  
  if (!q || q.trim() === '') {
    return res.status(400).json({ success: false, message: 'Debe proporcionar un término de búsqueda' });
  }
  
  try {
    const searchTerm = `%${q.trim()}%`;
    
    const [rows] = await db.query(
      `SELECT * FROM curso.curso 
       WHERE tipo_ofertante = 0 
         AND id_estudiante = ?
         AND curso LIKE ?
       ORDER BY curso ASC`,
      [id_estudiante, searchTerm]
    );

    // Agregar categorías a cada curso
    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }
    
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar cursos del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al buscar cursos' });
  }
};

export const buscarCursosPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  const { q } = req.query;
  
  if (!id_empleador || isNaN(id_empleador)) {
    return res.status(400).json({ success: false, message: 'ID de empleador inválido' });
  }
  
  if (!q || q.trim() === '') {
    return res.status(400).json({ success: false, message: 'Debe proporcionar un término de búsqueda' });
  }
  
  try {
    const searchTerm = `%${q.trim()}%`;
    
    const [rows] = await db.query(
      `SELECT * FROM curso.curso 
       WHERE tipo_ofertante = 1 
         AND id_empleador = ?
         AND curso LIKE ?
       ORDER BY curso ASC`,
      [id_empleador, searchTerm]
    );

    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }
    
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar cursos del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al buscar cursos' });
  }
};



export const filtrarCursosPorRangoFechas = async (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  if (!fechaDesde || !fechaHasta) {
    return res.status(400).json({
      success: false,
      message: 'Los parámetros fechaDesde y fechaHasta son obligatorios (formato YYYY-MM-DD)'
    });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(fechaDesde) || !dateRegex.test(fechaHasta)) {
    return res.status(400).json({
      success: false,
      message: 'Las fechas deben tener el formato YYYY-MM-DD'
   });
  }
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
      FROM curso.curso c
      LEFT JOIN estudiante.estudiante e   ON c.tipo_ofertante = 0 AND c.id_estudiante = e.id_estudiante
      LEFT JOIN empleador.empleador emp  ON c.tipo_ofertante = 1 AND c.id_empleador  = emp.id_empleador
      WHERE c.estado = 1
        AND c.fecha_creacion BETWEEN ? AND ?
      ORDER BY c.fecha_creacion DESC`,
      [fechaDesde, fechaHasta]
    );

    // add categorías a cada curso igual que en listarCursosDisponibles
    for (const curso of rows) {
      const [categoriasRows] = await db.query(`
        SELECT cc.id_categoria_curso, cc.id_categoria, cat.categoria 
        FROM categoria_curso.categoria_curso cc 
        JOIN categoria.categoria cat ON cc.id_categoria = cat.id_categoria 
        WHERE cc.id_curso = ?
        ORDER BY cat.categoria
      `, [curso.id_curso]);
      curso.categorias = categoriasRows;
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al filtrar cursos por rango de fechas:', error);
    res.status(500).json({ success: false, message: 'Error al filtrar cursos por fechas' });
   
  }
};

export const contarCursos = async (req, res) => {
  const { estado } = req.params;
  if (estado === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Debes proporcionar un estado para contar los cursos.' 
    });
  }
    try {
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM curso.curso WHERE estado = ?',
      [estado]
    );
    res.status(200).json({
      success: true,
      data: {
        estado: parseInt(estado),
        total: result[0].total
      }
    });

  } catch (error) {
    console.error('❌ Error al contar cursos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al intentar contar los cursos' 
    });
  }
};

export const contarCursosEstudiante = async (req, res) => {
  const { estudiante } = req.params;
  if (estudiante === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Debes proporcionar un ID de estudiante para contar sus cursos.' 
    });
  }

  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM curso.curso WHERE id_estudiante = ? AND estado = 1',
      [estudiante]
    );
    res.status(200).json({
      success: true,
      data: {
        estudiante: parseInt(estudiante),
        total: result[0].total
      }
    });

  } catch (error) {
    console.error('❌ Error al contar cursos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al intentar contar los cursos' 
    });
  }
};

export const contarCursosEmpleador = async (req, res) => {
  const { empleador } = req.params;
  if (empleador === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Debes proporcionar un ID de empleador para contar sus cursos.' 
    });
  }

  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM curso.curso WHERE id_empleador = ? AND estado = 1',
      [empleador]
    );
    res.status(200).json({
      success: true,
      data: {
        empleador: parseInt(empleador),
        total: result[0].total
      }
    });

  } catch (error) {
    console.error('❌ Error al contar cursos:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al intentar contar los cursos' 
    });
  }
};
