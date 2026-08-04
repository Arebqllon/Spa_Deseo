const { Schema, model } = require('mongoose');

/**
 * Esquema de Mongoose para la entidad Cita.
 */
const citaSchema = new Schema(
  {
    cliente: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    manicurista: { type: Schema.Types.ObjectId, ref: 'Manicurista', required: true },
    servicios: { type: Schema.Types.ObjectId, ref: 'Servicio', required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    total: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = model('Cita', citaSchema);

