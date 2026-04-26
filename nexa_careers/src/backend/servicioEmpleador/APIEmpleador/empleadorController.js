import db from '../../api-gateway/db.js';
import { enviarCodigo } from '../servicioNotificacion/correoService.js';

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
    // 🛑 NUEVO: Validar si el correo ya existe
    const [existingEmail] = await db.query('SELECT gmail FROM empleador WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
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

// 5. PUT: actualizar perfil -acepta todos los campossss - actualizado
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { empresa, telefono, gmail, nombre, apellido, descripcion } = req.body;

  // Construir la consulta dinámicamente según los campos que lleguen
  const updates = [];
  const values = [];

  if (empresa !== undefined) {
    updates.push('empresa = ?');
    values.push(empresa);
  }
  if (telefono !== undefined) {
    updates.push('telefono = ?');
    values.push(telefono);
  }
  if (gmail !== undefined) {
    // Validar formato del correo
    const isValidEmail = (email) => {
      if (!email || typeof email !== 'string') return false;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };
    if (!isValidEmail(gmail)) {
      return res.status(400).json({ success: false, message: 'El correo electrónico tiene formato inválido' });
    }
    updates.push('gmail = ?');
    values.push(gmail);
  }
  if (nombre !== undefined) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (apellido !== undefined) {
    updates.push('apellido = ?');
    values.push(apellido);
  }
  if (descripcion !== undefined) {
    updates.push('descripcion = ?');
    values.push(descripcion);
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
  }

  try {
    values.push(id);
    const query = `UPDATE empleador SET ${updates.join(', ')} WHERE id_empleador = ?`;
    
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    }
    
    res.status(200).json({ success: true, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
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
    const [rows] = await db.query('SELECT contrasena FROM empleador WHERE id_empleador = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    }
    const contrasenaActual = rows[0].contrasena;
    if (contrasena === contrasenaActual) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const [result] = await db.query('UPDATE empleador SET contrasena = ? WHERE id_empleador = ?', [contrasena, id]);
    //if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
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

export const enviarCodigoEmpleador = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ success: false, message: 'El correo y el código son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM empleador WHERE gmail = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    }

    const resultado = await enviarCodigo(correo, codigo);

    if (resultado.success) {
      res.status(200).json({ success: true, message: `Código enviado a ${correo}` });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
  } catch (error) {
    console.error('Error en enviarCodigoEmpleador:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
