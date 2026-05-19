import db from './db.js';
import { enviarCodigo } from './correoService.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { uploadDir } from './cvController.js';
import path from 'path';
import fs from 'fs';
import PDFParser from 'pdf2json'

const dominiosPermitidos = ['ucb.edu.bo'];

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isInstitucional = (email) => {
  const partes = String(email).split('@');
  if (partes.length !== 2) return false;
  return dominiosPermitidos.includes(partes[1].toLowerCase());
};

const isValidPhone = (telefono) => {
  if (!telefono) return true;
  const str = String(telefono).trim();
  const regex = /^[0-9]{7,15}$/;
  return regex.test(str);
};

const isValidUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateEstudiante = (data, { isNew = false } = {}) => {
  const errors = [];
  const {
    nombre,
    apellido,
    telefono,
    gmail,
    cv,
    contrasena,
    id_carrera,
    descripcion,
    habilidades,
    educacion,
  } = data;

  if (isNew) {
    if (!nombre || !String(nombre).trim()) errors.push('El nombre es obligatorio');
    if (!apellido || !String(apellido).trim()) errors.push('El apellido es obligatorio');
    if (!gmail) errors.push('El gmail es obligatorio');
    if (!contrasena) errors.push('La contraseña es obligatoria');
    if (!id_carrera) errors.push('El id_carrera es obligatorio');
  }

  if (nombre && String(nombre).trim().length > 80) errors.push('El nombre no puede exceder 80 caracteres');
  if (apellido && String(apellido).trim().length > 80) errors.push('El apellido no puede exceder 80 caracteres');

  if (gmail) {
    if (!isValidEmail(gmail)) errors.push('El gmail tiene formato inválido');
    else if (!isInstitucional(gmail)) errors.push('El correo debe ser institucional con dominio permitido');
  }

  if (telefono && !isValidPhone(telefono)) errors.push('El teléfono debe contener solo dígitos y entre 7 y 15 caracteres');
  
  if (cv && typeof cv === 'string' && cv.length > 0) {
    if (cv.startsWith('http') && !isValidUrl(cv)) {
      errors.push('El campo cv debe ser una URL válida');
    }
  }
  if (contrasena && String(contrasena).length < 8) errors.push('La contraseña debe tener al menos 8 caracteres');
  if (contrasena && String(contrasena).length > 60) errors.push('La contraseña no puede exceder 60 caracteres');
  if (descripcion && String(descripcion).length > 500) errors.push('La descripción no puede exceder 500 caracteres');
  if (habilidades && String(habilidades).length > 500) errors.push('Las habilidades no pueden exceder 500 caracteres');
  if (educacion && String(educacion).length > 500) errors.push('La educación no puede exceder 500 caracteres');
  if (id_carrera && (isNaN(Number(id_carrera)) || Number(id_carrera) <= 0)) errors.push('El id_carrera debe ser un número válido positivo');

  return { valid: errors.length === 0, errors };
};

