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
    { 
      expiresIn: 86400
      //expiresIn: 1 
    } 
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
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  
  if(!await bcrypt.compare(senha, user.senha))
    return res.status(400).json({ error: 'Senha inválida.' });
  
  user.senha = undefined;

  res.json({
    user,
    token: generateToken({ id: user.id, permissao: user.permissao }),
  });
});


/**
 * Verify token 
 */
router.post('/verify-token', async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if(err) {
        return res.status(400).json({
          err,
          decoded
        });
      }

      const user = (
        await Especialista.findOne({ _id: decoded.id }) ||
        await Paciente.findOne({ _id: decoded.id })
      )

      if(!user)
        return res.status(400).json({ error: 'Usuario nao encontrado.' })

      return res.status(200).json({ user })
    })
  } catch (err) {
    return res.status(400).json(err);
  }
})


module.exports = app => app.use('/auth', router);