const Manicurista = require('../models/manicurista.model');

/**
 * Muestra la página principal del módulo de manicuristas.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar una nueva manicurista.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioManicurista', {
        mensaje: null
    });
};

/**
 * Registra una nueva manicurista en la base de datos.
 *
 * Recibe los datos personales, la especialidad, la fecha de ingreso
 * y el usuarioId que relaciona la manicurista con su cuenta.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            usuarioId,
            nombre,
            apellido,
            telefono,
            especialidad,
            fechaIngreso
        } = req.body;

        // Validar nombre.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'El nombre solo debe contener letras'
            });
        }

        // Validar apellido.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido)) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'El apellido solo debe contener letras'
            });
        }

        // Validar teléfono.
        if (!/^\d{7,20}$/.test(telefono)) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'El teléfono debe contener entre 7 y 20 números'
            });
        }

        // Validar especialidad.
        if (!especialidad || especialidad.trim() === '') {
            return res.render('pages/formularioManicurista', {
                mensaje: 'La especialidad es obligatoria'
            });
        }

        // Validar fecha de ingreso.
        if (!fechaIngreso) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'La fecha de ingreso es obligatoria'
            });
        }

        const manicuristaNueva = {
            usuarioId,
            nombre,
            apellido,
            telefono,
            especialidad,
            fechaIngreso
        };

        const manicurista = await Manicurista.create(manicuristaNueva);

        if (manicurista) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'Manicurista registrada exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        // El usuarioId es único y no puede repetirse.
        if (error.code === 11000) {
            return res.render('pages/formularioManicurista', {
                mensaje: 'Este usuario ya está registrado como manicurista'
            });
        }

        res.render('pages/formularioManicurista', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todas las manicuristas registradas.
 */
exports.consultar = async (req, res) => {
    try {

        const manicuristas = await Manicurista.find();

        res.render('pages/manicuristas', {
            manicuristas,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta una manicurista utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const manicurista = await Manicurista.findById(req.params.id);

        if (!manicurista) {
            return res.status(404).json({
                mensaje: 'Manicurista no encontrada'
            });
        }

        res.json(manicurista);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza los datos de una manicurista.
 *
 * No modifica el usuarioId porque este campo mantiene
 * la relación con la cuenta de Usuario.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            nombre,
            apellido,
            telefono,
            especialidad,
            fechaIngreso,
            estado
        } = req.body;

        // Validar nombre.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
            const manicuristas = await Manicurista.find();

            return res.render('pages/manicuristas', {
                manicuristas,
                mensaje: 'El nombre solo debe contener letras'
            });
        }

        // Validar apellido.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido)) {
            const manicuristas = await Manicurista.find();

            return res.render('pages/manicuristas', {
                manicuristas,
                mensaje: 'El apellido solo debe contener letras'
            });
        }

        // Validar teléfono.
        if (!/^\d{7,20}$/.test(telefono)) {
            const manicuristas = await Manicurista.find();

            return res.render('pages/manicuristas', {
                manicuristas,
                mensaje: 'El teléfono debe contener entre 7 y 20 números'
            });
        }

        // Validar especialidad.
        if (!especialidad || especialidad.trim() === '') {
            const manicuristas = await Manicurista.find();

            return res.render('pages/manicuristas', {
                manicuristas,
                mensaje: 'La especialidad es obligatoria'
            });
        }

        // Validar fecha de ingreso.
        if (!fechaIngreso) {
            const manicuristas = await Manicurista.find();

            return res.render('pages/manicuristas', {
                manicuristas,
                mensaje: 'La fecha de ingreso es obligatoria'
            });
        }

        const datos = {
            nombre,
            apellido,
            telefono,
            especialidad,
            fechaIngreso,
            estado
        };

        const manicurista = await Manicurista.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!manicurista) {
            return res.status(404).json({
                mensaje: 'Manicurista no encontrada'
            });
        }

        res.redirect('/manicuristasvista');

    } catch (error) {

        console.log(error);

        const manicuristas = await Manicurista.find();

        res.render('pages/manicuristas', {
            manicuristas,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina una manicurista utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const manicurista = await Manicurista.findByIdAndDelete(req.params.id);

        if (!manicurista) {
            return res.status(404).json({
                mensaje: 'Manicurista no encontrada'
            });
        }

        res.redirect('/manicuristasvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};