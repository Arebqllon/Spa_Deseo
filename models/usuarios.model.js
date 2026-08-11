const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE USUARIO
 *
 * Almacena las credenciales y el rol de acceso de cada persona
 * que utiliza el sistema.
 *
 * Se relaciona con Cliente y Manicurista mediante usuarioId.
 */
const UsuarioSchema = new Schema(
    {
        // Correo utilizado para iniciar sesión.

        correo:{
            type: String,
            required: [true, 'El coreo es obligatorio.'],
            trim: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            unique: true,
        },

        // Contraseña utilizada para autenticar al usuario.
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria.'],
        },

        // Define los permisos y el tipo de usuario dentro del sistema.
        rol: {
            type: String,
            enum: {
                values: ['Cliente', 'Manicurista', 'Administrador'],
                message: '{VALUE} no es un rol válido.',
            },
            required: [true, 'El rol es obligatorio.'],
        },
    },
);

/*
 * Exportación del modelo:
 * Mongoose utilizará este esquema para trabajar con la colección
 * 'usuarios' en MongoDB.
 */
module.exports = mongoose.model('Usuario', UsuarioSchema);