// src/backend/servicioOfertante/APIOfertante/ofertanteController.js
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
      `INSERT INTO ofertante (id_oferta, id_estudiante, estado) VALUES (?, ?, ?)`,
      [id_oferta, id_estudiante, estado]
    );
    res.status(201).json({ success: true, id_ofertante: result.insertId, message: 'Postulación creada correctamente' });
  } catch (error) {
    console.error('Error al crear postulación:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar la postulación' });
  }
};

// 2. GET: Buscar postulación por su ID
export const buscarOfertantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM ofertante WHERE id_ofertante = ?', [id]);
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
    const [rows] = await db.query('SELECT * FROM ofertante WHERE id_oferta = ?', [id_oferta]);
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
    const [rows] = await db.query('SELECT * FROM ofertante WHERE id_estudiante = ?', [id_estudiante]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Este estudiante no tiene postulaciones' });
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar por estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al buscar las postulaciones del estudiante' });
  }
};

// 5. PUT: Cambiar estado de la postulación
export const cambiarEstadoOfertante = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // Ej: 0 (Pendiente), 1 (Aceptado), 2 (Rechazado)

  if (estado === undefined) return res.status(400).json({ success: false, message: 'El estado es obligatorio' });

  try {
    const [result] = await db.query('UPDATE ofertante SET estado = ? WHERE id_ofertante = ?', [estado, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Postulación no encontrada' });
    res.status(200).json({ success: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
  }
};