const mongoose = require('mongoose');
const { Schema } = mongoose;

// ESQUEMA DE MANICURISTA
// Almacena la información del personal especialista que presta los servicios.
const ManicuristaSchema = new Schema(
  {
    // Referencia obligatoria a la colección Usuario (donde están email y password)
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


    // Técnica o especialidad principal de la manicurista
    especialidad: {
      type: String,
      required: [true, 'La especialidad es obligatoria.'],
      trim: true,
      maxlength: [100, 'La especialidad no puede exceder los 100 caracteres.'],
    },

    // Fecha en la que ingresó a trabajar en el establecimiento
    fechaIngreso: {
      type: Date,
      required: [true, 'La fecha de ingreso es obligatoria.'],
    },

    // Estado operativo (Equivalente al choices de Django)
    estado: {
      type: String,
      enum: {
        values: ['Activa', 'Inactiva'],
        message: '{VALUE} no es un estado válido. Opciones permitidas: Activa, Inactiva.',
      },
      default: 'Activa',
    },
  },

);



module.exports = mongoose.model('Manicurista', ManicuristaSchema);