// src/backend/servicioCurso/APICurso/cursoController.js
import db from '../../api-gateway/db.js';

//1. Crear Curso por estudiante
export const registrarCursoEstudiante = async (req, res) => {
  const { curso, descripcion, id_estudiante, contacto} = req.body;

  try {
    const estado = 0; // 0 por defecto al crearse
    const tipoOfertante = 0; // 0 para estudiante, 1 para empleador
    const fechaSQL = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD

    // IMPORTANTE: En el SQL usamos 'id_empleador' para coincidir con tu BD
    const [result] = await db.query(
      `INSERT INTO oferta (curso, descripcion, id_estudiante, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_estudiante, contacto, estado, tipoOfertante, fechaSQL]
    );
    res.status(201).json({ success: true, id_curso: result.insertId, message: 'Curso creada correctamente' });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};

//2. Crear Curso por empleador
export const registrarCursoEmpleador = async (req, res) => {
  const { curso, descripcion, id_empleador, contacto} = req.body;

  try {
    const estado = 0; // 0 por defecto al crearse
    const tipoOfertante = 1; // 1 para empleador, 0 para estudiante
    const fechaSQL = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD

    // IMPORTANTE: En el SQL usamos 'id_empleador' para coincidir con tu BD
    const [result] = await db.query(
      `INSERT INTO oferta (curso, descripcion, id_empleador, contacto, estado, tipo_ofertante, fecha_creacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [curso, descripcion, id_empleador, contacto, estado, tipoOfertante, fechaSQL]
    );
    res.status(201).json({ success: true, id_curso: result.insertId, message: 'Curso creada correctamente' });
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ success: false, message: 'Error interno al crear el curso' });
  }
};


// 3. GET: Listar todas los cursos
export const listarCursos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM curso');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar cursos:', error);
    res.status(500).json({ success: false, message: 'Error al listar cursos' });
  }
};