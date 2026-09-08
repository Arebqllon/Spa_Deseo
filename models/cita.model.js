const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE CITA
 * Gestiona el agendamiento de citas asociando el cliente, manicurista y servicio.
 */
const CitaSchema = new Schema(
  {
    // Referencia al Cliente (o Usuario que inicia sesión)
    clienteId: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El ID del cliente es obligatorio.'],
      index: true,
    },

    // Referencia a la Manicurista asignada
    manicuristaId: {
      type: Schema.Types.ObjectId,
      ref: 'Manicurista',
      required: [true, 'El ID de la manicurista es obligatorio.'],
      index: true,
    },

    // Referencia al Servicio contratado
    servicioId: {
      type: Schema.Types.ObjectId,
      ref: 'Servicio',
      required: [true, 'El ID del servicio es obligatorio.'],
    },

    // Fecha de la cita (YYYY-MM-DD)
    fecha: {
      type: Date,
      required: [true, 'La fecha de la cita es obligatoria.'],
    },

    // Hora de la cita en formato HH:mm (24 horas)
    hora: {
      type: String,
      required: [true, 'La hora de la cita es obligatoria.'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'El formato de hora debe ser HH:mm.'],
    },

    // Monto total a pagar por la cita
    total: {
      type: Number,
      required: [true, 'El valor total de la cita es obligatorio.'],
      min: [0, 'El monto total no puede ser negativo.'],
    },

    // Estado operativo de la cita
    estado: {
      type: String,
      enum: {
        values: ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'],
        message: '{VALUE} no es un estado válido para la cita.',
      },
      default: 'Pendiente',
    },

    // Notas opcionales para la cita
    notas: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    // Genera automáticamente createdAt y updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model('Cita', CitaSchema);