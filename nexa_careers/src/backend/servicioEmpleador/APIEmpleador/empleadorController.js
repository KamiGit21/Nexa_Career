import db from '../../api-gateway/db.js';

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/*
const dominiosPermitidosEmpleador = ['ucb.edu.bo'];  // Si se quiere restringir a ciertos dominios, se puede usar esta función. Por ahora no se aplica esa restricción.
const isInstitucional = (email) => {
  const partes = String(email).split('@');
  if (partes.length !== 2) return false;
  return dominiosPermitidosEmpleador.includes(partes[1].toLowerCase());
};
*/

const isValidPhone = (telefono) => {
  if (!telefono) return true;
  const str = String(telefono).trim();
  const regex = /^[0-9]{7,15}$/;
  return regex.test(str);
};

const validateEmpleador = (data, { isNew = false } = {}) => {
  const errors = [];
  const { empresa, telefono, gmail, contrasena } = data;

  if (isNew) {
    if (!empresa || !String(empresa).trim()) errors.push('El nombre de la empresa es obligatorio');
    if (!gmail) errors.push('El gmail es obligatorio');
    if (!contrasena) errors.push('La contraseña es obligatoria');
  }

  if (empresa && String(empresa).trim().length > 100) errors.push('El nombre de empresa no puede exceder 100 caracteres');
  if (telefono && !isValidPhone(telefono)) errors.push('El teléfono debe contener solo dígitos y entre 7 y 15 caracteres');

  if (gmail) {
    if (!isValidEmail(gmail)) errors.push('El gmail tiene formato inválido');
  }

  if (contrasena && (String(contrasena).length < 8 || String(contrasena).length > 60)) {
    errors.push('La contraseña debe tener entre 8 y 60 caracteres');
  }

  return { valid: errors.length === 0, errors };
};

// 1. POST: Registrar empleador (activo = true por defecto)
export const registrarEmpleador = async (req, res) => {
  const validation = validateEmpleador(req.body, { isNew: true });
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.errors.join('; ') });

  const { empresa, telefono, gmail, contrasena } = req.body;
  
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

  const validation = validateEmpleador({ empresa, telefono, gmail }, { isNew: false });
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.errors.join('; ') });

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
  if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 60) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 60 caracteres' });
  }

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

  if (![0, 1, '0', '1', true, false].includes(activo)) {
    return res.status(400).json({ success: false, message: 'El valor activo debe ser 0 o 1' });
  }

  const valorActivo = activo === 1 || activo === '1' || activo === true ? 1 : 0;

  try {
    const [result] = await db.query('UPDATE empleador SET activo = ? WHERE id_empleador = ?', [valorActivo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    res.status(200).json({ success: true, message: `Estado del empleador actualizado a ${valorActivo ? 'Activo' : 'Inactivo'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};