import express from 'express';
import * as cursoController from './cursoController.js';

const router = express.Router();

// Rutas específicas PRIMERO
router.post('/registrarPorEstudiante', cursoController.registrarCursoEstudiante);
router.post('/registrarPorEmpleador', cursoController.registrarCursoEmpleador);
router.get('/', cursoController.listarCursos);
router.get('/listarDisponibles', cursoController.listarCursosDisponibles);
// Rutas con parámetros 
router.get('/estudiante/:id_estudiante', cursoController.listarCursosPorEstudiante);
router.get('/empleador/:id_empleador', cursoController.listarCursosPorEmpleador);

export default router;