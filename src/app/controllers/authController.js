const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Especialista = require('../models/Especialista');
const Paciente= require('../models/Paciente');

const router = express.Router();


function generateToken(params = {}) {
  return jwt.sign(
    params,
    process.env.JWT_SECRET,
    { expiresIn: 86400 } 
  );
}


/**
 * Login route
 */
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  // select('+senha) porque senha por padrao nao é retornado nas buscas
  // const user = await User.findOne({ email }).select('+senha');
  const user = (
    await Especialista.findOne({ email }).select('+senha +permissao') ||
    await Paciente.findOne({ email }).select('+senha +permissao')
  );

  if(!user)
    return res.status(400).json({ error: 'Usuario nao encontrado. '});
  
  if(!await bcrypt.compare(senha, user.senha))
    return res.status(400).json({ error: 'Senha invalida.' });
  
  user.senha = undefined;

  res.json({
    user,
    token: generateToken({ id: user.id, permissao: user.permissao }),
  });
});


module.exports = app => app.use('/', router);