const mongoose = require('mongoose');

/**
 * Conecta la aplicación con MongoDB.
 *
 * La dirección de conexión se obtiene
 * desde la variable MONGO_URI del archivo .env.
 */
const conectarDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB conectado correctamente.');

    } catch (error) {

        console.error('Error al conectar con MongoDB:', error.message);

        process.exit(1);
    }
};

module.exports = conectarDB;