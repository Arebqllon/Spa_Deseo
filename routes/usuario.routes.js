const express = require('express');

const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');

const {enviarCorreoPrueba }= require('../services/email.service');

const verificarToken = require('../middlewares/auth.middleware');
/**
 * POST /registro
 *
 * Registra un nuevo usuario.
 */
router.post(
    '/registro',
    usuarioController.registrar
);

/**
 * POST /login
 *
 * Inicia sesión y devuelve un JWT.
 */
router.post(
    '/login',
    usuarioController.login
);


/**
 * Ruta protegida de prueba.
 *
 * Solo puede acceder un usuario
 * que tenga un JWT válido.
 */
router.get(
    '/perfil',
    verificarToken,
    (req, res) => {

        res.status(200).json({
            mensaje: 'Acceso autorizado.',
            usuario: req.usuario
        });

    }
);

router.get(
    '/correo-prueba',
    async (req, res) => {

        await enviarCorreoPrueba();

        res.json({
            mensaje: 'Se intentó enviar el correo de prueba.'
        });

    }
);


module.exports = router;