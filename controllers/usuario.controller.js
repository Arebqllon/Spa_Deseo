const Usuario = require('../models/usuarios.model');
const Cliente = require('../models/cliente.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const enviarCorreoBienvenida = require('../services/email.service');


/**
 * ============================================================
 * REGISTRAR USUARIO
 * ============================================================
 *
 * Registra un nuevo usuario en MongoDB.
 *
 * Flujo:
 * 1. Recibe los datos.
 * 2. Valida los campos.
 * 3. Comprueba que el rol sea válido.
 * 4. Comprueba que el correo no exista.
 * 5. Encripta la contraseña con bcrypt.
 * 6. Guarda el usuario en MongoDB.
 * 7. Envía un correo de bienvenida.
 */
exports.registrar = async (req, res) => {

    try {

        const {
            nombre,
            apellido,
            telefono,
            correo,
            password
        } = req.body;


        // =====================================================
        // VALIDAR CAMPOS OBLIGATORIOS
        // =====================================================

        if (!nombre || !apellido || !telefono || !correo || !password) {

            return res.status(400).json({
                mensaje: 'Nombre, apellido, teléfono, correo y contraseña son obligatorios.'
            });

        }

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,100}$/.test(nombre.trim())) {
            return res.status(400).json({
                mensaje: 'El nombre solo debe contener letras y tener entre 3 y 100 caracteres.'
            });
        }

        if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,100}$/.test(apellido.trim())) {
            return res.status(400).json({
                mensaje: 'El apellido solo debe contener letras y tener entre 3 y 100 caracteres.'
            });
        }

        if (!/^\d{7,20}$/.test(telefono.trim())) {
            return res.status(400).json({
                mensaje: 'El teléfono debe contener entre 7 y 20 números.'
            });
        }

        if (password.length < 8 || password.length > 20 || !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener entre 8 y 20 caracteres, una mayúscula, una minúscula y un número.'
            });
        }


        // =====================================================
        // NORMALIZAR CORREO
        // =====================================================

        const correoNormalizado = correo
            .trim()
            .toLowerCase();


        // =====================================================
        // COMPROBAR SI EL CORREO YA EXISTE
        // =====================================================

        const usuarioExistente = await Usuario.findOne({
            correo: correoNormalizado
        });


        if (usuarioExistente) {

            return res.status(409).json({
                mensaje: 'El correo ya está registrado.'
            });

        }


        // =====================================================
        // ENCRIPTAR CONTRASEÑA
        // =====================================================

        const passwordEncriptada = await bcrypt.hash(
            password,
            10
        );


        // =====================================================
        // CREAR USUARIO
        // =====================================================

        const usuarioNuevo = new Usuario({

            correo: correoNormalizado,

            password: passwordEncriptada,

            rol: 'Cliente'

        });


        // =====================================================
        // GUARDAR EN MONGODB
        // =====================================================

        await usuarioNuevo.save();

        try {
            await Cliente.create({
                usuarioId: usuarioNuevo._id,
                nombre: nombre.trim(),
                apellido: apellido.trim(),
                correo: correoNormalizado,
                telefono: telefono.trim()
            });
        } catch (errorCliente) {
            await Usuario.deleteOne({ _id: usuarioNuevo._id });
            throw errorCliente;
        }


        // =====================================================
        // ENVIAR CORREO DE BIENVENIDA
        // =====================================================
        //
        // Si el correo falla, el usuario NO se elimina.
        // El registro en MongoDB ya fue realizado correctamente.
        //

        try {

            await enviarCorreoBienvenida(
                correoNormalizado,
                'Cliente'
            );

            console.log(
                `Correo de bienvenida enviado a ${correoNormalizado}`
            );

        } catch (errorCorreo) {

            console.error(
                'No se pudo enviar el correo de bienvenida:',
                errorCorreo.message
            );

        }


        // =====================================================
        // RESPUESTA
        // =====================================================

        return res.status(201).json({

            mensaje: 'Usuario registrado correctamente.',

            correo: correoNormalizado,

            correoBienvenida: true

        });


    } catch (error) {

        console.error(
            'Error registrando usuario:',
            error
        );


        return res.status(500).json({

            mensaje: 'Error del servidor.'

        });

    }

};


/**
 * ============================================================
 * LOGIN
 * ============================================================
 *
 * Realiza el inicio de sesión.
 *
 * Flujo:
 * 1. Recibe correo y contraseña.
 * 2. Busca el usuario.
 * 3. Comprueba la contraseña con bcrypt.
 * 4. Genera un JWT.
 * 5. Devuelve el token.
 */
exports.login = async (req, res) => {

    try {

        const {
            correo,
            password
        } = req.body;


        // =====================================================
        // VALIDAR CAMPOS
        // =====================================================

        if (!correo || !password) {

            return res.status(400).json({

                mensaje:
                    'El correo y la contraseña son obligatorios.'

            });

        }


        // =====================================================
        // NORMALIZAR CORREO
        // =====================================================

        const correoNormalizado = correo
            .trim()
            .toLowerCase();


        // =====================================================
        // BUSCAR USUARIO
        // =====================================================

        const usuario = await Usuario.findOne({

            correo: correoNormalizado

        });


        // =====================================================
        // USUARIO NO ENCONTRADO
        // =====================================================

        if (!usuario) {

            return res.status(401).json({

                mensaje:
                    'Correo o contraseña incorrectos.'

            });

        }


        // =====================================================
        // COMPARAR CONTRASEÑA
        // =====================================================

        const passwordCorrecta =
            await bcrypt.compare(
                password,
                usuario.password
            );


        if (!passwordCorrecta) {

            return res.status(401).json({

                mensaje:
                    'Correo o contraseña incorrectos.'

            });

        }


        // =====================================================
        // CREAR JWT
        // =====================================================

        const token = jwt.sign(

            {

                id: usuario._id,

                correo: usuario.correo,

                rol: usuario.rol

            },

            process.env.JWT_SECRET,

            {

                expiresIn:
                    process.env.JWT_EXPIRES_IN

            }

        );


        // =====================================================
        // RESPUESTA
        // =====================================================

        return res.status(200).json({

            mensaje:
                'Inicio de sesión exitoso.',

            token

        });


    } catch (error) {

        console.error(
            'Error iniciando sesión:',
            error
        );


        return res.status(500).json({

            mensaje:
                'Error del servidor.'

        });

    }

};
