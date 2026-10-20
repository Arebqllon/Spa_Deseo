const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cron = require('node-cron');

dotenv.config();

const app = express();

// ===============================
// BASE DE DATOS Y SERVICIOS
// ===============================
const conectarDB = require('./config/db');
const logger = require('./utils/logger'); // Ruta corregida a ./utils/logger
const backup = require('./services/backup'); // Verifica que tu carpeta sea 'services'

// ===============================
// CONFIGURACIÓN DE VISTAS (EJS)
// ===============================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===============================
// ARCHIVOS ESTÁTICOS Y MIDDLEWARES
// ===============================
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ===============================
// RUTAS API
// ===============================
const usuarioRoutes = require('./routes/usuario.routes');
const citaRoutes = require('./routes/cita.routes');
const servicioRoutes = require('./routes/servicio.routes');
const manicuristaRoutes = require('./routes/manicurista.routes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/manicuristas', manicuristaRoutes);

// ===============================
// RUTAS DE VISTAS (EJS)
// ===============================
app.get('/', (req, res) => res.render('login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/registro', (req, res) => res.render('registro'));
app.get('/dashboard', (req, res) => res.render('dashboard'));

// ===============================
// INICIALIZACIÓN DEL SERVIDOR
// ===============================
const iniciarServidor = async () => {
    try {
        logger.info('Iniciando servidor de Spa Deseo');

        // 1. Conectar a MongoDB
        await conectarDB();

        const PORT = process.env.PORT || 3000;

        // 2. Levantar el puerto de Express
        app.listen(PORT, () => {
            logger.info(`Servidor ejecutándose en el puerto ${PORT}`);
        });

        // 3. Programar la tarea Cron (cada 10 segundos para pruebas)
        cron.schedule('*/10 * * * * *', async () => {
            console.log('Ejecutando Backup de la Base de datos...');
            await backup.backupDatabase();
        });

    } catch (error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
    }
};

// Llamada directa para arrancar la aplicación
iniciarServidor();