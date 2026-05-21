import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadDir = path.join(__dirname, '../uploads/cv');

// 1. Subir o reemplazar CV
export const subirCV = async (req, res) => {
  const id_estudiante = req.params.id;
  
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'No se ha enviado ningún archivo' 
    });
  }

  try {
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante.estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );
    
    if (estudiante.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const cvPath = req.file.filename;
    
    await db.query(
      'UPDATE estudiante.estudiante SET cv = ? WHERE id_estudiante = ?',
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
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error interno al subir el CV' 
    });
  }
};

// 2. Obtener CV para visualizar
export const obtenerCV = async (req, res) => {
  const id_estudiante = req.params.id;

  try {
    const [estudiante] = await db.query(
      'SELECT cv FROM estudiante.estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    // Buscar archivo que empiece con el ID del estudiante
    const files = fs.readdirSync(uploadDir);
    const cvFile = files.find(f => f.startsWith(`${id_estudiante}_`));
    
    if (!cvFile) {
      return res.status(404).json({ 
        success: false, 
        message: 'El estudiante no tiene un CV cargado' 
      });
    }

    const filePath = path.join(uploadDir, cvFile);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'El archivo CV no existe en el servidor' 
      });
    }

    // Extraer nombre original para la descarga
    const parts = cvFile.split('_');
    const originalName = parts.slice(2).join('_');
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(originalName)}"`);
    
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
      'SELECT cv FROM estudiante.estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const files = fs.readdirSync(uploadDir);
    const cvFile = files.find(f => f.startsWith(`${id_estudiante}_`));
    
    if (!cvFile) {
      return res.status(404).json({ 
        success: false, 
        message: 'El estudiante no tiene un CV cargado' 
      });
    }

    const filePath = path.join(uploadDir, cvFile);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await db.query(
      'UPDATE estudiante.estudiante SET cv = NULL WHERE id_estudiante = ?',
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
      'SELECT cv FROM estudiante.estudiante WHERE id_estudiante = ?',
      [id_estudiante]
    );

    if (estudiante.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Estudiante no encontrado' 
      });
    }

    const cvValor = estudiante[0].cv;
    
    if (!cvValor) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        data: null
      });
    }

    const files = fs.readdirSync(uploadDir);
    const cvFile = files.find(f => f.startsWith(`${id_estudiante}_`));
    
    if (!cvFile) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        data: null,
        message: 'El archivo no existe en el servidor'
      });
    }

    const filePath = path.join(uploadDir, cvFile);
    const stats = fs.statSync(filePath);
    
    const parts = cvFile.split('_');
    const originalName = parts.slice(2).join('_');
    
    res.status(200).json({
      success: true,
      hasCV: true,
      data: {
        filename: originalName,
        storedFilename: cvFile,
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