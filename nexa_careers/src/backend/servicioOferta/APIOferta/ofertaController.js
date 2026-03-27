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


// 1. POST: Crear oferta (estado = 0 y rechazo = '' por defecto)
export const crearOferta = async (req, res) => {
  const { descripcion, fecha_apertura, oferta, id_empleador } = req.body;
  
  if (!oferta || !id_empleador) {
    return res.status(400).json({ success: false, message: 'El título de la oferta y el id_empleador son obligatorios' });
  }

  try {
    const estado = 0; // 0 por defecto al crearse
    const rechazo = ''; // Blanco por defecto
    
    // IMPORTANTE: En el SQL usamos 'id_emepleador' para coincidir con tu BD
    const [result] = await db.query(
      `INSERT INTO oferta (descripcion, fecha_apertura, estado, rechazo, oferta, id_emepleador) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [descripcion, fecha_apertura, estado, rechazo, oferta, id_empleador]
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
    // IMPORTANTE: En el SQL usamos 'id_emepleador'
    const [rows] = await db.query('SELECT * FROM oferta WHERE id_emepleador = ?', [id_empleador]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Este empleador no tiene ofertas' });
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar por empleador:', error);
    res.status(500).json({ success: false, message: 'Error al buscar ofertas del empleador' });
  }
};

// 6. PUT: Editar detalles de la oferta (TODO menos el estado)
export const editarOferta = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_apertura, rechazo, oferta } = req.body;
  
  try {
    const [result] = await db.query(
      `UPDATE oferta SET descripcion = ?, fecha_apertura = ?, rechazo = ?, oferta = ? WHERE id_oferta = ?`,
      [descripcion, fecha_apertura, rechazo, oferta, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Oferta no encontrada para editar' });
    res.status(200).json({ success: true, message: 'Oferta actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar oferta:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la oferta' });
  }
};

// 7. PUT: Cambiar solo el estado
export const cambiarEstadoOferta = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Ej: 0 (Pendiente), 1 (Aprobada), 2 (Rechazada)

  if (estado === undefined) return res.status(400).json({ success: false, message: 'El estado es obligatorio' });

  try {
    const [result] = await db.query('UPDATE oferta SET estado = ? WHERE id_oferta = ?', [estado, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
    res.status(200).json({ success: true, message: `Estado de la oferta actualizado a ${estado}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

