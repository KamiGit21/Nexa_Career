// src/backend/servicioOferta/APIOferta/ofertaController.js
import db from '../../api-gateway/db.js';

// Función para obtener una oferta laboral específica por ID
export const obtenerOfertaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta WHERE id_oferta = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    }
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al obtener oferta por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al obtener oferta' });
  }
};

// Validar campos de oferta
const isValidDate = (value) => {
  if (!value) return true; // opcional
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

// 1. POST: Crear oferta (estado = 0 y rechazo = '' por defecto)
export const crearOferta = async (req, res) => {
  const { descripcion, fecha_apertura, oferta, id_empleador, modalidad } = req.body;

  const validation = validateOferta({ descripcion, fecha_apertura, oferta, id_empleador });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  try {
    const estado = 0; // 0 por defecto al crearse, pero por ahora es 1
    const rechazo = ''; // Blanco por defecto

    const [result] = await db.query(
      `INSERT INTO oferta (descripcion, fecha_apertura, estado, rechazo, oferta, id_empleador, modalidad) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [descripcion, fecha_apertura, estado, rechazo, oferta, id_empleador, modalidad || 'Presencial']
    );
    res.status(201).json({ success: true, id_oferta: result.insertId, message: 'Oferta creada correctamente' });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear la oferta' });
  }
};

// 2. GET: Listar todas las ofertas
export const listarOfertas = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM oferta');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar ofertas:', error);
    res.status(500).json({ success: false, message: 'Error al listar ofertas' });
  }
};

// 2.1. GET: Listar ofertas en estado pendiente (estado = 0)
export const listarOfertasPendientes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM oferta WHERE estado = 0');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar ofertas pendientes:', error);
    res.status(500).json({ success: false, message: 'Error al listar ofertas pendientes' });
  }
};

// 3. GET: Buscar oferta por ID
export const buscarOfertaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta WHERE id_oferta = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar la oferta' });
  }
};

// 4. GET: Buscar por título de oferta
export const buscarOfertaPorTitulo = async (req, res) => {
  const { oferta } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta WHERE oferta LIKE ?', [`%${oferta}%`]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'No se encontraron ofertas con ese título' });
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar por título:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas' });
  }
};

// 5. GET: Buscar ofertas por id de empleador
export const buscarOfertasPorEmpleador = async (req, res) => {
  const { id_empleador } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM oferta WHERE id_empleador = ?', [id_empleador]);
    res.status(200).json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error al buscar por empleador:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas del empleador' });
  }
};

// 6. PUT: Editar detalles de la oferta (TODO menos el estado)
export const editarOferta = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_apertura, rechazo, oferta, modalidad } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE oferta SET descripcion = ?, fecha_apertura = ?, rechazo = ?, oferta = ?, modalidad = ? WHERE id_oferta = ?`,
      [descripcion, fecha_apertura, rechazo, oferta, modalidad, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Oferta no encontrada para editar' });
    res.status(200).json({ success: true, message: 'Oferta actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar oferta:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la oferta' });
  }
};

// 7. PATCH: Cambiar estado de la oferta (usado por el supervisor)
export const cambiarEstadoOferta = async (req, res) => {
  const { id } = req.params;
  const { estado, rechazo } = req.body; // rechazo es opcional

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
      'UPDATE oferta SET estado = ?, rechazo = ? WHERE id_oferta = ?',
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

// 7.1 PUT: Cambiar el estado de una oferta a Archivado (estado = 3)
export const cambiarEstadoOfertaAPendiente = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('UPDATE oferta SET estado = 3 WHERE id_oferta = ?', [id]);
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

// 8. GET: Obtener postulantes de una oferta con tabla postulante 
//ESTO NO DEBERIA ESTAR AQUI Atm:Santi
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
      FROM postulante p
      INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
      LEFT JOIN carrera c ON e.id_carrera = c.id_carrera
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

//9. Obtener ofertas por paginacion 
export const obtenerOfertasPaginacion = async (req, res) => {
  const pagina = parseInt(req.params.pagina) || 1;
  const limite = 15; 
  const offset = (pagina - 1) * limite;

  try {
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM oferta');
    const totalOfertas = countResult[0].total;
    const totalPaginas = Math.ceil(totalOfertas / limite);

    const [rows] = await db.query(
      'SELECT * FROM oferta LIMIT ? OFFSET ?',
      [limite, offset]
    );
    res.status(200).json({ 
      success: true, 
      data: rows,
    });

  } catch (error) {
    console.error('Error al obtener ofertas paginadas:', error);
    res.status(500).json({ success: false, message: 'Error interno al paginar las ofertas' });
  }
}