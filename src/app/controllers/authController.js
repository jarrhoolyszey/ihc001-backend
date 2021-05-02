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


/**
 * Login route
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // select('+password) porque password por padrao nao é retornado nas buscas
  const user = await User.findOne({ email }).select('+password');

  if(!user)
    return res.status(400).json({ error: 'User not found. '});
  
  if(!await bcrypt.compare(password, user.password))
    return res.status(400).json({ error: 'Invalid password.' });
  
  user.password = undefined;

  res.json({
    user,
    token: generateToken({ id: user.id, role: user.role }),
  });
});


module.exports = app => app.use('/', router);