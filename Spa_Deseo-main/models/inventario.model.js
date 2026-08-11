const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE INVENTARIO (Insumos y Productos)
 * 
 * Controla la existencia de productos e insumos utilizados en el spa
 * (esmaltes, limas, aceites, etc.) y alerta sobre reabastecimientos mediante el stock mínimo.
 */
const InventarioSchema = new Schema(
  {
    // Nombre identificador del producto o insumo
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio.'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres.'],
    },

    // Cantidad actual disponible en stock
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria.'],
      min: [0, 'La cantidad no puede ser un valor negativo.'],
      default: 0,
    },

    // Umbral mínimo para emitir alertas de reabastecimiento
    stockMinimo: {
      type: Number,
      required: [true, 'El stock mínimo es obligatorio.'],
      min: [0, 'El stock mínimo no puede ser negativo.'],
      default: 5,
    },

    // Precio unitario o de lote al que se adquirió el producto
    precioCompra: {
      type: Number,
      required: [true, 'El precio de compra es obligatorio.'],
      min: [0, 'El precio de compra no puede ser negativo.'],
    },

    // Fecha en la que se realizó la compra o adquisición
    fechaCompra: {
      type: Date,
      required: [true, 'La fecha de compra es obligatoria.'],
      default: Date.now,
    },
  },

);



// Exportación del modelo:
// Mongoose guardará los documentos en la colección 'inventarios'
module.exports = mongoose.model('Inventario', InventarioSchema);