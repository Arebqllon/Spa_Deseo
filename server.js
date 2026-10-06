const app = require('./app');
const conectarDB = require('./config/db');
const logger = require('./utils/logger');

const iniciarServidor = async () => {

    logger.info('Iniciando servidor de Spa Deseo');

    await conectarDB();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {

        logger.info(
            `Servidor ejecutándose en el puerto ${PORT}`
        );

    });

};

iniciarServidor();