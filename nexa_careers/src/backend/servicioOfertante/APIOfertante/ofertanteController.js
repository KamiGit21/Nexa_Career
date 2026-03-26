import db from '../../api-gateway/db.js';

// Obtener postulantes a una oferta laboral específica
export const obtenerPostulantesPorOferta = async (req, res) => {
    const { id_oferta } = req.params;
    try {
        const [rows] = await db.query(`
      SELECT
        p.id_postulacion,
        p.fecha_postulacion,
        p.estado,
        e.id_estudiante,
        e.nombre,
        e.apellido,
        e.telefono,
        e.gmail as correo,
        e.cv,
        e.descripcion,
        e.habilidades,
        e.educacion,
        c.carrera
      FROM postulacion p
      JOIN estudiante e ON p.id_estudiante = e.id_estudiante
      JOIN carrera c ON e.id_carrera = c.id_carrera
      WHERE p.id_oferta = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id_oferta]);

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Error al obtener postulantes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener postulantes' });
    }
};