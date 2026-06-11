import db from './db.js';
import { enviarCodigo, enviarNotificacionNuevaOferta } from './correoService.js';

export const registrarSupervisor = async (req, res) => {
  const { nombre, telefono, gmail, contrasena } = req.body;

  if (!nombre || !gmail || !contrasena) {
    return res.status(400).json({ success: false, message: 'El nombre, gmail y contraseña son obligatorios' });
  }

  try {
    const [existingEmail] = await db.query('SELECT gmail FROM supervisor.supervisor WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }

    const activo = 1; 
    const [result] = await db.query(
      `INSERT INTO supervisor.supervisor (nombre, telefono, gmail, contrasena, activo) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, telefono, gmail, contrasena, activo]
    );
    res.status(201).json({ success: true, id_supervisor: result.insertId, message: 'Supervisor registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar supervisor:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

export const listarSupervisores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM supervisor.supervisor');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar supervisores:', error);
    res.status(500).json({ success: false, message: 'Error al listar supervisores' });
  }
};

export const buscarSupervisorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM supervisor.supervisor WHERE id_supervisor = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar supervisor' });
  }
};

export const buscarSupervisorPorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM supervisor.supervisor WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar supervisor' });
  }
};

export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, gmail } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE supervisor.supervisor SET nombre = ?, telefono = ?, gmail = ? WHERE id_supervisor = ?`,
      [nombre, telefono, gmail, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado para actualizar' });
    res.status(200).json({ success: true, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

export const cambiarContrasena = async (req, res) => {
  const { id } = req.params;
  const { contrasena } = req.body;

  if (!contrasena) return res.status(400).json({ success: false, message: 'La nueva contraseña es obligatoria' });
   if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 60) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 60 caracteres' });
  }

  try {
    const [rows] = await db.query('SELECT contrasena FROM supervisor.supervisor WHERE id_supervisor = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    }
    const contrasenaActual = rows[0].contrasena;

    if (contrasena === contrasenaActual) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const [result] = await db.query('UPDATE supervisor.supervisor SET contrasena = ? WHERE id_supervisor = ?', [contrasena, id]);
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar contraseña' });
  }
};

export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activo, motivo } = req.body; 

  if (![0, 1, '0', '1', true, false].includes(activo)) {
    return res.status(400).json({ success: false, message: 'El valor activo debe ser 0 o 1' });
  }

   const valorActivo = activo === 1 || activo === '1' || activo === true ? 1 : 0;

  try {
    let query = 'UPDATE supervisor.supervisor SET activo = ?';
    let values = [valorActivo];
    
    if (valorActivo === 0) {
      query += ', motivo_bloqueo = ?, fecha_bloqueo = NOW()';
      values.push(motivo || null);
    } else {
      query += ', motivo_bloqueo = NULL, fecha_bloqueo = NULL';
    }

    query += ' WHERE id_supervisor = ?';
    values.push(id);
    
     const [result] = await db.query(query, values);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    res.status(200).json({ success: true, message: `Estado del supervisor actualizado a ${valorActivo ? 'Activo' : 'Inactivo'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

export const bloquearUsuario = async (req, res) => {
  const { tipo_usuario, id_usuario, motivo } = req.body;
  const { id_supervisor } = req.params;

  if (!tipo_usuario || !id_usuario || !id_supervisor || !motivo) {
    return res.status(400).json({ success: false, message: 'tipo_usuario, id_usuario, id_supervisor y motivo son obligatorios' });
  }

  const tiposValidos = ['estudiante', 'empleador', 'supervisor'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({ success: false, message: 'tipo_usuario debe ser: estudiante, empleador o supervisor' });
  }

  try {
    const [supervisor] = await db.query('SELECT activo FROM supervisor.supervisor WHERE id_supervisor = ? AND activo = 1', [id_supervisor]);
    if (supervisor.length === 0) {
      return res.status(403).json({ success: false, message: 'Supervisor no autorizado o inactivo' });
    }

    if (tipo_usuario === 'supervisor') {
      const confirmadores = req.body.confirmadores || [];
      if (!Array.isArray(confirmadores) || confirmadores.length < 2) {
        return res.status(400).json({ success: false, message: 'Para bloquear un supervisor, se requieren al menos 2 confirmadores' });
      }

      for (const id_conf of confirmadores) {
        const [conf] = await db.query('SELECT activo FROM supervisor.supervisor WHERE id_supervisor = ? AND activo = 1', [id_conf]);
        if (conf.length === 0) {
          return res.status(400).json({ success: false, message: `Confirmador ${id_conf} no existe o no está activo` });
        }
      }
    }

    let tabla, columnaId;
    switch (tipo_usuario) {
      case 'estudiante':
        tabla = 'estudiante.estudiante';
        columnaId = 'id_estudiante';
        break;
      case 'empleador':
        tabla = 'empleador.empleador';
        columnaId = 'id_empleador';
        break;
      case 'supervisor':
        tabla = 'supervisor.supervisor';
        columnaId = 'id_supervisor';
        break;
    }

    const [usuario] = await db.query(`SELECT activo FROM ${tabla} WHERE ${columnaId} = ?`, [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: `${tipo_usuario} no encontrado` });
    }

    if (usuario[0].activo === 0) {
      return res.status(400).json({ success: false, message: `${tipo_usuario} ya está inactivo` });
    }

    const [result] = await db.query(`UPDATE ${tabla} SET activo = 0, motivo_bloqueo = ?, fecha_bloqueo = NOW() WHERE ${columnaId} = ?`, [motivo, id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Error al bloquear usuario' });
    }

    res.status(200).json({ success: true, message: `${tipo_usuario} bloqueado exitosamente`, tipo_usuario, id_usuario, fecha_bloqueo: new Date() });

  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno al bloquear usuario' });
  }
};

export const desbloquearUsuario = async (req, res) => {
  const { tipo_usuario, id_usuario } = req.body;
  const { id_supervisor } = req.params;

  if (!tipo_usuario || !id_usuario || !id_supervisor) {
    return res.status(400).json({ success: false, message: 'tipo_usuario, id_usuario e id_supervisor son obligatorios' });
  }

  const tiposValidos = ['estudiante', 'empleador', 'supervisor'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({ success: false, message: 'tipo_usuario debe ser: estudiante, empleador o supervisor' });
  }

  try {
    const [supervisor] = await db.query('SELECT activo FROM supervisor.supervisor WHERE id_supervisor = ? AND activo = 1', [id_supervisor]);
    if (supervisor.length === 0) {
      return res.status(403).json({ success: false, message: 'Supervisor no autorizado o inactivo' });
    }

    let tabla, columnaId;
    switch (tipo_usuario) {
      case 'estudiante':
        tabla = 'estudiante.estudiante';
        columnaId = 'id_estudiante';
        break;
      case 'empleador':
        tabla = 'empleador.empleador';
        columnaId = 'id_empleador';
        break;
      case 'supervisor':
        tabla = 'supervisor.supervisor';
        columnaId = 'id_supervisor';
        break;
    }

    const [usuario] = await db.query(`SELECT activo FROM ${tabla} WHERE ${columnaId} = ?`, [id_usuario]);
    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: `${tipo_usuario} no encontrado` });
    }

    if (usuario[0].activo === 1) {
      return res.status(400).json({ success: false, message: `${tipo_usuario} ya está activo` });
    }

    const [result] = await db.query(`UPDATE ${tabla} SET activo = 1, motivo_bloqueo = NULL, fecha_bloqueo = NULL WHERE ${columnaId} = ?`, [id_usuario]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ success: false, message: 'Error al desbloquear usuario' });
    }

    res.status(200).json({ success: true, message: `${tipo_usuario} desbloqueado exitosamente`, tipo_usuario, id_usuario, fecha_desbloqueo: new Date() });

  } catch (error) {
    console.error('Error al desbloquear usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno al desbloquear usuario' });
  }
};

export const listarUsuariosBloqueados = async (req, res) => {
  try {
    const [estudiantesBloqueados] = await db.query(`
      SELECT id_estudiante as id_usuario, CONCAT(nombre, ' ', apellido) as nombre_completo, gmail, telefono, motivo_bloqueo, fecha_bloqueo, 'estudiante' as tipo_usuario, creado_en
      FROM estudiante.estudiante WHERE activo = 0 ORDER BY fecha_bloqueo DESC
    `);

    const [empleadoresBloqueados] = await db.query(`
      SELECT id_empleador as id_usuario, empresa as nombre_completo, gmail, telefono, motivo_bloqueo, fecha_bloqueo, 'empleador' as tipo_usuario, creado_en
      FROM empleador.empleador WHERE activo = 0 ORDER BY fecha_bloqueo DESC
    `);

    const [supervisoresBloqueados] = await db.query(`
      SELECT id_supervisor as id_usuario, CONCAT(nombre, ' ', apellido) as nombre_completo, gmail, telefono, motivo_bloqueo, fecha_bloqueo, 'supervisor' as tipo_usuario, creado_en
      FROM supervisor.supervisor WHERE activo = 0 ORDER BY fecha_bloqueo DESC
    `);

    const usuariosBloqueados = [ ...estudiantesBloqueados, ...empleadoresBloqueados, ...supervisoresBloqueados ]
      .sort((a, b) => new Date(b.fecha_bloqueo || b.creado_en) - new Date(a.fecha_bloqueo || a.creado_en));

    res.status(200).json({ success: true, data: usuariosBloqueados, total: usuariosBloqueados.length });
  } catch (error) {
    console.error('Error al listar usuarios bloqueados:', error);
    res.status(500).json({ success: false, message: 'Error interno al listar usuarios bloqueados' });
  }
};

export const listarEstudiantesAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('ERROR REAL EN CONSOLA:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listarEmpleadoresAdmin = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        emp.id_empleador, emp.empresa, emp.descripcion, emp.gmail, emp.telefono, emp.activo, emp.creado_en, emp.motivo_bloqueo, emp.fecha_bloqueo,
        COUNT(DISTINCT o.id_oferta)  AS total_ofertas,
        COUNT(DISTINCT cu.id_curso)  AS total_cursos
      FROM empleador.empleador emp
      LEFT JOIN oferta.oferta o  ON emp.id_empleador = o.id_empleador
      LEFT JOIN curso.curso  cu ON emp.id_empleador = cu.id_empleador
      GROUP BY emp.id_empleador, emp.empresa, emp.descripcion, emp.gmail, emp.telefono, emp.activo, emp.creado_en, emp.motivo_bloqueo, emp.fecha_bloqueo
      ORDER BY emp.creado_en DESC
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarEmpleadoresAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listarSupervisoresAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id_supervisor, nombre, apellido, gmail, telefono, activo, motivo_bloqueo, fecha_bloqueo, creado_en FROM supervisor.supervisor ORDER BY creado_en DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error en listarSupervisoresAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      FROM postulante.postulante p
      JOIN oferta.oferta o ON p.id_oferta = o.id_oferta
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
      FROM curso.curso
      WHERE id_estudiante = ?
    `, [id]);
 
    const logs = [...postulaciones, ...cursos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error en obtenerLogsEstudiante:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      FROM oferta.oferta
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
      FROM curso.curso
      WHERE id_empleador = ?
    `, [id]);
 
    const logs = [...ofertas, ...cursos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error en obtenerLogsEmpleador:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const enviarCodigoSupervisor = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ success: false, message: 'El correo y el código son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM supervisor.supervisor WHERE gmail = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Supervisor no encontrado' });
    }

    const resultado = await enviarCodigo(correo, codigo);

    if (resultado.success) {
      res.status(200).json({ success: true, message: `Código enviado a ${correo}` });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
  } catch (error) {
    console.error('Error en enviarCodigoSupervisor:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const notificarNuevaOfertaA_Supervisores = async (req, res) => {
  const { idOferta } = req.params;
  console.log(`\n --- PROCESANDO NOTIFICACIÓN DE NUEVA OFERTA PARA SUPERVISORES ---`);
  console.log(`Oferta ID: ${idOferta}`);

  try {
    const [ofertaRows] = await db.query(`
      SELECT o.oferta, emp.empresa AS empleador 
      FROM oferta.oferta o
      JOIN empleador.empleador emp ON o.id_empleador = emp.id_empleador
      WHERE o.id_oferta = ?
    `, [idOferta]);

    if (ofertaRows.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontró la oferta especificada.' });
    }

    const { oferta, empleador } = ofertaRows[0];

    
    const [supervisores] = await db.query(`
      SELECT gmail FROM supervisor.supervisor WHERE activo = 1
    `);

    if (supervisores.length === 0) {
      console.log('⚠️ No se encontraron supervisores activos registrados en el sistema.');
      return res.status(200).json({ success: true, message: 'No hay supervisores activos a quienes notificar.' });
    }

    console.log(`📢 Enviando notificaciones a ${supervisores.length} supervisores activos...`);

   
    const enviosPromesas = supervisores.map(sup => {
      if (sup.gmail) {
        return enviarNotificacionNuevaOferta(sup.gmail, empleador, oferta);
      }
      return Promise.resolve({ success: false });
    });

    await Promise.all(enviosPromesas);

    console.log('✅ Correos masivos enviados correctamente al equipo de supervisión.');
    return res.status(200).json({ success: true, message: 'Todos los supervisores fueron notificados con éxito.' });

  } catch (error) {
    console.error('❌ Error interno en notificarNuevaOfertaA_Supervisores:', error);
    return res.status(500).json({ success: false, message: 'Error interno en el servidor al despachar las notificaciones.' });
  }
};