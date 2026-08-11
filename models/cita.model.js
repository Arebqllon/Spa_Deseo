const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE CITA (Fecha y Hora Unificadas)
 * 
 * Gestiona el agendamiento de citas asociando el cliente, la manicurista y los servicios.
 * Representa la entidad central del módulo de agenda dentro del sistema.
 */
const CitaSchema = new Schema(
  {
    // Referencia obligatoria al Cliente que solicita la cita
    clienteId: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El ID del cliente es obligatorio.'],
      index: true,
    },

    // Referencia obligatoria a la Manicurista asignada
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

    // Fecha y hora de inicio de la cita unificadas en un solo objeto Date
    fecha: {
      type: Date,
      required: [true, 'La fecha de la cita es obligatoria.']
    },

    hora: {
      type: String,
      required: [true, 'La hora de la cita es obligatoria.'],
      match: /^([01]\d|2[0-3]):[0-5]\d$/
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
  },

);





module.exports = mongoose.model('Cita', CitaSchema);