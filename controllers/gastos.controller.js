const Gasto = require('../models/gastos.model');

/**
 * Muestra la página principal del módulo de gastos.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un nuevo gasto.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioGasto', {
        mensaje: null
    });
};

/**
 * Registra un nuevo gasto en la base de datos.
 *
 * Recibe el concepto, valor, fecha y descripción
 * del gasto realizado.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            concepto,
            valor,
            fecha,
            descripcion
        } = req.body;

        // Validar concepto.
        if (!concepto || concepto.trim() === '') {
            return res.render('pages/formularioGasto', {
                mensaje: 'El concepto del gasto es obligatorio'
            });
        }

        // Validar valor.
        if (
            valor === undefined ||
            valor === '' ||
            Number(valor) < 0
        ) {
            return res.render('pages/formularioGasto', {
                mensaje: 'El valor del gasto no puede ser negativo'
            });
        }

        // Validar fecha.
        if (!fecha) {
            return res.render('pages/formularioGasto', {
                mensaje: 'La fecha del gasto es obligatoria'
            });
        }

        // Validar descripción.
        if (!descripcion || descripcion.trim() === '') {
            return res.render('pages/formularioGasto', {
                mensaje: 'La descripción del gasto es obligatoria'
            });
        }

        const gastoNuevo = {
            concepto,
            valor,
            fecha,
            descripcion
        };

        const gasto = await Gasto.create(gastoNuevo);

        if (gasto) {
            return res.render('pages/formularioGasto', {
                mensaje: 'Gasto registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioGasto', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los gastos registrados.
 */
exports.consultar = async (req, res) => {
    try {

        const gastos = await Gasto.find();

        res.render('pages/gastos', {
            gastos,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un gasto utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const gasto = await Gasto.findById(req.params.id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        res.json(gasto);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza un gasto existente.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            concepto,
            valor,
            fecha,
            descripcion
        } = req.body;

        // Validar concepto.
        if (!concepto || concepto.trim() === '') {
            const gastos = await Gasto.find();

            return res.render('pages/gastos', {
                gastos,
                mensaje: 'El concepto del gasto es obligatorio'
            });
        }

        // Validar valor.
        if (
            valor === undefined ||
            valor === '' ||
            Number(valor) < 0
        ) {
            const gastos = await Gasto.find();

            return res.render('pages/gastos', {
                gastos,
                mensaje: 'El valor del gasto no puede ser negativo'
            });
        }

        // Validar fecha.
        if (!fecha) {
            const gastos = await Gasto.find();

            return res.render('pages/gastos', {
                gastos,
                mensaje: 'La fecha del gasto es obligatoria'
            });
        }

        // Validar descripción.
        if (!descripcion || descripcion.trim() === '') {
            const gastos = await Gasto.find();

            return res.render('pages/gastos', {
                gastos,
                mensaje: 'La descripción del gasto es obligatoria'
            });
        }

        const datos = {
            concepto,
            valor,
            fecha,
            descripcion
        };

        const gasto = await Gasto.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!gasto) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        res.redirect('/gastosvista');

    } catch (error) {

        console.log(error);

        const gastos = await Gasto.find();

        res.render('pages/gastos', {
            gastos,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un gasto utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const gasto = await Gasto.findByIdAndDelete(req.params.id);

        if (!gasto) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado'
            });
        }

        res.redirect('/gastosvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};