export const registrarEstudiante = async (req, res) => {
  const validation = validateEstudiante(req.body, { isNew: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  const { nombre, apellido, telefono, gmail, cv, contrasena, id_carrera, descripcion, habilidades, educacion } = req.body;

  try {
    const [existingEmail] = await db.query('SELECT gmail FROM estudiante.estudiante WHERE gmail = ?', [gmail]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ success: false, message: 'Este correo electrónico ya está registrado.' });
    }
    const activo = 1;
    const [result] = await db.query(
      `INSERT INTO estudiante.estudiante (nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, telefono, gmail, cv, contrasena, activo, id_carrera, descripcion, habilidades, educacion]
    );
    res.status(201).json({ success: true, id_estudiante: result.insertId, message: 'Estudiante registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno al registrar' });
  }
};

export const listarEstudiantes = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ success: false, message: 'Error al listar estudiantes' });
  }
};

export const buscarEstudiantePorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE id_estudiante = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por ID:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

export const buscarEstudiantePorGmail = async (req, res) => {
  const { gmail } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE gmail = ?', [gmail]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado con ese correo' });
    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error al buscar por gmail:', error);
    res.status(500).json({ success: false, message: 'Error al buscar estudiante' });
  }
};

export const actualizarPerfil = async (req, res) => {
  const { id } = req.params;
  const { telefono, gmail, cv, descripcion, educacion, habilidades } = req.body;

  const validation = validateEstudiante({ telefono, gmail, cv, descripcion, educacion, habilidades }, { isNew: false });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.errors.join('; ') });
  }

  try {
    const [result] = await db.query(
      `UPDATE estudiante.estudiante SET telefono = ?, gmail = ?, cv = ?, descripcion = ?, educacion = ?, habilidades = ? WHERE id_estudiante = ?`,
      [telefono, gmail, cv, descripcion, educacion, habilidades, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado para actualizar' });
    res.status(200).json({ success: true, message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar perfil' });
  }
};

export const cambiarContrasena = async (req, res) => {
  const { id } = req.params;
  const { contrasena } = req.body;

  if (!contrasena) return res.status(400).json({ success: false, message: 'La nueva contraseña es obligatoria' });
  if (typeof contrasena !== 'string' || contrasena.length < 8 || contrasena.length > 60) {
    return res.status(400).json({ success: false, message: 'La contraseña debe tener entre 8 y 60 caracteres' });
  }

  try {
    const [rows] = await db.query('SELECT contrasena FROM estudiante.estudiante WHERE id_estudiante = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    const contrasenaActual = rows[0].contrasena;
    if (contrasena === contrasenaActual) {
      return res.status(400).json({ success: false, message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    const [result] = await db.query('UPDATE estudiante.estudiante SET contrasena = ? WHERE id_estudiante = ?', [contrasena, id]);
    res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar contraseña' });
  }
};

export const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { activo, motivo } = req.body;

  if (![0, 1, '0', '1', true, false].includes(activo)) {
    return res.status(400).json({ success: false, message: 'El valor activo debe ser 0 o 1' });
  }

  const valorActivo = activo === 1 || activo === '1' || activo === true ? 1 : 0;

  try {
    if (valorActivo === 0 && motivo) {
      const [result] = await db.query(
        'UPDATE estudiante.estudiante SET activo = ?, motivo_bloqueo = ?, fecha_bloqueo = NOW() WHERE id_estudiante = ?',
        [valorActivo, motivo, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      res.status(200).json({ success: true, message: 'Estudiante bloqueado correctamente' });
    } else {
      const [result] = await db.query(
        'UPDATE estudiante.estudiante SET activo = ?, motivo_bloqueo = NULL, fecha_bloqueo = NULL WHERE id_estudiante = ?',
        [valorActivo, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
      res.status(200).json({ success: true, message: 'Estudiante desbloqueado correctamente' });
    }
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar estado' });
  }
};

export const enviarCodigoEstudiante = async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo) {
    return res.status(400).json({ success: false, message: 'El correo y el código son obligatorios' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM estudiante.estudiante WHERE gmail = ?', [correo]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }

    const resultado = await enviarCodigo(correo, codigo);

    if (resultado.success) {
      res.status(200).json({ success: true, message: `Código enviado a ${correo}` });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar el correo' });
    }
  } catch (error) {
    console.error('Error en enviarCodigoEstudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const obtenerPostulacionesPorEstudiante = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        ofe.id_postulante as id_ofertante,
        ofe.id_estudiante,
        ofe.id_oferta,
        ofe.estado as estado_postulacion,
        o.oferta as titulo,
        o.descripcion,
        o.estado as estado_oferta,
        o.fecha_apertura
      FROM postulante.postulante ofe
      INNER JOIN oferta.oferta o ON ofe.id_oferta = o.id_oferta
      WHERE ofe.id_estudiante = ?
      ORDER BY ofe.id_postulante DESC
    `, [id]);

    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('Error al obtener postulaciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener postulaciones', error: error.message });
  }
};

