const express = require('express');

const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/permissions');

const roles = require('../../config/roles');

const Paciente = require('../models/Paciente');

const router = express.Router();

// Todas rotas requerem autenticação
router.use(auth);

// Todas rotas requerem permissao ADMIN ou ESPECIALISTA
router.use(hasRole(roles.ADMIN, roles.ESPECIALISTA));


/**
 * Cadastra novo paciente
 * Permissao: Admin, Especialista
 */
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    if (await Paciente.findOne({ email }))
      return res.status(409).json({ error: 'Paciente ja cadastrado.' });
    
    const paciente = await Paciente.create(req.body);

    res.json( paciente );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Atualiza um paciente pelo seu ID
 * Permissao: Admin, Especialista
 */
router.put('/:id', hasRole(roles.ADMIN, roles.ESPECIALISTA), async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    await Paciente.findByIdAndUpdate(id, update, {new: true}, (err, doc) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.json( doc );
      }
    });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});


/**
 * Deleta um Paciente pelo seu ID
 * Permissao: Admin, Especialista 
 */
router.delete('/:id', hasRole(roles.ADMIN, roles.ESPECIALISTA), async (req, res) => {
  const { id } = req.params;

  try{
    await Paciente.findByIdAndRemove(id, (err, doc) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.json( doc );
      }
    });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});


/**
 * Lista todos Pacientes
 * Permissoes: Admin, Especialista
 */
router.get('/', async (req, res) => {
  try {
    const list = await Paciente.find();

    return res.json( list );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});


module.exports = app => app.use('/pacientes', router);