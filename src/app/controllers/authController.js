const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(
    params,
    process.env.JWT_SECRET,
    { expiresIn: 86400 } 
  );
}

router.post('/register', async (req, res) => {
  const { email } = req.body;
  
  try {
    if(await User.findOne({ email }))
      return res.status(400).json({ error: 'User already exists' });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.json({ 
      user,
      token: generateToken({ id: user.id }),
    });
  
  } catch (err) {
    return res.status(400).json({ error: 'Registration failed' });
  }
});


router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if(!user)
    return res.status(400).json({ erro: 'User not found. '});
  
  if(!await bcrypt.compare(password, user.password))
    return res.status(400).json({ erro: 'Invalid password. '});
  
  user.password = undefined;

  res.json({ 
    user,
    token: generateToken({ id: user.id }),
  });
});


module.exports = app => app.use('/auth', router);