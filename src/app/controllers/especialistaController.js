const express = require('express');

const Especialista = require('../models/Especialista');

const auth = require('../middlewares/auth');
const hasRole = require('../middlewares/permissions');

const roles = require('../../config/roles');

const router = express.Router();


// Todas rotas utilizaram autenticação (userId, userPermissao)
router.use(auth);


/**
 * Cadastra um novo Especialista
 * Permissoes: admin (implementar)
 */
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    if(await Especialista.findOne({ email }))
      return res.status(409).json({ error: 'Especialista ja cadastrado. '});
    
    const especialista = await Especialista.create({
      nome, email, senha
    });

    return res.json( especialista );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Atualiza um Especialista pelo seu ID
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    await Especialista.findByIdAndUpdate(id, update, (err, doc) => {
      if(err) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.json(doc);
      }
    });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/**
 * Deleta um Especialista pelo seu ID
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Especialista.findByIdAndRemove(id, (err, doc) => {
      if(err) {
        return res.status(400).json({ error: err.message });
      } else {
        return res.json(doc);
      }  
    })
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
})

/**
 * Lista todos especialistas do DB
 */
router.get('/', async (req, res) => {
  try {
    const list = await Especialista.find();

    return res.json( list );

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
})


/**
 * Busca um Especialista pelo ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const especialista = await Especialista.findById(id);

    if (!especialista)
      return res.status(400).json({ error: 'Especialista nao encontrado.' });

    return res.json(
      especialista
    );

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


module.exports = app => app.use('/especialistas', router);