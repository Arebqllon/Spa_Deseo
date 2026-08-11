const mongoose = require('mongoose');
const { Schema } = mongoose;

// ESQUEMA DE CLIENTE
// Almacena los datos personales y de contacto de las usuarias/os.
const ClienteSchema = new Schema(
  {
    // Referencia 1:1 a la cuenta de autenticación
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El ID de usuario es obligatorio.'],
      unique: true,
    },

    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio.'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres.'],
    },

    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio.'],
      trim: true,
      maxlength: [100, 'El apellido no puede exceder los 100 caracteres.'],
    },


    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio.'],
      trim: true,
      maxlength: [20, 'El teléfono no puede exceder los 20 caracteres.'],
    },

  },
);



module.exports = mongoose.model('Cliente', ClienteSchema);