const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * ESQUEMA DE SERVICIO
 * 
 * Representa el catálogo de tratamientos o servicios ofrecidos por el Spa/Salón.
 * Este modelo define la tarifa, descripción y tiempo requerido de atención,
 * información fundamental para el módulo de agenda de citas.
 */
const ServicioSchema = new Schema(
  {
    // Nombre comercial del servicio (ej. "Manicura Rusa", "Pedicura SPA")
    nombre: {
      type: String,
      required: [true, 'El nombre del servicio es obligatorio.'],
      trim: true, // Remueve espacios en blanco innecesarios al inicio y al final
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres.'],
    },

    // Costo monetario del servicio
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio.'],
      min: [0, 'El precio no puede ser un valor negativo.'], // Garantiza que el valor no sea menor a cero
    },

    // Detalle explícito de lo que incluye el servicio
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria.'],
      trim: true,
    },

    // Tiempo total proyectado para realizar el servicio (medido en minutos)
    // Este campo es clave para calcular la disponibilidad en la agenda
    duracion: {
      type: Number,
      required: [true, 'La duración es obligatoria.'],
      min: [1, 'La duración debe ser de al menos 1 minuto.'], // Asegura que una cita requiera tiempo real
    },
  },

);



// Exportación del modelo:
// Mongoose registrará la colección en minúsculas y plural automáticamente ('servicios')
module.exports = mongoose.model('Servicio', ServicioSchema);