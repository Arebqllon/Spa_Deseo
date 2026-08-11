const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE PAGO
 * 
 * Registra las transacciones financieras asociadas a las citas del spa.
 * Soporta pasarelas de pago (Wompi, Mercado Pago) y transferencias bancarias.
 */
const PagoSchema = new Schema(
  {
    // Referencia obligatoria a la Cita que se está pagando
    // Equivalente a ForeignKey(Citas, on_delete=models.CASCADE) en Django
    citaId: {
      type: Schema.Types.ObjectId,
      ref: 'Cita',
      required: [true, 'El ID de la cita es obligatorio.'],
      index: true, // Facilita la consulta de pagos por cita
    },

    // Fecha y hora en la que se registra la transacción
    // Equivalente a auto_now_add=True en Django
    fechaPago: {
      type: Date,
      default: Date.now,
    },

    // Método utilizado para realizar la transacción
    metodoPago: {
      type: String,
      required: [true, 'El método de pago es obligatorio.'],
      enum: {
        values: ['Wompi', 'Mercado Pago', 'Transferencia'],
        message: '{VALUE} no es un método de pago válido.',
      },
    },

    // Estado actual de la transacción
    estado: {
      type: String,
      enum: {
        values: ['Pendiente', 'Realizado', 'Fallido'],
        message: '{VALUE} no es un estado de pago válido.',
      },
      default: 'Pendiente',
    },

    // Monto o valor numérico del pago registrado
    valor: {
      type: Number,
      required: [true, 'El valor del pago es obligatorio.'],
      min: [0, 'El valor del pago no puede ser negativo.'],
    },

    // ID o código de confirmación entregado por la pasarela de pago o banco
    // Equivalente a null=True, blank=True en Django
    referencia: {
      type: String,
      trim: true,
      maxlength: [100, 'La referencia no puede exceder los 100 caracteres.'],
      default: null,
    },
  },

);



// Exportación del modelo:
// Mongoose creará automáticamente la colección 'pagos' en la base de datos
module.exports = mongoose.model('Pago', PagoSchema);