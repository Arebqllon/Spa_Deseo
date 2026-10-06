const { Router } = require('express');

const router = Router();

const servicioController = require('../controllers/servicio.controller');

router.get('/', async (req, res) => {
    try {
        const Servicio = require('../models/servicio.model');

        const servicios = await Servicio.find()
            .sort({ nombre: 1 });

        res.status(200).json({
            ok: true,
            servicios
        });

    } catch (error) {
        console.error('Error al consultar servicios:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar servicios.'
        });
    }
});

module.exports = router;