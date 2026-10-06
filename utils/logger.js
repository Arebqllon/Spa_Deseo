const winston = require('winston');
const path = require('path');

const logsPath = path.join(__dirname, '..', 'logs');

const logger = winston.createLogger({
    level: 'info',

    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json()
    ),

    transports: [

        // Log general
        new winston.transports.File({
            filename: path.join(logsPath, 'combined.log')
        }),

        // Solo errores
        new winston.transports.File({
            filename: path.join(logsPath, 'error.log'),
            level: 'error'
        })

    ]
});


// Mostrar también los logs en la terminal
if (process.env.NODE_ENV !== 'production') {

    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );

}


module.exports = logger;