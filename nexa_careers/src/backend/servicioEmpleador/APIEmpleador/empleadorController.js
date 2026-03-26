import db from '../../api-gateway/db.js';

// 1. POST: Registrar empleador (activo = true por defecto)
export const registrarEmpleador = async (req, res) => {
  const { empresa, telefono, gmail, contrasena } = req.body;
  
  if (!empresa || !gmail || !contrasena) {
    return res.status(400).json({ success: false, message: 'La empresa, gmail y contraseña son obligatorios' });
  }

  try {
    const activo = 1; 
    const [result] = await db.query(
      `INSERT INTO empleador (empresa, telefono, gmail, contrasena, activo) 
       VALUES (?, ?, ?, ?, ?)`,
      [empresa, telefono, gmail, contrasena, activo]
    );
    res.status(201).json({ success: true, id_empleador: result.insertId, message: 'Empleador registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar empleador:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

// 2. GET: Listar todos los empleadores
export const listarEmpleadores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM empleador');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar empleadores:', error);
    res.status(500).json({ success: false, message: 'Error al listar empleadores' });
  }
};

// 3. GET: Buscar empleador por ID
export const buscarEmpleadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM empleador WHERE id_empleador = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar empleador' });
  }
};

// 4. GET: Buscar empleador por correo
export const buscarEmpleadorPorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM empleador WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar empleador' });
  }
};

// 5. PUT: Actualizar perfil (solo empresa, telefono y gmail en este caso)
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { empresa, telefono, gmail } = req.body;
  
  try {
    const [result] = await db.query(
      `UPDATE empleador SET empresa = ?, telefono = ?, gmail = ? WHERE id_empleador = ?`,
      [empresa, telefono, gmail, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado para actualizar' });
    res.status(200).json({ success: true, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

// 6. PUT: Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  const { id } = req.params;
  const { contrasena } = req.body;
  
  if (!contrasena) return res.status(400).json({ success: false, message: 'La nueva contraseña es obligatoria' });

  try {
    const [result] = await db.query('UPDATE empleador SET contrasena = ? WHERE id_empleador = ?', [contrasena, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar contraseña' });
  }
};

// 7. PUT: Cambiar estado (activo)
export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; 

  try {
    const [result] = await db.query('UPDATE empleador SET activo = ? WHERE id_empleador = ?', [activo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    res.status(200).json({ success: true, message: `Estado del empleador actualizado a ${activo ? 'Activo' : 'Inactivo'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

// 8. GET: Obtener ofertas laborales de un empleador (con conteo de postulaciones)
export const obtenerOfertasPorEmpleador = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        o.*,
        COUNT(p.id_postulacion) as total_postulaciones
      FROM oferta o
      LEFT JOIN postulacion p ON o.id_oferta = p.id_oferta
      WHERE o.id_empleador = ?
      GROUP BY o.id_oferta
      ORDER BY o.fecha_publicacion DESC
    `, [id]);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener ofertas del empleador:', error);
    res.status(500).json({ success: false, message: 'Error al obtener ofertas' });
  }
};