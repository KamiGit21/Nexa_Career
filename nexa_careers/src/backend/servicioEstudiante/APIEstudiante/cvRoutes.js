import express from 'express';
import * as cvController from './cvController.js';
import upload from '../middleware/uploadCV.js';

const router = express.Router();

// Subir/Reemplazar CV (POST)
router.post('/:id/cv/upload', 
  upload.single('cv'), 
  cvController.subirCV
);

// Obtener CV (para visualizar)
router.get('/:id/cv/ver', cvController.obtenerCV);

// Obtener información del CV (metadatos)
router.get('/:id/cv/info', cvController.obtenerInfoCV);

// Eliminar CV
router.delete('/:id/cv', cvController.eliminarCV);

export default router;