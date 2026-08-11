const Inventario = require('../models/inventario.model');

/**
 * Muestra la página principal del módulo de inventario.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un producto en inventario.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioInventario', {
        mensaje: null
    });
};

/**
 * Registra un nuevo producto o insumo en el inventario.
 *
 * Recibe el nombre, cantidad, stock mínimo, precio de compra
 * y fecha de compra.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            nombre,
            cantidad,
            stockMinimo,
            precioCompra,
            fechaCompra
        } = req.body;

        // Validar nombre.
        if (!nombre || nombre.trim() === '') {
            return res.render('pages/formularioInventario', {
                mensaje: 'El nombre del producto es obligatorio'
            });
        }

        // Validar cantidad.
        if (
            cantidad === undefined ||
            cantidad === '' ||
            Number(cantidad) < 0
        ) {
            return res.render('pages/formularioInventario', {
                mensaje: 'La cantidad no puede ser negativa'
            });
        }

        // Validar stock mínimo.
        if (
            stockMinimo === undefined ||
            stockMinimo === '' ||
            Number(stockMinimo) < 0
        ) {
            return res.render('pages/formularioInventario', {
                mensaje: 'El stock mínimo no puede ser negativo'
            });
        }

        // Validar precio de compra.
        if (
            precioCompra === undefined ||
            precioCompra === '' ||
            Number(precioCompra) < 0
        ) {
            return res.render('pages/formularioInventario', {
                mensaje: 'El precio de compra no puede ser negativo'
            });
        }

        // Validar fecha de compra.
        if (!fechaCompra) {
            return res.render('pages/formularioInventario', {
                mensaje: 'La fecha de compra es obligatoria'
            });
        }

        const inventarioNuevo = {
            nombre,
            cantidad,
            stockMinimo,
            precioCompra,
            fechaCompra
        };

        const inventario = await Inventario.create(inventarioNuevo);

        if (inventario) {
            return res.render('pages/formularioInventario', {
                mensaje: 'Producto registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioInventario', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los productos registrados en el inventario.
 */
exports.consultar = async (req, res) => {
    try {

        const inventarios = await Inventario.find();

        res.render('pages/inventario', {
            inventarios,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un producto del inventario utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const inventario = await Inventario.findById(req.params.id);

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(inventario);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza un producto existente del inventario.
 *
 * Permite modificar la cantidad, el stock mínimo,
 * el precio de compra y los demás datos del producto.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            nombre,
            cantidad,
            stockMinimo,
            precioCompra,
            fechaCompra
        } = req.body;

        // Validar nombre.
        if (!nombre || nombre.trim() === '') {
            const inventarios = await Inventario.find();

            return res.render('pages/inventario', {
                inventarios,
                mensaje: 'El nombre del producto es obligatorio'
            });
        }

        // Validar cantidad.
        if (
            cantidad === undefined ||
            cantidad === '' ||
            Number(cantidad) < 0
        ) {
            const inventarios = await Inventario.find();

            return res.render('pages/inventario', {
                inventarios,
                mensaje: 'La cantidad no puede ser negativa'
            });
        }

        // Validar stock mínimo.
        if (
            stockMinimo === undefined ||
            stockMinimo === '' ||
            Number(stockMinimo) < 0
        ) {
            const inventarios = await Inventario.find();

            return res.render('pages/inventario', {
                inventarios,
                mensaje: 'El stock mínimo no puede ser negativo'
            });
        }

        // Validar precio de compra.
        if (
            precioCompra === undefined ||
            precioCompra === '' ||
            Number(precioCompra) < 0
        ) {
            const inventarios = await Inventario.find();

            return res.render('pages/inventario', {
                inventarios,
                mensaje: 'El precio de compra no puede ser negativo'
            });
        }

        // Validar fecha de compra.
        if (!fechaCompra) {
            const inventarios = await Inventario.find();

            return res.render('pages/inventario', {
                inventarios,
                mensaje: 'La fecha de compra es obligatoria'
            });
        }

        const datos = {
            nombre,
            cantidad,
            stockMinimo,
            precioCompra,
            fechaCompra
        };

        const inventario = await Inventario.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.redirect('/inventariovista');

    } catch (error) {

        console.log(error);

        const inventarios = await Inventario.find();

        res.render('pages/inventario', {
            inventarios,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un producto del inventario utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const inventario = await Inventario.findByIdAndDelete(req.params.id);

        if (!inventario) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.redirect('/inventariovista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Consulta los productos cuyo stock actual está
 * por debajo o igual al stock mínimo establecido.
 *
 * Permite identificar los productos que necesitan
 * reabastecimiento.
 */
exports.stockBajo = async (req, res) => {
    try {

        const inventarios = await Inventario.find({
            $expr: {
                $lte: ['$cantidad', '$stockMinimo']
            }
        });

        res.json({
            cantidad: inventarios.length,
            inventarios
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};