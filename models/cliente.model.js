const { Schema, model } = require('mongoose');

/**
 * Esquema de Mongoose para la entidad Cliente.
 */
const clienteSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    color_piel: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = model('Cliente', clienteSchema);

