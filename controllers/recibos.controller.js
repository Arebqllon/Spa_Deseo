const Recibo = require('../models/recibos.model');
const Cita = require('../models/cita.model');

/**
 * Muestra la página principal del módulo de recibos.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un nuevo recibo.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioRecibo', {
        mensaje: null
    });
};

/**
 * Registra un nuevo recibo asociado a una cita.
 *
 * El valor del recibo se obtiene directamente del total de la cita.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            citaId,
            metodoPago
        } = req.body;

        // Validar la cita.
        if (!citaId) {
            return res.render('pages/formularioRecibo', {
                mensaje: 'La cita es obligatoria'
            });
        }

        // Buscar la cita asociada.
        const cita = await Cita.findById(citaId);

        if (!cita) {
            return res.render('pages/formularioRecibo', {
                mensaje: 'La cita seleccionada no existe'
            });
        }

        // Validar método de pago.
        if (!metodoPago || metodoPago.trim() === '') {
            return res.render('pages/formularioRecibo', {
                mensaje: 'El método de pago es obligatorio'
            });
        }

        /*
         * El valor se obtiene de la cita.
         * No se recibe directamente desde el formulario.
         */
        const reciboNuevo = {
            citaId,
            metodoPago,
            valor: cita.total
        };

        const recibo = await Recibo.create(reciboNuevo);

        if (recibo) {
            return res.render('pages/formularioRecibo', {
                mensaje: 'Recibo registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioRecibo', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los recibos registrados.
 *
 * También obtiene la información de la cita asociada.
 */
exports.consultar = async (req, res) => {
    try {

        const recibos = await Recibo.find()
            .populate('citaId');

        res.render('pages/recibos', {
            recibos,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un recibo utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const recibo = await Recibo.findById(req.params.id)
            .populate('citaId');

        if (!recibo) {
            return res.status(404).json({
                mensaje: 'Recibo no encontrado'
            });
        }

        res.json(recibo);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza un recibo existente.
 *
 * El valor se obtiene nuevamente desde la cita relacionada
 * para mantener la información consistente.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            citaId,
            metodoPago,
            estado
        } = req.body;

        // Validar cita.
        if (!citaId) {
            const recibos = await Recibo.find();

            return res.render('pages/recibos', {
                recibos,
                mensaje: 'La cita es obligatoria'
            });
        }

        // Buscar la cita.
        const cita = await Cita.findById(citaId);

        if (!cita) {
            const recibos = await Recibo.find();

            return res.render('pages/recibos', {
                recibos,
                mensaje: 'La cita seleccionada no existe'
            });
        }

        // Validar método de pago.
        if (!metodoPago || metodoPago.trim() === '') {
            const recibos = await Recibo.find();

            return res.render('pages/recibos', {
                recibos,
                mensaje: 'El método de pago es obligatorio'
            });
        }

        // Validar estado.
        const estadosPermitidos = [
            'Pendiente',
            'Realizado'
        ];

        if (!estadosPermitidos.includes(estado)) {
            const recibos = await Recibo.find();

            return res.render('pages/recibos', {
                recibos,
                mensaje: 'El estado del recibo no es válido'
            });
        }

        const datos = {
            citaId,
            metodoPago,
            estado,
            valor: cita.total
        };

        const recibo = await Recibo.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!recibo) {
            return res.status(404).json({
                mensaje: 'Recibo no encontrado'
            });
        }

        res.redirect('/recibosvista');

    } catch (error) {

        console.log(error);

        const recibos = await Recibo.find();

        res.render('pages/recibos', {
            recibos,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un recibo utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const recibo = await Recibo.findByIdAndDelete(req.params.id);

        if (!recibo) {
            return res.status(404).json({
                mensaje: 'Recibo no encontrado'
            });
        }

        res.redirect('/recibosvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};