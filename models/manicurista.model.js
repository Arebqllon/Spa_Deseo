const { Schema, model } = require('mongoose');

/**
 * Esquema de Mongoose para la entidad Manicurista.
 */
const manicuristaSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    especialidad: { type: String, required: true, trim: true },
    fecha_ingreso: { type: Date, required: true },
    estado: {
      type: String,
      enum: ['Activa', 'Inactiva'],
      default: 'Activa'
    }
  },
  { timestamps: true }
);

module.exports = model('Manicurista', manicuristaSchema);
