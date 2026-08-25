const app = require('./app');
const conectarDB = require('./config/db');

/**
 * Inicia la conexión con MongoDB
 * y posteriormente levanta el servidor.
 */
const iniciarServidor = async () => {

    await conectarDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
};

iniciarServidor();