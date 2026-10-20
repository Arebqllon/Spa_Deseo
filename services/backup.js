const { exec } = require('child_process');
require('dotenv').config();

exports.backupDatabase = async () => {
    const outputPath = './backup';

    // Genera la copia de seguridad de MongoDB usando la URI del .env
    const command = `mongodump --uri "${process.env.MONGO_URI}" --out ${outputPath} --gzip`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error en el respaldo: ${error.message}`);
            return;
        }
        console.log(`Respaldo completado con éxito: ${stdout || 'OK'}`);
    });
};