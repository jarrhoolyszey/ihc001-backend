const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middlewares/auth');

const Especialista = require('../models/Especialista');
const Paciente= require('../models/Paciente');

const router = express.Router();


function generateToken(params = {}) {
  return jwt.sign(
    params,
    process.env.JWT_SECRET,
    { 
      expiresIn: 86400,
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

  if(!user) {
    return res.status(401).json({error: 'Ops! Usuário não foi encontrado.'});
  }

  if(!await bcrypt.compare(senha, user.senha))
    return res.status(401).json({ error: 'Ops! Senha inválida.' });
  
  user.senha = undefined;

  res.status(200).json({
    user,
    token: generateToken({ id: user.id, permissao: user.permissao }),
  });
});


/**
 * Verify token 
 */
router.post('/verify-token', auth, async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if(err) {
        return res.status(403).json({
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
    return res.status(400).json({error: err.message});
  }
})


/*
 * Change Password
 */
router.post('/change-password/:id', auth, async (req, res) => {
  try {
    const { senha, novaSenha } = req.body;
    const { id } = req.params;

    const user = await Especialista.findById(id).select('+senha') ||
                 await Paciente.findById(id).select('+senha');

    if(!user) 
      return res.status(400).json({ error: 'Ops! Usuário não encontrado.' });

    if(!await bcrypt.compare(senha, user.senha))
      return res.status(403).json({ error: 'Ops! Senha inválida.' });

    user.senha = novaSenha;
    await user.save();
    
    user.senha = undefined;
    return res.status(200).json({ user, msg: 'Senha alterada com sucesso!' });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});


module.exports = app => app.use('/auth', router);