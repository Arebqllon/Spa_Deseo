const mongoose = require('mongoose');
const { Schema } = mongoose;

const ManicuristaSchema = new Schema(
  {
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
    especialidad: {
      type: String,
      required: [true, 'La especialidad es obligatoria.'],
      trim: true,
      maxlength: [100, 'La especialidad no puede exceder los 100 caracteres.'],
    },
    fechaIngreso: {
      type: Date,
      required: [true, 'La fecha de ingreso es obligatoria.'],
    },
    estado: {
      type: String,
      enum: {
        values: ['Activa', 'Inactiva'],
        message: '{VALUE} no es un estado válido. Opciones permitidas: Activa, Inactiva.',
      },
      default: 'Activa',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Manicurista', ManicuristaSchema);