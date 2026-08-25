const transporter = require('../config/mail');

/**
 * Envía un correo de bienvenida
 * después de registrar un usuario.
 */
const enviarCorreoBienvenida = async (correo, rol) => {

    const info = await transporter.sendMail({

        from: `"Spa Deseo" <${process.env.CORREO}>`,

        to: correo,

        subject: '¡Bienvenido a Spa Deseo! 💅',

        html: `
            <!DOCTYPE html>
            <html lang="es">

            <head>
                <meta charset="UTF-8">
                <title>Bienvenido a Spa Deseo</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #fdf2f8;
                font-family: Arial, sans-serif;
            ">

                <div style="
                    max-width: 600px;
                    margin: 40px auto;
                    background-color: white;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
                ">

                    <h1 style="
                        color: #c2185b;
                        margin-bottom: 10px;
                    ">
                        💅 Spa Deseo
                    </h1>

                    <h2 style="
                        color: #333;
                    ">
                        ¡Bienvenido!
                    </h2>

                    <p style="
                        color: #555;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Tu cuenta ha sido creada correctamente.
                    </p>

                    <p style="
                        color: #555;
                        font-size: 16px;
                    ">
                        Tu rol en Spa Deseo es:
                    </p>

                    <div style="
                        display: inline-block;
                        background-color: #f8bbd0;
                        color: #880e4f;
                        padding: 10px 25px;
                        border-radius: 25px;
                        font-weight: bold;
                        margin: 10px 0 20px;
                    ">
                        ${rol}
                    </div>

                    <p style="
                        color: #777;
                        font-size: 14px;
                        line-height: 1.6;
                    ">
                        Gracias por formar parte de Spa Deseo.
                    </p>

                    <hr style="
                        border: none;
                        border-top: 1px solid #eee;
                        margin: 30px 0;
                    ">

                    <p style="
                        color: #aaa;
                        font-size: 12px;
                    ">
                        Este es un mensaje automático.
                        Por favor, no respondas a este correo.
                    </p>

                </div>

            </body>
            </html>
        `
    });

    console.log(
        'Correo de bienvenida enviado:',
        info.messageId
    );

    return info;
};


module.exports = enviarCorreoBienvenida;