const { Schema, model } = require('mongoose');

/**
 * Esquema de Mongoose para la entidad Servicio.
 */
const servicioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, required: true, trim: true },
    duracion: { type: Number, required: true } // Duración en minutos
  },
  { timestamps: true }
);

module.exports = model('Servicio', servicioSchema);
