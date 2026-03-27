import db from '../../api-gateway/db.js';

const dominiosPermitidos = ['ucb.edu.bo'];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // validación simple de formato
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isInstitucional = (email) => {
  const partes = String(email).split('@');
  if (partes.length !== 2) return false;
  return dominiosPermitidos.includes(partes[1].toLowerCase());
};

const isValidPhone = (telefono) => {
  if (!telefono) return true; // opcional
  const str = String(telefono).trim();
  const regex = /^[0-9]{7,15}$/;
  return regex.test(str);
};

const isValidUrl = (url) => {
  if (!url) return true; // opcional
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

  if (cv && !isValidUrl(cv)) errors.push('El campo cv debe ser una URL válida');

  if (contrasena && String(contrasena).length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
  if (contrasena && String(contrasena).length > 60) errors.push('La contraseña no puede exceder 60 caracteres');

  if (descripcion && String(descripcion).length > 500) errors.push('La descripción no puede exceder 500 caracteres');
  if (habilidades && String(habilidades).length > 500) errors.push('Las habilidades no pueden exceder 500 caracteres');
  if (educacion && String(educacion).length > 500) errors.push('La educación no puede exceder 500 caracteres');

  if (id_carrera && (isNaN(Number(id_carrera)) || Number(id_carrera) <= 0)) errors.push('El id_carrera debe ser un número válido positivo');

  return { valid: errors.length === 0, errors };
};

// 1. POST: Registrar estudiante (activo = true por defecto)
export const registrarEstudiante = async (req, res) => {
  const validation = validateEstudiante(req.body, { isNew: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

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
  } = req.body;

  try {
    // 🛑 NUEVO: Validar si el correo ya existe
    const [existingEmail] = await db.query('SELECT gmail FROM estudiante WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
    const activo = 1; // 1 equivale a true en tinyint(1) de MySQL
    const [result] = await db.query(
      `INSERT INTO estudiante (nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion]
    );
    res.status(201).json({ success: true, id_estudiante: result.insertId, message: 'Estudiante registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

// 2. GET: Listar todos los estudiantes
export const listarEstudiantes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiante');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ success: false, message: 'Error al listar estudiantes' });
  }
};

// 3. GET: Buscar estudiante por ID
export const buscarEstudiantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante WHERE id_estudiante = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

// 4. GET: Buscar estudiante por correo
export const buscarEstudiantePorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

// 5. PUT: Actualizar perfil (telefono, gmail, cv, descripcion, educacion, habilidades)
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { telefono, gmail, cv, descripcion, educacion, habilidades } = req.body;

  const validation = validateEstudiante({ telefono, gmail, cv, descripcion, educacion, habilidades }, { isNew: false });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  try {
    const [result] = await db.query(
      `UPDATE estudiante SET telefono = ?, gmail = ?, cv = ?, descripcion = ?, educacion = ?, habilidades = ? WHERE id_estudiante = ?`,
      [telefono, gmail, cv, descripcion, educacion, habilidades, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado para actualizar' });
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
  if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 60) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 60 caracteres' });
  }

  try {
    const [result] = await db.query('UPDATE estudiante SET contrasena = ? WHERE id_estudiante = ?', [contrasena, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar contraseña' });
  }
};

// 7. PUT: Cambiar estado (activo)
export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body; // Se espera un 1 (true) o 0 (false)

  if (![0, 1, '0', '1', true, false].includes(activo)) {
    return res.status(400).json({ success: false, message: 'El valor activo debe ser 0 o 1' });
  }

  const valorActivo = activo === 1 || activo === '1' || activo === true ? 1 : 0;

  try {
    const [result] = await db.query('UPDATE estudiante SET activo = ? WHERE id_estudiante = ?', [valorActivo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, message: `Estado del estudiante actualizado a ${valorActivo ? 'Activo' : 'Inactivo'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

// 8. GET: Obtener postulaciones de un estudiante (con datos de oferta y empleador para frontend)
export const obtenerPostulacionesPorEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id_postulacion,
        p.fecha_postulacion,
        p.estado,
        o.id_oferta,
        o.titulo,
        o.descripcion,
        o.salario,
        o.ubicacion,
        o.fecha_publicacion,
        e.empresa,
        e.gmail as correo_empleador
      FROM postulacion p
      JOIN oferta o ON p.id_oferta = o.id_oferta
      JOIN empleador e ON o.id_empleador = e.id_empleador
      WHERE p.id_estudiante = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id]);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones' });
  }
};