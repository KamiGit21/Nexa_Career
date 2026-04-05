import db from '../../api-gateway/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads/cv');

// 1. Subir o reemplazar CV
export const subirCV = async (req, res) => {
  const id_estudiante = req.params.id;
  
  // Verificar que se haya subido un archivo
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se ha enviado ningún archivo' 
    });
  }

  try {
    // Obtener el CV actual del estudiante
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );
    
    if (estudiante.length === 0) {
      // Si el estudiante no existe, eliminar el archivo subido
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    // Si ya tenía un CV, eliminar el archivo anterior
    if (estudiante[0].cv) {
      const oldFilePath = path.join(uploadDir, path.basename(estudiante[0].cv));
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Guardar la ruta del nuevo CV en la BD (guardamos solo el nombre del archivo)
    const cvPath = req.file.filename;
    
    await db.query(
      'UPDATE estudiante SET cv = ? WHERE id_estudiante = ?',
      [cvPath, id_estudiante]
    );

    res.status(200).json({
      success: true,
      message: 'CV subido correctamente',
      data: {
        filename: cvPath,
        size: req.file.size,
        uploadedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error al subir CV:', error);
    // Eliminar el archivo si hubo error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al subir el CV' 
    });
  }
};

// 2. Obtener/visualizar CV
export const obtenerCV = async (req, res) => {
  const id_estudiante = req.params.id;

  try {
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const cvFilename = estudiante[0].cv;
    
    if (!cvFilename) {
      return res.status(404).json({ 
        success: false, 
        message: 'El estudiante no tiene un CV cargado' 
      });
    }

    const filePath = path.join(uploadDir, cvFilename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'El archivo CV no existe en el servidor' 
      });
    }

    // Enviar el archivo como PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="cv_${id_estudiante}.pdf"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error al obtener CV:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al obtener el CV' 
    });
  }
};

// 3. Eliminar CV
export const eliminarCV = async (req, res) => {
  const id_estudiante = req.params.id;

  try {
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const cvFilename = estudiante[0].cv;
    
    if (!cvFilename) {
      return res.status(404).json({ 
        success: false, 
        message: 'El estudiante no tiene un CV cargado' 
      });
    }

    // Eliminar el archivo físico
    const filePath = path.join(uploadDir, cvFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Actualizar la BD (poner NULL en lugar de la ruta)
    await db.query(
      'UPDATE estudiante SET cv = NULL WHERE id_estudiante = ?',
      [id_estudiante]
    );

    res.status(200).json({
      success: true,
      message: 'CV eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar CV:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al eliminar el CV' 
    });
  }
};

// 4. Obtener información del CV (metadatos)
export const obtenerInfoCV = async (req, res) => {
  const id_estudiante = req.params.id;

  try {
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const cvFilename = estudiante[0].cv;
    
    if (!cvFilename) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        data: null
      });
    }

    const filePath = path.join(uploadDir, cvFilename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        data: null,
        message: 'El archivo no existe en el servidor'
      });
    }

    const stats = fs.statSync(filePath);
    
    res.status(200).json({
      success: true,
      hasCV: true,
      data: {
        filename: cvFilename,
        size: stats.size,
        sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
        uploadedAt: stats.birthtime,
        url: `/api/estudiantes/${id_estudiante}/cv/ver`
      }
    });
  } catch (error) {
    console.error('Error al obtener info del CV:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al obtener información del CV' 
    });
  }
};