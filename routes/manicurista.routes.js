const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
    try {
        const Manicurista = require('../models/manicurista.model');

        const manicuristas = await Manicurista.find({
            estado: 'Activa'
        }).sort({ nombre: 1 });

        res.status(200).json({
            ok: true,
            manicuristas
        });

    } catch (error) {
        console.error('Error al consultar manicuristas:', error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar manicuristas.'
        });
    }
});

module.exports = router;