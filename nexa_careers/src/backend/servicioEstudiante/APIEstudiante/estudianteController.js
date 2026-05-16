import db from './db.js';
import { enviarCodigo } from './correoService.js';

const dominiosPermitidos = ['ucb.edu.bo'];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isInstitucional = (email) => {
  const partes = String(email).split('@');
  if (partes.length !== 2) return false;
  return dominiosPermitidos.includes(partes[1].toLowerCase());
};

const isValidPhone = (telefono) => {
  if (!telefono) return true;
  const str = String(telefono).trim();
  const regex = /^[0-9]{7,15}$/;
  return regex.test(str);
};

const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateEstudiante = (data, { isNew = false } = {}) => {
  const errors = [];
  const {
    nombre,
    apellido,
    telefono,
    gmail,
    cv,
    contrasena,
    id_carrera,
    descripcion,
    habilidades,
    educacion,
  } = data;

  if (isNew) {
    if (!nombre || !String(nombre).trim()) errors.push('El nombre es obligatorio');
    if (!apellido || !String(apellido).trim()) errors.push('El apellido es obligatorio');
    if (!gmail) errors.push('El gmail es obligatorio');
    if (!contrasena) errors.push('La contraseña es obligatoria');
    if (!id_carrera) errors.push('El id_carrera es obligatorio');
  }

  if (nombre && String(nombre).trim().length > 80) errors.push('El nombre no puede exceder 80 caracteres');
  if (apellido && String(apellido).trim().length > 80) errors.push('El apellido no puede exceder 80 caracteres');

  if (gmail) {
    if (!isValidEmail(gmail)) errors.push('El gmail tiene formato inválido');
    else if (!isInstitucional(gmail)) errors.push('El correo debe ser institucional con dominio permitido');
  }

  if (telefono && !isValidPhone(telefono)) errors.push('El teléfono debe contener solo dígitos y entre 7 y 15 caracteres');
  
  if (cv && typeof cv === 'string' && cv.length > 0) {
    if (cv.startsWith('http') && !isValidUrl(cv)) {
      errors.push('El campo cv debe ser una URL válida');
    }
  }
  if (contrasena && String(contrasena).length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
  if (contrasena && String(contrasena).length > 60) errors.push('La contraseña no puede exceder 60 caracteres');
  if (descripcion && String(descripcion).length > 500) errors.push('La descripción no puede exceder 500 caracteres');
  if (habilidades && String(habilidades).length > 500) errors.push('Las habilidades no pueden exceder 500 caracteres');
  if (educacion && String(educacion).length > 500) errors.push('La educación no puede exceder 500 caracteres');
  if (id_carrera && (isNaN(Number(id_carrera)) || Number(id_carrera) <= 0)) errors.push('El id_carrera debe ser un número válido positivo');

  return { valid: errors.length === 0, errors };
};

export const registrarEstudiante = async (req, res) => {
  const validation = validateEstudiante(req.body, { isNew: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  const { nombre, apellido, telefono, gmail, cv, contrasena, id_carrera, descripcion, habilidades, educacion } = req.body;

  try {
    const [existingEmail] = await db.query('SELECT gmail FROM estudiante.estudiante WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
    const activo = 1;
    const [result] = await db.query(
      `INSERT INTO estudiante.estudiante (nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion]
    );
    res.status(201).json({ success: true, id_estudiante: result.insertId, message: 'Estudiante registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

export const listarEstudiantes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ success: false, message: 'Error al listar estudiantes' });
  }
};

export const buscarEstudiantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE id_estudiante = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

export const buscarEstudiantePorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { telefono, gmail, cv, descripcion, educacion, habilidades } = req.body;

  const validation = validateEstudiante({ telefono, gmail, cv, descripcion, educacion, habilidades }, { isNew: false });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  try {
    const [result] = await db.query(
      `UPDATE estudiante.estudiante SET telefono = ?, gmail = ?, cv = ?, descripcion = ?, educacion = ?, habilidades = ? WHERE id_estudiante = ?`,
      [telefono, gmail, cv, descripcion, educacion, habilidades, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado para actualizar' });
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
    const [rows] = await db.query('SELECT contrasena FROM estudiante.estudiante WHERE id_estudiante = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    const contrasenaActual = rows[0].contrasena;
    if (contrasena === contrasenaActual) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const [result] = await db.query('UPDATE estudiante.estudiante SET contrasena = ? WHERE id_estudiante = ?', [contrasena, id]);
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
    if (valorActivo === 0 && motivo) {
      const [result] = await db.query(
        'UPDATE estudiante.estudiante SET activo = ?, motivo_bloqueo = ?, fecha_bloqueo = NOW() WHERE id_estudiante = ?',
        [valorActivo, motivo, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      res.status(200).json({ success: true, message: 'Estudiante bloqueado correctamente' });
    } else {
      const [result] = await db.query(
        'UPDATE estudiante.estudiante SET activo = ?, motivo_bloqueo = NULL, fecha_bloqueo = NULL WHERE id_estudiante = ?',
        [valorActivo, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      res.status(200).json({ success: true, message: 'Estudiante desbloqueado correctamente' });
    }
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

export const enviarCodigoEstudiante = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ success: false, message: 'El correo y el código son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE gmail = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }

    const resultado = await enviarCodigo(correo, codigo);

    if (resultado.success) {
      res.status(200).json({ success: true, message: `Código enviado a ${correo}` });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
  } catch (error) {
    console.error('Error en enviarCodigoEstudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const obtenerPostulacionesPorEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        ofe.id_postulante as id_ofertante,
        ofe.id_estudiante,
        ofe.id_oferta,
        ofe.estado as estado_postulacion,
        o.oferta as titulo,
        o.descripcion,
        o.estado as estado_oferta,
        o.fecha_apertura
      FROM postulante.postulante ofe
      INNER JOIN oferta.oferta o ON ofe.id_oferta = o.id_oferta
      WHERE ofe.id_estudiante = ?
      ORDER BY ofe.id_postulante DESC
    `, [id]);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones', error: error.message });
  }
};

export const postularAOferta = async (req, res) => {
  const { id } = req.params; 
  const { id_oferta } = req.body;

  if (!id_oferta) {
    return res.status(400).json({ success: false, message: 'El id_oferta es obligatorio' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM postulante.postulante WHERE id_estudiante = ? AND id_oferta = ?',
      [id, id_oferta]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya te has postulado a esta oferta' });
    }

    const [result] = await db.query(
      `INSERT INTO postulante.postulante (id_estudiante, id_oferta, estado) 
       VALUES (?, ?, 0)`,
      [id, id_oferta]
    );

    res.status(201).json({ success: true, message: 'Postulación realizada correctamente' });
  } catch (error) {
    console.error('Error al postular:', error);
    res.status(500).json({ success: false, message: 'Error interno al postular' });
  }
};