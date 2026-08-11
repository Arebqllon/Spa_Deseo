const Servicio = require('../models/servicio.model');

/**
 * Muestra la página principal del módulo de servicios.
 */
exports.home = async (req, res) => {
    res.render('pages/index');
};

/**
 * Muestra el formulario para registrar un nuevo servicio.
 */
exports.formulario = async (req, res) => {
    res.render('pages/formularioServicio', {
        mensaje: null
    });
};

/**
 * Registra un nuevo servicio en la base de datos.
 *
 * Recibe el nombre, precio, descripción y duración del servicio.
 */
exports.registrar = async (req, res) => {
    try {

        const {
            nombre,
            precio,
            descripcion,
            duracion
        } = req.body;

        // Validar nombre.
        if (!nombre || nombre.trim() === '') {
            return res.render('pages/formularioServicio', {
                mensaje: 'El nombre del servicio es obligatorio'
            });
        }

        // Validar precio.
        if (precio === undefined || precio === '' || Number(precio) < 0) {
            return res.render('pages/formularioServicio', {
                mensaje: 'El precio no puede ser negativo'
            });
        }

        // Validar descripción.
        if (!descripcion || descripcion.trim() === '') {
            return res.render('pages/formularioServicio', {
                mensaje: 'La descripción es obligatoria'
            });
        }

        // Validar duración.
        if (duracion === undefined || duracion === '' || Number(duracion) < 1) {
            return res.render('pages/formularioServicio', {
                mensaje: 'La duración debe ser de al menos 1 minuto'
            });
        }

        const servicioNuevo = {
            nombre,
            precio,
            descripcion,
            duracion
        };

        const servicio = await Servicio.create(servicioNuevo);

        if (servicio) {
            return res.render('pages/formularioServicio', {
                mensaje: 'Servicio registrado exitosamente'
            });
        }

    } catch (error) {

        console.log(error);

        res.render('pages/formularioServicio', {
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Consulta todos los servicios registrados.
 */
exports.consultar = async (req, res) => {
    try {

        const servicios = await Servicio.find();

        res.render('pages/servicios', {
            servicios,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Consulta un servicio utilizando su ID.
 */
exports.consultarId = async (req, res) => {
    try {

        const servicio = await Servicio.findById(req.params.id);

        if (!servicio) {
            return res.status(404).json({
                mensaje: 'Servicio no encontrado'
            });
        }

        res.json(servicio);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Busca servicios por nombre o descripción.
 *
 * El término de búsqueda se recibe mediante el parámetro q.
 */
exports.buscar = async (req, res) => {
    try {

        const { q } = req.query;

        // Si no se recibe un término, se muestran todos los servicios.
        if (!q || q.trim() === '') {
            const servicios = await Servicio.find();

            return res.render('pages/servicios', {
                servicios,
                mensaje: null
            });
        }

        const servicios = await Servicio.find({
            $or: [
                {
                    nombre: {
                        $regex: q,
                        $options: 'i'
                    }
                },
                {
                    descripcion: {
                        $regex: q,
                        $options: 'i'
                    }
                }
            ]
        });

        res.render('pages/servicios', {
            servicios,
            mensaje: null
        });

    } catch (error) {

        res.render('pages/error', {
            error: error.message
        });
    }
};

/**
 * Actualiza los datos de un servicio existente.
 */
exports.actualizar = async (req, res) => {
    try {

        const {
            nombre,
            precio,
            descripcion,
            duracion
        } = req.body;

        // Validar nombre.
        if (!nombre || nombre.trim() === '') {
            const servicios = await Servicio.find();

            return res.render('pages/servicios', {
                servicios,
                mensaje: 'El nombre del servicio es obligatorio'
            });
        }

        // Validar precio.
        if (precio === undefined || precio === '' || Number(precio) < 0) {
            const servicios = await Servicio.find();

            return res.render('pages/servicios', {
                servicios,
                mensaje: 'El precio no puede ser negativo'
            });
        }

        // Validar descripción.
        if (!descripcion || descripcion.trim() === '') {
            const servicios = await Servicio.find();

            return res.render('pages/servicios', {
                servicios,
                mensaje: 'La descripción es obligatoria'
            });
        }

        // Validar duración.
        if (duracion === undefined || duracion === '' || Number(duracion) < 1) {
            const servicios = await Servicio.find();

            return res.render('pages/servicios', {
                servicios,
                mensaje: 'La duración debe ser de al menos 1 minuto'
            });
        }

        const datos = {
            nombre,
            precio,
            descripcion,
            duracion
        };

        const servicio = await Servicio.findByIdAndUpdate(
            req.params.id,
            datos,
            {
                new: true,
                runValidators: true
            }
        );

        if (!servicio) {
            return res.status(404).json({
                mensaje: 'Servicio no encontrado'
            });
        }

        res.redirect('/serviciosvista');

    } catch (error) {

        console.log(error);

        const servicios = await Servicio.find();

        res.render('pages/servicios', {
            servicios,
            mensaje: 'Error del servidor'
        });
    }
};

/**
 * Elimina un servicio utilizando su ID.
 */
exports.eliminar = async (req, res) => {
    try {

        const servicio = await Servicio.findByIdAndDelete(req.params.id);

        if (!servicio) {
            return res.status(404).json({
                mensaje: 'Servicio no encontrado'
            });
        }

        res.redirect('/serviciosvista');

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Obtiene estadísticas generales de los servicios.
 *
 * Calcula la cantidad de servicios y los valores
 * mínimo, máximo, promedio y total de los precios.
 */
exports.dashboard = async (req, res) => {
    try {

        const servicios = await Servicio.find();

        const cantidad = servicios.length;

        let totalPrecios = 0;
        let precioMinimo = 0;
        let precioMaximo = 0;
        let precioPromedio = 0;

        if (cantidad > 0) {

            totalPrecios = servicios.reduce(
                (total, servicio) => total + servicio.precio,
                0
            );

            precioMinimo = Math.min(
                ...servicios.map(servicio => servicio.precio)
            );

            precioMaximo = Math.max(
                ...servicios.map(servicio => servicio.precio)
            );

            precioPromedio = totalPrecios / cantidad;
        }

        res.json({
            cantidad,
            totalPrecios,
            precioMinimo,
            precioMaximo,
            precioPromedio
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};