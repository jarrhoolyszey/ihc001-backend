const express = require('express');

const Atendimento = require('../models/Atendimento');

const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/permissions');

const router = express.Router();

router.use(auth);

/**
 * Cadastra um novo Atendimento
 */
router.post('/', async (req, res) => {
  const { especialistaId, pacienteId } = req.body;

  try {
    const atendimento = await Atendimento.create(req.body);

    return res.json( atendimento );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Lista todos atendimentos
 */
router.get('/', async (req, res) => {
  try {
    const atendimentos = await Atendimento.find()
      .populate('especialistaId')
      .populate('pacienteId');

    return res.send( atendimentos );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});


module.exports = app => app.use('/atendimentos', router);
