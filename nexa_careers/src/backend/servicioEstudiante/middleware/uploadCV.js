import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, '../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, res, cb) => {
    const id_estudiante = req.params.id || req.body.id_estudiante;
    const timestamp = Date.now();
    const extension = '.pdf';
    // Formato: cv_{id_estudiante}_{timestamp}.pdf
    const filename = `cv_${id_estudiante}_${timestamp}${extension}`;
    cb(null, filename);
  }
});

// Filtro para validar archivos
const fileFilter = (req, file, cb) => {
  // Solo permitir PDF
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Solo se aceptan archivos PDF'), false);
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB máximo
  }
});

export default upload;