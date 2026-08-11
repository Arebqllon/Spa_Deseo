const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE GASTO
 * 
 * Registra los egresos operativos y costes generales del establecimiento
 * (ej. insumos adicionales, pago de servicios públicos, mantenimiento, etc.).
 */
const GastoSchema = new Schema(
  {
    // Categoría o título breve que identifica el egreso
    concepto: {
      type: String,
      required: [true, 'El concepto del gasto es obligatorio.'],
      trim: true,
      maxlength: [100, 'El concepto no puede exceder los 100 caracteres.'],
    },

    // Monto monetario desembolsado
    valor: {
      type: Number,
      required: [true, 'El valor del gasto es obligatorio.'],
      min: [0, 'El valor del gasto no puede ser negativo.'],
    },

    // Fecha en la que se realizó o registró el egreso
    fecha: {
      type: Date,
      required: [true, 'La fecha del gasto es obligatoria.'],
      default: Date.now,
    },

    // Detalle o justificación ampliada sobre el gasto registrado
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true,
    },
  },

);


// Exportación del modelo:
// Mongoose registrará automáticamente la colección en plural como 'gastos'
module.exports = mongoose.model('Gasto', GastoSchema);