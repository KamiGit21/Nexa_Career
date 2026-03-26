import express from 'express';
import * as supervisorController from './supervisorController.js';

const router = express.Router();

router.post('/registrar', supervisorController.registrarSupervisor);
router.get('/', supervisorController.listarSupervisores);
router.get('/:id', supervisorController.buscarSupervisorPorId);
router.get('/gmail/:gmail', supervisorController.buscarSupervisorPorGmail);

router.put('/:id/perfil', supervisorController.actualizarPerfil);
router.put('/:id/contrasena', supervisorController.cambiarContrasena);
router.put('/:id/estado', supervisorController.cambiarEstado);

export default router;