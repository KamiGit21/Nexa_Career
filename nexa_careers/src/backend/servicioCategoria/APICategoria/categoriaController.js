import db from './db.js';

export const registrarCategoria = async (req, res) => {
  const { categoria } = req.body;
  const categoriaNormalizada = categoria?.trim();

  if (!categoriaNormalizada) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido' });
  }

  try {
    const [categorias] = await db.query('SELECT categoria FROM categoria.categoria');

    const yaExiste = categorias.some(
      (cat) => cat.categoria.trim().toLowerCase() === categoriaNormalizada.trim().toLowerCase()
    );

    if (yaExiste) {
      return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
    }

    const [result] = await db.query('INSERT INTO categoria.categoria (categoria) VALUES (?)', [categoriaNormalizada]);
    res.status(201).json({ success: true, id_categoria: result.insertId, message: 'Categoría registrada correctamente' });

  } catch (error) {
    console.error('Error al registrar categoría:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al registrar' });
  }
};

export const listarCategorias = async (req, res) => {
  const { incluir } = req.query;
  try {
    let query = `
      SELECT 
        c.id_categoria,
        c.categoria,
        c.estado,
        COALESCE((
          SELECT COUNT(*) 
          FROM categoria_oferta.categoria_oferta co 
          WHERE co.id_categoria = c.id_categoria AND c.estado = 1
        ), 0) AS total_ofertas,
        COALESCE((
          SELECT COUNT(*) 
          FROM categoria_curso.categoria_curso cc 
          WHERE cc.id_categoria = c.id_categoria AND c.estado = 1
        ), 0) AS total_cursos
      FROM categoria.categoria c
      ORDER BY c.categoria ASC
    `;
    
    const [rows] = await db.query(query);
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
    const [rows] = await db.query('SELECT * FROM categoria.categoria WHERE categoria LIKE ?', [`%${nombre}%`]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al buscar categoría por nombre:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar' });
  }
};


export const buscarCategoriaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id_categoria, categoria, estado FROM categoria.categoria WHERE id_categoria = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar categoría por ID:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al buscar por ID' });
  }
};

export const asociarCategoriaAOferta = async (req, res) => {
  const { id } = req.params;
  const { id_oferta } = req.body; 
  if (!id_oferta) return res.status(400).json({ success: false, message: 'El ID de la oferta laboral es requerido' });

  try {
    const [categoriaRows] = await db.query('SELECT * FROM categoria.categoria WHERE id_categoria = ?', [id]);
    if (categoriaRows.length === 0) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

    const [ofertaRows] = await db.query('SELECT * FROM oferta.oferta WHERE id_oferta = ?', [id_oferta]);
    if (ofertaRows.length === 0) return res.status(404).json({ success: false, message: 'Oferta laboral no encontrada' });

    const [existeAsociacion] = await db.query(
      'SELECT * FROM categoria_oferta.categoria_oferta WHERE id_oferta = ? AND id_categoria = ?',
      [id_oferta, id]
    );
    if (existeAsociacion.length > 0) {
      return res.status(409).json({ success: false, message: 'Esta categoría ya está asociada a la oferta laboral' });
    }

    await db.query('INSERT INTO categoria_oferta.categoria_oferta (id_categoria, id_oferta) VALUES (?, ?)', [id, id_oferta]);
    res.status(200).json({ success: true, message: 'Categoría asociada a la oferta laboral correctamente' });

  } catch (error) {
    console.error('Error al asociar categoría a oferta:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor al asociar categoría' });
  }
};

export const editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { categoria } = req.body;
  const categoriaNormalizada = categoria?.trim();

  if (!categoriaNormalizada) {
    return res.status(400).json({ success: false, message: 'El nombre de la categoría es requerido' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM categoria.categoria WHERE id_categoria = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    const [categorias] = await db.query('SELECT id_categoria, categoria FROM categoria.categoria WHERE id_categoria != ?', [id]);
    const yaExiste = categorias.some(
      (cat) => cat.categoria.trim().toLowerCase() === categoriaNormalizada.toLowerCase()
    );
    if (yaExiste) {
      return res.status(409).json({ success: false, message: 'Ya existe una categoría con ese nombre' });
    }

    await db.query('UPDATE categoria.categoria SET categoria = ? WHERE id_categoria = ?', [categoriaNormalizada, id]);
    res.status(200).json({ success: true, message: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error('Error al editar categoría:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al editar' });
  }
};

export const cambiarEstadoCategoria = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (typeof estado !== 'number' || ![0, 1].includes(estado)) {
    return res.status(400).json({ success: false, message: 'El estado debe ser 0 (archivada) o 1 (activa)' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM categoria.categoria WHERE id_categoria = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    await db.query('UPDATE categoria.categoria SET estado = ? WHERE id_categoria = ?', [estado, id]);
    
    const estadoTexto = estado === 1 ? 'activa' : 'archivada';
    res.status(200).json({ 
      success: true, 
      message: `Categoría marcada como ${estadoTexto} correctamente` 
    });
  } catch (error) {
    console.error('Error al cambiar estado de categoría:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al cambiar estado' });

  }
}

export const actualizarCategoriasDeOferta = async (req, res) => {
  const { id_oferta } = req.params;
  const { categorias } = req.body;

  if (!Array.isArray(categorias)) {
    return res.status(400).json({ success: false, message: 'El campo categorias debe ser un arreglo de IDs de categoría' });
  }

  try {
    const [ofertaRows] = await db.query('SELECT * FROM oferta.oferta WHERE id_oferta = ?', [id_oferta]);
    if (ofertaRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Oferta laboral no encontrada' });
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query('DELETE FROM categoria_oferta.categoria_oferta WHERE id_oferta = ?', [id_oferta]);

      const categoriasUnicas = [...new Set(categorias.filter((idCategoria) => idCategoria !== undefined && idCategoria !== null))];
      for (const idCategoria of categoriasUnicas) {
        const [categoriaRows] = await connection.query('SELECT * FROM categoria.categoria WHERE id_categoria = ?', [idCategoria]);
        if (categoriaRows.length === 0) {
          await connection.rollback();
          return res.status(404).json({ success: false, message: `Categoría no encontrada: ${idCategoria}` });
        }
        await connection.query('INSERT INTO categoria_oferta.categoria_oferta (id_categoria, id_oferta) VALUES (?, ?)', [idCategoria, id_oferta]);
      }

      await connection.commit();
      res.status(200).json({ success: true, message: 'Categorías de la oferta laboral actualizadas correctamente' });
    } catch (error) {
      await connection.rollback();
      console.error('Error al actualizar categorías de oferta:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar categorías' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error al actualizar las categorías de la oferta:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor al actualizar categorías' });
  }
};

export const dummy = null;