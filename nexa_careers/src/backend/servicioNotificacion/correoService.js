const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nexacareersjobs@gmail.com',
    pass: 'iwtwfiiatotilicc711' 
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