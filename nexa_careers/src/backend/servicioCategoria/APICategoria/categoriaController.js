import db from '../../api-gateway/db.js';

export const registrarCategoria = async (req, res) => {
  const { categoria } = req.body;
  if (!categoria) return res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido' });

  try {
    const [result] = await db.query('INSERT INTO categoria (categoria) VALUES (?)', [categoria]);
    res.status(201).json({ success: true, id_categoria: result.insertId, message: 'Categoría registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar categoría:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al registrar' });
  }
};

export const listarCategorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categoria');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al listar' });
  }
};

export const buscarCategoriaPorNombre = async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ success: false, message: 'Debes proporcionar un parámetro de búsqueda ?nombre=' });

  try {
    const [rows] = await db.query('SELECT * FROM categoria WHERE categoria LIKE ?', [`%${nombre}%`]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar categoría por nombre:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar' });
  }
};

export const buscarCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar categoría por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar por ID' });
  }
};