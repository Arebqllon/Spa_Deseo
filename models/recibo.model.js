const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE RECIBO
 * 
 * Modela la comprobación o comprobante de pago emitido por el sistema
 * para respaldar el cobro de una cita agendada.
 */
const ReciboSchema = new Schema(
  {
    // Referencia obligatoria a la Cita asociada al recibo
    // Equivalente a ForeignKey(Citas, on_delete=models.CASCADE) en Django
    citaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cita',
      required: [true, 'El ID de la cita es obligatorio.'],
      index: true, // Facilita la búsqueda rápida de recibos por cita
    },

    // Fecha en la que se genera o emite el recibo
    // Equivalente a auto_now_add=True en Django
    fechaPago: {
      type: Date,
      default: Date.now,
    },

    // Nombre del método de pago utilizado (ej. "Efectivo", "Transferencia", etc.)
    metodoPago: {
      type: String,
      required: [true, 'El método de pago es obligatorio.'],
      trim: true,
      maxlength: [100, 'El método de pago no puede exceder los 100 caracteres.'],
    },

    // Estado del comprobante/recibo
    estado: {
      type: String,
      enum: {
        values: ['Pendiente', 'Realizado'],
        message: '{VALUE} no es un estado válido para el recibo.',
      },
      default: 'Pendiente',
    },

    // Monto total facturado en el recibo
    valor: {
      type: Number,
      required: [true, 'El valor es obligatorio.'],
      min: [0, 'El valor no puede ser un monto negativo.'],
    },
  },

);



// Exportación del modelo:
// Mongoose registrará la colección automática como 'recibos'
module.exports = mongoose.model('Recibo', ReciboSchema);