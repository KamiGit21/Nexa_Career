import db from './db.js';

// se normaliza el objeto oferta para asegurar que siempre tenga el campo motivo_rechazo, incluso si se llama rechazo en la base de datos
const normalizarOferta = (oferta) => ({
  ...oferta,
  motivo_rechazo: oferta.rechazo || oferta.motivo_rechazo || ''
});

export const obtenerOfertaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta WHERE id_oferta = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    }

    const [categoriasRows] = await db.query(
      `SELECT c.id_categoria, c.categoria 
        FROM categoria_oferta.categoria_oferta co 
        INNER JOIN categoria.categoria c ON co.id_categoria = c.id_categoria
        WHERE co.id_oferta = ? AND c.estado = 1`,
      [id]
    );

    const ofertaData = normalizarOferta(rows[0]);
    ofertaData.categorias = categoriasRows;

    res.status(200).json({ success: true, data: ofertaData });
  } catch (error) {
    console.error('Error al obtener oferta por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al obtener oferta' });
  }
};

const isValidDate = (value) => {
  if (!value) return true;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const validateOferta = (data) => {
  const errors = [];
  const { descripcion, fecha_apertura, oferta, id_empleador } = data;

  if (!oferta || !String(oferta).trim()) {
    errors.push('El título de la oferta es obligatorio');
  }

  if (!id_empleador || Number.isNaN(Number(id_empleador)) || Number(id_empleador) <= 0) {
    errors.push('El id_empleador es obligatorio y debe ser un número entero positivo');
  }

  if (descripcion && String(descripcion).length > 1000) {
    errors.push('La descripción no puede exceder 1000 caracteres');
  }

  if (oferta && String(oferta).length > 255) {
    errors.push('El título de la oferta no puede exceder 255 caracteres');
  }

  if (fecha_apertura && !isValidDate(fecha_apertura)) {
    errors.push('La fecha de apertura debe ser una fecha válida');
  }

  return { valid: errors.length === 0, errors };
};

// Validar que las categorías no estén archivadas
const validarCategoriasActivas = async (categorias) => {
  if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
    return { valid: true, errors: [] };
  }

  const errors = [];
  for (const idCategoria of categorias) {
    if (idCategoria) {
      const [rows] = await db.query('SELECT estado FROM categoria.categoria WHERE id_categoria = ?', [idCategoria]);
      if (rows.length === 0) {
        errors.push(`Categoría con ID ${idCategoria} no existe`);
      } else if (rows[0].estado === 0) {
        errors.push(`No se puede usar categorías archivadas (ID: ${idCategoria})`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

export const crearOferta = async (req, res) => {
  const { descripcion, fecha_apertura, fecha_cierre, oferta, id_empleador, modalidad, categorias } = req.body;

  const validation = validateOferta({ descripcion, fecha_apertura, oferta, id_empleador });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  // Validar que las categorías no estén archivadas
  const categoriasValidation = await validarCategoriasActivas(categorias);
  if (!categoriasValidation.valid) {
    return res.status(400).json({ success: false, message: categoriasValidation.errors.join('; ') });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const estado = 0;
    const rechazo = '';

    const [result] = await connection.query(
      `INSERT INTO oferta.oferta (descripcion, fecha_apertura, fecha_cierre, estado, rechazo, oferta, id_empleador, modalidad) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [descripcion, fecha_apertura, fecha_cierre, estado, rechazo, oferta, id_empleador, modalidad || 'Presencial']
    );

    const idOferta = result.insertId;

    if (categorias && Array.isArray(categorias) && categorias.length > 0) {
      for (const idCategoria of categorias) {
        if (idCategoria) {
          await connection.query(
            'INSERT INTO categoria_oferta.categoria_oferta (id_categoria, id_oferta) VALUES (?, ?)',
            [idCategoria, idOferta]
          );
        }
      }
    }

    await connection.commit();
    res.status(201).json({ success: true, id_oferta: idOferta, message: 'Oferta creada correctamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear la oferta' });
  } finally {
    connection.release();
  }
};

export const listarOfertas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta');
    res.status(200).json({ success: true, data: rows.map(normalizarOferta) });
  } catch (error) {
    console.error('Error al listar ofertas:', error);
    res.status(500).json({ success: false, message: 'Error al listar ofertas' });
  }
};

export const listarOfertasPendientes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta WHERE estado = 0');
    res.status(200).json({ success: true, data: rows.map(normalizarOferta) });
  } catch (error) {
    console.error('Error al listar ofertas pendientes:', error);
    res.status(500).json({ success: false, message: 'Error al listar ofertas pendientes' });
  }
};

export const buscarOfertaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta WHERE id_oferta = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar la oferta' });
  }
};

export const buscarOfertaPorTitulo = async (req, res) => {
  const { oferta } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta WHERE oferta LIKE ?', [`%${oferta}%`]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'No se encontraron ofertas con ese título' });
    res.status(200).json({ success: true, data: rows.map(normalizarOferta) });
  } catch (error) {
    console.error('Error al buscar por título:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas' });
  }
};

export const buscarOfertasPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta.oferta WHERE id_empleador = ?', [id_empleador]);
    res.status(200).json({ success: true, data: (rows || []).map(normalizarOferta) });
  } catch (error) {
    console.error('Error al buscar por empleador:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas del empleador' });
  }
};

export const editarOferta = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_apertura, rechazo, oferta, modalidad, categorias } = req.body;

  // Validar que las categorías no estén archivadas
  const categoriasValidation = await validarCategoriasActivas(categorias);
  if (!categoriasValidation.valid) {
    return res.status(400).json({ success: false, message: categoriasValidation.errors.join('; ') });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `UPDATE oferta.oferta SET descripcion = ?, fecha_apertura = ?, rechazo = ?, oferta = ?, modalidad = ? WHERE id_oferta = ?`,
      [descripcion, fecha_apertura, rechazo, oferta, modalidad, id]
    );
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Oferta no encontrada para editar' });
    }

    if (categorias !== undefined) {
      await connection.query('DELETE FROM categoria_oferta.categoria_oferta WHERE id_oferta = ?', [id]);

      if (Array.isArray(categorias) && categorias.length > 0) {
        for (const idCategoria of categorias) {
          if (idCategoria) {
            await connection.query(
              'INSERT INTO categoria_oferta.categoria_oferta (id_categoria, id_oferta) VALUES (?, ?)',
              [idCategoria, id]
            );
          }
        }
      }
    }

    await connection.commit();
    res.status(200).json({ success: true, message: 'Oferta actualizada correctamente' });
  } catch (error) {
    await connection.rollback();
    console.error('Error al editar oferta:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la oferta' });
  } finally {
    connection.release();
  }
};

export const cambiarEstadoOferta = async (req, res) => {
  const { id } = req.params;
  const { estado, rechazo } = req.body;

  if (estado === undefined || estado === null) {
    return res.status(400).json({ success: false, message: 'El estado es obligatorio' });
  }

  const estadosValidos = [0, 1, 2, 3];
  if (!estadosValidos.includes(Number(estado))) {
    return res.status(400).json({
      success: false,
      message: 'Estado inválido. Los valores válidos son: 0 (Pendiente), 1 (Aprobada), 2 (Rechazada), 3 (Archivada)'
    });
  }

  try {
    const [result] = await db.query(
      'UPDATE oferta.oferta SET estado = ?, rechazo = ? WHERE id_oferta = ?',
      [Number(estado), rechazo || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    }

    const estadoTexto = { 0: 'Pendiente', 1: 'Aprobada', 2: 'Rechazada', 3: 'Archivada' };
    res.status(200).json({
      success: true,
      message: `Estado de la oferta actualizado a ${estadoTexto[Number(estado)]}`,
      estado_nuevo: Number(estado)
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado de la oferta' });
  }
};

export const cambiarEstadoOfertaAPendiente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('UPDATE oferta.oferta SET estado = 3 WHERE id_oferta = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    }

    res.status(200).json({
      success: true,
      message: 'Estado de la oferta actualizado a Inactivo',
      estado_nuevo: 3
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado de la oferta' });
  }
};

export const obtenerPostulantesPorOferta = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        p.id_postulante,
        p.id_estudiante,
        p.id_oferta,
        p.estado as estado_postulacion,
        e.nombre,
        e.apellido,
        e.gmail,
        e.cv,
        e.telefono,
        c.carrera
      FROM postulante.postulante p
      INNER JOIN estudiante.estudiante e ON p.id_estudiante = e.id_estudiante
      LEFT JOIN carrera.carrera c ON e.id_carrera = c.id_carrera
      WHERE p.id_oferta = ?
      ORDER BY p.id_postulante DESC
    `;

    const [rows] = await db.query(query, [id]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener postulantes por oferta:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulantes' });
  }
};

export const obtenerOfertasPaginacion = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({
      success: true,
      data: rows.map(normalizarOferta),
      paginas: totalPaginas
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginadas:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}

export const obtenerOfertasPaginacionPorEstado = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta WHERE estado = ?', [estado]);
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta WHERE estado = ? LIMIT ? OFFSET ?',
      [estado, limite, offset]
    );
    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginadas:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}

export const obtenerOfertasPaginacionPorFechaAscendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta ORDER BY fecha_apertura ASC, id_oferta ASC LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginadas:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}

export const obtenerOfertasPaginacionPorFechaDescendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta');
    const totalPaginas = Math.ceil(countResult[0].total / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta ORDER BY fecha_apertura DESC, id_oferta DESC LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ success: true, data: rows, paginas: totalPaginas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno al paginar' });
  }
}

export const obtenerOfertasPaginacionPorEstadoYFechaAscendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta WHERE estado = ?', [estado]);
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta WHERE estado = ? ORDER BY fecha_apertura ASC, id_oferta ASC LIMIT ? OFFSET ? ',
      [estado, limite, offset]
    );
    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}

export const obtenerOfertasPaginacionPorEstadoYFechaDescendente = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = parseInt(req.params.size) || 15;
  const offset = (pagina - 1) * limite;
  const estado = req.params.estado;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta.oferta WHERE estado = ?', [estado]);
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta.oferta WHERE estado = ? ORDER BY fecha_apertura DESC, id_oferta DESC LIMIT ? OFFSET ? ',
      [estado, limite, offset]
    );
    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginados:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}

