const Cita = require('../models/cita.model');
const Servicio = require('../models/servicio.model');
const Cliente = require('../models/cliente.model');
const Manicurista = require('../models/manicurista.model');

/**
 * Registra una nueva cita.
 */
exports.registrar = async (req, res) => {
    try {
        const {
            servicioId,
            manicuristaId,
            fecha,
            hora
        } = req.body;

        // Validar campos enviados desde el frontend
        if (!servicioId || !manicuristaId || !fecha || !hora) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Servicio, manicurista, fecha y hora son obligatorios.'
            });
        }

        // Buscar el cliente asociado al usuario autenticado
        const cliente = await Cliente.findOne({
            usuarioId: req.usuario.id
        });

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el perfil del cliente.'
            });
        }

        // Verificar que el servicio exista
        const servicio = await Servicio.findById(servicioId);

        if (!servicio) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El servicio seleccionado no existe.'
            });
        }

        // Verificar que la manicurista exista y esté activa
        const manicurista = await Manicurista.findOne({
            _id: manicuristaId,
            estado: 'Activa'
        });

        if (!manicurista) {
            return res.status(404).json({
                ok: false,
                mensaje: 'La manicurista seleccionada no existe o no está activa.'
            });
        }

        // Verificar que no exista otra cita en la misma fecha y hora
        const citaExistente = await Cita.findOne({
            manicuristaId,
            fecha: new Date(fecha),
            hora,
            estado: { $ne: 'Cancelada' }
        });

        if (citaExistente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La manicurista ya tiene una cita asignada en esa fecha y hora.'
            });
        }

        // Crear la cita
        const cita = await Cita.create({
            clienteId: cliente._id,
            manicuristaId: manicurista._id,
            servicioId: servicio._id,
            fecha: new Date(fecha),
            hora,
            total: servicio.precio
        });

        return res.status(201).json({
            ok: true,
            mensaje: 'Cita registrada exitosamente.',
            cita
        });

    } catch (error) {
        console.error('Error al registrar cita:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor.'
        });
    }
};


/**
 * Consulta las citas del cliente autenticado.
 */
exports.consultar = async (req, res) => {
    try {
        // Buscar el cliente asociado al usuario autenticado
        const cliente = await Cliente.findOne({
            usuarioId: req.usuario.id
        });

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se encontró el perfil del cliente.'
            });
        }

        // Buscar únicamente las citas de ese cliente
        const citas = await Cita.find({
            clienteId: cliente._id
        })
            .populate('clienteId')
            .populate('manicuristaId')
            .populate('servicioId')
            .sort({ fecha: 1, hora: 1 });

        return res.status(200).json({
            ok: true,
            citas
        });

    } catch (error) {
        console.error('Error al consultar citas:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar citas.'
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
                mensaje: 'Cita no encontrada.'
            });
        }

        return res.status(200).json({
            ok: true,
            cita
        });

    } catch (error) {
        console.error('Error al consultar la cita:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar la cita.'
        });
    }
};


/**
 * Actualiza una cita existente.
 */
exports.actualizar = async (req, res) => {
    try {
        const {
            manicuristaId,
            servicioId,
            fecha,
            hora,
            estado
        } = req.body;

        const servicio = await Servicio.findById(servicioId);

        if (!servicio) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El servicio seleccionado no existe.'
            });
        }

        const cita = await Cita.findById(req.params.id);

        if (!cita) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita no encontrada.'
            });
        }

        const datos = {
            manicuristaId,
            servicioId,
            fecha: new Date(fecha),
            hora,
            total: servicio.precio,
            estado
        };

        const citaActualizada = await Cita.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            ok: true,
            mensaje: 'Cita actualizada correctamente.',
            cita: citaActualizada
        });

    } catch (error) {
        console.error('Error al actualizar la cita:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la cita.'
        });
    }
};


/**
 * Elimina una cita.
 */
exports.eliminar = async (req, res) => {
    try {
        const cita = await Cita.findById(req.params.id);

        if (!cita) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita no encontrada.'
            });
        }

        await Cita.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            ok: true,
            mensaje: 'Cita eliminada correctamente.'
        });

    } catch (error) {
        console.error('Error al eliminar la cita:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la cita.'
        });
    }
};