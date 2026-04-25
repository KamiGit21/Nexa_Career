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

// 8. PUT: Bloquear usuario (cambiar estado a inactivo) - GPA 300
export const bloquearUsuario = async (req, res) => {
  console.log("--- INTENTO DE BLOQUEO ---");
  console.log("Body recibido:", req.body);
  console.log("ID Supervisor:", req.params.id_supervisor);

  const { tipo_usuario, id_usuario, motivo } = req.body;
  const { id_supervisor } = req.params;

  // Validar parámetros
  if (!tipo_usuario || !id_usuario || !id_supervisor || !motivo) {
    return res.status(400).json({
      success: false,
      message: 'tipo_usuario, id_usuario, id_supervisor y motivo son obligatorios'
    });
  }

  const tiposValidos = ['estudiante', 'empleador', 'supervisor'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({
      success: false,
      message: 'tipo_usuario debe ser: estudiante, empleador o supervisor'
    });
  }

  try {
    // Verificar que el supervisor existe y está activo
    const [supervisor] = await db.query('SELECT activo FROM supervisor WHERE id_supervisor = ? AND activo = 1', [id_supervisor]);
    if (supervisor.length === 0) {
      return res.status(403).json({ success: false, message: 'Supervisor no autorizado o inactivo' });
    }

    // DEMO. Para bloqueo de supervisor (extra): verificar confirmaciones
    if (tipo_usuario === 'supervisor') {
      const confirmadores = req.body.confirmadores || [];
      if (!Array.isArray(confirmadores) || confirmadores.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Para bloquear un supervisor, se requieren al menos 2 confirmadores (array de id_supervisor)'
        });
      }

      // Verificar que los confirmadores existen y están activos
      for (const id_conf of confirmadores) {
        const [conf] = await db.query('SELECT activo FROM supervisor WHERE id_supervisor = ? AND activo = 1', [id_conf]);
        if (conf.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Confirmador ${id_conf} no existe o no está activo`
          });
        }
      }
    }

    // Determinar tabla y columna ID según tipo_usuario
    let tabla, columnaId;
    switch (tipo_usuario) {
      case 'estudiante':
        tabla = 'estudiante';
        columnaId = 'id_estudiante';
        break;
      case 'empleador':
        tabla = 'empleador';
        columnaId = 'id_empleador';
        break;
      case 'supervisor':
        tabla = 'supervisor';
        columnaId = 'id_supervisor';
        break;
    }

    // Verificar que el usuario existe
    const [usuario] = await db.query(`SELECT activo FROM ${tabla} WHERE ${columnaId} = ?`, [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: `${tipo_usuario} no encontrado` });
    }

    if (usuario[0].activo === 0) {
      return res.status(400).json({ success: false, message: `${tipo_usuario} ya está inactivo` });
    }

    // Bloquear usuario (activo = 0, para inactivar dicho usuario)
    const [result] = await db.query(`UPDATE ${tabla} SET activo = 0, motivo_bloqueo = ?, fecha_bloqueo = NOW() WHERE ${columnaId} = ?`, [motivo, id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Error al bloquear usuario' });
    }

    res.status(200).json({
      success: true,
      message: `${tipo_usuario} bloqueado exitosamente`,
      tipo_usuario,
      id_usuario,
      fecha_bloqueo: new Date(),
    });

  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno al bloquear usuario' });
  }
};

// 8.1. PUT: Desbloquear usuario (cambiar estado a activo) - GPA 40
export const desbloquearUsuario = async (req, res) => {
  console.log("--- INTENTO DE DESBLOQUEO ---");
  console.log("Body recibido:", req.body);
  console.log("ID Supervisor:", req.params.id_supervisor);

  const { tipo_usuario, id_usuario } = req.body;
  const { id_supervisor } = req.params;

  // Validar parámetros
  if (!tipo_usuario || !id_usuario || !id_supervisor) {
    return res.status(400).json({
      success: false,
      message: 'tipo_usuario, id_usuario e id_supervisor son obligatorios'
    });
  }

  const tiposValidos = ['estudiante', 'empleador', 'supervisor'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({
      success: false,
      message: 'tipo_usuario debe ser: estudiante, empleador o supervisor'
    });
  }

  try {
    // Verificar que el supervisor existe y está activo
    const [supervisor] = await db.query('SELECT activo FROM supervisor WHERE id_supervisor = ? AND activo = 1', [id_supervisor]);
    if (supervisor.length === 0) {
      return res.status(403).json({ success: false, message: 'Supervisor no autorizado o inactivo' });
    }

    // Determinar tabla y columna ID según tipo_usuario
    let tabla, columnaId;
    switch (tipo_usuario) {
      case 'estudiante':
        tabla = 'estudiante';
        columnaId = 'id_estudiante';
        break;
      case 'empleador':
        tabla = 'empleador';
        columnaId = 'id_empleador';
        break;
      case 'supervisor':
        tabla = 'supervisor';
        columnaId = 'id_supervisor';
        break;
    }

    // Verificar que el usuario existe
    const [usuario] = await db.query(`SELECT activo FROM ${tabla} WHERE ${columnaId} = ?`, [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: `${tipo_usuario} no encontrado` });
    }

    if (usuario[0].activo === 1) {
      return res.status(400).json({ success: false, message: `${tipo_usuario} ya está activo` });
    }

    // Desbloquear usuario (activo = 1, limpiar motivo y fecha de bloqueo)
    const [result] = await db.query(`UPDATE ${tabla} SET activo = 1, motivo_bloqueo = NULL, fecha_bloqueo = NULL WHERE ${columnaId} = ?`, [id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Error al desbloquear usuario' });
    }

    res.status(200).json({
      success: true,
      message: `${tipo_usuario} desbloqueado exitosamente`,
      tipo_usuario,
      id_usuario,
      fecha_desbloqueo: new Date(),
    });

  } catch (error) {
    console.error('Error al desbloquear usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno al desbloquear usuario' });
  }
};

// 8.2. GET: Listar todos los usuarios bloqueados (con estado inactivo) - GPA 567
export const listarUsuariosBloqueados = async (req, res) => {
  try {
    // Obtener estudiantes bloqueados
    const [estudiantesBloqueados] = await db.query(`
      SELECT
        id_estudiante as id_usuario,
        CONCAT(nombre, ' ', apellido) as nombre_completo,
        gmail,
        telefono,
        motivo_bloqueo,
        fecha_bloqueo,
        'estudiante' as tipo_usuario,
        creado_en
      FROM estudiante
      WHERE activo = 0
      ORDER BY fecha_bloqueo DESC
    `);

    // Obtener empleadores bloqueados
    const [empleadoresBloqueados] = await db.query(`
      SELECT
        id_empleador as id_usuario,
        empresa as nombre_completo,
        gmail,
        telefono,
        motivo_bloqueo,
        fecha_bloqueo,
        'empleador' as tipo_usuario,
        creado_en
      FROM empleador
      WHERE activo = 0
      ORDER BY fecha_bloqueo DESC
    `);

// Obtener supervisores bloqueados
    const [supervisoresBloqueados] = await db.query(`
      SELECT 
        id_supervisor as id_usuario,
        CONCAT(nombre, ' ', apellido) as nombre_completo,
        gmail,
        telefono,
        motivo_bloqueo,
        fecha_bloqueo,
        'supervisor' as tipo_usuario,
        creado_en
      FROM supervisor 
      WHERE activo = 0
      ORDER BY fecha_bloqueo DESC
    `);

    // Combinar todos los usuarios bloqueados
    const usuariosBloqueados = [
      ...estudiantesBloqueados,
      ...empleadoresBloqueados,
      ...supervisoresBloqueados
    ].sort((a, b) => new Date(b.fecha_bloqueo || b.creado_en) - new Date(a.fecha_bloqueo || a.creado_en));

    res.status(200).json({
      success: true,
      data: usuariosBloqueados,
      total: usuariosBloqueados.length
    });

  } catch (error) {
    console.error('Error al listar usuarios bloqueados:', error);
    res.status(500).json({ success: false, message: 'Error interno al listar usuarios bloqueados' });
  }
};

// 9. GET: Estadísticas de supervisores (empleadores, postulaciones, ofertas) 
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

// A. Listar estudiantes con estadísticas
// Prueba temporal en supervisorController.js
export const listarEstudiantesAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiante');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('ERROR REAL EN CONSOLA:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// B. Listar empleadores con estadísticas
export const listarEmpleadoresAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        emp.id_empleador,
        emp.empresa,
        emp.descripcion,
        emp.gmail,
        emp.telefono,
        emp.activo,
        emp.creado_en,
        emp.motivo_bloqueo, -- Ahora sí existe por el ALTER TABLE
        emp.fecha_bloqueo,  -- Ahora sí existe por el ALTER TABLE
        COUNT(DISTINCT o.id_oferta)  AS total_ofertas,
        COUNT(DISTINCT cu.id_curso)  AS total_cursos
      FROM empleador emp
      LEFT JOIN oferta o  ON emp.id_empleador = o.id_empleador
      LEFT JOIN curso  cu ON emp.id_empleador = cu.id_empleador
      GROUP BY 
        emp.id_empleador, 
        emp.empresa, 
        emp.descripcion, 
        emp.gmail, 
        emp.telefono, 
        emp.activo, 
        emp.creado_en,
        emp.motivo_bloqueo,
        emp.fecha_bloqueo
      ORDER BY emp.creado_en DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarEmpleadoresAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// C. Listar supervisores
export const listarSupervisoresAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id_supervisor, nombre, apellido, gmail, telefono, activo, creado_en FROM supervisor ORDER BY creado_en DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarSupervisoresAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// D. Logs de actividad de un estudiante (derivados de postulante + curso)
export const obtenerLogsEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const [postulaciones] = await db.query(`
      SELECT
        'Postulación enviada'  AS accion,
        o.oferta               AS detalle,
        'Ofertas'              AS modulo,
        CASE p.estado
          WHEN 0 THEN 'Pendiente'
          WHEN 1 THEN 'Aceptado'
          WHEN 2 THEN 'Rechazado'
        END                    AS estado,
        NULL                   AS fecha
      FROM postulante p
      JOIN oferta o ON p.id_oferta = o.id_oferta
      WHERE p.id_estudiante = ?
    `, [id]);
 
    const [cursos] = await db.query(`
      SELECT
        'Curso publicado' AS accion,
        curso             AS detalle,
        'Cursos'          AS modulo,
        CASE estado
          WHEN 0 THEN 'Pendiente'
          WHEN 1 THEN 'Aceptado'
          WHEN 2 THEN 'Rechazado'
          WHEN 3 THEN 'Archivado'
        END               AS estado,
        fecha_creacion    AS fecha
      FROM curso
      WHERE id_estudiante = ?
    `, [id]);
 
    const logs = [...postulaciones, ...cursos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
 
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error en obtenerLogsEstudiante:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
// E. Logs de actividad de un empleador (derivados de oferta + curso)
export const obtenerLogsEmpleador = async (req, res) => {
  const { id } = req.params;
  try {
    const [ofertas] = await db.query(`
      SELECT
        'Oferta publicada' AS accion,
        oferta             AS detalle,
        'Ofertas'          AS modulo,
        CASE estado
          WHEN 0 THEN 'Pendiente'
          WHEN 1 THEN 'Aceptado'
          WHEN 2 THEN 'Rechazado'
          WHEN 3 THEN 'Archivado'
        END                AS estado,
        fecha_apertura     AS fecha
      FROM oferta
      WHERE id_empleador = ?
    `, [id]);
 
    const [cursos] = await db.query(`
      SELECT
        'Curso publicado' AS accion,
        curso             AS detalle,
        'Cursos'          AS modulo,
        CASE estado
          WHEN 0 THEN 'Pendiente'
          WHEN 1 THEN 'Aceptado'
          WHEN 2 THEN 'Rechazado'
          WHEN 3 THEN 'Archivado'
        END               AS estado,
        fecha_creacion    AS fecha
      FROM curso
      WHERE id_empleador = ?
    `, [id]);
 
    const logs = [...ofertas, ...cursos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
 
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error en obtenerLogsEmpleador:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};