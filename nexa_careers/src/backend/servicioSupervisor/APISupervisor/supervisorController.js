import db from '../../api-gateway/db.js';

// 1. POST: Registrar supervisor (activo = 1 por defecto)
export const registrarSupervisor = async (req, res) => {
  const { nombre, telefono, gmail, contrasena } = req.body;
  
  if (!nombre || !gmail || !contrasena) {
    return res.status(400).json({ success: false, message: 'El nombre, gmail y contraseña son obligatorios' });
  }

  try {
    // 🛑 NUEVO: Validar si el correo ya existe
    const [existingEmail] = await db.query('SELECT gmail FROM supervisor WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
    
    const activo = 1; // 1 equivale a true/activo en tinyint(1)
    const [result] = await db.query(
      `INSERT INTO supervisor (nombre, telefono, gmail, contrasena, activo) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, telefono, gmail, contrasena, activo]
    );
    res.status(201).json({ success: true, id_supervisor: result.insertId, message: 'Supervisor registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar supervisor:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

// 2. GET: Listar todos
export const listarSupervisores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM supervisor');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar supervisores:', error);
    res.status(500).json({ success: false, message: 'Error al listar supervisores' });
  }
};

// 3. GET: Buscar por ID
export const buscarSupervisorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM supervisor WHERE id_supervisor = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar supervisor' });
  }
};

// 4. GET: Buscar por correo (gmail)
export const buscarSupervisorPorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM supervisor WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar supervisor' });
  }
};

// 5. PUT: Actualizar perfil (nombre, telefono, gmail)
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, gmail } = req.body;
  
  try {
    const [result] = await db.query(
      `UPDATE supervisor SET nombre = ?, telefono = ?, gmail = ? WHERE id_supervisor = ?`,
      [nombre, telefono, gmail, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado para actualizar' });
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
    const [result] = await db.query('UPDATE supervisor SET contrasena = ? WHERE id_supervisor = ?', [contrasena, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar contraseña' });
  }
};

// 7. PUT: Cambiar estado (activo: 0 o 1)
export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // Aquí se espera que envíes un 0 o un 1 desde el frontend

  try {
    const [result] = await db.query('UPDATE supervisor SET activo = ? WHERE id_supervisor = ?', [activo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    res.status(200).json({ success: true, message: `Estado del supervisor actualizado a ${activo ? 'Activo (1)' : 'Inactivo (0)'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};


// 8. GET: Estadisticas de supervisores (empleadores, postulantes, ofertas)
export const obtenerEstadisticasDashboard = async (req, res) => {
  try {
    //Contar Empleadores
    const [[{ totalEmpleadores }]] = await db.query('SELECT COUNT(*) as totalEmpleadores FROM empleador');
    
    //Contar Postulaciones totales
    const [[{ totalPostulaciones }]] = await db.query('SELECT COUNT(*) as totalPostulaciones FROM postulante');

    //Actividad reciente (ultimas ofertas y registros)
    const [actividad] = await db.query(`
      (SELECT empresa as usuario, 'Publicó una oferta' as accion, 'Ofertas' as modulo, creado_en as fecha, 'Aprobado' as estado FROM empleador ORDER BY creado_en DESC LIMIT 5)
      UNION
      (SELECT nombre as usuario, 'Nuevo registro' as accion, 'Estudiantes' as modulo, creado_en as fecha, 'Activo' as estado FROM estudiante ORDER BY creado_en DESC LIMIT 5)
      ORDER BY fecha DESC LIMIT 5
    `);

    res.status(200).json({
      success: true,
      metricas: {
        empleadores: totalEmpleadores,
        postulaciones: totalPostulaciones,
        pendientes: pendientes
      },
      recientes: actividad
    });
  } catch (error) {
    console.error('Error en estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
  }
};