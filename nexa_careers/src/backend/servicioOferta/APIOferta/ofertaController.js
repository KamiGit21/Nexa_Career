import db from '../../api-gateway/db.js';

// Función para obtener una oferta laboral específica por ID
export const obtenerOfertaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM oferta WHERE id_oferta = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Oferta no encontrada' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error al obtener oferta por ID:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor al obtener oferta' });
    }
};

