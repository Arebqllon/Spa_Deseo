const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServicioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio.'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres.'],
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio.'],
      min: [0, 'El precio no puede ser un valor negativo.'],
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true,
    },
    duracion: {
      type: Number,
      required: [true, 'La duración es obligatoria.'],
      min: [1, 'La duración debe ser de al menos 1 minuto.'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Servicio', ServicioSchema);