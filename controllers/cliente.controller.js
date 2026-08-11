const Cliente = require('../models/cliente.model');

/**
 * Muestra la página principal del módulo de clientes.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un nuevo cliente.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formulario', {
        mensaje: null
    });
};

/**
 * Registra un nuevo cliente en la base de datos.
 *
 * Valida los datos básicos antes de crear el registro.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            usuarioId,
            nombre,
            apellido,
            correo,
            telefono
        } = req.body;

        // Validar nombre.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
            return res.render('pages/formulario', {
                mensaje: 'El nombre solo debe contener letras'
            });
        }

        // Validar apellido.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido)) {
            return res.render('pages/formulario', {
                mensaje: 'El apellido solo debe contener letras'
            });
        }

        // Validar correo electrónico.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            return res.render('pages/formulario', {
                mensaje: 'Correo electrónico inválido'
            });
        }

        // Validar teléfono.
        if (!/^\d{7,20}$/.test(telefono)) {
            return res.render('pages/formulario', {
                mensaje: 'El teléfono debe contener entre 7 y 20 números'
            });
        }

        const clienteNuevo = {
            usuarioId,
            nombre,
            apellido,
            correo,
            telefono
        };

        const cliente = await Cliente.create(clienteNuevo);

        if (cliente) {
            return res.render('pages/formulario', {
                mensaje: 'Cliente registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        // Controla los campos que tienen restricción unique.
        if (error.code === 11000) {
            return res.render('pages/formulario', {
                mensaje: 'El correo o usuario ya está registrado'
            });
        }

        res.render('pages/formulario', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los clientes registrados.
 */
exports.consultar = async (req, res) => {
    try {

        const clientes = await Cliente.find();

        res.render('pages/clientes', {
            clientes,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un cliente utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.json(cliente);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza los datos personales de un cliente.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            nombre,
            apellido,
            correo,
            telefono
        } = req.body;

        // Validar nombre.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre)) {
            const clientes = await Cliente.find();

            return res.render('pages/clientes', {
                clientes,
                mensaje: 'El nombre solo debe contener letras'
            });
        }

        // Validar apellido.
        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido)) {
            const clientes = await Cliente.find();

            return res.render('pages/clientes', {
                clientes,
                mensaje: 'El apellido solo debe contener letras'
            });
        }

        // Validar correo.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            const clientes = await Cliente.find();

            return res.render('pages/clientes', {
                clientes,
                mensaje: 'Correo electrónico inválido'
            });
        }

        // Validar teléfono.
        if (!/^\d{7,20}$/.test(telefono)) {
            const clientes = await Cliente.find();

            return res.render('pages/clientes', {
                clientes,
                mensaje: 'El teléfono debe contener entre 7 y 20 números'
            });
        }

        const datos = {
            nombre,
            apellido,
            correo,
            telefono
        };

        const cliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.redirect('/clientesvista');

    } catch (error) {

        console.log(error);

        // Controla el correo duplicado.
        if (error.code === 11000) {
            const clientes = await Cliente.find();

            return res.render('pages/clientes', {
                clientes,
                mensaje: 'Ese correo ya está registrado'
            });
        }

        const clientes = await Cliente.find();

        res.render('pages/clientes', {
            clientes,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un cliente utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const cliente = await Cliente.findByIdAndDelete(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        res.redirect('/clientesvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};