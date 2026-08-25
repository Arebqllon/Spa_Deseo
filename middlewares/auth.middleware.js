const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el JWT.
 *
 * El cliente debe enviar el token mediante:
 *
 * Authorization: Bearer TOKEN
 */
const verificarToken = (req, res, next) => {

    try {

        // Obtener el encabezado Authorization.
        const authHeader = req.headers.authorization;

        // Comprobar que exista.
        if (!authHeader) {
            return res.status(401).json({
                mensaje: 'No se proporcionó un token de autenticación.'
            });
        }

        // El formato esperado es:
        //
        // Authorization: Bearer TOKEN
        //
        const partes = authHeader.split(' ');

        if (partes.length !== 2 || partes[0] !== 'Bearer') {
            return res.status(401).json({
                mensaje: 'Formato de token inválido.'
            });
        }

        const token = partes[1];

        // Verificar el JWT.
        const usuarioVerificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Guardar los datos del usuario
        // para que los controladores puedan utilizarlos.
        req.usuario = usuarioVerificado;

        // Continuar con la siguiente función.
        next();

    } catch (error) {

        console.log('Error verificando JWT:', error.message);

        return res.status(401).json({
            mensaje: 'Token inválido o expirado.'
        });
    }
};

module.exports = verificarToken;