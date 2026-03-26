import express from 'express';
import * as estudianteController from './estudianteController.js';

const router = express.Router();

router.post('/registrar', estudianteController.registrarEstudiante);
router.get('/', estudianteController.listarEstudiantes);
router.get('/:id', estudianteController.buscarEstudiantePorId);
router.get('/gmail/:gmail', estudianteController.buscarEstudiantePorGmail);

// Rutas PUT para actualizaciones específicas
router.put('/:id/perfil', estudianteController.actualizarPerfil);
router.put('/:id/contrasena', estudianteController.cambiarContrasena);
router.put('/:id/estado', estudianteController.cambiarEstado);

export default router;