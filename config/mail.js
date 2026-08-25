const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: process.env.CORREO,
        pass: process.env.PASSWORD_CORREO
    }
});

module.exports = transporter;