import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nexacareersjobs@gmail.com',
    pass: 'okxkisznolmexsja' 
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const enviarCodigo = async (correoDestino, codigo) => {
  try {
    const mailOptions = {
      from: '"Nexa Careers" <nexacareersjobs@gmail.com>',
      to: correoDestino,
      subject: `Código de verificación - Nexa Careers`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Solicitud de código de verificación</h2>
          <p>Has solicitado un código de verificación para tu cuenta de <b>Nexa Careers</b>.</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f4f4f4; padding: 15px; margin: 20px auto; width: fit-content; border-radius: 8px;">
            ${codigo}
          </div>
          <p>Si no solicitaste este código, puedes ignorar este correo.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${correoDestino}: %s`, info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return { success: false, message: 'Fallo al enviar el correo' };
  }
};

export const enviarNotificacion = async (correoDestino, empleador, oferta) => {
  try {
    const mailOptions = {
      from: '"Nexa Careers" <nexacareersjobs@gmail.com>',
      to: correoDestino,
      subject: `Nueva Postulación Recibida - Nexa Careers`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <div style="background-color: #1b2a4a; padding: 25px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 22px;">¡Nueva Postulación Registrada!</h2>
            </div>
            <div style="padding: 30px; background-color: #ffffff;">
              <p style="font-size: 16px; margin: 0 0 20px 0; line-height: 1.5;">
                Estimado <b>${empleador}</b>, se le informa que acaba de recibir una postulacion a la oferta <b>${oferta}</b>.
              </p>
              <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #edf2f7; text-align: center;">
                <p style="font-size: 12px; color: #a0aec0; margin: 0;">Este es un mensaje automático enviado por el ecosistema de Nexa Careers.</p>
              </div>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Notificación de postulación enviada a empleador ${correoDestino}: %s`, info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar correo de notificación al empleador:', error);
    return { success: false, message: 'Fallo al enviar el correo de notificación' };
  }
};