const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();


// ===============================
// CONFIGURACIÓN DE EJS
// ===============================

app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'views')
);


// ===============================
// ARCHIVOS ESTÁTICOS
// ===============================

app.use(
    express.static(
        path.join(__dirname, 'public')
    )
);


// ===============================
// MIDDLEWARES
// ===============================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(morgan('dev'));


// ===============================
// RUTAS
// ===============================

const usuarioRoutes = require('./routes/usuario.routes');

app.use(
    '/api/usuarios',
    usuarioRoutes
);


// ===============================
// PÁGINA PRINCIPAL
// ===============================

app.get('/', (req, res) => {

    res.render('login');

});

// ===============================
// VISTAS EJS
// ===============================

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

// ===============================
// EXPORTAR APP
// ===============================

module.exports = app;