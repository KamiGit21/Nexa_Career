import express from 'express';
import * as cursoController from './cursoController.js';

const router = express.Router();

router.post('/registrarPorEstudiante', cursoController.registrarCursoEstudiante);
router.post('/registrarPorEmpleador', cursoController.registrarCursoEmpleador);
router.get('/', cursoController.listarCursos);


export default router;