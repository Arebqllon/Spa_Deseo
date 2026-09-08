const Cita = require('../models/cita.model');
const Servicio = require('../models/servicio.model');

/**
 * Registra una nueva cita.
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

        if (!clienteId || !manicuristaId || !servicioId || !fecha || !hora) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Todos los campos de la cita son obligatorios'
            });
        }

        const servicio = await Servicio.findById(servicioId);
        if (!servicio) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El servicio seleccionado no existe'
            });
        }

        const citaExistente = await Cita.findOne({
            manicuristaId,
            fecha,
            hora,
            estado: { $ne: 'Cancelada' }
        });

        if (citaExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La manicurista ya tiene una cita asignada en esa fecha y hora'
            });
        }

        const citaNueva = {
            clienteId,
            manicuristaId,
            servicioId,
            fecha,
            hora,
            total: servicio.precio
        };

        const cita = await Cita.create(citaNueva);

        return res.status(201).json({
            ok: true,
            mensaje: 'Cita registrada exitosamente',
            cita
        });

    } catch (error) {
        console.error('Error al registrar cita:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

/**
 * Consulta todas las citas.
 */
exports.consultar = async (req, res) => {
    try {
        const citas = await Cita.find()
            .populate('clienteId')
            .populate('manicuristaId')
            .populate('servicioId');

        return res.status(200).json({
            ok: true,
            citas
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar citas',
            error: error.message
        });
    }
};

/**
 * Consulta una cita por ID.
 */
exports.consultarId = async (req, res) => {
    try {
        const cita = await Cita.findById(req.params.id)
            .populate('clienteId')
            .populate('manicuristaId')
            .populate('servicioId');

        if (!cita) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            cita
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar la cita',
            error: error.message
        });
    }
};

/**
 * Actualiza una cita existente.
 */
exports.actualizar = async (req, res) => {
    try {
        const { clienteId, manicuristaId, servicioId, fecha, hora, estado } = req.body;

        const servicio = await Servicio.findById(servicioId);
        if (!servicio) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El servicio seleccionado no existe'
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

        const cita = await Cita.findByIdAndUpdate(req.params.id, datos, {
            new: true,
            runValidators: true
        });

        if (!cita) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: 'Cita actualizada correctamente',
            cita
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la cita',
            error: error.message
        });
    }
};

/**
 * Elimina una cita.
 */
exports.eliminar = async (req, res) => {
    try {
        const cita = await Cita.findByIdAndDelete(req.params.id);

        if (!cita) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: 'Cita eliminada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la cita',
            error: error.message
        });
    }
};