export const buscarOfertasAvanzado = async (req, res) => {
  try {
    const { q, empresa, modalidad, pagina = 1, size = 15, sort = 'desc' } = req.query;
    const limite = parseInt(size);
    const offset = (parseInt(pagina) - 1) * limite;

    let queryBase = `
      FROM oferta.oferta o
      INNER JOIN empleador.empleador e ON o.id_empleador = e.id_empleador
      WHERE o.estado = 1
    `;
    const params = [];

    if (q) {
      queryBase += " AND o.oferta LIKE ?";
      params.push(`%${q}%`);
    }
    if (empresa) {
      queryBase += " AND e.empresa LIKE ?";
      params.push(`%${empresa}%`);
    }
    if (modalidad) {
      queryBase += " AND o.modalidad = ?";
      params.push(modalidad);
    }
    const [countResult] = await db.query(`SELECT COUNT(*) as total ${queryBase}`, params);
    const totalPaginas = Math.ceil(countResult[0].total / limite);

    const orderDir = sort.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    const queryFinal = `SELECT o.*, e.empresa ${queryBase} ORDER BY o.fecha_apertura ${orderDir} LIMIT ? OFFSET ?`;

    const [rows] = await db.query(queryFinal, [...params, limite, offset]);

    res.status(200).json({
      success: true,
      data: rows,
      paginas: totalPaginas
    });
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    res.status(500).json({ success: false, message: 'Error interno en la búsqueda' });
  }
};

