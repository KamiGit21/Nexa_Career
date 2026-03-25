import db from '../api-gateway/db.js';

export const registrarCarrera = async (req, res) => {
  const { carrera } = req.body; 
  if (!carrera) return res.status(400).json({ success: false, message: 'El nombre de la carrera es requerido' });

  try {
    const [result] = await db.query('INSERT INTO carrera (carrera) VALUES (?)', [carrera]);
    res.status(201).json({ success: true, id_carrera: result.insertId, message: 'Carrera registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar carrera:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al registrar' });
  }
};

export const listarCarreras = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM carrera');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar carreras:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al listar' });
  }
};

export const buscarCarreraPorNombre = async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ success: false, message: 'Debes proporcionar un parámetro de búsqueda ?nombre=' });

  try {
    const [rows] = await db.query('SELECT * FROM carrera WHERE carrera LIKE ?', [`%${nombre}%`]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar carrera por nombre:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar' });
  }
};

export const buscarCarreraPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM carrera WHERE id_carrera = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Carrera no encontrada' });
    
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar carrera por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar por ID' });
  }
};