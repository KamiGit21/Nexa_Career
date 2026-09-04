import express from 'express';
import * as estudianteController from './estudianteController.js';
import 'dotenv/config';

const router = express.Router();

router.post('/registrar', estudianteController.registrarEstudiante);
router.get('/', estudianteController.listarEstudiantes);
router.get('/:id', estudianteController.buscarEstudiantePorId);
router.get('/gmail/:gmail', estudianteController.buscarEstudiantePorGmail);

// Rutas PUT para actualizaciones específicas
router.put('/:id/perfil', estudianteController.actualizarPerfil);
router.put('/:id/contrasena', estudianteController.cambiarContrasena);
router.put('/:id/estado', estudianteController.cambiarEstado);
router.post('/enviarCodigo', estudianteController.enviarCodigoEstudiante);

// rutas pa postulaciones de un estudiante
router.get('/:id/postulaciones', estudianteController.obtenerPostulacionesPorEstudiante);
router.post('/:id/postulaciones', estudianteController.postularAOferta);//nuevooooo
router.get('/analisis-ia/:id', estudianteController.analizarPerfilConIA);
router.get('/notificacion/postulacion/:postulacion', estudianteController.enviarNotificacionEstudiante);
router.get('/:id/recomendaciones', estudianteController.obtenerRecomendacionesIA);
router.get('/:id/recomendaciones/tip', estudianteController.obtenerTipIA);

//rutas pa cursos favoritos de un estudiante
router.get('/:id/cursos-favoritos', estudianteController.obtenerCursosFavoritos);
router.post('/:id/cursos-favoritos/nuevo', estudianteController.agregarCursoFavorito);
router.put('/:id/cursos-favoritos/deshabilitar/:cursoId', estudianteController.deshabilitarCursoFavorito);

//rutas pa ofertas favoritos de un estudiante
router.get('/:id/ofertas-favoritas', estudianteController.obtenerOfertasFavoritas);
router.post('/:id/ofertas-favoritas/nueva', estudianteController.agregarOfertaFavorita);
router.put('/:id/ofertas-favoritas/deshabilitar/:ofertaId', estudianteController.deshabilitarOfertaFavorita);

export default router;