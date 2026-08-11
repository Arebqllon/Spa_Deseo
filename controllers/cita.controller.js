const Cita = require('../models/cita.model');
const Servicio = require('../models/servicio.model');

/**
 * Muestra la página principal del módulo de citas.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar una nueva cita.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioCita', {
        mensaje: null
    });
};

/**
 * Registra una nueva cita.
 *
 * Verifica que el servicio exista, calcula el total a partir
 * de su precio y comprueba que la manicurista no tenga otra
 * cita en la misma fecha y hora.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            clienteId,
            manicuristaId,
            servicioId,
            fecha,
            hora
        } = req.body;

        // Validar los datos obligatorios.
        if (!clienteId || !manicuristaId || !servicioId || !fecha || !hora) {
            return res.render('pages/formularioCita', {
                mensaje: 'Todos los campos de la cita son obligatorios'
            });
        }

        // Buscar el servicio para obtener su precio.
        const servicio = await Servicio.findById(servicioId);

        if (!servicio) {
            return res.render('pages/formularioCita', {
                mensaje: 'El servicio seleccionado no existe'
            });
        }

        /*
         * Verificar que la manicurista no tenga otra cita
         * en la misma fecha y hora.
         */
        const citaExistente = await Cita.findOne({
            manicuristaId,
            fecha,
            hora,
            estado: { $ne: 'Cancelada' }
        });

        if (citaExistente) {
            return res.render('pages/formularioCita', {
                mensaje: 'La manicurista ya tiene una cita en esa fecha y hora'
            });
        }

        // El total se obtiene directamente del precio del servicio.
        const citaNueva = {
            clienteId,
            manicuristaId,
            servicioId,
            fecha,
            hora,
            total: servicio.precio
        };

        const cita = await Cita.create(citaNueva);

        if (cita) {
            return res.render('pages/formularioCita', {
                mensaje: 'Cita registrada exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioCita', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todas las citas registradas.
 *
 * populate permite mostrar la información de Cliente,
 * Manicurista y Servicio relacionados con cada cita.
 */
exports.consultar = async (req, res) => {
    try {

        const citas = await Cita.find()
            .populate('clienteId')
            .populate('manicuristaId')
            .populate('servicioId');

        res.render('pages/citas', {
            citas,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta una cita utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const cita = await Cita.findById(req.params.id)
            .populate('clienteId')
            .populate('manicuristaId')
            .populate('servicioId');

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.json(cita);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza una cita existente.
 *
 * Si cambia el servicio, se vuelve a obtener su precio
 * para mantener actualizado el total de la cita.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            clienteId,
            manicuristaId,
            servicioId,
            fecha,
            hora,
            estado
        } = req.body;

        // Validar los datos obligatorios.
        if (!clienteId || !manicuristaId || !servicioId || !fecha || !hora) {
            const citas = await Cita.find();

            return res.render('pages/citas', {
                citas,
                mensaje: 'Todos los campos de la cita son obligatorios'
            });
        }

        // Buscar el servicio para obtener su precio.
        const servicio = await Servicio.findById(servicioId);

        if (!servicio) {
            const citas = await Cita.find();

            return res.render('pages/citas', {
                citas,
                mensaje: 'El servicio seleccionado no existe'
            });
        }

        /*
         * Verificar si existe otra cita con la misma
         * manicurista, fecha y hora.
         *
         * Se excluye la cita que se está actualizando.
         */
        const citaExistente = await Cita.findOne({
            _id: { $ne: req.params.id },
            manicuristaId,
            fecha,
            hora,
            estado: { $ne: 'Cancelada' }
        });

        if (citaExistente) {
            const citas = await Cita.find();

            return res.render('pages/citas', {
                citas,
                mensaje: 'La manicurista ya tiene una cita en esa fecha y hora'
            });
        }

        const datos = {
            clienteId,
            manicuristaId,
            servicioId,
            fecha,
            hora,
            total: servicio.precio,
            estado
        };

        const cita = await Cita.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.redirect('/citasvista');

    } catch (error) {

        console.log(error);

        const citas = await Cita.find();

        res.render('pages/citas', {
            citas,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina una cita utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const cita = await Cita.findByIdAndDelete(req.params.id);

        if (!cita) {
            return res.status(404).json({
                mensaje: 'Cita no encontrada'
            });
        }

        res.redirect('/citasvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};