export const actualizarOfertasVencidas = async (req, res) => {
  try {
    const [result] = await db.query(
      `UPDATE oferta.oferta 
       SET estado = 4 
       WHERE estado = 1 AND fecha_cierre < CURDATE()`
    );

    res.status(200).json({
      success: true,
      message: 'Revisión de ofertas vencidas completada',
      actualizadas: result.affectedRows
    });
  } catch (error) {
    console.error('Error al actualizar ofertas vencidas:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar vencimientos' });
  }
};

export const buscarOfertasPorEmpleadorConFiltro = async (req, res) => {
  const { id_empleador } = req.params;
  const { q, estado } = req.query;

  if (!id_empleador || isNaN(id_empleador)) {
    return res.status(400).json({ success: false, message: 'ID de empleador inválido' });
  }

  try {
    let query = 'SELECT * FROM oferta.oferta WHERE id_empleador = ?';
    const params = [id_empleador];

    if (q && q.trim() !== '') {
      query += ' AND oferta LIKE ?';
      params.push(`%${q.trim()}%`);
    }

    if (estado !== undefined && estado !== null && estado !== '') {
      query += ' AND estado = ?';
      params.push(parseInt(estado));
    }

    query += ' ORDER BY fecha_apertura DESC';

    const [rows] = await db.query(query, params);
    res.status(200).json({
      success: true, data: rows.map(row => ({
        ...row,
        motivo_rechazo: row.rechazo || row.motivo_rechazo || ''
      }))
    });
  } catch (error) {
    console.error('Error al buscar ofertas del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas' });
  }
};