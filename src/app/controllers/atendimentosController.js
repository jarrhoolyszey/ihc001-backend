const express = require('express');
const ObjectId = require('mongoose').Types.ObjectId;

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

/**
 * Lista todos atendimentos de um paciente
 */
router.get('/:id_paciente', async (req, res) => {
  try {
    const { id_paciente } = req.params;

    const atendimentos = await Atendimento.find({pacienteId: id_paciente}).populate('especialistaId');
    
    if(!atendimentos) {
      throw new Error('Atendimentos nao encontrados.');
    }

    return res.json(atendimentos);
    
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
})


module.exports = app => app.use('/atendimentos', router);
