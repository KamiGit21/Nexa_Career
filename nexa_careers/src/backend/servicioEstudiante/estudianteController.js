import db from '../api-gateway/db.js';

// 1. POST: Registrar estudiante (activo = true por defecto)
export const registrarEstudiante = async (req, res) => {
  const { nombre, apellido, telefono, gmail, cv, contrasena, id_carrera, descripcion, habilidades, educacion, cuenta } = req.body;
  
  if (!cuenta || !gmail || !id_carrera) {
    return res.status(400).json({ success: false, message: 'La cuenta, gmail y id_carrera son obligatorios' });
  }

  try {
    const activo = 1; // 1 equivale a true en tinyint(1) de MySQL
    const [result] = await db.query(
      `INSERT INTO estudiante (nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion, cuenta) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion, cuenta]
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

// 4. GET: Buscar estudiante por cuenta
export const buscarEstudiantePorCuenta = async (req, res) => {
  const { cuenta } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante WHERE cuenta = ?', [cuenta]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado con esa cuenta' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por cuenta:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

// 5. PUT: Actualizar perfil (telefono, gmail, cv, descripcion, educacion, habilidades)
export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { telefono, gmail, cv, descripcion, educacion, habilidades } = req.body;
  
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

  try {
    const [result] = await db.query('UPDATE estudiante SET activo = ? WHERE id_estudiante = ?', [activo, id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, message: `Estado del estudiante actualizado a ${activo ? 'Activo' : 'Inactivo'}` });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};