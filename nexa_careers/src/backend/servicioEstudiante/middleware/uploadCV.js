import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads/cv');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const id_estudiante = req.params.id || req.body.id_estudiante;
    const timestamp = Date.now();
    
    // Limpiar y truncar nombre original para no exceder VARCHAR(255)
    let originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    // Máximo 200 caracteres para el nombre (el resto del path ocupa ~50)
    const maxNameLength = 200;
    if (originalName.length > maxNameLength) {
      const ext = path.extname(originalName);
      const nameWithoutExt = originalName.slice(0, maxNameLength - ext.length);
      originalName = nameWithoutExt + ext;
    }
    
    const filename = `${id_estudiante}_${timestamp}_${originalName}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Solo se aceptan archivos PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;