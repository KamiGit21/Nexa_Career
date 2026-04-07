import db from '../../api-gateway/db.js';

// 1. POST: Crear postulación (estado = 0 por defecto)
export const crearOfertante = async (req, res) => {
  const { id_oferta, id_estudiante } = req.body;

  if (!id_oferta || !id_estudiante) {
    return res.status(400).json({ success: false, message: 'El id_oferta y el id_estudiante son obligatorios' });
  }

  try {
    const estado = 0; // 0 = Postulado/Pendiente por defecto
    const [result] = await db.query(
      `INSERT INTO postulante (id_oferta, id_estudiante, estado) VALUES (?, ?, ?)`,
      [id_oferta, id_estudiante, estado]
    );
    res.status(201).json({ success: true, id_postulante: result.insertId, message: 'Postulación creada correctamente' });
  } catch (error) {
    console.error('Error al crear postulación:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar la postulación' });
  }
};

// 2. GET: Buscar postulación por su ID
export const buscarOfertantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM postulante WHERE id_postulante = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Postulación no encontrada' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar la postulación' });
  }
};

// 3. GET: Buscar todas las postulaciones a una oferta específica
export const buscarPorOferta = async (req, res) => {
  const { id_oferta } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM postulante WHERE id_oferta = ?', [id_oferta]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'No hay postulantes para esta oferta' });
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar por oferta:', error);
    res.status(500).json({ success: false, message: 'Error al buscar postulantes' });
  }
};

// 4. GET: Buscar todas las postulaciones que ha hecho un estudiante
export const buscarPorEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM postulante WHERE id_estudiante = ?', [id_estudiante]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Este estudiante no tiene postulaciones' });
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar por estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al buscar las postulaciones del estudiante' });
  }
};

// 4.1 GET: Obtener postulaciones filtradas por estudiante con detalles de las ofertas
export const obtenerPostulacionesEstudiante = async (req, res) => {
  const { id_estudiante } = req.params;

  if (!id_estudiante || Number.isNaN(Number(id_estudiante)) || Number(id_estudiante) <= 0) {
    return res.status(400).json({ success: false, message: 'El id_estudiante es obligatorio y debe ser un número entero positivo' });
  }

  try {
    const query = `
      SELECT 
        p.id_postulante,
        p.id_estudiante,
        p.id_oferta,
        p.estado as estado_postulacion,
        o.oferta as titulo_oferta,
        o.descripcion,
        o.fecha_apertura,
        o.fecha_cierre,
        o.modalidad,
        o.estado as estado_oferta,
        o.id_empleador,
        emp.empresa,
        emp.empresa as nombre_empleador,
        emp.gmail as email_empleador
      FROM postulante p
      INNER JOIN oferta o ON p.id_oferta = o.id_oferta
      LEFT JOIN empleador emp ON o.id_empleador = emp.id_empleador
      WHERE p.id_estudiante = ?
      ORDER BY p.id_postulante DESC
    `;

    const [rows] = await db.query(query, [id_estudiante]);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Este estudiante no tiene postulaciones'
      });
    }

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener postulaciones del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al obtener las postulaciones del estudiante' });
  }
};

// 5. PUT: Cambiar estado de la postulación
export const cambiarEstadoOfertante = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Ej: 0 (Pendiente), 1 (Aceptado), 2 (Rechazado)

  if (estado === undefined) return res.status(400).json({ success: false, message: 'El estado es obligatorio' });

  try {
    const [result] = await db.query('UPDATE postulante SET estado = ? WHERE id_postulante = ?', [estado, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Postulación no encontrada' });
    res.status(200).json({ success: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
  }
};

// 6. GET: Obtener cv de postulantes de una oferta con su respectiva info------------------------------------------------jij
export const obtenerPostulantesConCV = async (req, res) => {
  const { id_oferta } = req.params;

  if (!id_oferta) {
    return res.status(400).json({ 
      success: false, 
      message: 'El id_oferta es obligatorio' 
    });
  }

  try {
    // Consulta simple sin join primero para probar
    const query = `
      SELECT 
        p.id_postulante,
        p.id_estudiante,
        p.id_oferta,
        p.estado
      FROM postulante p
      WHERE p.id_oferta = ?
    `;

    const [rows] = await db.query(query, [id_oferta]);
    console.log('Postulantes encontrados:', rows);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No hay postulantes para esta oferta'
      });
    }

    // Para cada postulante, obtener datos del estudiante
    const result = [];
    for (const postulante of rows) {
      const [estudianteRows] = await db.query(
        'SELECT id_estudiante, nombre, apellido, gmail, telefono, cv FROM estudiante WHERE id_estudiante = ?',
        [postulante.id_estudiante]
      );
      
      if (estudianteRows.length > 0) {
        const estudiante = estudianteRows[0];
        result.push({
          id_postulante: postulante.id_postulante,
          id_estudiante: postulante.id_estudiante,
          id_oferta: postulante.id_oferta,
          estado_postulacion: postulante.estado,
          nombre: estudiante.nombre,
          apellido: estudiante.apellido,
          nombre_completo: `${estudiante.nombre || ''} ${estudiante.apellido || ''}`.trim(),
          gmail: estudiante.gmail,
          telefono: estudiante.telefono,
          hasCV: !!(estudiante.cv),
          cvUrl: estudiante.cv ? `/api/estudiantes/${postulante.id_estudiante}/cv/ver` : null
        });
      }
    }

    res.status(200).json({ 
      success: true, 
      data: result,
      total: result.length
    });
  } catch (error) {
    console.error('Error al obtener postulantes con CV:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener los postulantes de la oferta',
      error: error.message
    });
  }
};