const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ 
            mensaje: 'Acceso denegado: No se proporcionó token de autorización.' 
        });
    }

    // El encabezado debe venir con el formato: "Bearer <token>"
    const partes = authHeader.split(' ');
    
    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({ 
            mensaje: 'Acceso denegado: Formato de token inválido.' 
        });
    }

    const token = partes[1];

    // Evita pasar 'undefined' o 'null' como cadenas al verificar JWT
    if (!token || token === 'undefined' || token === 'null') {
        return res.status(401).json({ 
            mensaje: 'Acceso denegado: Token inexistente o malformado.' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey_spadeseo');
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error('Error verificando JWT:', error.message);
        return res.status(401).json({ 
            mensaje: 'Acceso denegado: Token inválido o expirado.' 
        });
    }
};

module.exports = verificarToken;