export const postularAOferta = async (req, res) => {
  const { id } = req.params; 
  const { id_oferta } = req.body;

  if (!id_oferta) {
    return res.status(400).json({ success: false, message: 'El id_oferta es obligatorio' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM postulante.postulante WHERE id_estudiante = ? AND id_oferta = ?',
      [id, id_oferta]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Ya te has postulado a esta oferta' });
    }

    const [result] = await db.query(
      `INSERT INTO postulante.postulante (id_estudiante, id_oferta, estado) 
       VALUES (?, ?, 0)`,
      [id, id_oferta]
    );

    res.status(201).json({ success: true, message: 'Postulación realizada correctamente' });
  } catch (error) {
    console.error('Error al postular:', error);
    res.status(500).json({ success: false, message: 'Error interno al postular' });
  }
};

export const analizarPerfilConIA = async (req, res) => {
  const { id } = req.params;
  console.log(`\n --- INICIANDO ANÁLISIS IA PARA ESTUDIANTE ${id} ---`);
  if (process.env.GEMINI_API_KEY) {
    const terminacion = process.env.GEMINI_API_KEY.slice(-4);
    console.log(`🔑 API KEY DETECTADA: ✅ SÍ (Termina en ...${terminacion})`);
  } else {
    console.log(`🔑 API KEY DETECTADA: ❌ NO ESTÁ LEYENDO EL .env`);
    return res.status(500).json({ success: false, message: 'Falta la API Key en el servidor' });
  }

  /*try {
    console.log("🔍 Consultando a Google qué modelos tienes habilitados...");
    const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const listData = await listResponse.json();
    
    if (listData.models) {
      const modelosValidos = listData.models
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace('models/', '')); // Limpiamos el texto para que solo salga el nombre
        
      console.log("✅ MODELOS QUE GOOGLE TE PERMITE USAR:\n", modelosValidos);
    } else {
      console.log("❌ Google no devolvió ningún modelo. Revisa tu cuenta en AI Studio.");
    }
  } catch(e) {
    console.log("⚠️ Error al intentar listar modelos:", e.message);
  }*/

  try {
    const [estudianteRows] = await db.query(
      'SELECT descripcion, habilidades, cv FROM estudiante.estudiante WHERE id_estudiante = ?', 
      [id]
    );
    
    if (estudianteRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Estudiante no encontrado' });
    }
    const estudiante = estudianteRows[0];

    let textoDelCV = "El estudiante no adjuntó un archivo de CV o el documento no se pudo procesar.";
    
    if (estudiante.cv) {
      try {
        const files = fs.readdirSync(uploadDir);
        const cvFile = files.find(f => f.startsWith(`cv_${id}_`)) || estudiante.cv;
        const cvPath = path.join(uploadDir, cvFile);
        
        if (fs.existsSync(cvPath)) {
          textoDelCV = await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(null, 1);
            
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
              const rawText = pdfParser.getRawTextContent();
              resolve(rawText.replace(/\r\n/g, " ").replace(/\n/g, " ").trim());
            });
            
            pdfParser.loadPDF(cvPath);
          });
          
          console.log("📄 Texto completo extraído del PDF con éxito para el prompt.");
        } else {
          console.log(`⚠️ Archivo físico no localizado en el path: ${cvPath}`);
        }
      } catch (error) {
        console.error("❌ Error interno al procesar el PDF:", error.message);
      }
    }

    const [ofertasRows] = await db.query(`
      SELECT o.id_oferta, o.oferta, o.descripcion, o.modalidad, e.empresa 
      FROM oferta.oferta o 
      JOIN empleador.empleador e ON o.id_empleador = e.id_empleador 
      WHERE o.estado = 1
    `);

    if (ofertasRows.length === 0) {
      return res.status(200).json({ success: false, message: 'No hay ofertas activas para analizar' });
    }

    const datosEstudiante = `Descripción: ${estudiante.descripcion || 'N/A'}. Habilidades: ${estudiante.habilidades || 'N/A'}. CV Texto extraído: ${textoDelCV}`;
    const datosOfertas = JSON.stringify(ofertasRows.map(o => ({
      id: o.id_oferta,
      titulo: o.oferta,
      descripcion: o.descripcion
    })));

    const prompt = `Actúa como un Reclutador Experto y Analista de Talento IT. Tu única tarea es leer el perfil de un estudiante y compararlo con una lista de ofertas laborales activas.
    REGLA ESTRICTA: No saludes, no expliques. Tu respuesta DEBE SER ÚNICA Y EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
    {
      "profile": {
        "role": "[Título del rol que mejor lo define]",
        "skills": ["[Skill 1]", "[Skill 2]", "[Skill 3]"],
        "tip": "[Consejo accionable para mejorar empleabilidad]"
      },
      "jobs": [
        {
          "id": [ID numérico de la oferta],
          "match": [Número 0-100],
          "reason": "[Por qué encaja en 2 líneas]"
        }
      ]
    }
    Filtra y devuelve solo ofertas con match > 60%.
    
    Perfil del estudiante: ${datosEstudiante}
    Ofertas disponibles: ${datosOfertas}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(responseText);

    const jobsEnriquecidos = aiData.jobs.map(aiJob => {
      const ofertaOriginal = ofertasRows.find(o => o.id_oferta === aiJob.id);
      return {
        id: aiJob.id,
        title: ofertaOriginal ? ofertaOriginal.oferta : 'Oferta',
        company: ofertaOriginal ? ofertaOriginal.empresa : 'Empresa',
        location: ofertaOriginal ? ofertaOriginal.modalidad : 'N/A',
        match: aiJob.match,
        reason: aiJob.reason,
        tags: ['IA MATCH', ofertaOriginal ? ofertaOriginal.modalidad.toUpperCase() : '']
      };
    });

    aiData.jobs = jobsEnriquecidos;

    
    res.status(200).json({ success: true, data: aiData });

  } catch (error) {
    console.error('Error en el análisis de IA:', error);
    res.status(500).json({ success: false, message: 'La IA no pudo procesar el perfil en este momento' });
  }
};