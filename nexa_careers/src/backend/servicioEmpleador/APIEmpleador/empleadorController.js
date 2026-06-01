import db from './db.js';
import { enviarCodigo } from './correoService.js';

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

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

export const registrarEmpleador = async (req, res) => {
  const validation = validateEmpleador(req.body, { isNew: true });
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.errors.join('; ') });

  const { empresa, telefono, gmail, contrasena } = req.body;
  
  try {
    const [existingEmail] = await db.query('SELECT gmail FROM empleador.empleador WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
    const activo = 1; 
    const [result] = await db.query(
      `INSERT INTO empleador.empleador (empresa, telefono, gmail, contrasena, activo) 
       VALUES (?, ?, ?, ?, ?)`,
      [empresa, telefono, gmail, contrasena, activo]
    );
    res.status(201).json({ success: true, id_empleador: result.insertId, message: 'Empleador registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar empleador:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

export const listarEmpleadores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM empleador.empleador');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar empleadores:', error);
    res.status(500).json({ success: false, message: 'Error al listar empleadores' });
  }
};

export const buscarEmpleadorPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM empleador.empleador WHERE id_empleador = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar empleador' });
  }
};

export const buscarEmpleadorPorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM empleador.empleador WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Empleador no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar empleador' });
  }
};

export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { empresa, telefono, gmail, nombre, apellido, descripcion } = req.body;

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
    const query = `UPDATE empleador.empleador SET ${updates.join(', ')} WHERE id_empleador = ?`;
    
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

export const cambiarContrasena = async (req, res) => {
  const { id } = req.params;
  const { contrasena } = req.body;
  
  if (!contrasena) return res.status(400).json({ success: false, message: 'La nueva contraseña es obligatoria' });
  if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 60) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 60 caracteres' });
  }

  try {
    const [rows] = await db.query('SELECT contrasena FROM empleador.empleador WHERE id_empleador = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Empleador no encontrado' });
    }
    const contrasenaActual = rows[0].contrasena;
    if (contrasena === contrasenaActual) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const [result] = await db.query('UPDATE empleador.empleador SET contrasena = ? WHERE id_empleador = ?', [contrasena, id]);
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
    let query = 'UPDATE empleador.empleador SET activo = ?';
    let values = [valorActivo];

    if (valorActivo === 0) {
      query += ', motivo_bloqueo = ?, fecha_bloqueo = NOW()';
      values.push(motivo || null);
    } else {
      query += ', motivo_bloqueo = NULL, fecha_bloqueo = NULL';
    }

    query += ' WHERE id_empleador = ?';
    values.push(id);

    const [result] = await db.query(query, values);
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
    const [rows] = await db.query('SELECT * FROM empleador.empleador WHERE gmail = ?', [correo]);
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

export const contarEmpleadores = async (req, res) => {
  const { activo } = req.params;
  if (activo === undefined) {
    return res.status(400).json({ 
      success: false, 
      message: 'Debes proporcionar un valor de activo para contar los empleadores.' 
    });
  }

  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as total FROM empleador.empleador WHERE activo = ?',
      [activo]
    );
    res.status(200).json({
      success: true,
      data: {
        activo: parseInt(activo),
        total: result[0].total
      }
    });

  } catch (error) {
    console.error('❌ Error al contar empleadores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al intentar contar los empleadores' 
    });
  }
};