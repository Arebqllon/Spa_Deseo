const Pago = require('../models/pagos.model');
const Cita = require('../models/cita.model');

/**
 * Muestra la página principal del módulo de pagos.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un nuevo pago.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioPago', {
        mensaje: null
    });
};

/**
 * Registra un nuevo pago asociado a una cita.
 *
 * El valor del pago se obtiene directamente del total de la cita
 * para evitar que el usuario pueda modificarlo desde el formulario.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            citaId,
            metodoPago,
            referencia
        } = req.body;

        // Validar cita.
        if (!citaId) {
            return res.render('pages/formularioPago', {
                mensaje: 'La cita es obligatoria'
            });
        }

        // Buscar la cita asociada.
        const cita = await Cita.findById(citaId);

        if (!cita) {
            return res.render('pages/formularioPago', {
                mensaje: 'La cita seleccionada no existe'
            });
        }

        // Validar método de pago.
        const metodosPermitidos = [
            'Wompi',
            'Mercado Pago',
            'Transferencia'
        ];

        if (!metodosPermitidos.includes(metodoPago)) {
            return res.render('pages/formularioPago', {
                mensaje: 'El método de pago no es válido'
            });
        }

        /*
         * El valor se obtiene de la cita.
         * No se toma desde req.body.
         */
        const pagoNuevo = {
            citaId,
            metodoPago,
            valor: cita.total,
            referencia: referencia || null
        };

        const pago = await Pago.create(pagoNuevo);

        if (pago) {
            return res.render('pages/formularioPago', {
                mensaje: 'Pago registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioPago', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los pagos registrados.
 *
 * También obtiene la información de la cita relacionada.
 */
exports.consultar = async (req, res) => {
    try {

        const pagos = await Pago.find()
            .populate('citaId');

        res.render('pages/pagos', {
            pagos,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un pago utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const pago = await Pago.findById(req.params.id)
            .populate('citaId');

        if (!pago) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.json(pago);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza un pago existente.
 *
 * El valor vuelve a obtenerse desde la cita relacionada
 * para mantener la información financiera consistente.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            citaId,
            metodoPago,
            estado,
            referencia
        } = req.body;

        // Validar cita.
        if (!citaId) {
            const pagos = await Pago.find();

            return res.render('pages/pagos', {
                pagos,
                mensaje: 'La cita es obligatoria'
            });
        }

        // Buscar la cita.
        const cita = await Cita.findById(citaId);

        if (!cita) {
            const pagos = await Pago.find();

            return res.render('pages/pagos', {
                pagos,
                mensaje: 'La cita seleccionada no existe'
            });
        }

        // Validar método de pago.
        const metodosPermitidos = [
            'Wompi',
            'Mercado Pago',
            'Transferencia'
        ];

        if (!metodosPermitidos.includes(metodoPago)) {
            const pagos = await Pago.find();

            return res.render('pages/pagos', {
                pagos,
                mensaje: 'El método de pago no es válido'
            });
        }

        // Validar estado.
        const estadosPermitidos = [
            'Pendiente',
            'Realizado',
            'Fallido'
        ];

        if (!estadosPermitidos.includes(estado)) {
            const pagos = await Pago.find();

            return res.render('pages/pagos', {
                pagos,
                mensaje: 'El estado del pago no es válido'
            });
        }

        const datos = {
            citaId,
            metodoPago,
            estado,
            valor: cita.total,
            referencia: referencia || null
        };

        const pago = await Pago.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!pago) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.redirect('/pagosvista');

    } catch (error) {

        console.log(error);

        const pagos = await Pago.find();

        res.render('pages/pagos', {
            pagos,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un pago utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const pago = await Pago.findByIdAndDelete(req.params.id);

        if (!pago) {
            return res.status(404).json({
                mensaje: 'Pago no encontrado'
            });
        }

        res.redirect('/pagosvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};