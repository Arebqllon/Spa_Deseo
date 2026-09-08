const { Router } = require('express');
const router = Router();

const citaController = require('../controllers/cita.controller');
const verificarToken = require('../middlewares/auth.middleware');

// ===============================
// RUTAS DE CITAS (/api/citas)
// ===============================

router.post('/registrar', verificarToken, citaController.registrar);
router.get('/consultar', verificarToken, citaController.consultar);
router.get('/:id', verificarToken, citaController.consultarId);
router.put('/:id', verificarToken, citaController.actualizar);
router.delete('/:id', verificarToken, citaController.eliminar);

module.exports = router;